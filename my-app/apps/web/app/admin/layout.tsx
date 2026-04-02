'use client';

import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		router.push('/login');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
			<div className="max-w-6xl mx-auto">
				<header className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-indigo-900">Administration</h1>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					>
						Déconnexion
					</button>
				</header>
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
					<div className="flex">
						<aside className="w-64 bg-indigo-50 border-r p-6">
							<h2 className="font-bold text-indigo-900 mb-6">Menu Admin</h2>
							<nav className="space-y-2">
								<a href="/admin" className="block p-3 bg-indigo-600 text-white rounded-lg font-medium">
									Transactions
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