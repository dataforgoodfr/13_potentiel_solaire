export function formatNumber(value: number): string {
	return new Intl.NumberFormat('fr-FR').format(value);
}
