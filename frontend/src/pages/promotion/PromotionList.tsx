import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  Tag, 
  Search, 
  Plus, 
  Edit, 
  Trash2
} from 'lucide-react';
import { formatRupiah, formatDate } from '../../lib/utils';

interface Promotion {
  _id: string;
  hotel: {
    _id: string;
    nama_hotel: string;
  };
  nama_promo: string;
  deskripsi: string;
  tipe_promo: 'discount_percent' | 'discount_value' | 'early_bird' | 'last_minute';
  nilai_diskon: number;
  kode_promo: string;
  periode_mulai: string;
  periode_selesai: string;
  room_ids: string[];
  rooms?: {
    _id: string;
    nama_kamar: string;
  }[];
  min_length_of_stay?: number;
  min_days_before_checkin?: number;
  max_days_before_checkin?: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  updatedAt: string;
}

const mockPromotions: Promotion[] = [
  {
    _id: '1',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    nama_promo: 'Diskon Awal Tahun 20%',
    deskripsi: 'Dapatkan diskon 20% untuk pemesanan kamar Deluxe dan Superior',
    tipe_promo: 'discount_percent',
    nilai_diskon: 20,
    kode_promo: 'NEWYEAR20',
    periode_mulai: '2025-01-01T00:00:00.000Z',
    periode_selesai: '2025-01-31T23:59:59.000Z',
    room_ids: ['1', '2'],
    rooms: [
      { _id: '1', nama_kamar: 'Deluxe Room' },
      { _id: '2', nama_kamar: 'Superior Room' }
    ],
    status: 'expired',
    createdAt: '2024-12-15T08:30:00.000Z',
    updatedAt: '2024-12-15T08:30:00.000Z'
  },
  {
    _id: '2',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    nama_promo: 'Early Bird 15%',
    deskripsi: 'Diskon 15% untuk pemesanan minimal 30 hari sebelum check-in',
    tipe_promo: 'early_bird',
    nilai_diskon: 15,
    kode_promo: 'EARLY15',
    periode_mulai: '2025-04-01T00:00:00.000Z',
    periode_selesai: '2025-06-30T23:59:59.000Z',
    room_ids: ['1', '2', '3'],
    min_days_before_checkin: 30,
    status: 'active',
    createdAt: '2025-03-15T10:15:00.000Z',
    updatedAt: '2025-03-15T10:15:00.000Z'
  },
  {
    _id: '3',
    hotel: {
      _id: '2',
      nama_hotel: 'Aston Bandung Hotel & Residence'
    },
    nama_promo: 'Last Minute Deal 25%',
    deskripsi: 'Diskon 25% untuk pemesanan maksimal 3 hari sebelum check-in',
    tipe_promo: 'last_minute',
    nilai_diskon: 25,
    kode_promo: 'LAST25',
    periode_mulai: '2025-04-01T00:00:00.000Z',
    periode_selesai: '2025-05-31T23:59:59.000Z',
    room_ids: ['3'],
    rooms: [
      { _id: '3', nama_kamar: 'Executive Suite' }
    ],
    max_days_before_checkin: 3,
    status: 'active',
    createdAt: '2025-03-20T11:45:00.000Z',
    updatedAt: '2025-03-20T11:45:00.000Z'
  },
  {
    _id: '4',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    nama_promo: 'Diskon Rp 200.000',
    deskripsi: 'Potongan harga Rp 200.000 untuk pemesanan minimal 2 malam',
    tipe_promo: 'discount_value',
    nilai_diskon: 200000,
    kode_promo: 'STAY200',
    periode_mulai: '2025-04-15T00:00:00.000Z',
    periode_selesai: '2025-05-15T23:59:59.000Z',
    room_ids: ['1'],
    rooms: [
      { _id: '1', nama_kamar: 'Deluxe Room' }
    ],
    min_length_of_stay: 2,
    status: 'inactive',
    createdAt: '2025-04-01T09:30:00.000Z',
    updatedAt: '2025-04-01T09:30:00.000Z'
  }
];

export default function PromotionList() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = 
      promotion.nama_promo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.hotel.nama_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.kode_promo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPromotions(mockPromotions);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus promosi ini?')) {
      setPromotions(promotions.filter(promo => promo._id !== id));
    }
  };

  const getStatusBadgeClass = (status: Promotion['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Promotion['status']) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Tidak Aktif';
      case 'expired':
        return 'Kadaluarsa';
      default:
        return status;
    }
  };

  const getPromoTypeText = (type: Promotion['tipe_promo']) => {
    switch (type) {
      case 'discount_percent':
        return 'Diskon Persentase';
      case 'discount_value':
        return 'Diskon Nominal';
      case 'early_bird':
        return 'Early Bird';
      case 'last_minute':
        return 'Last Minute Deal';
      default:
        return type;
    }
  };

  const getPromoValueText = (promotion: Promotion) => {
    if (promotion.tipe_promo === 'discount_percent' || promotion.tipe_promo === 'early_bird' || promotion.tipe_promo === 'last_minute') {
      return `${promotion.nilai_diskon}%`;
    } else if (promotion.tipe_promo === 'discount_value') {
      return formatRupiah(promotion.nilai_diskon);
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Promosi</h2>
          <p className="text-muted-foreground">
            Kelola promosi dan penawaran spesial untuk kamar hotel Anda
          </p>
        </div>
        <Link to="/promotions/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Promosi
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama promosi, hotel, atau kode promo..."
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
            variant={statusFilter === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('active')}
          >
            Aktif
          </Button>
          <Button 
            variant={statusFilter === 'inactive' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('inactive')}
          >
            Tidak Aktif
          </Button>
          <Button 
            variant={statusFilter === 'expired' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('expired')}
          >
            Kadaluarsa
          </Button>
        </div>
      </div>

      {/* Promotion List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data promosi...</p>
        </div>
      ) : filteredPromotions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Tag className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Tidak ada promosi yang ditemukan. Tambahkan promosi baru atau ubah filter pencarian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPromotions.map(promotion => (
            <Card key={promotion._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{promotion.nama_promo}</CardTitle>
                    <CardDescription>{promotion.hotel.nama_hotel}</CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeClass(promotion.status)}`}>
                    {getStatusText(promotion.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{promotion.deskripsi}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Tipe Promosi</p>
                    <p className="text-sm">{getPromoTypeText(promotion.tipe_promo)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nilai Diskon</p>
                    <p className="text-sm font-semibold">{getPromoValueText(promotion)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kode Promo</p>
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">{promotion.kode_promo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Periode</p>
                    <p className="text-sm">{formatDate(promotion.periode_mulai)} - {formatDate(promotion.periode_selesai)}</p>
                  </div>
                </div>
                
                {/* Conditional fields based on promo type */}
                {promotion.min_length_of_stay && (
                  <div>
                    <p className="text-sm font-medium">Minimal Lama Menginap</p>
                    <p className="text-sm">{promotion.min_length_of_stay} malam</p>
                  </div>
                )}
                
                {promotion.min_days_before_checkin && (
                  <div>
                    <p className="text-sm font-medium">Minimal Hari Sebelum Check-in</p>
                    <p className="text-sm">{promotion.min_days_before_checkin} hari</p>
                  </div>
                )}
                
                {promotion.max_days_before_checkin && (
                  <div>
                    <p className="text-sm font-medium">Maksimal Hari Sebelum Check-in</p>
                    <p className="text-sm">{promotion.max_days_before_checkin} hari</p>
                  </div>
                )}
                
                {/* Rooms */}
                <div>
                  <p className="text-sm font-medium">Berlaku untuk Kamar</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {promotion.rooms ? (
                      promotion.rooms.map(room => (
                        <span 
                          key={room._id} 
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {room.nama_kamar}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Semua kamar</span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Link to={`/promotions/edit/${promotion._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(promotion._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
