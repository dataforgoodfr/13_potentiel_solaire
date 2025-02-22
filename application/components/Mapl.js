// Version avec Leaflet

"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-control-geocoder";

// Définition d'une icône personnalisée
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Initialisation des données
const Map = () => {
  const mapRef = useRef(null);
  const regionsData = useRef(null);
  const departmentsData = useRef(null);
  const municipalitiesData = useRef(null);
  const initialView = { center: [46.603354, 1.888334], zoom: 5 }; // Coordonnées et zoom de la vue région
  const [mapInstance, setMapInstance] = useState(null);
  const [layers, setLayers] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Initialisation de la carte
  useEffect(() => {
    const map = L.map(mapRef.current).setView(initialView.center, initialView.zoom);

    // Ajout du fond CartoDB + contrôle de la carte par Leaflet Geocoder
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    // Ajout de la fonction recherche
    L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on("markgeocode", function (e) {
        map.setView(e.geocode.center, 12);
        L.marker(e.geocode.center).addTo(map);
      })
      .addTo(map);

    setMapInstance(map);
    return () => { map.remove(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Charger les régions au démarrage
  useEffect(() => {
    if (mapInstance && !regionsData.current) {
      // Ajout des régions
      fetch('/data/a-reg2021.json')
        .then((response) => response.json())
        .then((data) => {
          regionsData.current = data;
          displayRegions(data);
        })
        .catch((error) => console.error("Erreur de chargement des régions:", error));
    } else if (regionsData.current) {
      displayRegions(regionsData.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  const displayRegions = (data) => {
    L.geoJSON(data, {
      style: { color: 'blue', weight: 3, fillOpacity: 0 },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.libgeo);
        layer.on('click', () => {
          mapInstance.fitBounds(layer.getBounds());
          loadDepartments(feature.properties.code); // Charger les départements de la région
        });
      },
    }).addTo(mapInstance);
  };

  // Charger les départements de la région sélectionnée
  const loadDepartments = () => {
    if (!departmentsData.current) {
      fetch(`/data/a-dep2021.json`) // Ajustez selon la structure de vos fichiers
        .then((response) => response.json())
        .then((data) => {
          departmentsData.current = data;
          displayDepartments(data);
        })
        .catch((error) => console.error("Erreur de chargement des départements:", error));
    } else {
      displayDepartments(departmentsData.current);
    }
  };

  const displayDepartments = (data) => {
    const departmentsLayer = L.geoJSON(data, {
      style: { color: 'red', weight: 2, fillOpacity: 0 },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.libgeo);
        layer.on('click', () => {
          mapInstance.fitBounds(layer.getBounds());
          loadMunicipality(feature.properties.code); // Charger les communes du département
        });
      },
    }).addTo(mapInstance);
    setLayers((prevLayers) => [...prevLayers, departmentsLayer]);
  };

  // Charger les communes du département sélectionné
  const loadMunicipality = () => {
    if (!municipalitiesData.current) {
      fetch(`/data/a-com2022.json`) // Ajustez selon la structure de vos fichiers
        .then((response) => response.json())
        .then((data) => {
          municipalitiesData.current = data;
          displayMunicipalities(data);
        })
        .catch((error) => console.error("Erreur de chargement des communes:", error));
    } else {
      displayMunicipalities(municipalitiesData.current);
    }
  };

  const displayMunicipalities = (data) => {
    const municipalityLayer = L.geoJSON(data, {
      style: { color: 'black', weight: 1, fillOpacity: 0 },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.libgeo);
        layer.on('click', () => {
          mapInstance.fitBounds(layer.getBounds());
          loadSchools(feature.properties.libgeo); // Charger les écoles de la commune
        });
      },
    }).addTo(mapInstance);
    setLayers((prevLayers) => [...prevLayers, municipalityLayer]);
  };

  const loadSchools = (municipalityName) => {
    const url = `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/records?select=nom_etablissement,latitude,longitude,nom_commune&where=nom_commune="${encodeURIComponent(municipalityName)}"&limit=100`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const schoolsLayer = L.layerGroup();
        data.results.forEach(school => {
          if (school.latitude && school.longitude) {
            const marker = L.marker([school.latitude, school.longitude], { icon: customIcon })
              .bindPopup(`<b>${school.nom_etablissement}</b>`)
              .on('click', () => {
                setSelectedSchool({ ...school, municipalityName });
              });

            schoolsLayer.addLayer(marker);
          }
        });
        schoolsLayer.addTo(mapInstance);
        setLayers((prevLayers) => [...prevLayers, schoolsLayer]);
      })
      .catch((error) => console.error("Erreur de fetch :", error));
  };

  const resetMapView = () => {
    if (mapInstance) {
      mapInstance.setView(initialView.center, initialView.zoom);
      setSelectedSchool(null);
      layers.forEach(layer => mapInstance.removeLayer(layer));
      setLayers([]);
      if (regionsData.current) {
        displayRegions(regionsData.current);
      }
    }
  };

  return (
    <div className="w-screen h-[50vw] p-4 bg-gray-100">
      <button onClick={resetMapView} style={{ marginBottom: '10px' }}>Réinitialiser la carte</button>
      <div ref={mapRef} className="w-[65vw] h-[50vw] rounded-lg shadow-md border border-gray-300 overflow-hidden"></div>

      {selectedSchool && (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg border-l border-gray-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedSchool.nom_etablissement || "Nom inconnu"}
            </h2>
            <button
              onClick={() => setSelectedSchool(null)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            <p><span className="font-medium text-gray-900">Commune :</span> {selectedSchool.nom_commune || "Non disponible"}</p>
            <div className="border-t border-gray-300" />
            <p><span className="font-medium text-gray-900">Surface utile :</span> TBD</p>
            <p><span className="font-medium text-gray-900">Puissance de rayonnement :</span> TBD</p>
            <p><span className="font-medium text-gray-900">Indice de potentiel solaire :</span> TBD</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
