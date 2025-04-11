import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Bed, Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import { formatRupiah } from '../../lib/utils';

const mockRooms = [
  {
    _id: '1',
    hotel_id: '1',
    nama_kamar: 'Deluxe Room',
    tipe_tempat_tidur: 'King Size',
    fasilitas_kamar: ['AC', 'TV', 'Minibar', 'Wifi', 'Kamar Mandi Dalam'],
    harga_default: 850000,
    foto_kamar: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    hotel: {
      nama_hotel: 'Grand Mercure Jakarta'
    },
    stok_tersedia: 5,
    createdAt: '2023-01-20T08:30:00.000Z',
    updatedAt: '2023-05-25T14:45:00.000Z'
  },
  {
    _id: '2',
    hotel_id: '1',
    nama_kamar: 'Superior Room',
    tipe_tempat_tidur: 'Twin Bed',
    fasilitas_kamar: ['AC', 'TV', 'Wifi', 'Kamar Mandi Dalam'],
    harga_default: 650000,
    foto_kamar: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
    ],
    hotel: {
      nama_hotel: 'Grand Mercure Jakarta'
    },
    stok_tersedia: 8,
    createdAt: '2023-01-25T10:15:00.000Z',
    updatedAt: '2023-06-10T09:30:00.000Z'
  },
  {
    _id: '3',
    hotel_id: '2',
    nama_kamar: 'Executive Suite',
    tipe_tempat_tidur: 'King Size',
    fasilitas_kamar: ['AC', 'TV', 'Minibar', 'Wifi', 'Kamar Mandi Dalam', 'Bathtub', 'Ruang Tamu'],
    harga_default: 1250000,
    foto_kamar: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    hotel: {
      nama_hotel: 'Aston Bandung Hotel & Residence'
    },
    stok_tersedia: 3,
    createdAt: '2023-02-05T11:45:00.000Z',
    updatedAt: '2023-06-15T16:20:00.000Z'
  }
];

export default function RoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredRooms = rooms.filter(room => 
    room.nama_kamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.hotel.nama_hotel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
      setRooms(rooms.filter(room => room._id !== id));
    }
  };

  const handleManageAvailability = (roomId: string) => {
    navigate(`/availability/${roomId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Kamar</h2>
          <p className="text-muted-foreground">
            Kelola tipe kamar, harga, dan ketersediaan
          </p>
        </div>
        <Link to="/rooms/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kamar
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari kamar berdasarkan nama atau hotel..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Room List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data kamar...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Bed className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Tidak ada kamar yang ditemukan. Tambahkan kamar baru atau ubah filter pencarian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map(room => (
            <Card key={room._id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={room.foto_kamar[0]} 
                  alt={room.nama_kamar}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{room.nama_kamar}</CardTitle>
                <CardDescription>{room.hotel.nama_hotel}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tipe Tempat Tidur:</span>
                    <span className="text-sm">{room.tipe_tempat_tidur}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Harga Default:</span>
                    <span className="text-sm font-semibold">{formatRupiah(room.harga_default)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Stok Tersedia:</span>
                    <span className="text-sm">{room.stok_tersedia} kamar</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.fasilitas_kamar.slice(0, 3).map((fasilitas, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {fasilitas}
                      </span>
                    ))}
                    {room.fasilitas_kamar.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        +{room.fasilitas_kamar.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handleManageAvailability(room._id)}
                  >
                    <Calendar className="h-4 w-4 mr-1" /> Kelola Ketersediaan
                  </Button>
                  <div className="flex justify-between space-x-2">
                    <Link to={`/rooms/edit/${room._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(room._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
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
