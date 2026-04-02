'use client';

import Link from 'next/link';

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
			<div className="text-center space-y-6 max-w-lg">
				<h1 className="text-4xl font-bold text-indigo-900">
					Gestion des Transactions
				</h1>
				<p className="text-lg text-gray-600">
					Plateforme de gestion des transactions pour étudiants et administrateurs
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
					<Link 
						href="/login"
						className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
					>
						Connexion
					</Link>
					<Link 
						href="/signup"
						className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
					>
						S&apos;inscrire
					</Link>
				</div>
			</div>
		</div>
	);
}