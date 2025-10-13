'use client';

import { useState } from 'react';

import { Copy, CopyCheck, X } from 'lucide-react';

export const UNKNOWN_TEXT = '— Contenu à venir —';

interface CopyItem {
	label: string;
	value: string;
}

interface PopupProps {
	isOpen: boolean;
	onClose: () => void;
	email?: string;
	subject: string;
	body: string;
}

export const PopUp: React.FC<PopupProps> = ({ isOpen, onClose, email, subject, body }) => {
	const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

	const handleCopy = (key: string, text: string) => {
		navigator.clipboard.writeText(text);
		setCopied((prev) => ({ ...prev, [key]: true }));
		setTimeout(() => {
			setCopied((prev) => ({ ...prev, [key]: false }));
		}, 2000);
	};

	if (!isOpen) return null;

	const copyItems: CopyItem[] = [
		{ label: 'Mail :', value: email ?? 'exemple@mairie.fr' },
		{ label: 'Objet :', value: subject },
		{ label: 'Message :', value: body },
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
					onClick={onClose}
					className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'
					aria-label='Fermer la fenêtre'
				>
					<X size={24} aria-hidden='true' />
				</button>

				<h2 id='popup-title' className='mb-4 text-base font-bold text-darkgrey'>
					Contenus du mail de contact
				</h2>

				<p id='popup-description' className='mb-6 text-grey'>
					Merci de copier/coller les éléments suivants dans le mail adressé à votre maire.
				</p>

				<div className='space-y-4'>
					{copyItems.map((item) => {
						const isCopied = copied[item.label];
						const value = item.value || UNKNOWN_TEXT;

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
										{value}
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
