'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { Copy, CopyCheck, X } from 'lucide-react';

interface CopyItem {
	label: string;
	value: string;
	formattedValue?: ReactNode;
}

interface PopupProps {
	isOpen: boolean;
	onClose: () => void;
	email?: string;
	subject: string;
	body: string;
}

const INFO_TRIGGER_TEXT = 'Voir plus';
const INFO_HIDE_TEXT = 'Voir moins';
const POPUP_TITLE = 'Contenus du mail de contact';
const POPUP_DESCRIPTION =
	'Vous pouvez copier/coller les éléments suivants dans le mail adressé à votre maire.';

export const PopUp: React.FC<PopupProps> = ({ isOpen, onClose, email, subject, body }) => {
	const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
	const [isBodyExpanded, setIsBodyExpanded] = useState(false);

	const handleCopy = (key: string, text: string) => {
		navigator.clipboard.writeText(text);
		setCopied((prev) => ({ ...prev, [key]: true }));
		setTimeout(() => {
			setCopied((prev) => ({ ...prev, [key]: false }));
		}, 4000);
		toast({
			title: 'Texte copié dans le presse-papiers !',
		});
	};

	const handleClose = useCallback(() => {
		setCopied({});
		setIsBodyExpanded(false);
		onClose();
	}, [onClose]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				e.stopImmediatePropagation();
				handleClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown, true);

		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [isOpen, handleClose]);

	if (!isOpen) return null;

	const fullBodyText = body;
	const formattedBody = body.split('\n').map((line, i) => (
		<p key={i} className='mb-2 whitespace-pre-wrap'>
			{line}
		</p>
	));
	const bodyLines = body.split('\n');
	const firstLines = bodyLines.slice(0, 3).map((line, i) => (
		<p key={i} className='mb-2 whitespace-pre-wrap'>
			{line}
		</p>
	));
	const remainingLines = bodyLines.slice(2).map((line, i) => (
		<p key={i} className='mb-2 whitespace-pre-wrap'>
			{line}
		</p>
	));

	const copyItems: CopyItem[] = [
		...(email ? [{ label: 'Mail :', value: email }] : []),
		{ label: 'Objet :', value: subject },
		{
			label: 'Message :',
			value: fullBodyText,
			formattedValue: (
				<>
					<div className='block md:hidden'>
						{firstLines}
						{remainingLines.length > 0 && (
							<Collapsible
								asChild
								defaultOpen={false}
								onOpenChange={setIsBodyExpanded}
							>
								<div>
									<CollapsibleContent>{remainingLines}</CollapsibleContent>
									<CollapsibleTrigger className='mt-2 text-darkgrey underline decoration-dotted decoration-2 underline-offset-4'>
										{isBodyExpanded ? INFO_HIDE_TEXT : INFO_TRIGGER_TEXT}
									</CollapsibleTrigger>
								</div>
							</Collapsible>
						)}
					</div>

					<div className='hidden md:block'>{formattedBody}</div>
				</>
			),
		},
	];

	return (
		<div
			className='fixed inset-0 z-dialog flex items-center justify-center bg-black/50 p-4'
			role='dialog'
			aria-modal='true'
			aria-labelledby='popup-title'
			aria-describedby='popup-description'
		>
			<div className='relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg md:p-8'>
				<button
					onClick={() => handleClose()}
					className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'
					aria-label='Fermer la fenêtre'
				>
					<X size={24} aria-hidden='true' />
				</button>

				<h3 id='popup-title' className='mb-4 text-base font-bold text-darkgrey'>
					{POPUP_TITLE}
				</h3>

				<p id='popup-description' className='mb-6 text-grey'>
					{POPUP_DESCRIPTION}
				</p>

				<div className='space-y-4'>
					{copyItems.map((item) => {
						const isCopied = copied[item.label];
						const value = item.value;

						return (
							<div
								key={item.label}
								className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
									isCopied
										? 'border-gray-300 bg-gray-100'
										: 'border-green bg-green'
								}`}
							>
								<button
									onClick={() => handleCopy(item.label, value)}
									className='flex-shrink-0 rounded p-2 text-darkgreen focus:outline-none focus:ring-2 focus:ring-green'
									aria-label={`Copier le contenu de ${item.label}`}
								>
									{isCopied ? (
										<CopyCheck size={22} aria-hidden='true' />
									) : (
										<Copy size={22} aria-hidden='true' />
									)}
								</button>

								<div className='flex flex-1 flex-col'>
									<span className='font-semibold text-darkgrey'>
										{item.label}
									</span>
									<span className='mt-1 break-words text-sm text-darkgrey'>
										{item.formattedValue || value}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
