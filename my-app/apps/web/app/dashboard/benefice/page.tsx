'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';

interface Benefice {
	id: number;
	amount: number;
	description: string;
	createdAt: string;
}

export default function BeneficePage() {
	const router = useRouter();
	const [benefices, setBenefices] = useState<Benefice[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const ITEMS_PER_PAGE = 10;

	async function fetchData(token: string, page: number = 1) {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/benefice/me?page=${page}&limit=${ITEMS_PER_PAGE}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const data = await response.json();
				setBenefices(data);
				// Estimate total pages
				setTotalPages(data.length > 0 ? Math.max(1, Math.ceil(100 / ITEMS_PER_PAGE)) : 1);
			} else {
				setError('Erreur lors du chargement');
			}
		} catch {
			setError('Erreur de connexion');
		} finally {
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

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		const token = localStorage.getItem('token');
		if (token) {
			setLoading(true);
			fetchData(token, page);
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

	const totalBenefice = benefices.reduce((sum, b) => sum + b.amount, 0);

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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-6 relative">
			<div className="absolute inset-0 -z-10" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
				backgroundSize: '40px 40px',
			}} />

			<div className="relative max-w-6xl mx-auto">
				<header className="mb-6 md:mb-8 animate-fadeIn">
					<button
						onClick={() => router.push('/dashboard')}
						className="mb-3 md:mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm md:text-base"
					>
						<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Retour
					</button>
					<h1 className="text-2xl md:text-3xl font-bold text-white">Bénéfices</h1>
					<p className="text-gray-400 mt-1 text-sm md:text-base">Historique des bénéfices de la communauté</p>
				</header>

				{error && (
					<div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl flex items-center gap-3 text-sm md:text-base">
						<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
						{error}
					</div>
				)}

				<div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 animate-fadeIn">
					<div className="flex items-center gap-3 mb-2">
						<div className="w-9 md:w-10 h-9 md:h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg className="w-4 md:w-5 h-4 md:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
						</div>
						<span className="text-emerald-400 text-xs md:text-sm font-medium">Total des bénéfices</span>
					</div>
					<p className="text-2xl md:text-4xl font-bold text-white">{totalBenefice.toFixed(2)} (Ar)</p>
					<p className="text-emerald-400/70 text-xs md:text-sm mt-1">{benefices.length} transactions</p>
				</div>

				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-fadeIn">
					<div className="p-4 md:p-6">
						{benefices.length === 0 ? (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
									<svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
								</div>
								<p className="text-gray-400 text-lg">Aucun bénéfice</p>
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
						)}

					{benefices.length > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							isLoading={loading}
						/>
					)}

					{benefices.length === 0 && currentPage > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							isLoading={loading}
							isEmpty={true}
						/>
					)}
					</div>
				</div>
			</div>
		</div>
	);
}
