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

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch('http://localhost:3001/auth/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur de connexion');
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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-3xl font-bold text-center text-indigo-900 mb-8">Connexion</h2>
					<form onSubmit={handleLogin} className="space-y-6">
						{error && (
							<div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
								{error}
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
							<input
								type="text"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="email@exemple.com"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="••••••••"
							/>
						</div>
						<button 
							type="submit" 
							disabled={loading}
							className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
						>
							{loading ? 'Connexion...' : 'Se connecter'}
						</button>
					</form>
					<p className="text-center mt-6 text-gray-600">
						Pas de compte ?{' '}
						<Link href="/signup" className="text-indigo-600 hover:underline font-medium">
							S&apos;inscrire
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}