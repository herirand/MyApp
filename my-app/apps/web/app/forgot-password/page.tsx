'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [userId, setUserId] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const [focused, setFocused] = useState<string | null>(null);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		if (newPassword !== confirmPassword) {
			setError('Les mots de passe ne correspondent pas');
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, userId, newPassword, confirmPassword }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Erreur lors de la réinitialisation');
				setLoading(false);
				return;
			}

			setSuccess('Mot de passe mis à jour avec succès ! Redirection...');
			
			// Redirect after a short delay so user can read the success message
			setTimeout(() => {
				router.push('/login');
			}, 2000);
			
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion au serveur';
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
					<Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 md:mb-8 justify-center text-sm md:text-base">
						<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Retour à la connexion
					</Link>
				</div>

				<div className="auth-card backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn stagger-1">
					<div className="text-center mb-6 sm:mb-8">
						<div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
							<svg className="w-7 sm:w-8 h-7 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-white">Mot de passe oublié</h2>
						<p className="text-gray-400 mt-2 text-sm sm:text-base">Réinitialisez votre mot de passe</p>
					</div>

					<form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-5">
						{error && (
							<div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-shake">
								<svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{error}
							</div>
						)}
						{success && (
							<div className="p-3 sm:p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
								<svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
								{success}
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-xs sm:text-sm font-medium text-gray-300">Email</label>
							<div className={`relative transition-all duration-300 ${focused === 'email' ? 'transform scale-[1.02]' : ''}`}>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onFocus={() => setFocused('email')}
									onBlur={() => setFocused(null)}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-sm sm:text-base"
									placeholder="email@exemple.com"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs sm:text-sm font-medium text-gray-300">ID Utilisateur (User ID)</label>
							<div className={`relative transition-all duration-300 ${focused === 'userId' ? 'transform scale-[1.02]' : ''}`}>
								<input
									type="text"
									required
									value={userId}
									onChange={(e) => setUserId(e.target.value)}
									onFocus={() => setFocused('userId')}
									onBlur={() => setFocused(null)}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-sm sm:text-base"
									placeholder="Votre ID utilisateur"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs sm:text-sm font-medium text-gray-300">Nouveau mot de passe</label>
							<div className={`relative transition-all duration-300 ${focused === 'newPassword' ? 'transform scale-[1.02]' : ''}`}>
								<input
									type="password"
									required
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									onFocus={() => setFocused('newPassword')}
									onBlur={() => setFocused(null)}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-sm sm:text-base"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs sm:text-sm font-medium text-gray-300">Confirmer le mot de passe</label>
							<div className={`relative transition-all duration-300 ${focused === 'confirmPassword' ? 'transform scale-[1.02]' : ''}`}>
								<input
									type="password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									onFocus={() => setFocused('confirmPassword')}
									onBlur={() => setFocused(null)}
									className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-sm sm:text-base"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 sm:py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/25 mt-2"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Mise à jour...
								</span>
							) : 'Réinitialiser le mot de passe'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
