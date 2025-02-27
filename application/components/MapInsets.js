"use client";

import { useEffect, useRef, useState } from "react";
// import * as turf from "@turf/turf";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const mapRef = useRef(null);
  const insetRefs = useRef([]);
  const mapInstance = useRef(null);
  const insetInstances = useRef([]);

  // const [selectedSchool, setSelectedSchool] = useState(null);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [, setSelectedRegion] = useState(null);
  const [, setSelectedDepartment] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.maptiler.com/maps/06388012-1c97-4709-834d-ed1505736064/style.json?key=cdZwnx5l25QVwmR58EvI",
      center: [5.888334, 46.203354],
      zoom: 4.4,
    });

    mapInstance.current = map;

    // Insets (cartes secondaires)
    const insetData = [
      { center: [-61.4, 16], zoom: 7 }, // Guadeloupe
      { center: [-61, 14.5], zoom: 7 }, // Martinique
      { center: [-53, 3.55], zoom: 5 }, // Guyane
      { center: [55.5, -21.2], zoom: 7 }, // La Réunion
      { center: [45.08, -13], zoom: 7 }, // Mayotte

    ];

    insetData.forEach((data, index) => {
      const insetMap = new maplibregl.Map({
        container: insetRefs.current[index],
        style: "https://api.maptiler.com/maps/06388012-1c97-4709-834d-ed1505736064/style.json?key=cdZwnx5l25QVwmR58EvI",
        center: data.center,
        zoom: data.zoom,
      });

      insetInstances.current[index] = insetMap;

      insetMap.on("load", () => {
        loadRegions(insetMap);
      });
    });

    map.on("load", () => {
      loadRegions(map);
    });

    return () => {
      map.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      insetInstances.current.forEach(inset => inset.remove());
    };


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ajout des événements de souris pour les interactions
  const addMouseEvents = (map, layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
  };

  // Chargement des régions
  const loadRegions = (map) => {
    fetch("/data/b-reg2021.json")
      .then((response) => response.json())
      .then((data) => {
        // if (applyMask) {
        //   const worldBounds = turf.polygon([
        //    [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
        //   ]);
        //   const franceMask = turf.mask(data, worldBounds);

        //   if (!map.getSource("france-mask")) {
        //     map.addSource("france-mask", { type: "geojson", data: franceMask });
        //     map.addLayer({
        //       id: "france-mask-fill",
        //       type: "fill",
        //       source: "france-mask",
        //       paint: { "fill-color": "rgba(255, 255, 255, 0.5)" },
        //     });
        //   }
        // }

        if (!map.getSource("regions")) {
          map.addSource("regions", { type: "geojson", data });
        }

        if (!map.getLayer("regions-border")) {
          map.addLayer({
            id: "regions-border",
            type: "line",
            source: "regions",
            paint: { "line-color": "blue", "line-width": 1 },
          });
        }

        if (!map.getLayer("regions-fill")) {
          map.addLayer({
            id: "regions-fill",
            type: "fill",
            source: "regions",
            paint: { "fill-opacity": 0 },
          });

          map.on("click", "regions-fill", (e) => {
            //const regCode = e.features[0].properties.reg;
            //setSelectedRegion(regCode);

            const bounds = new maplibregl.LngLatBounds();
            e.features[0].geometry.coordinates[0].forEach((coord) =>
              bounds.extend(coord)
            );
            map.fitBounds(bounds, {});
            //loadDepartments(mapInstance.current, regCode);
            loadDepartments();
          });

          addMouseEvents(map, "regions-fill");
        }
      });
  };

    // Chargement des départements non fonctionnel
  const loadDepartments = () => {
    const map = mapInstance.current;
    if (!map) return;

    fetch("/data/b-dep2021.json")
      .then((response) => response.json())
      .then((data) => {
        if (!map.getSource("departments")) {
          map.addSource("departments", { type: "geojson", data });
        }

        if (!map.getLayer("departments-border")) {
          map.addLayer({
            id: "departments-border",
            type: "line",
            source: "departments",
            paint: { "line-color": "red", "line-width": 1 },
          });
        }

        if (!map.getLayer("departments-fill")) {
          map.addLayer({
            id: "departments-fill",
            type: "fill",
            source: "departments",
            paint: { "fill-opacity": 0 },
          });

          map.on("click", "departments-fill", (e) => {
            const depCode = e.features[0].properties.dep;
            setSelectedDepartment(depCode);

            const bounds = new maplibregl.LngLatBounds();
            e.features[0].geometry.coordinates[0].forEach((coord) =>
              bounds.extend(coord)
            );
            map.fitBounds(bounds, {});

            loadCommunes(map, depCode);
          });

          addMouseEvents(map, "departments-fill");
        }
      });
  };

  return (
    <div className="flex flex-col items-center w-screen h-[60vw] p-4 bg-gray-100">
      {/* Carte principale */}
      <div ref={mapRef} className="w-[80vw] h-[50vw] rounded-lg shadow-md border border-gray-300 overflow-hidden" />

      {/* Grille des insets */}
      <div className="flex justify-between w-full mt-4">
        <div ref={(el) => insetRefs.current[0] = el} className="w-[18vw] h-[18vw] rounded-lg shadow-md border border-gray-300" />
        <div ref={(el) => insetRefs.current[1] = el} className="w-[18vw] h-[18vw] rounded-lg shadow-md border border-gray-300" />
        <div ref={(el) => insetRefs.current[2] = el} className="w-[18vw] h-[18vw] rounded-lg shadow-md border border-gray-300" />
        <div ref={(el) => insetRefs.current[3] = el} className="w-[18vw] h-[18vw] rounded-lg shadow-md border border-gray-300" />
        <div ref={(el) => insetRefs.current[4] = el} className="w-[18vw] h-[18vw] rounded-lg shadow-md border border-gray-300" />
      </div>
    </div>
  );


};

export default Map;
