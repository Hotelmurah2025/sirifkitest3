export interface User {
  id: string;
  nama: string;
  email: string;
  role: 'admin' | 'owner' | 'staff';
  hotel_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Hotel {
  _id: string;
  nama_hotel: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  telepon: string;
  email: string;
  website: string;
  deskripsi: string;
  bintang: number;
  fasilitas: string[];
  foto_cover: string;
  foto_hotel: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  hotel_id: string;
  nama_kamar: string;
  tipe_tempat_tidur: string;
  fasilitas_kamar: string[];
  harga_default: number;
  kapasitas: number;
  jumlah_kamar: number;
  foto_kamar: string[];
  createdAt: string;
  updatedAt: string;
  hotel?: {
    nama_hotel: string;
  };
  rateplans?: RatePlan[];
}

export interface Availability {
  _id: string;
  room_id: string;
  tanggal: string;
  jumlah_kamar_tersedia: number;
  harga_per_malam: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  hotel_id: string;
  room_id: string;
  user_id?: string;
  nama_tamu: string;
  check_in: string;
  check_out: string;
  jumlah_tamu: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  catatan?: string;
  createdAt: string;
  updatedAt: string;
  room?: Room;
}

export interface Promotion {
  _id: string;
  hotel_id: string;
  nama_promo: string;
  deskripsi: string;
  periode_mulai: string;
  periode_selesai: string;
  diskon_persen: number;
  tipe_promo: 'early_bird' | 'last_minute' | 'seasonal' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  hotel_id: string;
  reservation_id: string;
  jumlah_total: number;
  status_pembayaran: 'pending' | 'paid' | 'cancelled' | 'refunded';
  tanggal_pembayaran?: string;
  metode_pembayaran?: string;
  bukti_pembayaran?: string;
  createdAt: string;
  updatedAt: string;
  reservation?: Reservation;
}

export interface BankAccount {
  _id: string;
  hotel_id: string;
  nama_bank: string;
  nomor_rekening: string;
  nama_rekening: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  occupancyRate: number;
  monthlyRevenue: number;
  recentReservations: Reservation[];
  monthlyStats: {
    month: string;
    revenue: number;
    occupancy: number;
  }[];
}

export interface RatePlan {
  _id: string;
  room_id: string;
  nama_rateplan: string;
  deskripsi?: string;
  harga_dasar: number;
  periode_mulai: string;
  periode_selesai: string;
  hari_dalam_minggu: {
    senin: boolean;
    selasa: boolean;
    rabu: boolean;
    kamis: boolean;
    jumat: boolean;
    sabtu: boolean;
    minggu: boolean;
  };
  kebijakan_pembatalan: 'non_refundable' | 'free_cancellation' | 'partial_refund';
  termasuk_sarapan: boolean;
  minimum_malam: number;
  maksimum_malam: number;
  status: 'active' | 'inactive';
  prioritas: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}
