'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent) => {
		setMousePos({ x: e.clientX, y: e.clientY });
	};

	return (
		<div 
			className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden"
			onMouseMove={handleMouseMove}
		>
			<div className="absolute inset-0 overflow-hidden">
				<div 
					className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
					style={{
						background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%)',
						left: mousePos.x - 300,
						top: mousePos.y - 300,
						transform: 'translate(-50%, -50%)',
						transition: 'all 0.3s ease-out',
					}}
				/>
			</div>

			<div className="absolute inset-0" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
				backgroundSize: '40px 40px',
			}} />

			<div className="relative z-10 text-center space-y-8 max-w-3xl px-6">
				<div className="animate-fadeIn">
					<span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-200 mb-6 border border-white/20">
						✨ Gestion de budget simplifiée
					</span>
				</div>

				<h1 className="text-5xl md:text-7xl font-bold text-white animate-fadeIn stagger-1">
					Transaction
					<span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
						{' '}Manager
					</span>
				</h1>

				<p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fadeIn stagger-2">
					Une plateforme moderne pour gérer vos transactions. 
					Suivez vos revenus, vos dépenses et votre budget en temps réel.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fadeIn stagger-3">
					<Link 
						href="/login"
						className="group px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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
						className="group px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
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