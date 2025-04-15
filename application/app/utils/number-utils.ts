import { LANG } from '../languageConfig';

export function formatNumber(value: number): string {
	return new Intl.NumberFormat(LANG).format(value);
}
