'use client';

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

	return (
		<div className='flex gap-4'>
			<button
				onClick={handleShare}
				title='Partager'
				className='rounded p-2 text-darkgreen transition hover:bg-gray-100'
			>
				<Share2 className='h-5 w-5' />
			</button>
			<button className='rounded p-2 text-darkgreen transition hover:bg-gray-100'>
				<Download />
			</button>
		</div>
	);
};

export default ActionButtons;
