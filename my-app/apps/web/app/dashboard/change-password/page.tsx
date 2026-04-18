'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export default function ChangePasswordPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<PasswordFormData>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false
	});

	useEffect(() => {
		const token = localStorage.getItem('token');
		const role = localStorage.getItem('role');

		if (!token) {
			router.push('/login');
			return;
		}

		if (role !== 'STUDENT') {
			router.push('/dashboard');
			return;
		}

		setTimeout(() => {
			setLoading(false);
		}, 0);
	}, [router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		// Validation côté client
		if (formData.newPassword.length < 8) {
			setError('Le nouveau mot de passe doit avoir au moins 8 caractères');
			return;
		}

		if (formData.newPassword !== formData.confirmPassword) {
			setError('Les mots de passe ne correspondent pas');
			return;
		}

		if (formData.currentPassword === formData.newPassword) {
			setError('Le nouveau mot de passe doit être différent de l\'actuel');
			return;
		}

		setSubmitting(true);
		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newPassword`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					currentPassword: formData.currentPassword,
					newPassword: formData.newPassword,
					confirmPassword: formData.confirmPassword
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors du changement de mot de passe');
			}

			setSuccess('Mot de passe changé avec succès !');
			setFormData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			});

			// Redirection après 2 secondes
			setTimeout(() => {
				router.push('/dashboard');
			}, 2000);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
			setError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center">
				<div className="text-white flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
					<p>Chargement...</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<header className="flex justify-between items-center mb-8 animate-fadeIn">
				<button
					onClick={() => router.push('/dashboard')}
					className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Retour
				</button>
				<div>
					<h1 className="text-3xl font-bold text-white">Changer mon mot de passe</h1>
					<p className="text-gray-400 mt-1">Sécurisez votre compte en changeant votre mot de passe</p>
				</div>
			</header>

			<div className="max-w-2xl mx-auto">
				<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 animate-fadeIn">
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-center gap-3">
								<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								<span>{error}</span>
							</div>
						)}

						{success && (
							<div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm flex items-center gap-3">
								<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span>{success}</span>
							</div>
						)}

						{/* Mot de passe actuel */}
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300">Mot de passe actuel</label>
							<div className="relative">
								<input
									type={showPasswords.current ? 'text' : 'password'}
									name="currentPassword"
									required
									value={formData.currentPassword}
									onChange={handleChange}
									className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all pr-12"
									placeholder="Entrez votre mot de passe actuel"
								/>
								<button
									type="button"
									onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
								>
									{showPasswords.current ? (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									) : (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
						</div>

						{/* Nouveau mot de passe */}
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300">Nouveau mot de passe</label>
							<div className="relative">
								<input
									type={showPasswords.new ? 'text' : 'password'}
									name="newPassword"
									required
									minLength={8}
									value={formData.newPassword}
									onChange={handleChange}
									className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all pr-12"
									placeholder="Minimum 8 caractères"
								/>
								<button
									type="button"
									onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
								>
									{showPasswords.new ? (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									) : (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
							<p className="text-xs text-gray-400 mt-1">Minimum 8 caractères requis</p>
						</div>

						{/* Confirmer le nouveau mot de passe */}
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300">Confirmer le nouveau mot de passe</label>
							<div className="relative">
								<input
									type={showPasswords.confirm ? 'text' : 'password'}
									name="confirmPassword"
									required
									minLength={8}
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all pr-12"
									placeholder="Confirmez le nouveau mot de passe"
								/>
								<button
									type="button"
									onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
								>
									{showPasswords.confirm ? (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									) : (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
						</div>

						{/* Info de sécurité */}
						<div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
							<p className="text-blue-300 text-sm flex items-start gap-3">
								<svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
								</svg>
								<span><strong>Conseil:</strong> Utilisez un mot de passe fort avec un mélange de lettres, chiffres et symboles.</span>
							</p>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25"
						>
							{submitting ? 'Changement en cours...' : 'Changer mon mot de passe'}
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
