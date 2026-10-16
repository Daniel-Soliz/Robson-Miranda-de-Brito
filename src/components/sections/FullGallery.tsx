import React, { useState } from 'react';
import { Masonry } from '../reactbits/Masonry.tsx';
import { Photo, Category } from '../../data/types.ts';

interface FullGalleryProps {
  photos: Photo[];
  categories: Category[];
  onSelectPhoto: (photo: Photo) => void;
}

export const FullGallery: React.FC<FullGalleryProps> = ({
  photos,
  categories,
  onSelectPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const visiblePhotos = photos.filter(p => p.visible);

  const filteredPhotos = selectedCategory === 'todos'
    ? visiblePhotos
    : visiblePhotos.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const displayedPhotos = filteredPhotos.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goToPage = (target: number) => {
    setPage(Math.max(1, Math.min(totalPages, target)));
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="py-24 sm:py-32 px-5vw bg-[#050506] relative select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-1 rounded-full bg-[#D4B679]" />
              <span className="label-editorial text-[10px]">PORTFÓLIO COMPLETO</span>
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light">
              Histórias em <span className="italic font-normal text-[#D4B679]">Imagens</span>
            </h2>
          </div>

          {/* Dynamic Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => selectCategory('todos')}
              aria-pressed={selectedCategory === 'todos'}
              className={`px-4 py-1.5 rounded-full font-inter text-[11px] uppercase tracking-[0.18em] transition-all cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-[#D4B679] text-[#050506] font-medium shadow-md'
                  : 'bg-[#0A0A0D] border border-[rgba(242,238,232,0.08)] text-[#8E8982] hover:text-[#FAF7F2] hover:border-[rgba(212,182,121,0.25)]'
              }`}
            >
              Todos ({visiblePhotos.length})
            </button>

            {categories.map(cat => {
              const count = visiblePhotos.filter(
                p => p.category.toLowerCase() === cat.slug.toLowerCase() || p.category.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.slug)}
                  aria-pressed={selectedCategory === cat.slug}
                  className={`px-4 py-1.5 rounded-full font-inter text-[11px] uppercase tracking-[0.18em] transition-all cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                      ? 'bg-[#D4B679] text-[#050506] font-medium shadow-md'
                      : 'bg-[#0A0A0D] border border-[rgba(242,238,232,0.08)] text-[#8E8982] hover:text-[#FAF7F2] hover:border-[rgba(212,182,121,0.25)]'
                  }`}
                >
                  {cat.name} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry Grid */}
        <Masonry photos={displayedPhotos} onSelectPhoto={onSelectPhoto} />

        {totalPages > 1 && (
          <nav aria-label="Páginas do portfólio" className="flex items-center justify-center gap-4 sm:gap-8 mt-12 pt-8 border-t border-[#F2EEE8]/10">
            <button type="button" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2.5 border border-[#D4B679]/35 text-[#D4B679] text-xs uppercase tracking-widest disabled:opacity-30 hover:border-[#D4B679] transition-colors">
              ← Anterior
            </button>
            <span aria-live="polite" className="font-mono text-xs text-[#FAF7F2] whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>
            <button type="button" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2.5 border border-[#D4B679]/35 text-[#D4B679] text-xs uppercase tracking-widest disabled:opacity-30 hover:border-[#D4B679] transition-colors">
              Próxima →
            </button>
          </nav>
        )}

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[rgba(242,238,232,0.08)] rounded-[2px] bg-[#0A0A0D]">
            <p className="font-cormorant text-2xl text-[#8E8982] italic">
              Nenhuma fotografia encontrada nesta categoria no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
