'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({ username: '', amount: '', description: '' });
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
			const response = await fetch('http://localhost:3001/transactions', {
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

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-gray-500">Chargement...</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Transactions</h2>

			<div className="grid md:grid-cols-2 gap-6 mb-8">
				<div className="bg-indigo-50 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-indigo-900 mb-4">Créer une Transaction</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
								{error}
							</div>
						)}
						{success && (
							<div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
								{success}
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Nom d&apos;utilisateur</label>
							<input
								type="text"
								name="username"
								required
								value={formData.username}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								placeholder="username de l&apos;tudiant"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
							<input
								type="number"
								name="amount"
								required
								step="0.01"
								min="0"
								value={formData.amount}
								onChange={handleChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								placeholder="0.00"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea
								name="description"
								required
								value={formData.description}
								onChange={handleChange}
								rows={3}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								placeholder="Description de la transaction..."
							/>
						</div>
						<button
							type="submit"
							disabled={submitting}
							className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
						>
							{submitting ? 'Création...' : 'Créer la transaction'}
						</button>
					</form>
				</div>

				<div className="bg-gray-50 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
					<div className="space-y-4">
						<div className="p-4 bg-white rounded-lg shadow-sm">
							<p className="text-sm text-gray-500">Total transactions</p>
							<p className="text-2xl font-bold text-indigo-600">0</p>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 bg-white rounded-lg shadow-sm">
								<p className="text-sm text-gray-500">En attente</p>
								<p className="text-xl font-bold text-yellow-600">0</p>
							</div>
							<div className="p-4 bg-white rounded-lg shadow-sm">
								<p className="text-sm text-gray-500">Confirmées</p>
								<p className="text-xl font-bold text-green-600">0</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions Récentes</h3>
				<p className="text-gray-500 text-center py-8">Aucune transaction pour le moment.</p>
			</div>
		</div>
	);
}