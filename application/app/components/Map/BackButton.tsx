type BackButtonProps = {
	onBack: () => void;
};

export default function BackButton({ onBack }: BackButtonProps) {
	return (
		<button onClick={onBack} className='absolute right-2 top-2'>
			Retour
		</button>
	);
}
