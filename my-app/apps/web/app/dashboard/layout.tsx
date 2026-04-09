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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative">
			<div className="absolute inset-0 -z-10" style={{
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
						className="z-50 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Déconnexion
					</button>
				</header>

				{children}
			</div>
		</div>
	);
}