type TabsProps = {
	tabs: { id: string; label: string }[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
};

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
	return (
		<div className='mb-4 flex'>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					className={`w-1/2 truncate rounded-md px-4 py-1 text-sm md:text-base ${activeTab === tab.id ? 'bg-blue font-bold text-green' : 'bg-green text-blue'}`}
					onClick={() => onTabChange(tab.id)}
				>
					{tab.label}
				</div>
			))}
		</div>
	);
}
