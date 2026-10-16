import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePhoneNumber,
  formatDatePTBR,
  isDateAvailable,
  getAvailableSlots,
  generateClientWhatsAppUrl,
  generateAdminWhatsAppResponseUrl,
} from './scheduler.ts';
import type { ScheduleSettings, Booking } from '../data/types.ts';

const mockSettings: ScheduleSettings = {
  slotDurationMinutes: 120,
  bufferMinutes: 60,
  advanceNoticeDays: 2,
  maxAdvanceDays: 90,
  workingDays: [
    { dayOfWeek: 0, enabled: false, start: '10:00', end: '16:00' }, // Sunday disabled
    { dayOfWeek: 1, enabled: true, start: '09:00', end: '18:00' },  // Monday enabled
    { dayOfWeek: 2, enabled: true, start: '09:00', end: '18:00' },  // Tuesday enabled
    { dayOfWeek: 3, enabled: true, start: '09:00', end: '18:00' },  // Wednesday enabled
    { dayOfWeek: 4, enabled: true, start: '09:00', end: '18:00' },  // Thursday enabled
    { dayOfWeek: 5, enabled: true, start: '09:00', end: '18:00' },  // Friday enabled
    { dayOfWeek: 6, enabled: true, start: '09:00', end: '18:00' },  // Saturday enabled
  ],
  blockedDates: ['2026-10-25'],
  defaultSlots: ['09:00', '14:30', '17:00'],
};

test('normalizePhoneNumber prefixes Brazilian numbers with 55 and strips symbols', () => {
  assert.equal(normalizePhoneNumber('(11) 98765-4321'), '5511987654321');
  assert.equal(normalizePhoneNumber('+55 11 98765-4321'), '5511987654321');
  assert.equal(normalizePhoneNumber(''), '');
});

test('formatDatePTBR formats short and long correctly', () => {
  assert.equal(formatDatePTBR('2026-10-20', 'short'), '20/10/2026');
  assert.equal(formatDatePTBR('2026-10-20', 'long'), '20 de outubro de 2026');
});

test('isDateAvailable enforces advance notice, blocked dates and active days', () => {
  const baseNow = new Date(2026, 9, 16); // Oct 16, 2026 (Friday)

  // Same day -> too soon (diff = 0 < 2)
  const todayCheck = isDateAvailable('2026-10-16', mockSettings, baseNow);
  assert.equal(todayCheck.available, false);
  assert.equal(todayCheck.reason, 'too_soon');

  // Next day -> too soon (diff = 1 < 2)
  const tomorrowCheck = isDateAvailable('2026-10-17', mockSettings, baseNow);
  assert.equal(tomorrowCheck.available, false);
  assert.equal(tomorrowCheck.reason, 'too_soon');

  // Sunday Oct 18 -> day_disabled
  const sundayCheck = isDateAvailable('2026-10-18', mockSettings, baseNow);
  assert.equal(sundayCheck.available, false);
  assert.equal(sundayCheck.reason, 'day_disabled');

  // Monday Oct 19 -> available!
  const mondayCheck = isDateAvailable('2026-10-19', mockSettings, baseNow);
  assert.equal(mondayCheck.available, true);

  // Blocked date 2026-10-25
  const blockedCheck = isDateAvailable('2026-10-25', mockSettings, baseNow);
  assert.equal(blockedCheck.available, false);
  assert.equal(blockedCheck.reason, 'blocked');
});

test('getAvailableSlots excludes booked or pending slots', () => {
  const bookings: Booking[] = [
    {
      id: 'b1',
      serviceId: 's1',
      serviceName: 'Ensaio Editorial',
      date: '2026-10-20',
      timeSlot: '14:30',
      clientName: 'Mariana Lima',
      clientWhatsApp: '5511999999999',
      clientEmail: 'mariana@example.com',
      locationCity: 'São Paulo',
      status: 'confirmado',
      createdAt: Date.now(),
    },
    {
      id: 'b2',
      serviceId: 's1',
      serviceName: 'Ensaio Editorial',
      date: '2026-10-20',
      timeSlot: '09:00',
      clientName: 'Carla Silva',
      clientWhatsApp: '5511999999998',
      clientEmail: 'carla@example.com',
      locationCity: 'São Paulo',
      status: 'recusado', // recusado should NOT block the slot!
      createdAt: Date.now(),
    },
  ];

  const slots = getAvailableSlots('2026-10-20', mockSettings, bookings);
  // '14:30' is taken by confirmed booking. '09:00' was recusado, so it remains free. '17:00' is free.
  assert.deepEqual(slots, ['09:00', '17:00']);
});

test('generateClientWhatsAppUrl creates correctly encoded wa.me url with client and session details', () => {
  const url = generateClientWhatsAppUrl({
    phone: '11987654321',
    clientName: 'Camila & Leonardo',
    clientWhatsApp: '(11) 98888-7777',
    clientEmail: 'camila@exemplo.com',
    serviceName: 'Casamento Completo',
    date: '2026-11-14',
    timeSlot: '15:00',
    locationCity: 'Campos do Jordão, SP',
    message: 'Cerimônia ao ar livre durante o pôr do sol.',
  });

  assert.ok(url.startsWith('https://wa.me/5511987654321?text='));
  assert.ok(url.includes(encodeURIComponent('Camila & Leonardo')));
  assert.ok(url.includes(encodeURIComponent('Casamento Completo')));
  assert.ok(url.includes(encodeURIComponent('Campos do Jordão, SP')));
});

test('generateAdminWhatsAppResponseUrl formats confirm and decline messages', () => {
  const confirmUrl = generateAdminWhatsAppResponseUrl({
    clientPhone: '11988887777',
    clientName: 'Camila',
    serviceName: 'Casamento Completo',
    date: '2026-11-14',
    timeSlot: '15:00',
    action: 'confirm',
  });
  assert.ok(confirmUrl.startsWith('https://wa.me/5511988887777?text='));
  assert.ok(confirmUrl.includes(encodeURIComponent('CONFIRMADO')));

  const declineUrl = generateAdminWhatsAppResponseUrl({
    clientPhone: '11988887777',
    clientName: 'Camila',
    serviceName: 'Casamento Completo',
    date: '2026-11-14',
    timeSlot: '15:00',
    action: 'decline',
  });
  assert.ok(declineUrl.includes(encodeURIComponent('não está mais disponível')));
});
