'use client';

import { usePathname } from 'next/navigation';

import { useInitialView } from '../providers/initialViewProvider';

/**
 * Returns true if the search bar should be displayed based on the current pathname.
 */
export default function useShowSearchBar() {
	const pathname = usePathname();
	const { isInitialView, searchTerm } = useInitialView();

	// Show search bar only on the home page ('/') and if we are not displaying the initial view
	const showSearchBar = pathname === '/' && !isInitialView;
	return { show: showSearchBar, searchTerm };
}
