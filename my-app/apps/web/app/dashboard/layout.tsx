'use client';

import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		router.push('/login');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="max-w-6xl mx-auto">
				<header className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-indigo-900">Tableau de bord</h1>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					>
						Déconnexion
					</button>
				</header>
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
					<div className="flex">
						<aside className="w-64 bg-gray-50 border-r p-6">
							<h2 className="font-bold text-gray-700 mb-6">Menu</h2>
							<nav className="space-y-2">
								<a href="/dashboard" className="block p-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
									Mes transactions
								</a>
							</nav>
						</aside>
						<div className="flex-1 p-6">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}