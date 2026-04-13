'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
	id: string;
	username: string;
	email: string;
	userId: number;
	balance?: number;
}

interface DeleteFormData {
	username: string;
	userId: string;
}

export default function DeleteStudentPage() {
	const router = useRouter();
	const [students, setStudents] = useState<Student[]>([]);
	const [formData, setFormData] = useState<DeleteFormData>({ username: '', userId: '' });
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

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
	}, [router]);

	const fetchStudents = async (token: string) => {
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
	};

	const handleSelectStudent = (student: Student) => {
		setFormData({
			username: student.username,
			userId: student.userId.toString()
		});
		setSelectedStudent(student);
		setError('');
		setSuccess('');
	};

	const handleDelete = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!selectedStudent) {
			setError('Veuillez sélectionner un étudiant');
			return;
		}

		setError('');
		setSuccess('');
		setDeleting(true);

		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: formData.username,
					userId: formData.userId
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la suppression');
			}

			setSuccess(`Étudiant "${formData.username}" supprimé avec succès !`);
			setFormData({ username: '', userId: '' });
			setSelectedStudent(null);
			setShowConfirmModal(false);
			
			// Refresh student list
			setTimeout(() => {
				fetchStudents(token);
			}, 1500);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
			setError(errorMessage);
		} finally {
			setDeleting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
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
					<h1 className="text-3xl font-bold text-white">Suppression d'étudiants</h1>
					<p className="text-gray-400 mt-1">Supprimer un étudiant du système</p>
				</div>
			</header>

			<div className="grid md:grid-cols-2 gap-6">
				{/* Liste des étudiants */}
				<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
					<h3 className="text-xl font-bold text-white mb-6">Sélectionner un étudiant à supprimer</h3>
					
					{students.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-400">Aucun étudiant enregistré</p>
						</div>
					) : (
						<div className="space-y-3 max-h-[600px] overflow-y-auto">
							{students.map((student) => (
								<button
									key={student.id}
									onClick={() => handleSelectStudent(student)}
									className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
										selectedStudent?.id === student.id
											? 'bg-red-500/30 border border-red-500/50'
											: 'bg-white/5 hover:bg-white/10 border border-white/10'
									}`}
								>
									<div className="flex items-center gap-4 text-left">
										<div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
											<span className="text-white font-medium">{student.username[0].toUpperCase()}</span>
										</div>
										<div>
											<p className="text-white font-medium">{student.username}</p>
											<p className="text-gray-400 text-sm">ID: {student.userId}</p>
										</div>
									</div>
									<svg
										className={`w-5 h-5 transition-colors ${
											selectedStudent?.id === student.id ? 'text-red-400' : 'text-gray-400'
										}`}
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Formulaire de suppression */}
				<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-fadeIn">
					<h3 className="text-xl font-bold text-white mb-6">Confirmer la suppression</h3>
					
					{selectedStudent ? (
						<form onSubmit={handleDelete} className="space-y-4">
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

							<div className="bg-white/5 rounded-xl p-4 border border-white/10">
								<p className="text-gray-300 text-sm mb-3">Étudiant à supprimer:</p>
								<div className="space-y-2">
									<div>
										<label className="block text-xs text-gray-400 mb-1">Nom d'utilisateur</label>
										<input
											type="text"
											name="username"
											value={formData.username}
											disabled
											className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white opacity-75"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-400 mb-1">ID Utilisateur</label>
										<input
											type="text"
											name="userId"
											value={formData.userId}
											disabled
											className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white opacity-75"
										/>
									</div>
								</div>
							</div>

							<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
								<p className="text-red-300 text-sm">
									<strong>Attention:</strong> Cette action supprimera définitivement l'étudiant et toutes ses transactions.
								</p>
							</div>

							<button
								type="button"
								onClick={() => setShowConfirmModal(true)}
								disabled={deleting}
								className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/25"
							>
								{deleting ? 'Suppression...' : 'Supprimer cet étudiant'}
							</button>
						</form>
					) : (
						<div className="flex flex-col items-center justify-center h-64 text-center">
							<svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-gray-400">Sélectionnez un étudiant à supprimer</p>
						</div>
					)}
				</div>
			</div>

			{/* Modal de confirmation */}
			{showConfirmModal && selectedStudent && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
						<h2 className="text-2xl font-bold text-white mb-4">Êtes-vous sûr?</h2>
						
						<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
							<p className="text-red-300 text-sm mb-3">
								Vous êtes sur le point de supprimer définitivement:
							</p>
							<p className="text-white font-semibold text-lg">{selectedStudent.username}</p>
							<p className="text-gray-400 text-sm mt-2">ID: {selectedStudent.userId}</p>
						</div>

						<p className="text-gray-300 text-sm mb-6">
							Cette action est irréversible et supprimera toutes les transactions associées.
						</p>

						<div className="flex gap-4">
							<button
								onClick={() => setShowConfirmModal(false)}
								className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
								disabled={deleting}
							>
								Annuler
							</button>
							<button
								onClick={handleDelete}
								disabled={deleting}
								className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{deleting ? 'Suppression...' : 'Confirmer la suppression'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
