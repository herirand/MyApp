'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';

interface Transaction {
	id: number;
	amount: number;
	description: string;
	status: string;
	createdAt: string;
}

interface Expense {
	id: number;
	amount: number;
	description: string;
	createdAt: string;
}

interface Benefice {
	id: number;
	amount: number;
	description: string;
	createdAt: string;
}

interface GlobalTotal {
	id: number;
	total: number;
}

export default function DashboardPage() {
	const router = useRouter();
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [benefices, setBenefices] = useState<Benefice[]>([]);
	const [globalTotal, setGlobalTotal] = useState<number>(0);
	const [totalSpent, setTotalSpent] = useState<number>(0);
	const [userBalance, setUserBalance] = useState<number>(0);
	const [activeTab, setActiveTab] = useState<'transactions' | 'expenses' | 'benefices'>('transactions');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [tablesLoading, setTablesLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	// Pagination states
	const [expensePage, setExpensePage] = useState(1);
	const [beneficePage, setBeneficePage] = useState(1);
	const [transactionPage, setTransactionPage] = useState(1);
	const [expenseTotalPages, setExpenseTotalPages] = useState(1);
	const [beneficeTotalPages, setBeneficeTotalPages] = useState(1);
	const [transactionTotalPages, setTransactionTotalPages] = useState(1);
	const ITEMS_PER_PAGE = 10;

	async function fetchData(token: string, page: number = 1, expPage: number = 1, benPage: number = 1) {
		try {
			// PHASE 1: Charger les statistiques en priorité (cartes)
			const [studentPayRes, payRes, spentRes] = await Promise.all([
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/pay`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}),
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/pay`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}),
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/spent`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})
			]);

			// Traiter les réponses des statistiques
			if (studentPayRes.ok) {
				const studentPayData = await studentPayRes.json();
				setUserBalance(studentPayData.balance || 0);
			}

			if (payRes.ok) {
				const payData: GlobalTotal[] = await payRes.json();
				if (payData.length > 0) {
					setGlobalTotal(payData[0].total);
				}
			}

			if (spentRes.ok) {
				const spentData = await spentRes.json();
				const spentArray = spentData?.spent || spentData || [];
				const total = Array.isArray(spentArray)
					? spentArray.reduce((sum, item) => sum + (item.total || item.amount || 0), 0)
					: spentData?.total || 0;
				setTotalSpent(total);
			}

			// Permettre au dashboard de s'afficher maintenant avec les cartes
			setLoading(false);

			// PHASE 2: Charger les tables en arrière-plan (sans bloquer l'affichage)
			const [transRes, expenseRes, beneficeRes] = await Promise.all([
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/me?page=${page}&limit=${ITEMS_PER_PAGE}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}),
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/expense/me?page=${expPage}&limit=${ITEMS_PER_PAGE}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}),
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/benefice/me?page=${benPage}&limit=${ITEMS_PER_PAGE}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})
			]);

			if (transRes.ok) {
				const transData = await transRes.json();
				setTransactions(transData.data || []);
				setTransactionTotalPages(transData.pagination?.totalPages || 1);
			}

			if (expenseRes.ok) {
				const expenseData = await expenseRes.json();
				setExpenses(expenseData.data || []);
				setExpenseTotalPages(expenseData.pagination?.totalPages || 1);
			}

			if (beneficeRes.ok) {
				const beneficeData = await beneficeRes.json();
				setBenefices(beneficeData.data || []);
				setBeneficeTotalPages(beneficeData.pagination?.totalPages || 1);
			}
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
			setError(errorMessage);
			setLoading(false);
		}
	}

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

		setTimeout(() => {
			void fetchData(token);
		}, 0);
	}, [router]);

	const handleRefresh = async () => {
		setRefreshing(true);
		const token = localStorage.getItem('token');
		if (token) {
			await fetchData(token, transactionPage, expensePage, beneficePage);
		}
		setRefreshing(false);
	};

	const handleExpensePageChange = async (page: number) => {
		setExpensePage(page);
		const token = localStorage.getItem('token');
		if (token) {
			setTablesLoading(true);
			try {
				const expenseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expense/me?page=${page}&limit=${ITEMS_PER_PAGE}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				if (expenseRes.ok) {
					const expenseData = await expenseRes.json();
					setExpenses(expenseData.data || []);
					setExpenseTotalPages(expenseData.pagination?.totalPages || 1);
				}
			} finally {
				setTablesLoading(false);
			}
		}
	};

	const handleBeneficePageChange = async (page: number) => {
		setBeneficePage(page);
		const token = localStorage.getItem('token');
		if (token) {
			setTablesLoading(true);
			try {
				const beneficeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/benefice/me?page=${page}&limit=${ITEMS_PER_PAGE}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				if (beneficeRes.ok) {
					const beneficeData = await beneficeRes.json();
					setBenefices(beneficeData.data || []);
					setBeneficeTotalPages(beneficeData.pagination?.totalPages || 1);
				}
			} finally {
				setTablesLoading(false);
			}
		}
	};

	const handleTransactionPageChange = async (page: number) => {
		setTransactionPage(page);
		const token = localStorage.getItem('token');
		if (token) {
			setTablesLoading(true);
			try {
				const transRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/me?page=${page}&limit=${ITEMS_PER_PAGE}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				if (transRes.ok) {
					const transData = await transRes.json();
					setTransactions(transData.data || []);
					setTransactionTotalPages(transData.pagination?.totalPages || 1);
				}
			} finally {
				setTablesLoading(false);
			}
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'CONFIRMED':
				return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
			case 'REJECTED':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			default:
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
		}
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

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center app-shell-bg">
				<div className="text-white flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
					<p>Chargement...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen app-shell-bg p-3 md:p-6 relative">
			<div className="absolute inset-0 -z-10 app-shell-grid" />

			<div className="relative max-w-6xl mx-auto">
				<header className="flex justify-between items-start sm:items-center gap-3 mb-6 md:mb-8 animate-fadeIn">
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-white">Tableau de bord</h1>
						<p className="text-gray-400 mt-1 text-sm md:text-base">Gérez vos transactions et dépenses</p>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						<button
							onClick={() => router.push('/dashboard/change-password')}
							className="p-2.5 sm:p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white hover:scale-105"
							title="Changer le mot de passe"
						>
							<svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
							</svg>
						</button>
						<button
							onClick={handleRefresh}
							disabled={refreshing}
							className="p-2.5 sm:p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white hover:scale-105"
						>
							<svg className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</button>
					</div>
				</header>

				{error && (
					<div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl flex items-center gap-3 animate-shake">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
					<div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4 md:p-6 card-hover animate-fadeIn stagger-1">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
								<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</div>
							<span className="text-emerald-400 text-sm font-medium">Solde Utilisateur</span>
						</div>
						<p className="text-xl md:text-3xl font-bold text-white">{userBalance.toFixed(2)} (Ar)</p>
						<p className="text-emerald-400/70 text-sm mt-1">Votre solde personnelle</p>
					</div>

					<div className="bg-gradient-to-br from-red-500/20 to-orange-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4 md:p-6 card-hover animate-fadeIn stagger-2">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
								<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
								</svg>
							</div>
							<span className="text-red-400 text-sm font-medium">Dépenses Totales</span>
						</div>
						<p className="text-xl md:text-3xl font-bold text-white">{totalSpent.toFixed(2)} (Ar)</p>
						<p className="text-red-400/70 text-sm mt-1">Dépenses globales de l&apos;admin</p>
					</div>

					<div className="bg-gradient-to-br from-sky-500/20 to-cyan-500/10 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-4 md:p-6 card-hover animate-fadeIn stagger-3">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center">
								<svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							</div>
							<span className="text-sky-400 text-sm font-medium">Solde Globale</span>
						</div>
						<p className="text-xl md:text-3xl font-bold text-white">{globalTotal.toFixed(2)} (Ar)</p>
						<p className="text-sky-400/70 text-sm mt-1">Total de la communauté</p>
					</div>
				</div>

				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-fadeIn stagger-4">
					<div className="flex border-b border-white/10 overflow-x-auto">
						<button
							onClick={() => setActiveTab('transactions')}
							className={`flex-1 min-w-max md:flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'transactions' ? 'text-white' : 'text-gray-400 hover:text-white'
								}`}
						>
							<span className="flex items-center justify-center gap-1 md:gap-2">
								<svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
								</svg>
								<span className="hidden sm:inline">Transactions</span>
								<span className="sm:hidden">Trans</span>
								<span className="hidden md:inline ml-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">{transactions.length}</span>
							</span>
							{activeTab === 'transactions' && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-sky-500" />
							)}
						</button>
						<button
							onClick={() => setActiveTab('expenses')}
							className={`flex-1 min-w-max md:flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'expenses' ? 'text-white' : 'text-gray-400 hover:text-white'
								}`}
						>
							<span className="flex items-center justify-center gap-1 md:gap-2">
								<svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
								<span className="hidden sm:inline">Dépenses</span>
								<span className="sm:hidden">Dépense</span>
								<span className="hidden md:inline ml-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">{expenses.length}</span>
							</span>
							{activeTab === 'expenses' && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-sky-500" />
							)}
						</button>
						<button
							onClick={() => setActiveTab('benefices')}
							className={`flex-1 min-w-max md:flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'benefices' ? 'text-white' : 'text-gray-400 hover:text-white'
								}`}
						>
							<span className="flex items-center justify-center gap-1 md:gap-2">
								<svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								<span className="hidden sm:inline">Bénéfices</span>
								<span className="sm:hidden">Bénéf</span>
								<span className="hidden md:inline ml-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">{benefices.length}</span>
							</span>
							{activeTab === 'benefices' && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-sky-500" />
							)}
						</button>
					</div>

					<div className="p-4 md:p-6">
						{activeTab === 'transactions' && (
							transactions.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
										<svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
										</svg>
									</div>
									<p className="text-gray-400 text-lg">Aucune transaction</p>
									<p className="text-gray-500 text-sm mt-1">Vos transactions apparaîtront ici</p>
								</div>
							) : (
								<div className="space-y-3">
									{transactions.map((t, index) => (
										<div
											key={t.id}
											className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 animate-slideIn gap-3 md:gap-0"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="flex items-center gap-4">
												<div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.status === 'CONFIRMED' ? 'bg-emerald-500/20' : t.status === 'REJECTED' ? 'bg-red-500/20' : 'bg-yellow-500/20'
													}`}>
													{t.status === 'CONFIRMED' ? (
														<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
														</svg>
													) : (
														<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
													)}
												</div>
												<div>
													<p className="text-white font-medium">{t.description}</p>
													<p className="text-gray-500 text-sm">{formatDate(t.createdAt)}</p>
												</div>
											</div>
											<div className="text-right md:text-right">
												<p className="text-white font-bold text-lg">+{t.amount.toFixed(2)} (Ar)</p>
												<span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(t.status)}`}>
													{t.status}
												</span>
											</div>
										</div>
									))}
								</div>
							)
						)}

						{activeTab === 'expenses' && (
							expenses.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
										<svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
									</div>
									<p className="text-gray-400 text-lg">Aucune dépense</p>
									<p className="text-gray-500 text-sm mt-1">Vos dépenses apparaîtront ici</p>
								</div>
							) : (
								<div className="space-y-3">
									{expenses.map((e, index) => (
										<div
											key={e.id}
											className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 animate-slideIn gap-3 md:gap-0"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
													<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
													</svg>
												</div>
												<div>
													<p className="text-white font-medium">{e.description}</p>
													<p className="text-gray-500 text-sm">{formatDate(e.createdAt)}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-red-400 font-bold text-lg">-{e.amount.toFixed(2)} (Ar)</p>
											</div>
										</div>
									))}
								</div>
							)
						)}

						{activeTab === 'benefices' && (
							benefices.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
										<svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
										</svg>
									</div>
									<p className="text-gray-400 text-lg">Aucune bénéfice</p>
									<p className="text-gray-500 text-sm mt-1">Les bénéfices apparaîtront ici</p>
								</div>
							) : (
								<div className="space-y-3">
									{benefices.map((b, index) => (
										<div
											key={b.id}
											className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 animate-slideIn gap-3 md:gap-0"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
													<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
													</svg>
												</div>
												<div>
													<p className="text-white font-medium">{b.description}</p>
													<p className="text-gray-500 text-sm">{formatDate(b.createdAt)}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-emerald-400 font-bold text-lg">+{b.amount.toFixed(2)} (Ar)</p>
											</div>
										</div>
									))}
								</div>
							)
						)}

						{/* Pagination for transactions */}
						{activeTab === 'transactions' && (
							<Pagination
								currentPage={transactionPage}
								totalPages={transactionTotalPages}
								onPageChange={handleTransactionPageChange}
								isLoading={tablesLoading}
								isEmpty={transactions.length === 0}
							/>
						)}

						{/* Pagination for expenses */}
						{activeTab === 'expenses' && (
							<Pagination
								currentPage={expensePage}
								totalPages={expenseTotalPages}
								onPageChange={handleExpensePageChange}
								isLoading={tablesLoading}
								isEmpty={expenses.length === 0}
							/>
						)}

						{/* Pagination for benefices */}
						{activeTab === 'benefices' && (
							<Pagination
								currentPage={beneficePage}
								totalPages={beneficeTotalPages}
								onPageChange={handleBeneficePageChange}
								isLoading={tablesLoading}
								isEmpty={benefices.length === 0}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
