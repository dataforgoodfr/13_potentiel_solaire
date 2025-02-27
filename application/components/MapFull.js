"use client";

import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [activeTab, setActiveTab] = useState("Hexagone");
  //const [selectedSchool, setSelectedSchool] = useState(null);
  //const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setSelectedDepartment] = useState(null);

  // Coordonnées des zones
  const locations = {
    Guadeloupe: [-61.5833, 16.25, 8],
    Martinique: [-61.0167, 14.6415, 8],
    Guyane: [-52.3333, 4.0, 6],
    Hexagone: [2.3610, 46.2938, 4.7],
    Mayotte: [45.1662, -12.8275, 9],
    "La Réunion": [55.5364, -21.1151, 9],
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.maptiler.com/maps/06388012-1c97-4709-834d-ed1505736064/style.json?key=cdZwnx5l25QVwmR58EvI",
      center: [20.888334, 18.603354],
      zoom: 2.3,
    });

    mapInstance.current = map;

    map.on("load", () => {
      loadRegions(map);
    });

    return () => {
      map.remove();
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

  // Chargement des régions et du masque
  const loadRegions = (map) => {
    fetch("/data/b-reg2021.json")
      .then((response) => response.json())
      .then((regionsData) => {
        const worldBounds = turf.polygon([
          [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
        ]);
        const franceMask = turf.mask(regionsData, worldBounds);
        if (!map.getSource("france-mask")) {
          map.addSource("france-mask", { type: "geojson", data: franceMask });
          map.addLayer({
            id: "france-mask-fill",
            type: "fill",
            source: "france-mask",
            paint: { "fill-color": "rgba(255, 255, 255, 0.4)" },
          });
        }

        if (!map.getSource("regions")) {
          map.addSource("regions", { type: "geojson", data: regionsData });
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
        }

        // Ajout aplat de couleurs pour le potentiel solaire
        if (!map.getLayer("regions-solar-potential")) {
          map.addLayer({
            id: "regions-solar-potential",
            type: "fill",
            source: "regions",
            paint: {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "potentiel_solaire"],
                1, "#c56d2e",   // Cacao (1 - 25)
                25, "#be7c4d",  // Caramel (26 - 50)
                50, "#f1f48f",  // Mindaro (51 - 75)
                75, "#f2f230",  // Icterine (76 - 100)
              ],
              "fill-opacity": 0.5
            }
          });
        }


        map.on("click", "regions-fill", (e) => {
          const bounds = new maplibregl.LngLatBounds();
          e.features[0].geometry.coordinates[0].forEach((coord) =>
            bounds.extend(coord)
          );
          map.fitBounds(bounds, {});
          loadDepartments(map);
          map.removeLayer("regions-solar-potential")
        });

        addMouseEvents(map, "regions-fill");
      });

  };

  // Chargement des départements
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
        }

        if (!map.getLayer("departments-solar-potential")) {
          map.addLayer({
            id: "departments-solar-potential",
            type: "fill",
            source: "departments",
            paint: {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "dep"]],
                1, "#c56d2e",   // Cacao (1 - 25)
                25, "#be7c4d",  // Caramel (26 - 50)
                50, "#f1f48f",  // Mindaro (51 - 75)
                75, "#f2f230",  // Icterine (76 - 100)
              ],
              "fill-opacity": 0.5
            }
          });
        }

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
      });
  };

  // Chargement des communes
  const loadCommunes = (map, depCode) => {
    fetch("/data/a-com2022.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredCommunes = {
          type: "FeatureCollection",
          features: data.features.filter((f) => f.properties.dep === depCode),
        };

        if (map.getSource("communes")) {
          map.getSource("communes").setData(filteredCommunes);
        } else {
          map.addSource("communes", { type: "geojson", data: filteredCommunes });

          map.addLayer({
            id: "communes-border",
            type: "line",
            source: "communes",
            paint: { "line-color": "black", "line-width": 0.5 },
          });

          map.addLayer({
            id: "communes-fill",
            type: "fill",
            source: "communes",
            paint: { "fill-opacity": 0 },
          });

          map.on("click", "communes-fill", (e) => {
            const nomMunicipality = e.features[0].properties.libgeo;
            const bounds = new maplibregl.LngLatBounds();
            e.features[0].geometry.coordinates[0].forEach((coord) =>
              bounds.extend(coord)
            );
            map.fitBounds(bounds, {});

            loadSchools(map, nomMunicipality);
          });

          addMouseEvents(map, "communes-fill");
        }
      });
  };

  // Fonction pour flyTo sur une zone
  const flyToLocation = (location) => {
    if (!mapInstance.current) return;
    const [lng, lat, zoom] = locations[location];
    mapInstance.current.flyTo({ center: [lng, lat], zoom, essential: true });
    setActiveTab(location);
  };

  return (
    <div className="relative w-screen h-[50vw] bg-gray-100 flex">
      {/* Carte */}
      <div ref={mapRef} className="flex-1 h-full rounded-lg shadow-md border border-gray-300 overflow-hidden" />

      {/* Bandeau sur le côté droit */}
      <div className="absolute top-0 right-0 h-full w-[200px] bg-white shadow-md flex flex-col z-10 border-l-2 border-gray-200">
        {Object.keys(locations).map((location) => (
          <button
            key={location}
            onClick={() => flyToLocation(location)}
            className={`w-full text-center py-3 text-lg font-semibold transition relative
              ${activeTab === location ? "text-[#66CC00]" : "text-[#004B00] hover:text-[#66CC00]"}`}
          >
            {location}
            {/* Soulignement vertical animé */}
            <span
              className={`absolute bottom-0 left-0 h-full w-1 bg-[#66CC00] transition-all duration-300
                ${activeTab === location ? "scale-y-100" : "scale-y-0"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );

};

export default Map;
