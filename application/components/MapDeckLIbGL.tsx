/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// TO DO
// Définir l'ajout des couches par bounding box et niveau de zoom
// Corriger l'erreur des zooms sur certaines régions
"use client";

import { useEffect, useRef, useState } from "react";
import { Feature, Geometry } from "geojson";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { IControl } from "maplibre-gl";


const COLOR_STOPS = [
  { value: 1, color: [197, 109, 46] },  // Cacao
  { value: 25, color: [190, 124, 77] }, // Caramel
  { value: 50, color: [241, 244, 143] }, // Mindaro
  { value: 75, color: [242, 242, 48] }, // Icterine
];

const interpolateColor = (value: number, opacity = 50): [number, number, number, number] => {
  if (value <= COLOR_STOPS[0].value) return [...COLOR_STOPS[0].color, opacity] as [number, number, number, number];
  if (value >= COLOR_STOPS[COLOR_STOPS.length - 1].value) return [...COLOR_STOPS[COLOR_STOPS.length - 1].color, opacity] as [number, number, number, number];

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const { value: v1, color: c1 } = COLOR_STOPS[i];
    const { value: v2, color: c2 } = COLOR_STOPS[i + 1];

    if (value >= v1 && value <= v2) {
      const ratio = (value - v1) / (v2 - v1);
      const interpolatedColor = c1.map((c, index) => Math.round(c + ratio * (c2[index] - c)));
      return [...interpolatedColor, opacity] as [number, number, number, number];
    }
  }

  return [255, 255, 255, opacity];
};

export default function MapWithDeckGL() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<IControl | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Feature<Geometry, any> | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Feature<Geometry, any> | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<Feature<Geometry, any> | null>(null);
  const [regionsLayer, setRegionsLayer] = useState<GeoJsonLayer | null>(null);
  const [departmentsLayer, setDepartmentsLayer] = useState<GeoJsonLayer | null>(null);
  const [communesLayer, setCommunesLayer] = useState<GeoJsonLayer | null>(null);
  const [schoolsLayer, setSchoolsLayer] = useState<GeoJsonLayer | ScatterplotLayer | null>(null);

  console.log(schoolsLayer);

  const locations = {
    "🇬🇵": [-61.5833, 16.25, 8], // Guadeloupe
    "🇲🇶": [-61.0167, 14.6415, 8], // Martinique
    "🇬🇫": [-52.3333, 4.0, 6], // Guyane
    "⎔": [2.3610, 46.2938, 4.7], // Hexagone
    "🇾🇹": [45.1662, -12.8275, 9], // Mayotte
    "🇷🇪": [55.5364, -21.1151, 9], // Réunion
  };

  const flyToLocation = (location: string) => {
    if (!(location in locations)) {
      console.error("Emplacement inconnu :", location);
      return;
    }

    if (mapRef.current) {
      const [lng, lat, zoom] = locations[location as keyof typeof locations];
      mapRef.current.flyTo({ center: [lng, lat], zoom, essential: true });
    }
  };

  const zoomToFeature = (feature: any) => {
    if (!mapRef.current || !feature) return;

    let bounds: [maplibregl.LngLatLike, maplibregl.LngLatLike];
    if (feature.bbox && feature.bbox.length === 4) {
      const [minLng, minLat, maxLng, maxLat] = feature.bbox;
      bounds = [
        [minLng, minLat],
        [maxLng, maxLat],
      ];
    } else {
      const coordinates = feature.geometry.coordinates.flat(2);
      const lats = coordinates.filter((_: number, i: number) => i % 2 === 1);
      const lngs = coordinates.filter((_: number, i: number) => i % 2 === 0);

      bounds = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];
    }

    mapRef.current.fitBounds(bounds);
  };

  // Carte + Régions
  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style:
          "https://api.maptiler.com/maps/06388012-1c97-4709-834d-ed1505736064/style.json?key=cdZwnx5l25QVwmR58EvI",
        center: [5.888334, 15.60335],
        zoom: 2.35,
      });

      mapRef.current = map;
      overlayRef.current = new MapboxOverlay({ layers: [] }) as IControl;
      map.addControl(overlayRef.current);

      fetch("/data/b-reg2021.json")
        .then((response) => response.json())
        .then((geojsonData) => {
          const newRegionsLayer = new GeoJsonLayer({
            id: "regions-layer",
            data: geojsonData,
            filled: true,
            stroked: true,
            pickable: true,
            getFillColor: (d) => interpolateColor(d.properties.potentiel_solaire),
            getLineColor: [0, 0, 0, 255],
            getLineWidth: 2,
            lineWidthMinPixels: 1,
            onClick: (info) => {
              if (info.object) {
                setSelectedRegion(info.object);
                zoomToFeature(info.object);
              }
            },
          });

          setRegionsLayer(newRegionsLayer);
          (overlayRef.current as unknown as MapboxOverlay)?.setProps({ layers: [newRegionsLayer] });

        })
        .catch((error) => console.error("Error loading GeoJSON:", error));
    }
  }, []);

  // Départements
  useEffect(() => {
    if (selectedRegion) {
      fetch("/data/b-dep2021.json")
        .then((response) => response.json())
        .then((geojsonData) => {
          const filteredDepartements = geojsonData.features.filter(
            (d: { properties: { reg: string } }) => d.properties.reg === selectedRegion?.properties.reg
          );
          const newDepartementsLayer = new GeoJsonLayer({
            id: "departements-layer",
            data: filteredDepartements,
            filled: true,
            stroked: true,
            pickable: true,
            getFillColor: (d) => interpolateColor(d.properties.dep),
            getLineColor: [0, 0, 0, 255],
            getLineWidth: 1,
            lineWidthMinPixels: 1,
            onClick: (info) => {
              if (info.object) {
                setSelectedDepartment(info.object);
                zoomToFeature(info.object);
              }
            },
          });

          setDepartmentsLayer(newDepartementsLayer);
          (overlayRef.current as unknown as MapboxOverlay)?.setProps({
            layers: regionsLayer ? [regionsLayer, newDepartementsLayer] : [newDepartementsLayer],
          });

        })
        .catch((error) => console.error("Error loading GeoJSON:", error));
    }
  }, [selectedRegion]);

  // Communes
  useEffect(() => {
    if (selectedDepartment) {
      fetch("/data/b-com2022.json")
        .then((response) => response.json())
        .then((geojsonData) => {
          const filteredCommunes = geojsonData.features.filter(
            (d: { properties: { dep: string } }) => d.properties.dep === selectedDepartment?.properties.dep
          );
          const newCommunesLayer = new GeoJsonLayer({
            id: "communes-layer",
            data: filteredCommunes,
            filled: true,
            stroked: true,
            pickable: true,
            getFillColor: [0, 0, 0, 0],
            getLineColor: [0, 0, 0, 255],
            getLineWidth: 1,
            lineWidthMinPixels: 1,
            onClick: (info) => {
              if (info.object) {
                setSelectedCommune(info.object);
                zoomToFeature(info.object);
              }
            },
          });

          setCommunesLayer(newCommunesLayer);
          (overlayRef.current as unknown as MapboxOverlay)?.setProps({
            layers: departmentsLayer ? [regionsLayer, departmentsLayer, newCommunesLayer] : [newCommunesLayer],
          });

        })
        .catch((error) => console.error("Error loading GeoJSON:", error));
    }
  }, [selectedDepartment]);

  // Ecoles
  useEffect(() => {
    if (selectedCommune) {
      fetch("/data/b-sch2025.geojson")
        .then((response) => response.json())
        .then((geojsonData) => {
          const filteredSchools = geojsonData.features.filter(
            (d: { properties: { code_commune: string } }) => d.properties.code_commune === selectedCommune.properties.codgeo
          );

          const newSchoolsLayer = new ScatterplotLayer({
            id: "schools-layer",
            data: filteredSchools,
            radiusMinPixels: 5,
            radiusMaxPixels: 50,
            getPosition: (d: any) => d.geometry.coordinates,
            getFillColor: (d: any) => interpolateColor(d.properties.nombre_d_eleves, 250),
            pickable: true,
            onClick: (info) => {
              if (info.object) {
                const schoolName = info.object.properties.nom_etablissement;
                const coordinates = info.object.geometry.coordinates;
                if (mapRef.current instanceof maplibregl.Map) {
                  const popup = new maplibregl.Popup({ offset: 25 })
                    .setLngLat(coordinates)
                    .setHTML(`<h3>${schoolName}</h3>`)
                    .addTo(mapRef.current);

                  const popupElement = popup.getElement();
                  if (popupElement) {
                    popupElement.style.zIndex = '9999';
                  }
                }
              }
            },
          });

          setSchoolsLayer(newSchoolsLayer);
          (overlayRef.current as unknown as MapboxOverlay)?.setProps({
            layers: communesLayer ? [regionsLayer, departmentsLayer, communesLayer, newSchoolsLayer] : [newSchoolsLayer],
          });

        })
        .catch((error) => console.error("Error loading GeoJSON:", error));
    }
  }, [selectedCommune]);

  return (
    <div className="relative w-screen h-[50vw] p-4 bg-gray-100">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-2 bg-white p-2 shadow-lg rounded-lg">
        {Object.keys(locations).map((zone) => (
          <button
            key={zone}
            className="p-2 bg-[#66CC00] text-white rounded-lg hover:bg-[#004B00] transition"
            onClick={() => flyToLocation(zone)}
          >
            {zone}
          </button>
        ))}
      </div>
    </div>
  );
}
