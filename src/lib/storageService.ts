import {
  Photo,
  Category,
  ServiceItem,
  Booking,
  Testimonial,
  ContactSettings,
  ScheduleSettings,
  SiteContent,
} from '../data/types.ts';
import {
  DEFAULT_PHOTOS,
  DEFAULT_CATEGORIES,
  DEFAULT_SERVICES,
  DEFAULT_CONTACTS,
  DEFAULT_SCHEDULE_SETTINGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SITE_CONTENT,
} from '../config/defaults.ts';
import { isFirebaseConfigured, db, storage } from './firebase.ts';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const LS_PREFIX = 'byrobsonbrito_v2_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    
    // Auto-migrate from SVG placeholders to curated photos if needed
    if (key === 'photos' && Array.isArray(parsed) && parsed.length > 0) {
      if (typeof parsed[0]?.src === 'string' && parsed[0].src.startsWith('data:image/svg')) {
        return fallback;
      }
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent('byrobsonbrito_data_updated', { detail: { key } }));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const dataService = {
  isDemoMode(): boolean {
    return !isFirebaseConfigured;
  },

  // === PHOTOS ===
  async getPhotos(): Promise<Photo[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'photos'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
        }
      } catch (err) {
        console.warn('Firestore getPhotos fallback to local:', err);
      }
    }
    const local = getLocal<Photo[]>('photos', DEFAULT_PHOTOS);
    if (local.length > 0 && local[0].src.startsWith('data:image/svg')) {
      return DEFAULT_PHOTOS;
    }
    return local;
  },

  async savePhoto(photo: Photo): Promise<void> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'photos', photo.id);
      await setDoc(docRef, photo, { merge: true });
    }
    const current = getLocal<Photo[]>('photos', DEFAULT_PHOTOS);
    const index = current.findIndex(p => p.id === photo.id);
    if (index >= 0) {
      current[index] = photo;
    } else {
      current.push(photo);
    }
    setLocal('photos', current);
  },

  async saveAllPhotos(photos: Photo[]): Promise<void> {
    if (isFirebaseConfigured && db) {
      for (const p of photos) {
        await setDoc(doc(db, 'photos', p.id), p, { merge: true });
      }
    }
    setLocal('photos', photos);
  },

  async deletePhoto(photoId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'photos', photoId));
    }
    const current = getLocal<Photo[]>('photos', DEFAULT_PHOTOS);
    const filtered = current.filter(p => p.id !== photoId);
    setLocal('photos', filtered);
  },

  // === CATEGORIES ===
  async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
        }
      } catch (err) {
        console.warn('Firestore getCategories fallback:', err);
      }
    }
    return getLocal<Category[]>('categories', DEFAULT_CATEGORIES);
  },

  async saveCategories(categories: Category[]): Promise<void> {
    if (isFirebaseConfigured && db) {
      for (const cat of categories) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }
    }
    setLocal('categories', categories);
  },

  // === SERVICES ===
  async getServices(): Promise<ServiceItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'services'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem));
        }
      } catch (err) {
        console.warn('Firestore getServices fallback:', err);
      }
    }
    return getLocal<ServiceItem[]>('services', DEFAULT_SERVICES);
  },

  async saveService(service: ServiceItem): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'services', service.id), service, { merge: true });
    }
    const current = getLocal<ServiceItem[]>('services', DEFAULT_SERVICES);
    const index = current.findIndex(s => s.id === service.id);
    if (index >= 0) {
      current[index] = service;
    } else {
      current.push(service);
    }
    setLocal('services', current);
  },

  async deleteService(serviceId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'services', serviceId));
    }
    const current = getLocal<ServiceItem[]>('services', DEFAULT_SERVICES);
    setLocal('services', current.filter(s => s.id !== serviceId));
  },

  // === BOOKINGS ===
  async getBookings(): Promise<Booking[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
      } catch (err) {
        console.warn('Firestore getBookings fallback:', err);
      }
    }
    return getLocal<Booking[]>('bookings', []);
  },

  async createBooking(booking: Booking): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'bookings', booking.id), booking);
    }
    const current = getLocal<Booking[]>('bookings', []);
    current.unshift(booking);
    setLocal('bookings', current);
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
    }
    const current = getLocal<Booking[]>('bookings', []);
    const item = current.find(b => b.id === bookingId);
    if (item) {
      item.status = status;
      setLocal('bookings', current);
    }
  },

  // === CONTACTS ===
  async getContacts(): Promise<ContactSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'contacts'));
        if (snap.exists()) {
          return { ...DEFAULT_CONTACTS, ...snap.data() } as ContactSettings;
        }
      } catch (err) {
        console.warn('Firestore getContacts fallback:', err);
      }
    }
    return getLocal<ContactSettings>('contacts', DEFAULT_CONTACTS);
  },

  async saveContacts(settings: ContactSettings): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'contacts'), settings, { merge: true });
    }
    setLocal('contacts', settings);
  },

  // === SCHEDULE SETTINGS ===
  async getScheduleSettings(): Promise<ScheduleSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'schedule'));
        if (snap.exists()) {
          return { ...DEFAULT_SCHEDULE_SETTINGS, ...snap.data() } as ScheduleSettings;
        }
      } catch (err) {
        console.warn('Firestore getScheduleSettings fallback:', err);
      }
    }
    return getLocal<ScheduleSettings>('schedule', DEFAULT_SCHEDULE_SETTINGS);
  },

  async saveScheduleSettings(settings: ScheduleSettings): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'schedule'), settings, { merge: true });
    }
    setLocal('schedule', settings);
  },

  // === TESTIMONIALS ===
  async getTestimonials(): Promise<Testimonial[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
        }
      } catch (err) {
        console.warn('Firestore getTestimonials fallback:', err);
      }
    }
    return getLocal<Testimonial[]>('testimonials', DEFAULT_TESTIMONIALS);
  },

  async saveTestimonial(testimonial: Testimonial): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'testimonials', testimonial.id), testimonial, { merge: true });
    }
    const current = getLocal<Testimonial[]>('testimonials', DEFAULT_TESTIMONIALS);
    const idx = current.findIndex(t => t.id === testimonial.id);
    if (idx >= 0) {
      current[idx] = testimonial;
    } else {
      current.push(testimonial);
    }
    setLocal('testimonials', current);
  },

  async deleteTestimonial(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'testimonials', id));
    }
    const current = getLocal<Testimonial[]>('testimonials', DEFAULT_TESTIMONIALS);
    setLocal('testimonials', current.filter(t => t.id !== id));
  },

  // === SITE CONTENT ===
  async getSiteContent(): Promise<SiteContent> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'content'));
        if (snap.exists()) {
          return { ...DEFAULT_SITE_CONTENT, ...snap.data() } as SiteContent;
        }
      } catch (err) {
        console.warn('Firestore getSiteContent fallback:', err);
      }
    }
    return getLocal<SiteContent>('content', DEFAULT_SITE_CONTENT);
  },

  async saveSiteContent(content: SiteContent): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'content'), content, { merge: true });
    }
    setLocal('content', content);
  },

  // === IMAGE UPLOADER WITH CLIENT COMPRESSION ===
  async uploadImage(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Compress in browser canvas to max 2400px JPEG/WebP ~85%
    const compressedBlob = await compressImageClient(file, 2400, 0.85);

    if (isFirebaseConfigured && storage) {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          error => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
    }

    // Demo Mode: convert compressed blob to data URL
    if (onProgress) onProgress(50);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result as string);
      };
      reader.readAsDataURL(compressedBlob);
    });
  },

  resetDemoData(): void {
    localStorage.removeItem(LS_PREFIX + 'photos');
    localStorage.removeItem(LS_PREFIX + 'categories');
    localStorage.removeItem(LS_PREFIX + 'services');
    localStorage.removeItem(LS_PREFIX + 'bookings');
    localStorage.removeItem(LS_PREFIX + 'contacts');
    localStorage.removeItem(LS_PREFIX + 'schedule');
    localStorage.removeItem(LS_PREFIX + 'testimonials');
    localStorage.removeItem(LS_PREFIX + 'content');
    window.location.reload();
  }
};

/**
 * Compresses an image in browser canvas to max dimension while preserving aspect ratio
 */
export async function compressImageClient(file: File, maxDim: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Falha ao processar imagem para compressão'));
    img.src = url;
  });
}

/**
 * Extracts width, height and orientation from a file
 */
export async function getImageMeta(file: File): Promise<{ width: number; height: number; orientation: Photo['orientation'] }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      let orientation: Photo['orientation'] = 'square';
      if (width > height * 1.1) orientation = 'landscape';
      else if (height > width * 1.1) orientation = 'portrait';
      resolve({ width, height, orientation });
    };
    img.onerror = () => reject(new Error('Não foi possível ler as dimensões da imagem'));
    img.src = url;
  });
}
