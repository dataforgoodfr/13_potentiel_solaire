import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ArrowDownCircle } from 'lucide-react';

interface ScrollButtonProps {
	targetId: string;
	label: string;
}

export const ScrollButton: React.FC<ScrollButtonProps> = ({ targetId, label }) => {
	const [isTargetVisible, setIsTargetVisible] = useState(false);
	const targetRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		targetRef.current = document.getElementById(targetId);
		if (!targetRef.current) return;

		const observer = new window.IntersectionObserver(
			([entry]) => setIsTargetVisible(entry.isIntersecting),
			{ threshold: 0.2 }, // 20% visible triggers hide
		);
		observer.observe(targetRef.current);

		return () => observer.disconnect();
	}, [targetId]);

	const handleClick = () => {
		targetRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Hide button if target is visible
	if (isTargetVisible) return null;

	return (
		<div className='flex justify-center print:hidden' aria-hidden={isTargetVisible}>
			<Button
				onClick={handleClick}
				aria-label={label}
				className='fixed bottom-0 inline-flex min-w-64 justify-between bg-blue font-bold hover:bg-blue sm:min-w-72'
			>
				<span>{label}</span>
				<ArrowDownCircle className='stroke-green' />
			</Button>
		</div>
	);
};
export default ScrollButton;
