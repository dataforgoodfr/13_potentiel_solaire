type TabsProps = {
	tabs: { id: string; label: string }[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
};

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
	const activeTabObj = tabs.find((tab) => tab.id === activeTab);
	return (
		<>
			<div className='mb-4 flex print:hidden'>
				{tabs.map((tab) => (
					<div
						key={tab.id}
						className={`w-1/2 cursor-pointer truncate rounded-md px-4 py-1 text-sm md:text-base ${activeTab === tab.id ? 'bg-blue font-bold text-green' : 'bg-green text-blue'}`}
						onClick={() => onTabChange(tab.id)}
					>
						{tab.label}
					</div>
				))}
			</div>
			<div className='hidden print:block'>
				{activeTabObj && (
					<h2>
						{activeTabObj.id === 'all'
							? "Tous type d'établissement"
							: activeTabObj.label}
					</h2>
				)}
			</div>
		</>
	);
}
