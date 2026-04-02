'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
	id: number;
	amount: number;
	description: string;
	status: string;
	createdAt: string;
}

export default function DashboardPage() {
	const router = useRouter();
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const role = localStorage.getItem('role');

		if (!token) {
			router.push('/login');
			return;
		}

		if (role === 'ADMIN') {
			router.push('/admin');
			return;
		}

		const fetchTransactions = async () => {
			try {
				const response = await fetch('http://localhost:3001/transactions/me', {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Session expirée ou erreur');
				}

				const data = await response.json();
				setTransactions(data);
			} catch (err: unknown) {
				const errorMessage = err instanceof Error ? err.message : 'Session expirée ou erreur';
				setError(errorMessage);
				localStorage.removeItem('token');
				localStorage.removeItem('role');
				router.push('/login');
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [router]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'CONFIRMED':
				return 'bg-green-100 text-green-700';
			case 'REJECTED':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-yellow-100 text-yellow-700';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
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
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Transactions</h2>

			{error && (
				<div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg mb-4">
					{error}
				</div>
			)}

			{transactions.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">Aucune transaction trouvée.</p>
					<p className="text-gray-400 text-sm mt-2">Vos transactions apparaîtront ici.</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b">
								<th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
								<th className="text-left py-3 px-4 font-semibold text-gray-600">Description</th>
								<th className="text-right py-3 px-4 font-semibold text-gray-600">Montant</th>
								<th className="text-center py-3 px-4 font-semibold text-gray-600">Statut</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((t) => (
								<tr key={t.id} className="border-b hover:bg-gray-50">
									<td className="py-3 px-4 text-gray-600">
										{formatDate(t.createdAt)}
									</td>
									<td className="py-3 px-4 text-gray-800">
										{t.description}
									</td>
									<td className="py-3 px-4 text-right font-bold text-indigo-600">
										{t.amount.toFixed(2)} €
									</td>
									<td className="py-3 px-4 text-center">
										<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(t.status)}`}>
											{t.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}