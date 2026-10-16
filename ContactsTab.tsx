import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Instagram,
  MapPin,
  Clock,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { ContactSettings, BioLink } from '../../data/types.ts';
import { dataService } from '../../lib/storageService.ts';

interface ContactsTabProps {
  contacts: ContactSettings;
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  onRefresh,
  showToast,
}) => {
  const [form, setForm] = useState<ContactSettings>({ ...contacts });
  const [newBioTitle, setNewBioTitle] = useState('');
  const [newBioUrl, setNewBioUrl] = useState('');
  const [newBioHighlight, setNewBioHighlight] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.saveContacts(form);
    showToast('Contatos atualizados em todo o site!', 'success');
    onRefresh();
  };

  const handleAddBioLink = () => {
    if (!newBioTitle.trim() || !newBioUrl.trim()) return;
    const newLink: BioLink = {
      id: `bl-${Date.now()}`,
      title: newBioTitle.trim(),
      url: newBioUrl.trim(),
      highlight: newBioHighlight,
      order: (form.bioLinks || []).length + 1,
    };
    setForm({
      ...form,
      bioLinks: [...(form.bioLinks || []), newLink],
    });
    setNewBioTitle('');
    setNewBioUrl('');
    setNewBioHighlight(false);
  };

  const handleRemoveBioLink = (id: string) => {
    setForm({
      ...form,
      bioLinks: (form.bioLinks || []).filter(l => l.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131315] border border-[rgba(242,238,232,0.12)] p-4 sm:p-6 rounded-[2px]">
        <div>
          <span className="label-editorial text-[10px] block">FONTE ÚNICA DE VERDADE</span>
          <h2 className="font-cormorant text-2xl sm:text-3xl text-[#F2EEE8] italic">
            Contatos, Redes & Página /links
          </h2>
          <p className="text-xs text-[#9A958D] font-inter mt-1">
            Qualquer alteração salva aqui é refletida instantaneamente no botão flutuante, menu, formulários, rodapé e SEO.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-widest font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Tudo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Edit Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">CANAIS DIRETOS</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  WhatsApp (apenas dígitos com DDI)
                </label>
                <input
                  type="text"
                  value={form.whatsapp || ''}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="5511987654321"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  WhatsApp (Exibição Formatada)
                </label>
                <input
                  type="text"
                  value={form.whatsappDisplay || ''}
                  onChange={e => setForm({ ...form, whatsappDisplay: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="contato@byrobsonbrito.com.br"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Telefone de Contato
                </label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+55 11 98765-4321"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Mensagem Padrão do WhatsApp
              </label>
              <input
                type="text"
                value={form.defaultWhatsappMsg || ''}
                onChange={e => setForm({ ...form, defaultWhatsappMsg: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>
          </div>

          {/* Social Networks */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">REDES SOCIAIS (Deixe vazio para ocultar)</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Instagram (Usuário sem @)
                </label>
                <input
                  type="text"
                  value={form.instagram || ''}
                  onChange={e => setForm({ ...form, instagram: e.target.value })}
                  placeholder="byrobsonbrito"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  TikTok (Usuário sem @)
                </label>
                <input
                  type="text"
                  value={form.tiktok || ''}
                  onChange={e => setForm({ ...form, tiktok: e.target.value })}
                  placeholder="byrobsonbrito"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  Pinterest
                </label>
                <input
                  type="text"
                  value={form.pinterest || ''}
                  onChange={e => setForm({ ...form, pinterest: e.target.value })}
                  placeholder="byrobsonbrito"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                  YouTube (canal ou handle)
                </label>
                <input
                  type="text"
                  value={form.youtube || ''}
                  onChange={e => setForm({ ...form, youtube: e.target.value })}
                  placeholder="canal"
                  className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
                />
              </div>
            </div>
          </div>

          {/* Location & Working Hours */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">LOCALIZAÇÃO & ATENDIMENTO</span>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Cidade e Abrangência
              </label>
              <input
                type="text"
                value={form.city || ''}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="São Paulo, SP — Atende todo o Brasil e exterior"
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Endereço ou Bairro
              </label>
              <input
                type="text"
                value={form.address || ''}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Rua Oscar Freire, Jardins"
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Link do Google Maps
              </label>
              <input
                type="url"
                value={form.googleMapsUrl || ''}
                onChange={e => setForm({ ...form, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9A958D] mb-1 font-inter">
                Horário de Atendimento
              </label>
              <input
                type="text"
                value={form.workingHoursText || ''}
                onChange={e => setForm({ ...form, workingHoursText: e.target.value })}
                placeholder="Segunda a Sábado, das 09h às 19h"
                className="w-full bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
            </div>
          </div>

          {/* Links for /links (Link na Bio) */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">BOTÕES EXTRAS PARA A PÁGINA /LINKS (BIO)</span>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Título do Botão (Ex: Baixar E-book de Dicas)"
                value={newBioTitle}
                onChange={e => setNewBioTitle(e.target.value)}
                className="flex-1 bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
              <input
                type="url"
                placeholder="Link URL"
                value={newBioUrl}
                onChange={e => setNewBioUrl(e.target.value)}
                className="flex-1 bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
              <button
                type="button"
                onClick={handleAddBioLink}
                className="px-4 py-2 bg-[#C8A96A] text-[#0B0B0C] text-xs uppercase tracking-wider font-inter font-medium rounded-[2px]"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {(form.bioLinks || []).map(bl => (
                <div
                  key={bl.id}
                  className="flex items-center justify-between p-2.5 bg-[#0B0B0C] border border-[rgba(242,238,232,0.08)] rounded-[2px] text-xs font-inter"
                >
                  <div>
                    <span className="text-[#F2EEE8] font-medium block">{bl.title}</span>
                    <span className="text-[10px] text-[#9A958D]">{bl.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBioLink(bl.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#C8A96A] text-[#0B0B0C] font-inter text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-[#d9bc7f] transition-all"
          >
            Salvar Contatos e Atualizar Site
          </button>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#131315] border border-[rgba(200,169,106,0.3)] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-2 text-[#C8A96A]">
              <Eye className="w-4 h-4" />
              <span className="label-editorial text-[10px]">PRÉ-VISUALIZAÇÃO DOS CONTATOS NO SITE</span>
            </div>

            <p className="text-xs text-[#9A958D] font-inter">
              Assim seus contatos aparecem no rodapé e no botão flutuante:
            </p>

            <div className="bg-[#0B0B0C] border border-[rgba(242,238,232,0.1)] p-4 rounded-[2px] space-y-3 text-xs font-inter">
              <div className="flex items-center gap-2 text-[#F2EEE8]">
                <MessageSquare className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>WhatsApp: {form.whatsappDisplay || form.whatsapp || 'Não configurado'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#F2EEE8]">
                <Instagram className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Instagram: {form.instagram ? `@${form.instagram}` : 'Oculto'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#F2EEE8]">
                <Mail className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>E-mail: {form.email || 'Não configurado'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#F2EEE8]">
                <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Cidade: {form.city || 'Não configurado'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#F2EEE8]">
                <Clock className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Horário: {form.workingHoursText || 'Não configurado'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/links"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#18181B] border border-[rgba(242,238,232,0.15)] text-[#C8A96A] text-xs uppercase tracking-wider font-inter rounded-[2px] flex items-center justify-center gap-2 hover:border-[#C8A96A]"
              >
                <span>Ver Página /links (Bio)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
