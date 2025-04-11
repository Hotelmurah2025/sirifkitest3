import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  User, 
  CreditCard 
} from 'lucide-react';
import { formatRupiah, formatDate } from '../../lib/utils';

interface Reservation {
  _id: string;
  hotel: {
    _id: string;
    nama_hotel: string;
  };
  room: {
    _id: string;
    nama_kamar: string;
  };
  nama_tamu: string;
  email_tamu: string;
  telepon_tamu: string;
  check_in: string;
  check_out: string;
  jumlah_tamu: number;
  jumlah_kamar: number;
  total_harga: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  catatan: string;
  metode_pembayaran: string;
  status_pembayaran: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
}

const mockReservations: Reservation[] = [
  {
    _id: '1',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    room: {
      _id: '1',
      nama_kamar: 'Deluxe Room'
    },
    nama_tamu: 'Budi Santoso',
    email_tamu: 'budi.santoso@example.com',
    telepon_tamu: '081234567890',
    check_in: '2025-04-15T14:00:00.000Z',
    check_out: '2025-04-17T12:00:00.000Z',
    jumlah_tamu: 2,
    jumlah_kamar: 1,
    total_harga: 1700000,
    status: 'confirmed',
    catatan: 'Kamar dengan pemandangan kota',
    metode_pembayaran: 'transfer_bank',
    status_pembayaran: 'paid',
    createdAt: '2025-04-01T08:30:00.000Z'
  },
  {
    _id: '2',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    room: {
      _id: '2',
      nama_kamar: 'Superior Room'
    },
    nama_tamu: 'Dewi Lestari',
    email_tamu: 'dewi.lestari@example.com',
    telepon_tamu: '081298765432',
    check_in: '2025-04-20T14:00:00.000Z',
    check_out: '2025-04-22T12:00:00.000Z',
    jumlah_tamu: 1,
    jumlah_kamar: 1,
    total_harga: 1300000,
    status: 'pending',
    catatan: '',
    metode_pembayaran: 'credit_card',
    status_pembayaran: 'unpaid',
    createdAt: '2025-04-05T10:15:00.000Z'
  },
  {
    _id: '3',
    hotel: {
      _id: '2',
      nama_hotel: 'Aston Bandung Hotel & Residence'
    },
    room: {
      _id: '3',
      nama_kamar: 'Executive Suite'
    },
    nama_tamu: 'Ahmad Hidayat',
    email_tamu: 'ahmad.hidayat@example.com',
    telepon_tamu: '081387654321',
    check_in: '2025-04-10T14:00:00.000Z',
    check_out: '2025-04-13T12:00:00.000Z',
    jumlah_tamu: 2,
    jumlah_kamar: 1,
    total_harga: 3750000,
    status: 'checked_in',
    catatan: 'Minta tambahan bantal',
    metode_pembayaran: 'transfer_bank',
    status_pembayaran: 'paid',
    createdAt: '2025-03-25T11:45:00.000Z'
  },
  {
    _id: '4',
    hotel: {
      _id: '3',
      nama_hotel: 'Swiss-Belhotel Yogyakarta'
    },
    room: {
      _id: '3',
      nama_kamar: 'Deluxe Room'
    },
    nama_tamu: 'Siti Rahayu',
    email_tamu: 'siti.rahayu@example.com',
    telepon_tamu: '081512345678',
    check_in: '2025-04-05T14:00:00.000Z',
    check_out: '2025-04-07T12:00:00.000Z',
    jumlah_tamu: 3,
    jumlah_kamar: 1,
    total_harga: 1600000,
    status: 'checked_out',
    catatan: '',
    metode_pembayaran: 'credit_card',
    status_pembayaran: 'paid',
    createdAt: '2025-03-20T09:30:00.000Z'
  },
  {
    _id: '5',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    room: {
      _id: '1',
      nama_kamar: 'Deluxe Room'
    },
    nama_tamu: 'Rudi Hartono',
    email_tamu: 'rudi.hartono@example.com',
    telepon_tamu: '081623456789',
    check_in: '2025-04-25T14:00:00.000Z',
    check_out: '2025-04-27T12:00:00.000Z',
    jumlah_tamu: 2,
    jumlah_kamar: 1,
    total_harga: 1700000,
    status: 'cancelled',
    catatan: 'Pembatalan karena perubahan jadwal',
    metode_pembayaran: 'transfer_bank',
    status_pembayaran: 'refunded',
    createdAt: '2025-04-02T14:20:00.000Z'
  }
];

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.nama_tamu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.hotel.nama_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.room.nama_kamar.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const getStatusBadgeClass = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_in':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'checked_out':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Terkonfirmasi';
      case 'checked_in':
        return 'Check-In';
      case 'checked_out':
        return 'Check-Out';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getPaymentStatusBadgeClass = (status: Reservation['status_pembayaran']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusText = (status: Reservation['status_pembayaran']) => {
    switch (status) {
      case 'paid':
        return 'Lunas';
      case 'unpaid':
        return 'Belum Bayar';
      case 'refunded':
        return 'Dikembalikan';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'transfer_bank':
        return 'Transfer Bank';
      case 'credit_card':
        return 'Kartu Kredit';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Reservasi</h2>
          <p className="text-muted-foreground">
            Kelola reservasi tamu hotel Anda
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama tamu, hotel, atau tipe kamar..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('all')}
          >
            Semua
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('pending')}
          >
            <Clock className="mr-1 h-4 w-4" />
            Menunggu
          </Button>
          <Button 
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('confirmed')}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Terkonfirmasi
          </Button>
          <Button 
            variant={statusFilter === 'checked_in' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('checked_in')}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Check-In
          </Button>
          <Button 
            variant={statusFilter === 'checked_out' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('checked_out')}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Check-Out
          </Button>
          <Button 
            variant={statusFilter === 'cancelled' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('cancelled')}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Dibatalkan
          </Button>
        </div>
      </div>

      {/* Reservation List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data reservasi...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Tidak ada reservasi yang ditemukan. Ubah filter pencarian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(reservation => (
            <Card key={reservation._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                  {/* Reservation Info */}
                  <div className="p-4 md:col-span-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{reservation.nama_tamu}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.email_tamu} • {reservation.telepon_tamu}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeClass(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium">Hotel</p>
                        <p className="text-sm">{reservation.hotel.nama_hotel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tipe Kamar</p>
                        <p className="text-sm">{reservation.room.nama_kamar}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Check-in</p>
                        <p className="text-sm">{formatDate(reservation.check_in)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Check-out</p>
                        <p className="text-sm">{formatDate(reservation.check_out)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Jumlah Tamu</p>
                        <p className="text-sm">{reservation.jumlah_tamu} orang</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Jumlah Kamar</p>
                        <p className="text-sm">{reservation.jumlah_kamar} kamar</p>
                      </div>
                    </div>
                    {reservation.catatan && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Catatan</p>
                        <p className="text-sm">{reservation.catatan}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Info */}
                  <div className="p-4">
                    <h4 className="font-medium mb-2">Informasi Pembayaran</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Total Harga</p>
                        <p className="text-lg font-semibold">{formatRupiah(reservation.total_harga)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Metode Pembayaran</p>
                        <p className="text-sm">{getPaymentMethodText(reservation.metode_pembayaran)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status Pembayaran</p>
                        <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium border mt-1 ${getPaymentStatusBadgeClass(reservation.status_pembayaran)}`}>
                          {getPaymentStatusText(reservation.status_pembayaran)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tanggal Pemesanan</p>
                        <p className="text-sm">{formatDate(reservation.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 flex flex-col justify-between">
                    <h4 className="font-medium mb-2">Tindakan</h4>
                    <div className="space-y-2">
                      <Link to={`/reservations/${reservation._id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Detail Reservasi
                        </Button>
                      </Link>
                      
                      {reservation.status === 'pending' && (
                        <Button variant="default" size="sm" className="w-full">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Konfirmasi
                        </Button>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <Button variant="default" size="sm" className="w-full">
                          <User className="mr-2 h-4 w-4" />
                          Check-In
                        </Button>
                      )}
                      
                      {reservation.status === 'checked_in' && (
                        <Button variant="default" size="sm" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" />
                          Check-Out
                        </Button>
                      )}
                      
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <Button variant="outline" size="sm" className="w-full text-red-500 hover:text-red-700">
                          <XCircle className="mr-2 h-4 w-4" />
                          Batalkan
                        </Button>
                      )}
                      
                      {reservation.status_pembayaran === 'unpaid' && (
                        <Button variant="outline" size="sm" className="w-full">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Catat Pembayaran
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
