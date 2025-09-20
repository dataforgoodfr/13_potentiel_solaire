'use client';

import { printFiche } from '@/app/utils/pdf-utils';
import { toast } from '@/hooks/use-toast';
import { Download, Share2 } from 'lucide-react';

const ActionButtons = () => {
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
	// 	const ficheIds = [
	// 		'fiche-commune',
	// 		'fiche-departement',
	// 		'fiche-region',
	// 		'fiche-etablissement',
	// 	];
	// 	const ficheId = ficheIds.find((id) => document.getElementById(id));

	// 	if (!ficheId) {
	// 		throw new Error('No fiche found in DOM');
	// 	}

	// 	// Extract fiche type from ID
	// 	const ficheType = ficheId.replace('fiche-', '');

	// 	// Extract name based on fiche type
	// 	let ficheName = 'fiche';

	// 	if (ficheType === 'etablissement') {
	// 		// For établissement, get name from EtablissementCard
	// 		const etablissementCard = document.querySelector(
	// 			'[data-testid="etablissement-card"] h1, .etablissement-card h1, h1',
	// 		);
	// 		if (etablissementCard) {
	// 			ficheName = etablissementCard.textContent?.trim() || 'etablissement';
	// 		}
	// 	} else {
	// 		// For collectivités, get name from CollectiviteHeaderCard
	// 		const headerCard = document.querySelector(`#${ficheId} h1`);
	// 		if (headerCard) {
	// 			ficheName = headerCard.textContent?.trim() || ficheType;
	// 		}
	// 	}

	// 	return { ficheId: 'fiche-root', ficheType, ficheName };
	// };

	const handleDownload = () => {
		try {
			printFiche();
		} catch (error) {
			console.error('Print failed:', error);
			toast({
				title: "Erreur lors de l'impression",
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='flex gap-4'>
			<button
				onClick={handleShare}
				title='Partager'
				className='hover:bg-gray-100 rounded p-2 text-darkgreen transition'
			>
				<Share2 className='h-5 w-5' />
			</button>

			<button
				onClick={handleDownload}
				title='Télécharger'
				className='hover:bg-gray-100 rounded p-2 text-darkgreen transition'
			>
				<Download />
			</button>
		</div>
	);
};

export default ActionButtons;
