'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
	id: string;
	username: string;
	email: string;
}

interface FormData {
	username: string;
	amount: string;
	description: string;
}

interface ExpenseFormData {
	amount: string;
	description: string;
}

interface BeneficeFormData {
	amount: string;
	description: string;
}

interface Stats {
	total: number;
	pending: number;
	confirmed: number;
}

export default function AdminPage() {
	const router = useRouter();
	const [students, setStudents] = useState<Student[]>([]);
	const [formData, setFormData] = useState<FormData>({ username: '', amount: '', description: '' });
	const [expenseForm, setExpenseForm] = useState<ExpenseFormData>({ amount: '', description: '' });
	const [beneficeForm, setBeneficeForm] = useState<BeneficeFormData>({ amount: '', description: '' });
	const [activeTab, setActiveTab] = useState<'transaction' | 'expense' | 'benefice'>('transaction');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [showStudents, setShowStudents] = useState(false);
	const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0 });

	useEffect(() => {
		const token = localStorage.getItem('token');
		const role = localStorage.getItem('role');

		if (!token) {
			router.push('/login');
			return;
		}

		if (role !== 'ADMIN') {
			router.push('/dashboard');
			return;
		}

		fetchStudents(token);
		setLoading(false);
	}, [router]);

	const fetchStudents = async (token: string) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student`, {
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
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setSubmitting(true);

		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: formData.username,
					amount: parseFloat(formData.amount),
					description: formData.description,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création');
			}

			setSuccess('Transaction créée avec succès !');
			setFormData({ username: '', amount: '', description: '' });

			setStats(prev => ({
				...prev,
				total: prev.total + 1,
				pending: prev.pending + 1
			}));
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
			setError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleExpenseSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setSubmitting(true);

		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expense`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount: parseFloat(expenseForm.amount),
					description: expenseForm.description,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création de la dépense');
			}

			setSuccess('Dépense créée avec succès !');
			setExpenseForm({ amount: '', description: '' });
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
			setError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleBeneficeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setSubmitting(true);

		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/benefice`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount: parseFloat(beneficeForm.amount),
					description: beneficeForm.description,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création du bénéfice');
			}

			setSuccess('Bénéfice créé avec succès !');
			setBeneficeForm({ amount: '', description: '' });
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
			setError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
	};

	const handleBeneficeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setBeneficeForm({ ...beneficeForm, [e.target.name]: e.target.value });
	};

	const selectStudent = (username: string) => {
		setFormData({ ...formData, username });
		setShowStudents(false);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
				<div className="text-white flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
					<p>Chargement...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative">
			<div className="absolute inset-0 -z-10" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
				backgroundSize: '40px 40px',
			}} />

			<div className="relative max-w-6xl mx-auto">
			<header className="flex justify-between items-center mb-8 animate-fadeIn">
				<div>
					<h1 className="text-3xl font-bold text-white">Administration</h1>
					<p className="text-gray-400 mt-1">Gestion des transactions et utilisateurs</p>
				</div>
				<button
					onClick={() => router.push('/admin/change-password')}
					className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white hover:scale-105"
					title="Changer le mot de passe"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
				</button>
			</header>

				<div className="grid md:grid-cols-2 gap-6 mb-8">
					<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn stagger-1">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</div>
							<h3 className="text-xl font-bold text-white">Créer une Transaction</h3>
						</div>

						<div className="flex border-b border-white/10 mb-6">
							<button
								type="button"
								onClick={() => setActiveTab('transaction')}
								className={`flex-1 py-3 text-sm font-medium transition-all relative ${activeTab === 'transaction' ? 'text-white' : 'text-gray-400 hover:text-white'
									}`}
							>
								Transaction
								{activeTab === 'transaction' && (
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
								)}
							</button>
							<button
								type="button"
								onClick={() => setActiveTab('expense')}
								className={`flex-1 py-3 text-sm font-medium transition-all relative ${activeTab === 'expense' ? 'text-white' : 'text-gray-400 hover:text-white'
									}`}
							>
								Dépense
								{activeTab === 'expense' && (
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
								)}
							</button>
							<button
								type="button"
								onClick={() => setActiveTab('benefice')}
								className={`flex-1 py-3 text-sm font-medium transition-all relative ${activeTab === 'benefice' ? 'text-white' : 'text-gray-400 hover:text-white'
									}`}
							>
								Bénéfice
								{activeTab === 'benefice' && (
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
								)}
							</button>
							<button
								onClick={() => router.push('/admin/student/delete')}
								className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-4 text-left group"
							>
								<div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
									<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</div>
								<div>
									<p className="text-white font-medium">Supprimer un étudiant</p>
									<p className="text-gray-400 text-sm">Supprimer un utilisateur du système</p>
								</div>
							</button>
						</div>

						{activeTab === 'transaction' ? (
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && (
									<div className="p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-center gap-3 animate-shake">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										{error}
									</div>
								)}
								{success && (
									<div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm flex items-center gap-3 animate-fadeIn">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										{success}
									</div>
								)}

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Étudiant</label>
									<div className="relative">
										<input
											type="text"
											name="username"
											required
											value={formData.username}
											onChange={handleChange}
											onFocus={() => setShowStudents(true)}
											className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
											placeholder="Rechercher un étudiant..."
										/>
										{showStudents && students.length > 0 && (
											<div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl">
												<div className="max-h-48 overflow-y-auto">
													{students.map((s) => (
														<button
															key={s.id}
															type="button"
															onClick={() => selectStudent(s.username)}
															className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3"
														>
															<div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
																<span className="text-sm font-medium">{s.username[0].toUpperCase()}</span>
															</div>
															<div>
																<p className="font-medium">{s.username}</p>
																<p className="text-xs text-gray-400">{s.email}</p>
															</div>
														</button>
													))}
												</div>
											</div>
										)}
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Montant (€)</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
										<input
											type="number"
											name="amount"
											required
											step="0.01"
											min="0"
											value={formData.amount}
											onChange={handleChange}
											className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
											placeholder="0.00"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Description</label>
									<textarea
										name="description"
										required
										value={formData.description}
										onChange={handleChange}
										rows={3}
										className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
										placeholder="Description de la transaction..."
									/>
								</div>

								<button
									type="submit"
									disabled={submitting}
									className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25"
								>
									{submitting ? (
										<span className="flex items-center justify-center gap-2">
											<svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Création...
										</span>
									) : 'Créer la transaction'}
								</button>
							</form>
						) : activeTab === 'expense' ? (
							<form onSubmit={handleExpenseSubmit} className="space-y-4">
								{error && (
									<div className="p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-center gap-3 animate-shake">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										{error}
									</div>
								)}
								{success && (
									<div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm flex items-center gap-3 animate-fadeIn">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										{success}
									</div>
								)}

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Montant (€)</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
										<input
											type="number"
											name="amount"
											required
											step="0.01"
											min="0"
											value={expenseForm.amount}
											onChange={handleExpenseChange}
											className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
											placeholder="0.00"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Description</label>
									<textarea
										name="description"
										required
										value={expenseForm.description}
										onChange={handleExpenseChange}
										rows={3}
										className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
										placeholder="Description de la dépense..."
									/>
								</div>

								<button
									type="submit"
									disabled={submitting}
									className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/25"
								>
									{submitting ? (
										<span className="flex items-center justify-center gap-2">
											<svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Création...
										</span>
									) : 'Créer la dépense'}
								</button>
							</form>
						) : activeTab === 'benefice' ? (
							<form onSubmit={handleBeneficeSubmit} className="space-y-4">
								{error && (
									<div className="p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-center gap-3 animate-shake">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										{error}
									</div>
								)}
								{success && (
									<div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm flex items-center gap-3 animate-fadeIn">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										{success}
									</div>
								)}

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Montant (€)</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
										<input
											type="number"
											name="amount"
											required
											step="0.01"
											min="0"
											value={beneficeForm.amount}
											onChange={handleBeneficeChange}
											className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
											placeholder="0.00"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-300">Description</label>
									<textarea
										name="description"
										required
										value={beneficeForm.description}
										onChange={handleBeneficeChange}
										rows={3}
										className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
										placeholder="Description du bénéfice..."
									/>
								</div>

								<button
									type="submit"
									disabled={submitting}
									className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/25"
								>
									{submitting ? (
										<span className="flex items-center justify-center gap-2">
											<svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Création...
										</span>
									) : 'Créer le bénéfice'}
								</button>
							</form>
						) : null}
					</div>

					<div className="space-y-6">
						<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn stagger-2">
							<h3 className="text-lg font-bold text-white mb-6">Statistiques</h3>
							<div className="grid grid-cols-3 gap-4">
								<div className="text-center p-4 bg-white/5 rounded-xl">
									<p className="text-3xl font-bold text-white">{stats.total}</p>
									<p className="text-gray-400 text-sm mt-1">Total</p>
								</div>
								<div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
									<p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
									<p className="text-yellow-400/70 text-sm mt-1">En attente</p>
								</div>
								<div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
									<p className="text-3xl font-bold text-emerald-400">{stats.confirmed}</p>
									<p className="text-emerald-400/70 text-sm mt-1">Confirmées</p>
								</div>
							</div>
						</div>

						<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn stagger-3">
							<h3 className="text-lg font-bold text-white mb-4">Actions rapides</h3>
							<div className="space-y-3">
								<button onClick={() => router.push('/admin/student')} className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-4 text-left group">
									<div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
									</div>
									<div>
										<p className="text-white font-medium">Voir les étudiants</p>
										<p className="text-gray-400 text-sm">{students.length} étudiants enregistrés</p>
									</div>
								</button>
								<button
									onClick={() => router.push('/admin/student/manage')}
									className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-4 text-left group"
								>
									<div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
										</svg>
									</div>
									<div>
										<p className="text-white font-medium">Gérer les étudiants</p>
										<p className="text-gray-400 text-sm">Ajouter, modifier ou supprimer</p>
									</div>
								</button>
								<button
									onClick={() => router.push('/admin/student/delete')}
									className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-4 text-left group"
								>
									<div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</div>
									<div>
										<p className="text-white font-medium">Supprimer un étudiant</p>
										<p className="text-gray-400 text-sm">Supprimer un utilisateur du système</p>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn stagger-4">
					<h3 className="text-lg font-bold text-white mb-4">Transactions récentes</h3>
					<div className="text-center py-8">
						<div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
							<svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
						</div>
						<p className="text-gray-400 text-lg">Aucune transaction pour le moment</p>
					</div>
				</div>
			</div>
		</div>
	);
}
