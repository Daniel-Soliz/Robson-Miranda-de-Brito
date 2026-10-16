import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Plus,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Edit2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Photo, Category } from '../../data/types.ts';
import { dataService, compressImageClient, getImageMeta } from '../../lib/storageService.ts';

interface PhotosTabProps {
  photos: Photo[];
  categories: Category[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({
  photos,
  categories,
  onRefresh,
  showToast,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // Category management modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const displayPhotos = filterCategory === 'todos'
    ? photos
    : photos.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  // Handle Multiple File Upload with client compression
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    const total = fileList.length;
    let completed = 0;

    try {
      for (let i = 0; i < total; i++) {
        const file = fileList[i];
        const meta = await getImageMeta(file);
        
        // Upload with client-side canvas compression (max 2400px)
        const path = `portfolio/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const url = await dataService.uploadImage(file, path, (prog) => {
          setUploadProgress(Math.round(((completed + prog / 100) / total) * 100));
        });

        // Derive friendly title from filename
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const cleanName = baseName.replace(/[-_]/g, ' ');

        const newPhoto: Photo = {
          id: `ph-${Date.now()}-${i}`,
          src: url,
          thumb: url,
          alt: cleanName,
          caption: cleanName,
          category: categories[0]?.slug || 'casamentos',
          featured: false,
          visible: true,
          order: photos.length + i + 1,
          orientation: meta.orientation,
          width: meta.width,
          height: meta.height,
          createdAt: Date.now(),
        };

        await dataService.savePhoto(newPhoto);
        completed++;
      }

      showToast(`${total} foto(s) enviada(s) e comprimida(s) com sucesso!`, 'success');
      onRefresh();
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('Erro ao processar as fotos.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleFeatured = async (photo: Photo) => {
    const updated = { ...photo, featured: !photo.featured };
    await dataService.savePhoto(updated);
    showToast(updated.featured ? 'Foto marcada como destaque!' : 'Destaque removido.');
    onRefresh();
  };

  const handleToggleVisible = async (photo: Photo) => {
    const updated = { ...photo, visible: !photo.visible };
    await dataService.savePhoto(updated);
    showToast(updated.visible ? 'Foto visível no site.' : 'Foto ocultada do site.');
    onRefresh();
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto do portfólio?')) return;
    await dataService.deletePhoto(photoId);
    showToast('Foto excluída com sucesso.', 'success');
    onRefresh();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const list = [...photos];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // reindex order
    list.forEach((p, i) => {
      p.order = i + 1;
    });

    await dataService.saveAllPhotos(list);
    onRefresh();
  };

  const handleSaveEdit = async () => {
    if (!editingPhoto) return;
    await dataService.savePhoto(editingPhoto);
    setEditingPhoto(null);
    showToast('Alterações salvas com sucesso!', 'success');
    onRefresh();
  };

  // Add category
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      order: categories.length + 1,
    };
    await dataService.saveCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    showToast('Categoria adicionada!', 'success');
    onRefresh();
  };

  const handleDeleteCategory = async (catId: string) => {
    if (categories.length <= 1) {
      showToast('O site precisa de ao menos uma categoria.', 'error');
      return;
    }
    if (!window.confirm('Excluir esta categoria? As fotos continuarão salvas.')) return;
    const updated = categories.filter(c => c.id !== catId);
    await dataService.saveCategories(updated);
    showToast('Categoria removida.');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131315] border border-[rgba(242,238,232,0.12)] p-4 sm:p-6 rounded-[2px]">
        <div>
          <span className="label-editorial text-[10px] block">GERENCIADOR DE PORTFÓLIO</span>
          <h2 className="font-cormorant text-2xl sm:text-3xl text-[#F2EEE8] italic">
            Fotos & Galeria ({photos.length})
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCatModal(true)}
            className="px-4 py-2 border border-[rgba(242,238,232,0.15)] text-[#F2EEE8] text-xs font-inter uppercase tracking-wider rounded-[2px] hover:border-[#C8A96A] transition-colors"
          >
            Categorias
          </button>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? `Comprimindo (${uploadProgress}%)` : 'Enviar Novas Fotos'}</span>
          </button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="bg-[#131315] border border-[rgba(200,169,106,0.3)] p-4 rounded-[2px]">
          <div className="flex justify-between text-xs text-[#C8A96A] font-inter mb-1.5">
            <span>Comprimindo imagens e otimizando para alta resolução...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#0B0B0C] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#C8A96A] h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory('todos')}
          className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-inter transition-all shrink-0 ${
            filterCategory === 'todos'
              ? 'bg-[#C8A96A] text-[#0B0B0C] font-medium'
              : 'bg-[#131315] border border-[rgba(242,238,232,0.1)] text-[#9A958D]'
          }`}
        >
          Todas ({photos.length})
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-inter transition-all shrink-0 ${
              filterCategory === c.slug
                ? 'bg-[#C8A96A] text-[#0B0B0C] font-medium'
                : 'bg-[#131315] border border-[rgba(242,238,232,0.1)] text-[#9A958D]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`group relative bg-[#131315] border rounded-[2px] overflow-hidden flex flex-col transition-all ${
              photo.visible ? 'border-[rgba(242,238,232,0.12)]' : 'border-red-900/40 opacity-60'
            }`}
          >
            {/* Image Preview */}
            <div className="relative aspect-[3/4] bg-[#0B0B0C] overflow-hidden">
              <img
                src={photo.thumb || photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {photo.featured && (
                  <span className="bg-[#C8A96A] text-[#0B0B0C] text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-[1px]">
                    Destaque
                  </span>
                )}
                {!photo.visible && (
                  <span className="bg-red-900/90 text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[1px]">
                    Oculta
                  </span>
                )}
              </div>

              {/* Quick Actions Hover/Tap */}
              <div className="absolute inset-0 bg-[#0B0B0C]/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleToggleFeatured(photo)}
                    title={photo.featured ? 'Remover destaque' : 'Marcar destaque'}
                    className={`p-1.5 rounded-full border ${
                      photo.featured
                        ? 'bg-[#C8A96A] text-[#0B0B0C] border-[#C8A96A]'
                        : 'bg-[#131315] text-[#9A958D] border-[rgba(242,238,232,0.2)]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleVisible(photo)}
                    title={photo.visible ? 'Ocultar do site' : 'Mostrar no site'}
                    className="p-1.5 rounded-full bg-[#131315] text-[#9A958D] border border-[rgba(242,238,232,0.2)] hover:text-[#F2EEE8]"
                  >
                    {photo.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded bg-[#131315] text-[#F2EEE8] border border-[rgba(242,238,232,0.15)] disabled:opacity-30"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === photos.length - 1}
                    className="p-1.5 rounded bg-[#131315] text-[#F2EEE8] border border-[rgba(242,238,232,0.15)] disabled:opacity-30"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="p-1.5 rounded-full bg-[#131315] text-[#F2EEE8] border border-[rgba(242,238,232,0.2)] hover:text-[#C8A96A]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1.5 rounded-full bg-[#131315] text-red-400 border border-red-500/30 hover:bg-red-950"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="p-2.5 text-left text-[11px] font-inter">
              <span className="text-[#C8A96A] block text-[9px] uppercase tracking-wider truncate">
                {photo.category}
              </span>
              <p className="text-[#F2EEE8] truncate font-medium">{photo.caption || photo.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.15)] p-6 max-w-lg w-full rounded-[2px] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(242,238,232,0.1)] pb-3">
              <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">Editar Detalhes da Foto</h3>
              <button onClick={() => setEditingPhoto(null)} className="text-[#9A958D] hover:text-[#F2EEE8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Título / Legenda da Foto
              </label>
              <input
                type="text"
                value={editingPhoto.caption}
                onChange={e => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Texto Alternativo (Acessibilidade & SEO)
              </label>
              <input
                type="text"
                value={editingPhoto.alt}
                onChange={e => setEditingPhoto({ ...editingPhoto, alt: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Categoria
                </label>
                <select
                  value={editingPhoto.category}
                  onChange={e => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Orientação Detectada
                </label>
                <select
                  value={editingPhoto.orientation}
                  onChange={e => setEditingPhoto({ ...editingPhoto, orientation: e.target.value as any })}
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                >
                  <option value="portrait">Vertical (Retrato)</option>
                  <option value="landscape">Horizontal (Paisagem)</option>
                  <option value="square">Quadrada</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-[#F2EEE8] font-inter cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPhoto.featured}
                  onChange={e => setEditingPhoto({ ...editingPhoto, featured: e.target.checked })}
                  className="text-[#C8A96A] rounded border-[rgba(242,238,232,0.2)] bg-[#0B0B0C]"
                />
                <span>Exibir na Galeria Circular em Destaque</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#F2EEE8] font-inter cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPhoto.visible}
                  onChange={e => setEditingPhoto({ ...editingPhoto, visible: e.target.checked })}
                  className="text-[#C8A96A] rounded border-[rgba(242,238,232,0.2)] bg-[#0B0B0C]"
                />
                <span>Visível publicamente</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(242,238,232,0.1)]">
              <button
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 border border-[rgba(242,238,232,0.15)] text-xs uppercase tracking-wider text-[#9A958D] font-inter rounded-[2px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px]"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Management Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.15)] p-6 max-w-md w-full rounded-[2px] shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[rgba(242,238,232,0.1)] pb-3">
              <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">Gerenciar Categorias</h3>
              <button onClick={() => setShowCatModal(false)} className="text-[#9A958D] hover:text-[#F2EEE8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List existing */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 bg-[#0B0B0C] border border-[rgba(242,238,232,0.08)] rounded-[2px] text-xs font-inter"
                >
                  <div>
                    <span className="text-[#F2EEE8] font-medium block">{cat.name}</span>
                    <span className="text-[10px] text-[#9A958D]">slug: {cat.slug}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new category form */}
            <div className="border-t border-[rgba(242,238,232,0.1)] pt-4 space-y-3">
              <span className="label-editorial text-[9px] block">NOVA CATEGORIA</span>
              <input
                type="text"
                placeholder="Nome da Categoria (Ex: Elopements)"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
              <button
                onClick={handleAddCategory}
                className="w-full py-2 bg-[#C8A96A] text-[#0B0B0C] text-xs uppercase tracking-widest font-inter font-medium rounded-[2px] hover:bg-[#d9bc7f]"
              >
                Adicionar Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
