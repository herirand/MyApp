'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Expense {
	id: number;
	amount: number;
	description: string;
	createdAt: string;
}

interface FormData {
	amount: string;
	description: string;
}

export default function AdminExpensesPage() {
	const router = useRouter();
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [formData, setFormData] = useState<FormData>({ amount: '', description: '' });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

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

		setLoading(false);
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
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
					amount: parseFloat(formData.amount),
					description: formData.description,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création');
			}

			setSuccess('Dépense créée avec succès !');
			setFormData({ amount: '', description: '' });
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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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
				<header className="mb-8 animate-fadeIn">
					<button
						onClick={() => router.push('/admin')}
						className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Retour aux transactions
					</button>
					<h1 className="text-3xl font-bold text-white">Dépenses</h1>
					<p className="text-gray-400 mt-1">Gérer les dépenses de la communauté</p>
				</header>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-bold text-white">Ajouter une dépense</h3>
						</div>

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
										className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
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
									className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
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
					</div>

					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-fadeIn">
						<div className="bg-gradient-to-br from-red-500/20 to-orange-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl p-4 mb-6">
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
									<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
									</svg>
								</div>
								<span className="text-red-400 text-sm font-medium">Total des dépenses</span>
							</div>
							<p className="text-3xl font-bold text-white">{totalExpenses.toFixed(2)} €</p>
							<p className="text-red-400/70 text-sm mt-1">{expenses.length} dépenses</p>
						</div>

						<div className="space-y-3 max-h-96 overflow-y-auto">
							{expenses.length === 0 ? (
								<div className="text-center py-8">
									<p className="text-gray-400">Aucune dépense</p>
								</div>
							) : (
								expenses.map((e) => (
									<div key={e.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
												<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
												</svg>
											</div>
											<div>
												<p className="text-white font-medium">{e.description}</p>
												<p className="text-gray-500 text-sm">{formatDate(e.createdAt)}</p>
											</div>
										</div>
										<p className="text-red-400 font-bold">-{e.amount.toFixed(2)} €</p>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}