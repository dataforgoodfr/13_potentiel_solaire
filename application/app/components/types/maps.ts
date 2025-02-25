import { Topology } from "topojson-specification";

export type MapProps = {
  topoJson: Topology;
  height: number;
  width: number;
  boundingBox?: [[number, number], [number, number]];
};

export type MapDeckGlProps = Omit<MapProps, "topoJson">;
