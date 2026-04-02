'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		id: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (formData.password !== formData.confirmPassword) {
			setError('Les mots de passe ne correspondent pas');
			return;
		}

		if (formData.password.length < 8) {
			setError('Le mot de passe doit contenir au moins 8 caractères');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch('http://localhost:3001/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: formData.email,
					username: formData.username,
					id: formData.id,
					password: formData.password,
					confirmPassword: formData.confirmPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création du compte');
			}

			alert('Compte créé avec succès ! Connectez-vous.');
			router.push('/login');
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-3xl font-bold text-center text-indigo-900 mb-8">Créer un compte</h2>
					<form onSubmit={handleSignup} className="space-y-5">
						{error && (
							<div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
								{error}
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
							<input
								type="email"
								name="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="email@exemple.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Nom d&apos;utilisateur</label>
							<input
								type="text"
								name="username"
								required
								minLength={3}
								pattern="^[a-zA-Z0-9_]+$"
								value={formData.username}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="username"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">ID Étudiant</label>
							<input
								type="text"
								name="id"
								required
								value={formData.id}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="Votre ID"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
							<input
								type="password"
								name="password"
								required
								minLength={8}
								value={formData.password}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="Minimum 8 caractères"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
							<input
								type="password"
								name="confirmPassword"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="••••••••"
							/>
						</div>
						<button 
							type="submit" 
							disabled={loading}
							className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
						>
							{loading ? 'Création...' : "S&apos;inscrire"}
						</button>
					</form>
					<p className="text-center mt-6 text-gray-600">
						Déjà un compte ?{' '}
						<Link href="/login" className="text-indigo-600 hover:underline font-medium">
							Se connecter
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}