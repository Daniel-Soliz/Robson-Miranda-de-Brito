import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  MessageSquare,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import { Booking, ScheduleSettings } from '../../data/types.ts';
import { dataService } from '../../lib/storageService.ts';
import {
  formatDatePTBR,
  generateAdminWhatsAppResponseUrl,
} from '../../utils/scheduler.ts';

interface AgendaTabProps {
  bookings: Booking[];
  scheduleSettings: ScheduleSettings;
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({
  bookings,
  scheduleSettings,
  onRefresh,
  showToast,
}) => {
  const [activeFilter, setActiveFilter] = useState<Booking['status'] | 'todos'>('todos');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');

  // Working day names in PT-BR
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const filteredBookings = activeFilter === 'todos'
    ? bookings
    : bookings.filter(b => b.status === activeFilter);

  // Status handlers
  const handleUpdateStatus = async (booking: Booking, newStatus: Booking['status']) => {
    await dataService.updateBookingStatus(booking.id, newStatus);
    showToast(`Pedido marcado como ${newStatus.toUpperCase()}`, 'success');

    // If confirm or refuse, open WhatsApp to customer with prefilled message
    if (newStatus === 'confirmado' || newStatus === 'recusado') {
      const waUrl = generateAdminWhatsAppResponseUrl({
        clientPhone: booking.clientWhatsApp,
        clientName: booking.clientName,
        serviceName: booking.serviceName,
        date: booking.date,
        timeSlot: booking.timeSlot,
        action: newStatus === 'confirmado' ? 'confirm' : 'decline',
      });
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    onRefresh();
  };

  // Toggle day enabled
  const handleToggleDay = async (dayOfWeek: number) => {
    const updatedDays = scheduleSettings.workingDays.map(d =>
      d.dayOfWeek === dayOfWeek ? { ...d, enabled: !d.enabled } : d
    );
    const updated = { ...scheduleSettings, workingDays: updatedDays };
    await dataService.saveScheduleSettings(updated);
    showToast('Dia de atendimento atualizado.');
    onRefresh();
  };

  // Add blocked date
  const handleAddBlockedDate = async () => {
    if (!newBlockedDate) return;
    if (scheduleSettings.blockedDates?.includes(newBlockedDate)) {
      showToast('Esta data já está bloqueada.', 'error');
      return;
    }
    const updated = {
      ...scheduleSettings,
      blockedDates: [...(scheduleSettings.blockedDates || []), newBlockedDate],
    };
    await dataService.saveScheduleSettings(updated);
    setNewBlockedDate('');
    showToast('Data bloqueada na agenda.');
    onRefresh();
  };

  // Remove blocked date
  const handleRemoveBlockedDate = async (dateStr: string) => {
    const updated = {
      ...scheduleSettings,
      blockedDates: (scheduleSettings.blockedDates || []).filter(d => d !== dateStr),
    };
    await dataService.saveScheduleSettings(updated);
    showToast('Data desbloqueada.');
    onRefresh();
  };

  // Add default slot
  const handleAddSlot = async () => {
    if (!newSlotTime.trim()) return;
    if (scheduleSettings.defaultSlots?.includes(newSlotTime.trim())) {
      showToast('Este horário já existe.', 'error');
      return;
    }
    const updatedSlots = [...(scheduleSettings.defaultSlots || []), newSlotTime.trim()].sort();
    const updated = { ...scheduleSettings, defaultSlots: updatedSlots };
    await dataService.saveScheduleSettings(updated);
    setNewSlotTime('');
    showToast('Horário adicionado.');
    onRefresh();
  };

  // Remove default slot
  const handleRemoveSlot = async (slot: string) => {
    const updatedSlots = (scheduleSettings.defaultSlots || []).filter(s => s !== slot);
    const updated = { ...scheduleSettings, defaultSlots: updatedSlots };
    await dataService.saveScheduleSettings(updated);
    showToast('Horário removido.');
    onRefresh();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131315] border border-[rgba(242,238,232,0.12)] p-4 sm:p-6 rounded-[2px]">
        <div>
          <span className="label-editorial text-[10px] block">CONTROLE DE RESERVAS</span>
          <h2 className="font-cormorant text-2xl sm:text-3xl text-[#F2EEE8] italic">
            Agenda & Pedidos ({bookings.length})
          </h2>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(['todos', 'pendente', 'confirmado', 'recusado', 'concluido'] as const).map(st => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1.5 rounded-[2px] font-inter text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === st
                  ? 'bg-[#C8A96A] text-[#0B0B0C] font-medium'
                  : 'bg-[#18181B] text-[#9A958D] hover:text-[#F2EEE8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center bg-[#131315] border border-dashed border-[rgba(242,238,232,0.1)] rounded-[2px]">
            <p className="font-cormorant text-2xl text-[#9A958D] italic">
              Nenhum pedido de agendamento neste filtro.
            </p>
          </div>
        ) : (
          filteredBookings.map(b => (
            <div
              key={b.id}
              className={`bg-[#131315] border rounded-[2px] p-5 sm:p-6 transition-all ${
                b.status === 'pendente'
                  ? 'border-[#C8A96A]/60 bg-[#161512]'
                  : b.status === 'confirmado'
                  ? 'border-emerald-600/40'
                  : 'border-[rgba(242,238,232,0.1)] opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[1px] ${
                        b.status === 'pendente'
                          ? 'bg-[#C8A96A] text-[#0B0B0C]'
                          : b.status === 'confirmado'
                          ? 'bg-emerald-600 text-white'
                          : b.status === 'recusado'
                          ? 'bg-red-800 text-white'
                          : 'bg-[#18181B] text-[#9A958D]'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#9A958D] font-mono">
                      Data do pedido: {new Date(b.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="font-cormorant text-2xl sm:text-3xl text-[#F2EEE8] font-normal">
                    {b.clientName}
                  </h3>
                  <span className="text-xs font-inter text-[#C8A96A] block mt-0.5">
                    {b.serviceName}
                  </span>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#9A958D] font-inter">
                    <span className="flex items-center gap-1.5 text-[#F2EEE8]">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <strong>{formatDatePTBR(b.date, 'long')} às {b.timeSlot}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" /> {b.locationCity}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#C8A96A]" /> WhatsApp: {b.clientWhatsApp}
                    </span>
                  </div>

                  {b.message && (
                    <p className="mt-3 text-xs text-[#9A958D] italic font-inter bg-[#0B0B0C] p-3 rounded-[2px] border border-[rgba(242,238,232,0.06)]">
                      "{b.message}"
                    </p>
                  )}
                </div>

                {/* Actions: Confirm, Decline, Mark Complete */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  {b.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(b, 'confirmado')}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-inter rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmar & WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(b, 'recusado')}
                        className="w-full px-4 py-2 border border-red-500/40 text-red-300 hover:bg-red-950/40 text-xs uppercase tracking-wider font-inter rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Recusar</span>
                      </button>
                    </>
                  )}

                  {b.status === 'confirmado' && (
                    <button
                      onClick={() => handleUpdateStatus(b, 'concluido')}
                      className="px-4 py-1.5 bg-[#18181B] text-[#9A958D] hover:text-[#F2EEE8] text-xs font-inter rounded-[2px]"
                    >
                      Marcar Concluído
                    </button>
                  )}

                  <a
                    href={`https://wa.me/${b.clientWhatsApp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs text-[#C8A96A] hover:underline font-inter flex items-center gap-1"
                  >
                    <span>Falar no WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Configuration Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[rgba(242,238,232,0.12)]">
        {/* Working Days */}
        <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
          <span className="label-editorial text-[10px] block">CONFIGURAÇÃO DE DIAS</span>
          <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">
            Dias de Atendimento na Semana
          </h3>

          <div className="space-y-2">
            {scheduleSettings.workingDays.map(d => (
              <div
                key={d.dayOfWeek}
                className="flex items-center justify-between p-2.5 bg-[#0B0B0C] border border-[rgba(242,238,232,0.08)] rounded-[2px] text-xs font-inter"
              >
                <span className={d.enabled ? 'text-[#F2EEE8] font-medium' : 'text-[#9A958D]/40'}>
                  {dayNames[d.dayOfWeek]}
                </span>
                <button
                  onClick={() => handleToggleDay(d.dayOfWeek)}
                  className={`px-3 py-1 rounded-[2px] text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-colors ${
                    d.enabled
                      ? 'bg-[#C8A96A] text-[#0B0B0C]'
                      : 'bg-[#18181B] text-[#9A958D] hover:text-[#F2EEE8]'
                  }`}
                >
                  {d.enabled ? 'Ativo' : 'Folga'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Dates & Default Slots */}
        <div className="space-y-6">
          {/* Blocked Dates (Vacation, Trip) */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">BLOQUEIO MANUAL DE DATAS</span>
            <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">
              Viagens ou Datas Indisponíveis
            </h3>

            <div className="flex gap-2">
              <input
                type="date"
                value={newBlockedDate}
                onChange={e => setNewBlockedDate(e.target.value)}
                className="flex-1 bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
              <button
                onClick={handleAddBlockedDate}
                className="px-4 py-2 bg-[#C8A96A] text-[#0B0B0C] text-xs uppercase tracking-wider font-inter font-medium rounded-[2px]"
              >
                Bloquear
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(scheduleSettings.blockedDates || []).map(dt => (
                <div
                  key={dt}
                  className="flex items-center gap-2 px-3 py-1 bg-[#0B0B0C] border border-red-500/30 text-red-200 text-xs rounded-[2px] font-mono"
                >
                  <span>{formatDatePTBR(dt, 'short')}</span>
                  <button
                    onClick={() => handleRemoveBlockedDate(dt)}
                    className="text-red-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Default Slots */}
          <div className="bg-[#131315] border border-[rgba(242,238,232,0.12)] p-6 rounded-[2px] space-y-4">
            <span className="label-editorial text-[10px] block">HORÁRIOS PADRÃO</span>
            <h3 className="font-cormorant text-2xl text-[#F2EEE8] italic">
              Horários de Sessão por Dia
            </h3>

            <div className="flex gap-2">
              <input
                type="time"
                value={newSlotTime}
                onChange={e => setNewSlotTime(e.target.value)}
                className="flex-1 bg-[#0B0B0C] border border-[rgba(242,238,232,0.12)] px-3 py-2 text-xs text-[#F2EEE8] rounded-[2px] focus:outline-none focus:border-[#C8A96A] font-inter"
              />
              <button
                onClick={handleAddSlot}
                className="px-4 py-2 bg-[#C8A96A] text-[#0B0B0C] text-xs uppercase tracking-wider font-inter font-medium rounded-[2px]"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(scheduleSettings.defaultSlots || []).map(slot => (
                <div
                  key={slot}
                  className="flex items-center gap-2 px-3 py-1 bg-[#0B0B0C] border border-[rgba(200,169,106,0.3)] text-[#F2EEE8] text-xs rounded-[2px] font-mono"
                >
                  <Clock className="w-3 h-3 text-[#C8A96A]" />
                  <span>{slot}</span>
                  <button
                    onClick={() => handleRemoveSlot(slot)}
                    className="text-[#9A958D] hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
