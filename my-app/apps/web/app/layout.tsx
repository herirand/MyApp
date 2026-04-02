import './globals.css';
import { Header } from './components/layout/Header';

export const metadata = {
	title: 'Mon Application',
	description: 'Frontend Next.js connecté à mon backend',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr">
			<body className="min-h-screen flex flex-col antialiased">
				<Header />
				<main className="flex-grow container mx-auto p-4">
					{children}
				</main>
				<footer className="border-t p-4 text-center text-sm text-gray-500">
					© {new Date().getFullYear()} - Mon Projet Perso
				</footer>
			</body>
		</html>
	);
}
