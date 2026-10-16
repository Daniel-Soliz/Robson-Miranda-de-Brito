import React, { useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Quote } from 'lucide-react';
import { SiteContent, Testimonial } from '../../data/types.ts';
import { dataService } from '../../lib/storageService.ts';

interface ContentTabProps {
  content: SiteContent;
  testimonials: Testimonial[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  content,
  testimonials,
  onRefresh,
  showToast,
}) => {
  const [siteForm, setSiteForm] = useState<SiteContent>({ ...content });
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.saveSiteContent(siteForm);
    showToast('Textos e marca salvos com sucesso!', 'success');
    onRefresh();
  };

  const handleToggleTestimonialVisible = async (t: Testimonial) => {
    const updated = { ...t, visible: !t.visible };
    await dataService.saveTestimonial(updated);
    showToast(updated.visible ? 'Depoimento visível no site.' : 'Depoimento ocultado.');
    onRefresh();
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Excluir este depoimento?')) return;
    await dataService.deleteTestimonial(id);
    showToast('Depoimento excluído.');
    onRefresh();
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    await dataService.saveTestimonial(editingTestimonial);
    setEditingTestimonial(null);
    showToast('Depoimento salvo!', 'success');
    onRefresh();
  };

  const handleNewTestimonial = () => {
    setEditingTestimonial({
      id: `t-${Date.now()}`,
      coupleNames: '',
      eventType: 'Casamento',
      eventDate: '',
      quote: '',
      order: testimonials.length + 1,
      visible: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131315] border border-[rgba(242,238,232,0.12)] p-4 sm:p-6 rounded-[2px]">
        <div>
          <span className="label-editorial text-[10px] block">NARRATIVA & MARCA</span>
          <h2 className="font-cormorant text-2xl sm:text-3xl text-[#F2EEE8] italic">
            Textos, Bio & Depoimentos
          </h2>
        </div>

        <button
          onClick={handleSaveContent}
          className="px-6 py-2.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Textos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Form */}
        <form onSubmit={handleSaveContent} className="lg:col-span-7 space-y-6">
          {/* Hero Section Copy */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">HERO (ABERTURA DO SITE)</span>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Subtítulo do Hero
              </label>
              <textarea
                rows={3}
                value={siteForm.heroSubtitle}
                onChange={e => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter resize-none"
              />
            </div>
          </div>

          {/* About Section */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">SEÇÃO SOBRE (BIO EM 1ª PESSOA)</span>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Foto do Robson (URL)
              </label>
              <input
                type="text"
                value={siteForm.aboutPhotoUrl}
                onChange={e => setSiteForm({ ...siteForm, aboutPhotoUrl: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] font-inter">
                Parágrafos da Bio
              </label>
              {siteForm.aboutTextParagraphs.map((p, idx) => (
                <textarea
                  key={idx}
                  rows={2}
                  value={p}
                  onChange={e => {
                    const updated = [...siteForm.aboutTextParagraphs];
                    updated[idx] = e.target.value;
                    setSiteForm({ ...siteForm, aboutTextParagraphs: updated });
                  }}
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter resize-none"
                />
              ))}
            </div>

            {/* 3 Stats editor */}
            <div className="pt-2 border-t border-[rgba(242,238,232,0.08)]">
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-3 font-inter">
                3 Números de Destaque
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {siteForm.aboutStats.map((stat, idx) => (
                  <div key={idx} className="bg-[#0B0B0C] p-3 rounded-[2px] border border-[rgba(242,238,232,0.08)] space-y-2">
                    <div>
                      <span className="text-[10px] text-[#9A958D] uppercase font-inter">Número</span>
                      <input
                        type="number"
                        value={stat.number}
                        onChange={e => {
                          const updated = [...siteForm.aboutStats];
                          updated[idx] = { ...updated[idx], number: parseInt(e.target.value, 10) || 0 };
                          setSiteForm({ ...siteForm, aboutStats: updated });
                        }}
                        className="w-full bg-[#131315] border border-[rgba(242,238,232,0.1)] px-2 py-1 text-xs text-[#F2EEE8] font-inter rounded"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9A958D] uppercase font-inter">Sufixo (ex: +)</span>
                      <input
                        type="text"
                        value={stat.suffix || ''}
                        onChange={e => {
                          const updated = [...siteForm.aboutStats];
                          updated[idx] = { ...updated[idx], suffix: e.target.value };
                          setSiteForm({ ...siteForm, aboutStats: updated });
                        }}
                        className="w-full bg-[#131315] border border-[rgba(242,238,232,0.1)] px-2 py-1 text-xs text-[#F2EEE8] font-inter rounded"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9A958D] uppercase font-inter">Rótulo</span>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={e => {
                          const updated = [...siteForm.aboutStats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setSiteForm({ ...siteForm, aboutStats: updated });
                        }}
                        className="w-full bg-[#131315] border border-[rgba(242,238,232,0.1)] px-2 py-1 text-xs text-[#F2EEE8] font-inter rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO & Meta */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">SEO & INDEXAÇÃO GOOGLE</span>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Meta Descrição (Google e WhatsApp)
              </label>
              <textarea
                rows={2}
                value={siteForm.metaDescription}
                onChange={e => setSiteForm({ ...siteForm, metaDescription: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-all"
          >
            Salvar Textos & Atualizar Site
          </button>
        </form>

        {/* Testimonials Manager */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(242,238,232,0.1)] pb-3">
              <div>
                <span className="label-editorial text-[10px] block">DEPOIMENTOS DOS CLIENTES</span>
                <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">
                  Avaliações ({testimonials.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={handleNewTestimonial}
                className="px-3 py-1.5 bg-[#C8A96A] text-[#0B0B0C] text-xs uppercase font-inter font-medium rounded-[2px] hover:bg-[#d9bc7f] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo</span>
              </button>
            </div>

            <div className="space-y-3">
              {testimonials.map(t => (
                <div
                  key={t.id}
                  className={`p-4 bg-[#0B0B0C] border rounded-[2px] space-y-2 transition-all ${
                    t.visible ? 'border-[rgba(242,238,232,0.08)]' : 'border-red-900/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cormorant text-lg text-[#F2EEE8]">{t.coupleNames}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleTestimonialVisible(t)}
                        className="p-1 text-[#9A958D] hover:text-[#F2EEE8]"
                      >
                        {t.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setEditingTestimonial(t)}
                        className="p-1 text-[#9A958D] hover:text-[#C8A96A]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#9A958D] font-inter italic line-clamp-2">
                    "{t.quote}"
                  </p>
                  <span className="text-[10px] text-[#C8A96A] block font-inter">
                    {t.eventType} • {t.eventDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.15)] p-6 max-w-md w-full rounded-[2px] shadow-2xl space-y-4">
            <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">Editar Depoimento</h3>

            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Nomes dos Noivos ou Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.coupleNames}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, coupleNames: e.target.value })}
                  placeholder="Ex: Beatriz & Lucas"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Tipo de Evento / Local
                </label>
                <input
                  type="text"
                  value={editingTestimonial.eventType}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, eventType: e.target.value })}
                  placeholder="Casamento na Fazenda Vila Rica"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Data ou Mês
                </label>
                <input
                  type="text"
                  value={editingTestimonial.eventDate}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, eventDate: e.target.value })}
                  placeholder="Outubro de 2025"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Depoimento / Citação
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.quote}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(242,238,232,0.1)]">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-1.5 border border-[rgba(242,238,232,0.15)] text-xs uppercase font-inter rounded-[2px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#C8A96A] text-[#0B0B0C] text-xs uppercase tracking-wider font-inter font-medium rounded-[2px]"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
