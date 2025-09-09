import { Level } from '../components/Map/interfaces';
import { SelectedPlaces } from '../models/common';
import { Commune } from '../models/communes';
import { Departement } from '../models/departements';
import { Etablissement } from '../models/etablissements';
import { Region } from '../models/regions';

export function getCurrentLevelItem(level: Level, selectedPlaces: SelectedPlaces) {
	if (level === 'nation') return null;
	return selectedPlaces[level];
}

export function getLevelName(level: Level, item: Region | Departement | Commune | Etablissement) {
	switch (level) {
		case 'region':
			return (item as Region).libelle_region;
		case 'departement':
			return (item as Departement).libelle_departement;
		case 'commune':
			return (item as Commune).nom_commune;
		case 'etablissement':
			return (item as Etablissement).nom_etablissement;
	}
}
