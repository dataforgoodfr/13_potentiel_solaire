'use client';

import { useReactToPrint } from 'react-to-print';

import { toast } from '@/hooks/use-toast';
import { Download, Share2 } from 'lucide-react';

const LABELS = {
	ARIA_SHARE: 'Partager la fiche',
	ARIA_DOWNLOAD: 'Télécharger la fiche',
};

interface ActionButtonsProps {
	ficheRef?: React.RefObject<HTMLDivElement | null>;
	ficheName?: string;
	onBeforePrint?: () => void;
	onAfterPrint?: () => void;
}

export default function ActionButtons({
	ficheRef,
	ficheName,
	onBeforePrint,
	onAfterPrint,
}: ActionButtonsProps) {
	const handleShare = async () => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: document.title,
					url,
				});
			} catch (err: unknown) {
				if (
					err instanceof DOMException &&
					(err.name === 'AbortError' ||
						err.message?.includes('cancelled') ||
						err.message?.includes('aborted'))
				) {
					console.info('Partage annulé par l’utilisateur.');
				} else {
					console.error('Erreur lors du partage :', err);
					toast({
						title: 'Le partage a échoué',
						variant: 'destructive',
					});
				}
			}
		} else {
			try {
				await navigator.clipboard.writeText(url);
				toast({
					title: 'Lien copié dans le presse-papiers !',
				});
			} catch (err) {
				console.error('Erreur lors de la copie du lien :', err);
				toast({
					title: 'Impossible de copier le lien',
					variant: 'destructive',
				});
			}
		}
	};

	const reactToPrintFn = useReactToPrint({
		contentRef: ficheRef as React.RefObject<HTMLDivElement>,
		documentTitle: `Potentiel solaire ${ficheName}` || 'Potentiel solaire',
		onBeforePrint: async () => {
			if (onBeforePrint) await onBeforePrint();
		},
		onAfterPrint: async () => {
			if (onAfterPrint) await onAfterPrint();
		},
		onPrintError: (error) => {
			console.error('Print error:', error);
			toast({
				title: "Erreur lors de l'impression",
				variant: 'destructive',
			});
		},
	});

	const handleDownload = () => {
		if (!ficheRef?.current) {
			console.error('Nothing to print: ficheRef is null');
			toast({
				title: "Impossible d'imprimer, contenu introuvable",
				variant: 'destructive',
			});
			return;
		}

		reactToPrintFn();
	};

	return (
		<div className='flex gap-4 print:hidden'>
			<button
				onClick={handleShare}
				title='Partager'
				className='rounded p-2 text-darkgreen transition hover:bg-gray-100'
				aria-label={LABELS.ARIA_SHARE}
			>
				<Share2 className='h-5 w-5' />
			</button>

			<button
				onClick={handleDownload}
				title='Télécharger'
				className='rounded p-2 text-darkgreen transition hover:bg-gray-100'
				aria-label={LABELS.ARIA_DOWNLOAD}
			>
				<Download />
			</button>
		</div>
	);
}
