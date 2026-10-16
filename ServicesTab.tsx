import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, MoveUp, MoveDown, Check, Clock, QrCode } from 'lucide-react';
import { ServiceItem } from '../../data/types.ts';
import { dataService } from '../../lib/storageService.ts';

interface ServicesTabProps {
  services: ServiceItem[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onRefresh,
  showToast,
}) => {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [includedInput, setIncludedInput] = useState('');

  const handleToggleVisible = async (svc: ServiceItem) => {
    const updated = { ...svc, visible: !svc.visible };
    await dataService.saveService(updated);
    showToast(updated.visible ? 'Serviço visível no site.' : 'Serviço ocultado.');
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este serviço?')) return;
    await dataService.deleteService(id);
    showToast('Serviço excluído com sucesso.');
    onRefresh();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= services.length) return;
    const list = [...services];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((s, i) => (s.order = i + 1));
    for (const s of list) {
      await dataService.saveService(s);
    }
    onRefresh();
  };

  const handleStartCreate = () => {
    setEditingService({
      id: `serv-${Date.now()}`,
      name: '',
      shortDescription: '',
      includedItems: [],
      duration: '2h de ensaio',
      priceText: 'A partir de R$ 1.500',
      coverImage: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600"%3E%3Crect width="800" height="600" fill="%231A1A1C"/%3E%3C/svg%3E',
      pixKey: '',
      pixType: 'email',
      paymentLink: '',
      whatsappMessage: '',
      order: services.length + 1,
      visible: true,
    });
    setIncludedInput('');
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name.trim()) {
      showToast('Nome do serviço é obrigatório.', 'error');
      return;
    }
    await dataService.saveService(editingService);
    setEditingService(null);
    setIsCreating(false);
    showToast('Serviço salvo com sucesso!', 'success');
    onRefresh();
  };

  const addIncludedItem = () => {
    if (!includedInput.trim() || !editingService) return;
    setEditingService({
      ...editingService,
      includedItems: [...editingService.includedItems, includedInput.trim()],
    });
    setIncludedInput('');
  };

  const removeIncludedItem = (idx: number) => {
    if (!editingService) return;
    const updated = editingService.includedItems.filter((_, i) => i !== idx);
    setEditingService({ ...editingService, includedItems: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131315] border border-[rgba(242,238,232,0.12)] p-4 sm:p-6 rounded-[2px]">
        <div>
          <span className="label-editorial text-[10px] block">CATÁLOGO DE EXPERIÊNCIAS</span>
          <h2 className="font-cormorant text-2xl sm:text-3xl text-[#F2EEE8] italic">
            Serviços & Pacotes ({services.length})
          </h2>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Serviço</span>
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc, index) => (
          <div
            key={svc.id}
            className={`bg-[#131315] border rounded-[2px] p-5 flex flex-col justify-between transition-all ${
              svc.visible ? 'border-[rgba(242,238,232,0.12)]' : 'border-red-900/40 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-[#C8A96A] font-inter">
                  {svc.priceText}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-[#9A958D] hover:text-[#F2EEE8] disabled:opacity-20"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === services.length - 1}
                    className="p-1 rounded text-[#9A958D] hover:text-[#F2EEE8] disabled:opacity-20"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleVisible(svc)}
                    className="p-1 text-[#9A958D] hover:text-[#F2EEE8]"
                  >
                    {svc.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingService(svc);
                      setIsCreating(false);
                    }}
                    className="p-1 text-[#9A958D] hover:text-[#C8A96A]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-cormorant text-2xl text-[#F2EEE8] mb-2">{svc.name}</h3>
              <p className="text-xs text-[#9A958D] font-inter leading-relaxed mb-4">
                {svc.shortDescription}
              </p>

              <div className="space-y-1.5 mb-4 text-xs font-inter text-[#F2EEE8]/80">
                <span className="text-[9px] uppercase tracking-widest text-[#9A958D] block">
                  Itens inclusos ({svc.includedItems.length}):
                </span>
                {svc.includedItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#C8A96A]" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
                {svc.includedItems.length > 3 && (
                  <span className="text-[10px] text-[#9A958D] italic">
                    +{svc.includedItems.length - 3} outros itens
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(242,238,232,0.08)] flex items-center justify-between text-[11px] text-[#9A958D] font-inter">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C8A96A]" /> {svc.duration}
              </span>
              {svc.pixKey && (
                <span className="flex items-center gap-1 text-[#C8A96A]">
                  <QrCode className="w-3 h-3" /> Pix Ativo
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.15)] p-6 sm:p-8 max-w-2xl w-full rounded-[2px] shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">
              {isCreating ? 'Novo Serviço' : `Editar: ${editingService.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                    Texto de Preço (ex: A partir de R$ 3.800 ou Sob consulta)
                  </label>
                  <input
                    type="text"
                    value={editingService.priceText}
                    onChange={e => setEditingService({ ...editingService, priceText: e.target.value })}
                    className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                    Duração Estimada
                  </label>
                  <input
                    type="text"
                    value={editingService.duration}
                    onChange={e => setEditingService({ ...editingService, duration: e.target.value })}
                    placeholder="Ex: 2h30 a 3h de ensaio"
                    className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                    Foto de Capa (URL ou Placeholder)
                  </label>
                  <input
                    type="text"
                    value={editingService.coverImage}
                    onChange={e => setEditingService({ ...editingService, coverImage: e.target.value })}
                    className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={e => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-sm text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter resize-none"
                />
              </div>

              {/* Included items manager */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Itens Inclusos
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ex: 60 fotografias tratadas individualmente"
                    value={includedInput}
                    onChange={e => setIncludedInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addIncludedItem();
                      }
                    }}
                    className="flex-1 bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                  <button
                    type="button"
                    onClick={addIncludedItem}
                    className="px-4 py-2 bg-[#18181B] border border-[rgba(200,169,106,0.3)] text-[#C8A96A] text-xs font-inter rounded-[2px]"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {editingService.includedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#0B0B0C] rounded-[2px] text-xs text-[#F2EEE8] font-inter"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(idx)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment / Pix Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(242,238,232,0.1)]">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                    Chave Pix para Sinal / Reserva (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingService.pixKey || ''}
                    onChange={e => setEditingService({ ...editingService, pixKey: e.target.value })}
                    placeholder="contato@byrobsonbrito.com.br"
                    className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                    Link de Pagamento Externo (Opcional)
                  </label>
                  <input
                    type="url"
                    value={editingService.paymentLink || ''}
                    onChange={e => setEditingService({ ...editingService, paymentLink: e.target.value })}
                    placeholder="https://pagamento.exemplo.com/sinal"
                    className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(242,238,232,0.1)]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-[rgba(242,238,232,0.15)] text-xs uppercase tracking-wider text-[#9A958D] font-inter rounded-[2px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px] hover:bg-[#d9bc7f]"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
