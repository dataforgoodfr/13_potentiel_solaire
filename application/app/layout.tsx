import { Suspense } from 'react';

import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';

import Providers from './Providers';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import SkipLinks from './components/SkipLinks';
import { DEFAULT_METADATA } from './content/seo';
import './styles/globals.css';
import { InitialViewProvider } from './utils/providers/initialViewProvider';

export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='fr' className='h-full'>
			<body className='flex min-h-dvh flex-col bg-blue'>
				<SkipLinks />
				<Suspense>
					<InitialViewProvider>
						<NavBar />
						<main className='flex flex-1 flex-col' id='main-content' tabIndex={-1}>
							<Providers>{children}</Providers>
						</main>
					</InitialViewProvider>
				</Suspense>
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}
