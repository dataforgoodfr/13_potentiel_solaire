'use client';

import { toast } from '@/hooks/use-toast';
import * as Popover from '@radix-ui/react-popover';
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
				className='hover:bg-gray-100 rounded p-2 text-darkgreen transition'
			>
				<Share2 className='h-5 w-5' />
			</button>
			<Popover.Root>
				<Popover.Trigger asChild>
					<button
						aria-disabled='true'
						className='hover:bg-gray-100 rounded p-2 text-darkgreen transition'
					>
						<Download />
					</button>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						className='z-tooltip rounded bg-blue px-3 py-1.5 text-xs text-white shadow'
						sideOffset={5}
					>
						Cette fonctionnalité n&apos;est pas encore disponible !
						<Popover.Arrow className='fill-black' />
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</div>
	);
};

export default ActionButtons;
