import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';

import Providers from './Providers';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import './styles/globals.css';
import { InitialViewProvider } from './utils/providers/initialViewProvider';
import { MapFilterProvider } from './utils/providers/mapFilterProvider';

export const metadata: Metadata = {
	title: 'Établissement solaire',
	description: 'lorem ipsum',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='h-full'>
			<body className='flex min-h-screen flex-col'>
				<InitialViewProvider>
					<MapFilterProvider>
						<header className='sticky top-0 z-50'>
							<NavBar />
						</header>
						<main className='flex flex-1 flex-col bg-blue'>
							<Providers>{children}</Providers>
						</main>
					</MapFilterProvider>
				</InitialViewProvider>
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}
