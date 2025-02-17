"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";

import {
  BaseType,
  ZoomBehavior,
  geoIdentity,
  geoPath,
  json,
  pointer,
  scaleOrdinal,
  schemeCategory10,
  select,
  zoom as zoomD3,
  zoomIdentity,
} from "d3";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  GeometryObject,
} from "geojson";
import { feature } from "topojson-client";
import { Topology } from "topojson-specification";

const COM2022_URL =
  "https://static.data.gouv.fr/resources/contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches/20220423-134434/a-com2022-topo-2154.json";

type Properties = {
  dep: `${number}`;
};

type GeoJsonData = FeatureCollection<GeometryObject, Properties>;

async function getTopoJson(): Promise<Topology> {
  const topo = await json(COM2022_URL).catch((e) => console.error(e.name));

  return topo as Topology;
}

function convertToGeoJson(data: Topology) {
  return feature(data, data.objects.a_com2022) as GeoJsonData;
}

async function drawMap(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
  zoom: ZoomBehavior<SVGSVGElement, unknown>
) {
  const topo = await getTopoJson();

  const data = convertToGeoJson(topo);

  const projection = geoIdentity()
    .reflectY(true)
    .fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      data
    );

  const path = geoPath();
  const pathGenerator = path.projection(projection);

  const svgSelection = select(svgElement);
  const mapSelection = svgSelection.select("g.topography");

  const colors = schemeCategory10;
  const scale = scaleOrdinal<string>().range(colors);

  function onMouseOver(this: BaseType | SVGPathElement) {
    select(this)
      .style("opacity", 1)
      .style("stroke", "grey")
      .style("stroke-width", 0.3);
  }

  function onMouseLeave(this: BaseType | SVGPathElement) {
    select(this).style("stroke", "transparent");
  }

  function onClick(event: MouseEvent, d: Feature<Geometry, GeoJsonProperties>) {
    event.stopPropagation();

    const [[x0, y0], [x1, y1]] = path.bounds(d);

    const scaleToZoom = 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height);
    const translateXToZoom = -(x0 + x1) / 2;
    const translateYToZoom = -(y0 + y1) / 2;

    svgSelection
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scaleToZoom)
          .translate(translateXToZoom, translateYToZoom),
        pointer(event, svgSelection.node())
      );
  }

  mapSelection
    .selectAll("path")
    .data(data.features)
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("fill", (d) => scale(d.properties.dep))
          .attr("opacity", 1),
      (update) => update.attr("fill", "transparent"),
      (exit) => exit.remove()
    )
    .attr("d", pathGenerator)
    .on("mouseover", onMouseOver)
    .on("mouseleave", onMouseLeave)
    .on("click", onClick);
}

function initZoom() {
  function handleZoom(e: { transform: string }) {
    select("svg g").attr("transform", e.transform);
  }

  const zoom = zoomD3<SVGSVGElement, unknown>()
    .scaleExtent([1, 100])
    .on("zoom", handleZoom);

  select<SVGSVGElement, unknown>("svg").call(zoom);

  return zoom;
}

export default function MapD3() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const width = 500;
  const height = 500;

  useEffect(() => {
    if (svgRef.current == null) return;

    setIsLoading(true);

    const zoom = initZoom();
    drawMap(svgRef.current, width, height, zoom).finally(() =>
      setIsLoading(false)
    );
  }, []);

  return (
    <div
      id="svg-container"
      style={{
        width: "100%",
        height: "100%",
        background: "pink",
      }}
    >
      {isLoading && "loading..."}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ background: "white" }}
      >
        <g className="topography" transform={`translate(${0},${0})`} />
      </svg>
    </div>
  );
}
