'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';

interface Student {
	id: string;
	username: string;
	email: string;
	balance?: number;
}

const ITEMS_PER_PAGE = 10;

export default function StudentListPage() {
	const router = useRouter();
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	async function fetchStudents(token: string, page: number) {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/student?page=${page}&limit=${ITEMS_PER_PAGE}`,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			);
			if (response.ok) {
				const data = await response.json();
				setStudents(data);
				// Rough estimation of total pages (assuming ~100 total items)
				setTotalPages(Math.ceil(100 / ITEMS_PER_PAGE));
			}
		} catch (err) {
			console.error('Error fetching students:', err);
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

		if (role !== 'ADMIN') {
			router.push('/dashboard');
			return;
		}

		setTimeout(() => {
			void fetchStudents(token, 1);
		}, 0);
	}, [router]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		const token = localStorage.getItem('token');
		if (token) {
			fetchStudents(token, page);
		}
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
					<h1 className="text-3xl font-bold text-white">Liste des étudiants</h1>
					<p className="text-gray-400 mt-1">Affichage de tous les étudiants enregistrés</p>
				</div>
			</header>

			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn flex flex-col">
				<h3 className="text-xl font-bold text-white mb-6">Étudiants ({students.length})</h3>
				
				<div className="flex-1">
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
										<span className="text-emerald-400 font-medium">{student.balance.toFixed(2)} €</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					isLoading={loading}
					isEmpty={students.length === 0}
				/>
			</div>
		</>
	);
}
