'use client';

import { useEffect, useState } from 'react';

interface FinancialStats {
	totalAmount: number;
	totalExpense: number;
	balance: number;
	loading: boolean;
	error: string | null;
}

export function StatisticsCard() {
	const [stats, setStats] = useState<FinancialStats>({
		totalAmount: 0,
		totalExpense: 0,
		balance: 0,
		loading: true,
		error: null,
	});

	async function fetchStatistics() {
		const token = localStorage.getItem('token');
		if (!token) return;

		try {
			setStats(prev => ({ ...prev, loading: true, error: null }));

			// Fetch total amount from global pay
			const payResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pay`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			// Fetch all expenses
			const expenseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expense/me`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (!payResponse.ok || !expenseResponse.ok) {
				throw new Error('Erreur lors du chargement des statistiques');
			}

			const payData = await payResponse.json();
			const expenseData = await expenseResponse.json();

			const totalAmount = payData[0]?.total || 0;
			const totalExpense = Array.isArray(expenseData)
				? expenseData.reduce((sum, expense) => sum + (expense.amount || 0), 0)
				: 0;

			setStats({
				totalAmount,
				totalExpense,
				balance: totalAmount - totalExpense,
				loading: false,
				error: null,
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
			setStats(prev => ({
				...prev,
				loading: false,
				error: errorMessage,
			}));
		}
	}

	useEffect(() => {
		setTimeout(() => {
			void fetchStatistics();
		}, 0);
	}, []);

	// Rafraîchir les statistiques à intervalles réguliers
	useEffect(() => {
		const interval = setInterval(fetchStatistics, 30000); // Refresh every 30 seconds
		return () => clearInterval(interval);
	}, []);

	if (stats.loading) {
		return (
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
				<h3 className="text-lg font-bold text-white mb-6">Statistiques Financières</h3>
				<div className="grid grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="text-center p-4 bg-white/5 rounded-xl animate-pulse">
							<div className="h-8 bg-white/10 rounded w-16 mx-auto mb-2"></div>
							<div className="h-4 bg-white/10 rounded w-20 mx-auto"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const formatCurrency = (value: number) => {
		return `${new Intl.NumberFormat('fr-FR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)} (Ar)`;
	};

	return (
		<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn stagger-2">
			<h3 className="text-lg font-bold text-white mb-6">Statistiques Financières</h3>
			<div className="grid grid-cols-3 gap-4">
				{/* Total Amount */}
				<div className="text-center p-6 bg-blue-500/10 rounded-xl border border-blue-500/20 overflow-hidden">
					<p className="text-3xl font-bold text-blue-400 break-words">{formatCurrency(stats.totalAmount)}</p>
					<p className="text-blue-400/70 text-sm mt-2">Montant Total</p>
				</div>

				{/* Total Expense */}
				<div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20 overflow-hidden">
					<p className="text-3xl font-bold text-red-400 break-words">{formatCurrency(stats.totalExpense)}</p>
					<p className="text-red-400/70 text-sm mt-2">Dépenses</p>
				</div>

				{/* Balance */}
				<div className={`text-center p-6 rounded-xl border overflow-hidden ${
					stats.balance >= 0
						? 'bg-emerald-500/10 border-emerald-500/20'
						: 'bg-orange-500/10 border-orange-500/20'
				}`}>
					<p className={`text-3xl font-bold break-words ${stats.balance >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
						{formatCurrency(stats.balance)}
					</p>
					<p className={`text-sm mt-2 ${stats.balance >= 0 ? 'text-emerald-400/70' : 'text-orange-400/70'}`}>
						Solde
					</p>
				</div>
			</div>

			{stats.error && (
				<div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
					<p className="text-red-400 text-sm">{stats.error}</p>
				</div>
			)}

			<button
				onClick={fetchStatistics}
				className="mt-4 w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors"
			>
				Actualiser
			</button>
		</div>
	);
}
