'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisible = 5 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

	if(totalPages <= maxVisible) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
	} else {
			pages.push(1);

			if(currentPage > 3) pages.push('...');

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) pages.push(i);

			if(currentPage < totalPages - 2) pages.push('...');

			if(totalPages !== 1) pages.push(totalPages);
		}

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10!">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
      >
        Prev
      </button>

      {getPageNumbers().map((page, index) => 
        page === '...' ? (
          <span key={`dots-${index}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-2 border rounded transition ${
              page === currentPage 
                ? 'bg-black text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
      >
        Next
      </button>
    </div>
  );
}