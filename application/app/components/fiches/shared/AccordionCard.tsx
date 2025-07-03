interface AccordionCardProps {
	actions: {
		title: string;
		content: React.ReactNode;
	}[];
}

export default function AccordionCard({ actions }: AccordionCardProps) {
	return (
		<div>
			{actions.map((action, index) => (
				<details
					key={index}
					className='mb-2 rounded-md border border-blue bg-blue p-2 text-sm text-white'
				>
					<summary className='cursor-pointer font-bold'>{action.title}</summary>
					<div className='mt-2'>{action.content}</div>
				</details>
			))}
		</div>
	);
}
