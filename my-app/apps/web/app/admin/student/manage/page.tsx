'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
	id: string;
	username: string;
	email: string;
	balance?: number;
}

interface FormData {
	username: string;
	email: string;
	password: string;
	userId: string | number;
}

export default function StudentManagePage() {
	const router = useRouter();
	const [students, setStudents] = useState<Student[]>([]);
	const [formData, setFormData] = useState<FormData>({ username: '', email: '', password: '', userId: '' });
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	async function fetchStudents(token: string) {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (response.ok) {
				const data = await response.json();
				setStudents(data);
			}
		} catch (err) {
			console.error('Error fetching students:', err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const role = localStorage.getItem('role');

		if (!storedToken) {
			router.push('/login');
			return;
		}

		if (role !== 'ADMIN') {
			router.push('/dashboard');
			return;
		}

		setTimeout(() => {
			void fetchStudents(storedToken);
		}, 0);
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setSubmitting(true);

		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: formData.username,
					email: formData.email,
					password: formData.password,
					confirmPassword: formData.password,
					id: String(formData.userId)
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création');
			}

			setSuccess('Étudiant créé avec succès !');
			setFormData({ username: '', email: '', password: '', userId: '' });
			if (token) {
				fetchStudents(token);
			}
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
			setError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: name === 'userId' ? (value === '' ? '' : parseInt(value, 10)) : value
		});
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
					onClick={() => router.push('/admin')}
					className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Retour
				</button>
				<div>
					<h1 className="text-3xl font-bold text-white">Gestion des étudiants</h1>
					<p className="text-gray-400 mt-1">Ajouter et gérer les étudiants</p>
				</div>
			</header>

			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
					<h3 className="text-xl font-bold text-white mb-6">Ajouter un étudiant</h3>
					
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-center gap-3">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{error}
							</div>
						)}
						{success && (
							<div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm flex items-center gap-3">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								{success}
							</div>
						)}

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">Nom d&apos;utilisateur</label>
						<input
							type="text"
							name="username"
							required
							value={formData.username}
							onChange={handleChange}
							className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
							placeholder="Nom d&apos;utilisateur"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">ID Utilisateur (userId)</label>
						<input
							type="number"
							name="userId"
							required
							min="1"
							step="1"
							value={formData.userId}
							onChange={handleChange}
							className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
							placeholder="Ex: 12345"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">Email</label>
						<input
							type="email"
							name="email"
							required
							value={formData.email}
							onChange={handleChange}
							className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
							placeholder="email@exemple.com"
						/>
					</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300">Mot de passe</label>
							<input
								type="password"
								name="password"
								required
								minLength={6}
								value={formData.password}
								onChange={handleChange}
								className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25"
						>
							{submitting ? 'Création...' : 'Ajouter l\'étudiant'}
						</button>
					</form>
				</div>

				<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
					<h3 className="text-xl font-bold text-white mb-6">Liste des étudiants ({students.length})</h3>
					
					{students.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-400">Aucun étudiant enregistré</p>
						</div>
					) : (
						<div className="space-y-3 max-h-[500px] overflow-y-auto">
							{students.map((student) => (
								<div key={student.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
											<span className="text-white font-medium">{student.username[0].toUpperCase()}</span>
										</div>
										<div>
											<p className="text-white font-medium">{student.username}</p>
											<p className="text-gray-400 text-sm">{student.email}</p>
										</div>
									</div>
									{student.balance !== undefined && (
										<span className="text-emerald-400 font-medium">{student.balance.toFixed(2)} (Ar)</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
