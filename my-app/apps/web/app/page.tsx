'use client';

import Link from 'next/link';

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center app-shell-bg relative overflow-hidden">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-24 -left-16 w-80 h-80 bg-cyan-500/18 rounded-full blur-3xl" />
				<div className="absolute top-1/3 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
				<div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-emerald-500/16 rounded-full blur-3xl" />
			</div>

			<div className="absolute inset-0 app-shell-grid" />

			<div className="relative z-10 text-center space-y-8 max-w-3xl px-6">
				<div className="animate-fadeIn">
					<span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-sky-100 mb-6 border border-white/20">
						✨ Gestion de budget simplifiée
					</span>
				</div>

				<h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white animate-fadeIn stagger-1 leading-tight">
					Transaction
					<span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
						{' '}Manager
					</span>
				</h1>

				<p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto animate-fadeIn stagger-2">
					Une plateforme moderne pour gérer vos transactions.
					Suivez vos revenus, vos dépenses et votre budget en temps réel.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fadeIn stagger-3">
					<Link
						href="/login"
						className="group px-8 py-4 bg-white text-sky-900 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
					>
						<span className="flex items-center justify-center gap-2">
							Connexion
							<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</span>
					</Link>
					<Link
						href="/signup"
						className="group px-8 py-4 bg-transparent border-2 border-slate-200/35 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-slate-200/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
					>
						<span className="flex items-center justify-center gap-2">
							Créer un compte
							<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
						</span>
					</Link>
				</div>

				<div className="flex items-center justify-center gap-8 pt-12 animate-fadeIn stagger-4">
					<div className="flex items-center gap-2 text-gray-400">
						<svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<span className="text-sm">Sécurisé</span>
					</div>
					<div className="flex items-center gap-2 text-gray-400">
						<svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<span className="text-sm">Temps réel</span>
					</div>
					<div className="flex items-center gap-2 text-gray-400">
						<svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<span className="text-sm">Gratuit</span>
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
		</div>
	);
}
