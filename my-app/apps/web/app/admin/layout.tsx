'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		router.push('/login');
	};

	const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
			<div className="absolute inset-0" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
				backgroundSize: '40px 40px',
			}} />
			
			<div className="relative max-w-7xl mx-auto">
				<header className="flex justify-between items-center mb-8">
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white">Administration</h1>
							<p className="text-gray-400 text-sm">Gestion des transactions</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Déconnexion
					</button>
				</header>

				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
					<div className="flex">
						<aside className="w-64 bg-white/5 border-r border-white/10 p-6">
							<nav className="space-y-2">
								<Link 
									href="/admin"
									className={`block p-3 rounded-xl transition-all flex items-center gap-3 ${
										currentPath === '/admin' 
											? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
											: 'text-gray-400 hover:bg-white/10 hover:text-white'
									}`}
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									Transactions
								</Link>
								<Link 
									href="/admin/expenses"
									className="block p-3 rounded-xl transition-all flex items-center gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
									Dépenses
								</Link>
								<Link 
									href="/admin/students"
									className="block p-3 rounded-xl transition-all flex items-center gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
									Étudiants
								</Link>
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