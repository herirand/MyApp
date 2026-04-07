'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
						<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white">Mon Compte</h1>
							<p className="text-gray-400 text-sm">Tableau de bord</p>
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
									href="/dashboard"
									className={`block p-3 rounded-xl transition-all flex items-center gap-3 ${
										currentPath === '/dashboard' 
											? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
											: 'text-gray-400 hover:bg-white/10 hover:text-white'
									}`}
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
									</svg>
									Mes Transactions
								</Link>
								<Link 
									href="/dashboard/expenses"
									className="block p-3 rounded-xl transition-all flex items-center gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
									Mes Dépenses
								</Link>
								<Link 
									href="/dashboard/profile"
									className="block p-3 rounded-xl transition-all flex items-center gap-3 text-gray-400 hover:bg-white/10 hover:text-white"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									Mon Profil
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