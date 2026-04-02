import Link from 'next/link';

export function Header() {
	return (
		<header className="border-b p-4">
			<nav className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold">
					Mon Projet
				</Link>
				<ul className="flex gap-4">
					<li><Link href="/">Accueil</Link></li>
					<li><Link href="/dashboard">Dashboard</Link></li>
				</ul>
			</nav>
		</header>
	);
}
