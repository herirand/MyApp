'use client';

import React from 'react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
	isEmpty?: boolean;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	isLoading = false,
	isEmpty = false
}: PaginationProps) {
	// Show reset button if we're on a page > 1 and data is empty
	if (isEmpty && currentPage > 1) {
		return (
			<div className="flex items-center justify-center mt-6 px-6 py-4 bg-white/5 border-t border-white/10 rounded-b-2xl">
				<div className="text-center">
					<p className="text-gray-400 mb-3">Aucun résultat sur cette page</p>
					<button
						onClick={() => onPageChange(1)}
						className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isLoading}
					>
						Revenir à la page 1
					</button>
				</div>
			</div>
		);
	}

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between mt-6 px-6 py-4 bg-white/5 border-t border-white/10">
			<div className="text-sm text-gray-400">
				Page <span className="text-white font-medium">{currentPage}</span> sur <span className="text-white font-medium">{totalPages}</span>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1 || isLoading}
					className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-sm font-medium transition-all"
				>
					← Précédent
				</button>

				{/* Page numbers */}
				<div className="flex items-center gap-1">
					{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						// Show first 5 pages or center around current page
						let pageNum;
						if (totalPages <= 5) {
							pageNum = i + 1;
						} else if (currentPage <= 3) {
							pageNum = i + 1;
						} else if (currentPage >= totalPages - 2) {
							pageNum = totalPages - 4 + i;
						} else {
							pageNum = currentPage - 2 + i;
						}

						return (
							<button
								key={pageNum}
								onClick={() => onPageChange(pageNum)}
								disabled={isLoading}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
									pageNum === currentPage
										? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
										: 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
								} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								{pageNum}
							</button>
						);
					})}
				</div>

				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages || isLoading}
					className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-sm font-medium transition-all"
				>
					Suivant →
				</button>
			</div>
		</div>
	);
}
