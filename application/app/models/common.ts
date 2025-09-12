import { Commune } from './communes';
import { Departement } from './departements';
import { Etablissement } from './etablissements';
import { Region } from './regions';

export type NiveauPotentiel = '1_HIGH' | '2_GOOD' | '3_LIMITED';

export type NbEtablissementsByNiveauPotentiel = Record<NiveauPotentiel, number>;

export type SelectedPlaces = {
	etablissement: Etablissement | undefined;
	commune: Commune | undefined;
	departement: Departement | undefined;
	region: Region | undefined;
};
