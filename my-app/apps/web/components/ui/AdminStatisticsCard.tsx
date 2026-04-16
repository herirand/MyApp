'use client';

import { useEffect, useState } from 'react';

interface AdminFinancialStats {
	totalSpent: number;
	globalTotal: number;
	loading: boolean;
	error: string | null;
}

export function AdminStatisticsCard() {
	const [stats, setStats] = useState<AdminFinancialStats>({
		totalSpent: 0,
		globalTotal: 0,
		loading: true,
		error: null,
	});

	useEffect(() => {
		fetchStatistics();
	}, []);

	const fetchStatistics = async () => {
		const token = localStorage.getItem('token');
		if (!token) return;

		try {
			setStats(prev => ({ ...prev, loading: true, error: null }));

			// Fetch total spent (dépenses globales)
			const spentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spent`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			// Fetch global total (solde global)
			const payResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pay`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (!spentResponse.ok || !payResponse.ok) {
				throw new Error('Erreur lors du chargement des statistiques');
			}

			const spentData = await spentResponse.json();
			const payData = await payResponse.json();

			// Gère le format de réponse du backend: { success: true, spent: [...] }
			const spentArray = spentData?.spent || spentData || [];
			const totalSpent = Array.isArray(spentArray) 
				? spentArray.reduce((sum, item) => sum + (item.total || item.amount || 0), 0)
				: spentData?.total || 0;

			const globalTotal = payData[0]?.total || 0;

			setStats({
				totalSpent,
				globalTotal,
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
	};

	// Rafraîchir les statistiques à intervalles réguliers
	useEffect(() => {
		const interval = setInterval(fetchStatistics, 30000); // Refresh every 30 seconds
		return () => clearInterval(interval);
	}, []);

	if (stats.loading) {
		return (
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
				<h3 className="text-lg font-bold text-white mb-6">Statistiques de Gestion</h3>
				<div className="grid grid-cols-2 gap-4">
					{[1, 2].map((i) => (
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
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'EUR'
		}).format(value);
	};

	return (
		<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn stagger-2">
			<h3 className="text-lg font-bold text-white mb-6">Statistiques de Gestion</h3>
			<div className="grid grid-cols-2 gap-4">
				{/* Total Spent */}
				<div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20 overflow-hidden">
					<p className="text-3xl font-bold text-red-400 break-words">{formatCurrency(stats.totalSpent)}</p>
					<p className="text-red-400/70 text-sm mt-2">Dépenses Totales</p>
				</div>

				{/* Global Total */}
				<div className={`text-center p-6 rounded-xl border overflow-hidden ${
					stats.globalTotal >= 0
						? 'bg-purple-500/10 border-purple-500/20'
						: 'bg-orange-500/10 border-orange-500/20'
				}`}>
					<p className={`text-3xl font-bold break-words ${stats.globalTotal >= 0 ? 'text-purple-400' : 'text-orange-400'}`}>
						{formatCurrency(stats.globalTotal)}
					</p>
					<p className={`text-sm mt-2 ${stats.globalTotal >= 0 ? 'text-purple-400/70' : 'text-orange-400/70'}`}>
						Solde Global
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
