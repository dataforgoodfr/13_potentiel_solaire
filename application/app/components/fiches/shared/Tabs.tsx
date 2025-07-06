import { useRef } from 'react';

type Tab = {
	id: string;
	label: string;
};

type TabsProps = {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
};

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			const dir = e.key === 'ArrowRight' ? 1 : -1;
			const nextIndex = (index + dir + tabs.length) % tabs.length;
			tabRefs.current[nextIndex]?.focus();
			onTabChange(tabs[nextIndex].id);
		}
	};

	return (
		<div role='tablist' aria-label="Sélection du type d'établissement" className='mb-4 flex'>
			{tabs.map((tab, index) => {
				const isActive = tab.id === activeTab;

				return (
					<button
						key={tab.id}
						role='tab'
						id={`tab-${tab.id}`}
						aria-selected={isActive}
						aria-controls={`panel-${tab.id}`}
						tabIndex={isActive ? 0 : -1}
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						onClick={() => onTabChange(tab.id)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						className={`w-1/2 truncate rounded-md px-4 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue md:text-base ${
							isActive ? 'bg-blue font-bold text-green' : 'bg-green text-blue'
						}`}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}
