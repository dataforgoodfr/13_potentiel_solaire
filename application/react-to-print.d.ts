declare module 'react-to-print' {
	import * as React from 'react';

	export interface UseReactToPrintOptions {
		contentRef: React.RefObject<HTMLElement>;
		documentTitle?: string;
		onAfterPrint?: () => void;
		onBeforePrint?: () => void;
		onPrintError?: (error: Error) => void;
	}

	export function useReactToPrint(options: UseReactToPrintOptions): () => void;
}
