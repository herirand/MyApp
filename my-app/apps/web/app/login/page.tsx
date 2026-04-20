'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [focused, setFocused] = useState<string | null>(null);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Erreur de connexion');
				setLoading(false);
				return;
			}

			localStorage.setItem('token', data.token);
			localStorage.setItem('role', data.role || 'STUDENT');

			if (data.role === 'ADMIN') {
				router.push('/admin');
			} else {
				router.push('/dashboard');
			}
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center app-shell-bg relative overflow-hidden p-3 sm:p-4">
			<div className="absolute inset-0 app-shell-grid" />

			<div className="hidden md:block absolute top-20 left-20 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />
			<div className="hidden md:block absolute bottom-20 right-20 w-96 bg-teal-500/20 rounded-full blur-3xl" />

			<div className="relative z-10 w-full max-w-md px-1 sm:px-4">
				<div className="animate-fadeIn">
					<Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 md:mb-8 justify-center text-sm md:text-base">
						<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Retour à l&apos;accueil
					</Link>
				</div>

				<div className="auth-card backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn stagger-1">
					<div className="text-center mb-6 sm:mb-8">
						<div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
							<svg className="w-7 sm:w-8 h-7 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-white">Connexion</h2>
						<p className="text-gray-400 mt-2 text-sm sm:text-base">Bienvenue ! Connectez-vous à votre compte</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
						{error && (
							<div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-shake">
								<svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{error}
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-xs sm:text-sm font-medium text-gray-300">Email</label>
							<div className={`relative transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.02]' : ''}`}>
								<div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
									<svg className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors ${focused === 'email' ? 'text-sky-300' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								</div>
								<input
									type="text"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onFocus={() => setFocused('email')}
									onBlur={() => setFocused(null)}
									className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-sm sm:text-base"
									placeholder="email@exemple.com"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs sm:text-sm font-medium text-gray-300">Mot de passe</label>
							<div className={`relative transition-all duration-300 ${focused === 'password' ? 'transform scale-[1.02]' : ''}`}>
								<div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
									<svg className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors ${focused === 'password' ? 'text-sky-300' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<input
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									onFocus={() => setFocused('password')}
									onBlur={() => setFocused(null)}
									className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-sm sm:text-base"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 sm:py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/25"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Connexion en cours...
								</span>
							) : 'Se connecter'}
						</button>
					</form>

					<p className="text-center mt-4 sm:mt-6 text-gray-400 text-sm sm:text-base">
						Pas de compte ?{' '}
						<Link href="/signup" className="text-sky-300 hover:text-sky-200 font-medium transition-colors hover:underline">
							S&apos;inscrire
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
