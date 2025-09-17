import { Level } from '../components/Map/interfaces';

/**
 * Hierarchy of the levels from the highest to the lowest.
 */
export const LEVEL_HIERARCHY: Array<Level> = [
	'nation',
	'region',
	'departement',
	'commune',
	'etablissement',
];

/**
 * Return true if the level is strictly after the otherLevel in the hierarchy.
 * @param level
 * @param otherLevel
 * @returns
 */
export function isAfter(level: Level, otherLevel: Level): boolean {
	const levelIndex = LEVEL_HIERARCHY.indexOf(level);
	const otherLevelIndex = LEVEL_HIERARCHY.indexOf(otherLevel);
	return levelIndex > otherLevelIndex;
}
