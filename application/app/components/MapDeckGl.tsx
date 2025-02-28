"use client";

import { useCallback, useMemo, useState } from "react";

import {
  Color,
  FlyToInterpolator,
  MapViewState,
  PickingInfo,
  ViewStateChangeParameters,
  WebMercatorViewport,
} from "@deck.gl/core";
import {
  GeoJsonLayer,
  GeoJsonLayerProps,
  IconLayerProps,
} from "@deck.gl/layers";
import DeckGL, { DeckGLProps } from "@deck.gl/react";
import { GeoPermissibleObjects, geoMercator, geoPath } from "d3";
import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import { feature } from "topojson-client";
import { Etablissement } from "../models/etablissements";
import { debounce } from "../utils/debounce";
import { useAllEtablissements } from "./fakeApi/useAllEtablissements";
import { useTopoJsonData } from "./fakeApi/useTopoJson";
import IconClusterLayer, {
  IconClusterLayerPickingInfo,
} from "./IconClusterLayer";
import { EtablissementProperties } from "./types/etablissementProperties";
import { MapDeckGlProps, MapProps } from "./types/maps";
import { TerritoryProperties } from "./types/territoryProperties";

enum Level {
  Region = "region",
  Departement = "departement",
  Communes = "communes",
}

const black: Color = [0, 0, 0, 255];

const defaultBoundingBox = [
  [32, -7],
  [51, 14],
] satisfies MapProps["boundingBox"];

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 2.5,
  latitude: 46.5,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  minZoom: 4,
  maxZoom: 12,
};

// TODO - Use D3 for scaling
/**
 * Color scale for testing
 */
function colorScale(code: number, divider: number): Color {
  return [48, 128, (+code / divider) * 255, 255];
}

function createRegionsLayer(props?: Omit<GeoJsonLayerProps, "id">) {
  return new GeoJsonLayer<TerritoryProperties>({
    id: "regions",
    lineWidthMinPixels: 1.5,
    pickable: true,
    visible: true,
    getFillColor: (d) => colorScale(+d.properties.reg, 100),
    getLineColor: black,
    ...props,
  });
}

function createDepartementsLayer(props?: Omit<GeoJsonLayerProps, "id">) {
  return new GeoJsonLayer<TerritoryProperties>({
    id: "departements",
    pickable: true,
    lineWidthMinPixels: 1,
    getFillColor: (d) => colorScale(+d.properties.dep, 100),
    getLineColor: black,
    ...props,
  });
}

function createCommunesLayer(props?: Omit<GeoJsonLayerProps, "id">) {
  return new GeoJsonLayer<TerritoryProperties>({
    id: "communes",
    pickable: true,
    lineWidthMinPixels: 0.2,
    getLineWidth: 100,
    getFillColor: (d) => colorScale(+d.properties.codgeo, 10000),
    getLineColor: black,
    ...props,
  });
}

const iconAtlasPath = "data/locationIconAtlas.png";
const iconMappingPath = "data/locationIconMapping.json";

function createClusterEtablissementLayer(
  props?: Omit<IconLayerProps<Etablissement>, "id">
) {
  return new IconClusterLayer<Etablissement>({
    id: "icon-cluster",
    sizeScale: 40,
    pickable: true,
    iconAtlas: iconAtlasPath,
    iconMapping: iconMappingPath,
    getPosition: (d) => [d.longitude, d.latitude],
    ...props,
  });
}

export default function MapDeckGl(props: MapDeckGlProps) {
  const topoJson = useTopoJsonData();

  return topoJson === undefined ? (
    "loading"
  ) : (
    <Map topoJson={topoJson} {...props} />
  );
}

function keepViewStateInBox(boundingBox: [[number, number], [number, number]]) {
  return (viewState: MapViewState): MapViewState => ({
    ...viewState,
    latitude: Math.max(
      boundingBox[0][0],
      Math.min(boundingBox[1][0], viewState.latitude)
    ),
    longitude: Math.max(
      boundingBox[0][1],
      Math.min(boundingBox[1][1], viewState.longitude)
    ),
  });
}

function Map({
  topoJson,
  height,
  width,
  boundingBox = defaultBoundingBox,
}: MapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [level, setLevel] = useState<Level>(Level.Region);
  const [selectedRegion, setSelectedRegion] = useState<string>();
  const [selectedDepartement, setSelectedDepartement] = useState<string>();
  const etablissements = useAllEtablissements();

  const geojsonCom = useMemo(
    () =>
      feature(topoJson, topoJson.objects.a_com2022) as FeatureCollection<
        Geometry,
        TerritoryProperties
      >,
    [topoJson]
  );
  const geojsonDep = useMemo(
    () =>
      feature(topoJson, topoJson.objects.a_dep2022) as FeatureCollection<
        Geometry,
        TerritoryProperties
      >,
    [topoJson]
  );
  const geojsonReg = useMemo(
    () =>
      feature(topoJson, topoJson.objects.a_reg2022) as FeatureCollection<
        Geometry,
        TerritoryProperties
      >,
    [topoJson]
  );

  function getObjectBoundingBox(
    object: GeoPermissibleObjects
  ): [[number, number], [number, number]] {
    const projection = geoMercator();
    const path = geoPath(projection);

    const bbx = path.bounds(object);

    if (projection?.invert === undefined) {
      throw new Error("Projection invert fn should exist");
    }

    const topLeftCorner = projection.invert(bbx[0]);
    const bottomRightCorner = projection.invert(bbx[1]);

    if (!topLeftCorner || !bottomRightCorner) {
      throw new Error("Invalid projection inversion");
    }

    return [topLeftCorner, bottomRightCorner];
  }

  function zoomToShape(object: Feature<Geometry, TerritoryProperties>) {
    const viewport = new WebMercatorViewport({ height, width });

    const bbx = getObjectBoundingBox(object);

    const updatedViewState = viewport.fitBounds(bbx, { padding: 10 });

    setViewState({
      ...updatedViewState,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    });
  }

  function zoomToPoint(
    pickingInfo: IconClusterLayerPickingInfo<
      Feature<Point, EtablissementProperties>
    >
  ) {
    if (pickingInfo.object === undefined) {
      throw new Error("Picked object is undefined");
    }

    const [longitude, latitude] = pickingInfo.coordinate ?? [0, 0];

    setViewState({
      latitude,
      longitude,
      zoom: 8,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    });
  }

  function handleClickCommune(
    pickingInfo: PickingInfo<Feature<Geometry, TerritoryProperties>>
  ) {
    const { object } = pickingInfo;
    if (object === undefined) {
      throw new Error("Picked object is undefined");
    }

    zoomToShape(object);
  }

  function handleClickDepartement(
    pickingInfo: PickingInfo<Feature<Geometry, TerritoryProperties>>
  ) {
    const { object } = pickingInfo;
    if (object === undefined) {
      throw new Error("Picked object is undefined");
    }

    zoomToShape(object);

    setSelectedDepartement(object.properties.dep);
  }

  function handleClickRegion(
    pickingInfo: PickingInfo<Feature<Geometry, TerritoryProperties>>
  ) {
    const { object } = pickingInfo;
    if (object === undefined) {
      throw new Error("Picked object is undefined");
    }

    zoomToShape(object);

    setSelectedRegion(object.properties.reg);
  }

  const filteredCommunes = useMemo(
    () =>
      geojsonCom.features.filter(
        (d) => d.properties.dep === selectedDepartement
      ),
    [selectedDepartement]
  );

  const filteredDepartements = useMemo(
    () =>
      geojsonDep.features.filter((d) => d.properties.reg === selectedRegion),
    [selectedRegion]
  );

  const layers = [
    createCommunesLayer({
      data: filteredCommunes,
      visible: level === Level.Communes,
      onClick: handleClickCommune,
    }),
    createDepartementsLayer({
      data: filteredDepartements,
      filled: level === Level.Departement,
      onClick: handleClickDepartement,
    }),
    createRegionsLayer({
      data: geojsonReg.features,
      filled: level === Level.Region,
      onClick: handleClickRegion,
    }),
    etablissements &&
      createClusterEtablissementLayer({
        data: etablissements,
        onClick: zoomToPoint,
      }),
  ];

  const handleDynamicLayers = debounce(
    ({ zoom }: ViewStateChangeParameters["viewState"]) => {
      const thresholdCommunes = 7.2;
      const thresholdDepartements = 5;

      if (zoom < thresholdDepartements) {
        setLevel(Level.Region);
      } else if (zoom < thresholdCommunes) {
        setLevel(Level.Departement);
      } else {
        setLevel(Level.Communes);
      }
    },
    500
  );

  const handleViewStateChange: DeckGLProps["onViewStateChange"] = ({
    viewState,
  }) => {
    handleDynamicLayers(viewState);
    setViewState(keepViewStateInBox(boundingBox)(viewState));
  };

  const getTooltip = useCallback(
    ({
      object,
    }: PickingInfo<Feature<Geometry, TerritoryProperties> | Etablissement>) => {
      if (!object) return null;

      if ("nom_etablissement" in object) {
        return object.nom_etablissement;
      }

      if ("properties" in object) {
        return object.properties.libgeo;
      }

      if ("cluster" in object) {
        return "Zoom in cluster?";
      }

      return "Inconnu";
    },
    []
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        background: "pink",
      }}
    >
      <DeckGL
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={{ scrollZoom: true, dragPan: true, dragRotate: false }}
        layers={layers}
        getTooltip={getTooltip}
      />
    </div>
  );
}
