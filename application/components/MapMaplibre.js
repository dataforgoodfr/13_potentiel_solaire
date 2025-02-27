"use client";

import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setSelectedDepartment] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.maptiler.com/maps/06388012-1c97-4709-834d-ed1505736064/style.json?key=cdZwnx5l25QVwmR58EvI",
      center: [1.888334, 46.603354],
<<<<<<< HEAD
      zoom: 4.8,
=======
      zoom: 4,
>>>>>>> 1c4b0e3 (amélioration de la carte)
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

<<<<<<< HEAD
  // Chargement des régions
  const loadRegions = (map) => {
    fetch("/data/a-reg2021.json")
      .then((response) => response.json())
      .then((regionsData) => {
        const worldBounds = turf.polygon([
          [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
        ]);
        const franceMask = turf.mask(regionsData, worldBounds);
=======
  // Chargement des régions avec le masque
  const loadRegions = (map) => {
    fetch("/data/a-reg2021.json")
      .then((response) => response.json())
      .then((data) => {
        const worldBounds = turf.polygon([
          [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
        ]);
        const franceMask = turf.mask(data, worldBounds);

>>>>>>> 1c4b0e3 (amélioration de la carte)
        if (!map.getSource("france-mask")) {
          map.addSource("france-mask", { type: "geojson", data: franceMask });
          map.addLayer({
            id: "france-mask-fill",
            type: "fill",
            source: "france-mask",
            paint: { "fill-color": "rgba(255, 255, 255, 0.9)" },
          });
        }

        if (!map.getSource("regions")) {
<<<<<<< HEAD
          map.addSource("regions", { type: "geojson", data: regionsData });
=======
          map.addSource("regions", { type: "geojson", data });
>>>>>>> 1c4b0e3 (amélioration de la carte)
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
<<<<<<< HEAD
        }

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
              "fill-opacity": 0.5 // Ajuste l'opacité pour voir la carte en dessous
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
        });

        addMouseEvents(map, "regions-fill");
      });

=======

          map.on("click", "regions-fill", (e) => {
            const bounds = new maplibregl.LngLatBounds();
            e.features[0].geometry.coordinates[0].forEach((coord) =>
              bounds.extend(coord)
            );
            map.fitBounds(bounds, {});
            loadDepartments(map);
          });

          addMouseEvents(map, "regions-fill");
        }
      });
>>>>>>> 1c4b0e3 (amélioration de la carte)
  };

  // Chargement des départements
  const loadDepartments = () => {
    const map = mapInstance.current; // Récupérer la carte
    if (!map) return; // Sécurité

    fetch("/data/a-dep2021.json")
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

  // Chargement des écoles
  const loadSchools = (map, nomMunicipality) => {
<<<<<<< HEAD
    const url = `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records?select=nom_etablissement,latitude,longitude,nom_commune&where=nom_commune="${encodeURIComponent(nomMunicipality)}"&limit=100`;
=======
    const url = `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records?select=nom_etablissement,latitude,longitude,nom_commune&where=nom_commune="${encodeURIComponent(
      nomMunicipality
    )}"&limit=100`;
>>>>>>> 1c4b0e3 (amélioration de la carte)

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((school) => {
          const marker = new maplibregl.Marker()
            .setLngLat([school.longitude, school.latitude])
            .addTo(map);

            marker.getElement().addEventListener("click", () => {
              setSelectedSchool(school);
              setIsSidebarOpen(true);
            });
        });
      });
  };

  // Ajout du panneau latéral
  const Sidebar = ({ selectedSchool, onClose }) => {
    if (!selectedSchool) return null;

    return (
      <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg border-l border-gray-200 p-6 flex flex-col">
        {/* Bouton de fermeture */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedSchool.nom_etablissement || "Nom inconnu"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Informations sur l'école */}
        <div className="space-y-4 text-gray-700">
          <p><span className="font-medium text-gray-900">Commune :</span> {selectedSchool.nom_commune || "Non disponible"}</p>
          <div className="border-t border-gray-300" />
          <p><span className="font-medium text-gray-900">Surface utile :</span> TBD</p>
          <p><span className="font-medium text-gray-900">Puissance de rayonnement :</span> TBD</p>
          <p><span className="font-medium text-gray-900">Indice de potentiel solaire :</span> TBD</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-screen h-[50vw] p-4 bg-gray-100">
      {/* Carte */}
      <div ref={mapRef} className="w-[65vw] h-[50vw] rounded-lg shadow-md border border-gray-300 overflow-hidden" />

      {/* Panneau latéral à droite */}
      {isSidebarOpen && (
        <Sidebar
          selectedSchool={selectedSchool}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );


};

export default Map;
