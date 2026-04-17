'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		router.push('/login');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-6 relative">
			<div className="absolute inset-0 -z-10" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
				backgroundSize: '40px 40px',
			}} />
			
			<div className="relative max-w-7xl mx-auto">
				<header className="flex justify-between items-center mb-6 md:mb-8">
					<div className="flex items-center gap-2 md:gap-4">
						<div className="w-9 md:w-10 h-9 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg className="w-4 md:w-5 h-4 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<div>
							<h1 className="text-lg md:text-2xl font-bold text-white">Mon Compte</h1>
							<p className="text-gray-400 text-xs md:text-sm">Tableau de bord</p>
						</div>
					</div>

					{/* Desktop logout button */}
					<button
						onClick={handleLogout}
						className="hidden sm:flex z-50 px-3 md:px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all items-center gap-2 text-sm"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						<span className="hidden md:inline">Déconnexion</span>
					</button>

					{/* Mobile menu button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="sm:hidden z-50 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
					>
						<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{mobileMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</header>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div className="sm:hidden mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
						<button
							onClick={() => {
								handleLogout();
								setMobileMenuOpen(false);
							}}
							className="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 text-sm"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							Déconnexion
						</button>
					</div>
				)}

				{children}
			</div>
		</div>
	);
}