import './globals.css';

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
				<main className="flex-grow">
					{children}
				</main>
			</body>
		</html>
	);
}
