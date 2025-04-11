import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Hotel, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

const mockHotels = [
  {
    _id: '1',
    nama_hotel: 'Grand Mercure Jakarta',
    alamat: 'Jl. Hayam Wuruk No. 65, Jakarta Pusat',
    kota: 'Jakarta',
    deskripsi: 'Hotel bintang 5 dengan fasilitas lengkap di pusat kota Jakarta',
    fasilitas: ['Kolam Renang', 'Spa', 'Restoran', 'Wifi', 'Parkir'],
    foto_cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2023-01-15T08:30:00.000Z',
    updatedAt: '2023-05-20T14:45:00.000Z'
  },
  {
    _id: '2',
    nama_hotel: 'Aston Bandung Hotel & Residence',
    alamat: 'Jl. Braga No. 99-101, Bandung',
    kota: 'Bandung',
    deskripsi: 'Hotel modern dengan pemandangan kota Bandung yang indah',
    fasilitas: ['Kolam Renang', 'Gym', 'Restoran', 'Wifi', 'Parkir'],
    foto_cover: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2023-02-10T10:15:00.000Z',
    updatedAt: '2023-06-05T09:30:00.000Z'
  },
  {
    _id: '3',
    nama_hotel: 'Swiss-Belhotel Yogyakarta',
    alamat: 'Jl. Malioboro No. 128, Yogyakarta',
    kota: 'Yogyakarta',
    deskripsi: 'Hotel nyaman dekat dengan pusat wisata Malioboro',
    fasilitas: ['Kolam Renang', 'Spa', 'Restoran', 'Wifi', 'Parkir'],
    foto_cover: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2023-03-05T11:45:00.000Z',
    updatedAt: '2023-06-15T16:20:00.000Z'
  }
];

export default function HotelList() {
  const [hotels, setHotels] = useState(mockHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredHotels = hotels.filter(hotel => 
    hotel.nama_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.kota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setHotels(mockHotels);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus hotel ini?')) {
      setHotels(hotels.filter(hotel => hotel._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Hotel</h2>
          <p className="text-muted-foreground">
            Kelola properti hotel Anda
          </p>
        </div>
        <Link to="/hotels/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Hotel
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari hotel berdasarkan nama atau kota..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Hotel List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data hotel...</p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Hotel className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Tidak ada hotel yang ditemukan. Tambahkan hotel baru atau ubah filter pencarian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map(hotel => (
            <Card key={hotel._id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={hotel.foto_cover} 
                  alt={hotel.nama_hotel}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{hotel.nama_hotel}</CardTitle>
                <CardDescription>{hotel.kota}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{hotel.alamat}</p>
                  <p className="text-sm line-clamp-2">{hotel.deskripsi}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.fasilitas.slice(0, 3).map((fasilitas, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {fasilitas}
                      </span>
                    ))}
                    {hotel.fasilitas.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        +{hotel.fasilitas.length - 3}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Terakhir diperbarui: {formatDate(hotel.updatedAt)}
                  </p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Link to={`/hotels/edit/${hotel._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(hotel._id)}
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
