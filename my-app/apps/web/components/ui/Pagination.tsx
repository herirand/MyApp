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
			<div className="flex items-center justify-center mt-4 md:mt-6 px-4 md:px-6 py-3 md:py-4 bg-white/5 border-t border-white/10 rounded-b-2xl">
				<div className="text-center">
					<p className="text-gray-400 mb-3 text-sm md:text-base">Aucun résultat sur cette page</p>
					<button
						onClick={() => onPageChange(1)}
						className="px-4 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm md:text-base hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
		<div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 md:mt-6 px-4 md:px-6 py-3 md:py-4 bg-white/5 border-t border-white/10 gap-4 md:gap-0">
			<div className="text-xs md:text-sm text-gray-400 text-center md:text-left">
				Page <span className="text-white font-medium">{currentPage}</span> sur <span className="text-white font-medium">{totalPages}</span>
			</div>

			<div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto">
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1 || isLoading}
					className="px-2 md:px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-xs md:text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap"
				>
					← <span className="hidden sm:inline">Prec</span>
				</button>

				{/* Page numbers */}
				<div className="flex items-center gap-1 overflow-x-auto">
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
								className={`px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-shrink-0 ${
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
					className="px-2 md:px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-xs md:text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap"
				>
					<span className="hidden sm:inline">Suiv</span> →
				</button>
			</div>
		</div>
	);
}
