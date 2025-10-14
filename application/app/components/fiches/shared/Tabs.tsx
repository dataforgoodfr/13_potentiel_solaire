type TabsProps = {
	tabs: { id: string; label: string }[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
};

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
	const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

	function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			const next = (activeIndex + 1) % tabs.length;
			onTabChange(tabs[next].id);
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			const prev = (activeIndex - 1 + tabs.length) % tabs.length;
			onTabChange(tabs[prev].id);
		}
	}

	return (
		<div>
			<div
				className='mb-4 flex print:hidden'
				role='tablist'
				aria-label="Choisir un type d'établissement"
				onKeyDown={handleKeyDown}
			>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						role='tab'
						id={`tab-${tab.id}`}
						aria-selected={activeTab === tab.id}
						aria-controls={`panel-${tab.id}`}
						className={`w-1/2 truncate rounded-md px-4 py-1 text-sm md:text-base ${
							activeTab === tab.id
								? 'bg-blue font-bold text-green'
								: 'bg-green text-blue'
						}`}
						onClick={() => onTabChange(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='hidden print:block'>
				{activeTab && (
					<h2>
						{activeTab === 'all'
							? "Tous type d'établissement"
							: tabs.find((t) => t.id === activeTab)?.label}
					</h2>
				)}
			</div>
		</div>
	);
}
