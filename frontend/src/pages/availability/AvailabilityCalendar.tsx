import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Calendar, Upload, Save } from 'lucide-react';
import { formatRupiah } from '../../lib/utils';

interface Room {
  _id: string;
  nama_kamar: string;
  hotel: { nama_hotel: string };
  harga_default: number;
}

interface DateObject {
  date: Date;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isWeekend: boolean;
}

interface AvailabilityData {
  [roomId: string]: {
    [dateStr: string]: {
      available: number;
      price: number;
    }
  }
}

const mockRooms: Room[] = [
  {
    _id: '1',
    nama_kamar: 'Deluxe Room',
    hotel: { nama_hotel: 'Grand Mercure Jakarta' },
    harga_default: 850000
  },
  {
    _id: '2',
    nama_kamar: 'Superior Room',
    hotel: { nama_hotel: 'Grand Mercure Jakarta' },
    harga_default: 650000
  },
  {
    _id: '3',
    nama_kamar: 'Executive Suite',
    hotel: { nama_hotel: 'Aston Bandung Hotel & Residence' },
    harga_default: 1250000
  }
];

const generateDates = (): DateObject[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dates: DateObject[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    dates.push({
      date,
      dayName: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      dayNumber: i,
      monthName: date.toLocaleDateString('id-ID', { month: 'short' }),
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
  
  return dates;
};

const generateAvailabilityData = (): AvailabilityData => {
  const dates = generateDates();
  const rooms = mockRooms;
  
  const availabilityData: AvailabilityData = {};
  
  rooms.forEach(room => {
    availabilityData[room._id] = {};
    
    dates.forEach(dateObj => {
      const dateStr = dateObj.date.toISOString().split('T')[0];
      const isWeekend = dateObj.isWeekend;
      
      const available = Math.floor(Math.random() * 11);
      
      const price = isWeekend 
        ? Math.round(room.harga_default * 1.2) 
        : room.harga_default;
      
      availabilityData[room._id][dateStr] = {
        available,
        price
      };
    });
  });
  
  return availabilityData;
};

export default function AvailabilityCalendar() {
  const dates = generateDates();
  const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]._id);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>(generateAvailabilityData());
  const [editMode, setEditMode] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [bulkAvailable, setBulkAvailable] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoom(e.target.value);
  };

  const handleAvailabilityChange = (dateStr: string, field: 'available' | 'price', value: number) => {
    setAvailabilityData(prev => ({
      ...prev,
      [selectedRoom]: {
        ...prev[selectedRoom],
        [dateStr]: {
          ...prev[selectedRoom][dateStr],
          [field]: value
        }
      }
    }));
  };

  const handleBulkUpdate = () => {
    if (!bulkStartDate || !bulkEndDate) {
      alert('Silakan pilih tanggal mulai dan tanggal selesai');
      return;
    }

    const start = new Date(bulkStartDate);
    const end = new Date(bulkEndDate);

    if (start > end) {
      alert('Tanggal mulai harus lebih awal dari tanggal selesai');
      return;
    }

    const newAvailabilityData = { ...availabilityData };
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (newAvailabilityData[selectedRoom][dateStr]) {
        if (bulkAvailable) {
          newAvailabilityData[selectedRoom][dateStr].available = parseInt(bulkAvailable);
        }
        
        if (bulkPrice) {
          newAvailabilityData[selectedRoom][dateStr].price = parseInt(bulkPrice);
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setAvailabilityData(newAvailabilityData);
    setBulkEditMode(false);
    setBulkStartDate('');
    setBulkEndDate('');
    setBulkAvailable('');
    setBulkPrice('');
  };

  const handleSaveChanges = () => {
    alert('Perubahan ketersediaan kamar berhasil disimpan');
    setEditMode(false);
  };

  const selectedRoomData = mockRooms.find(room => room._id === selectedRoom);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kalender Ketersediaan</h2>
          <p className="text-muted-foreground">
            Kelola ketersediaan dan harga kamar per tanggal
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setBulkEditMode(!bulkEditMode)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Update Massal
          </Button>
          <Button 
            variant="outline"
            onClick={() => setEditMode(!editMode)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
          {editMode && (
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          )}
        </div>
      </div>

      {/* Room Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Kamar</CardTitle>
          <CardDescription>
            Pilih tipe kamar untuk melihat dan mengatur ketersediaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room-select">Tipe Kamar</Label>
              <select
                id="room-select"
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedRoom}
                onChange={handleRoomChange}
              >
                {mockRooms.map(room => (
                  <option key={room._id} value={room._id}>
                    {room.nama_kamar} - {room.hotel.nama_hotel}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Harga Default</Label>
              <div className="flex h-9 items-center px-3 rounded-md border border-zinc-200 bg-zinc-100">
                {selectedRoomData ? formatRupiah(selectedRoomData.harga_default) : '-'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hotel</Label>
              <div className="flex h-9 items-center px-3 rounded-md border border-zinc-200 bg-zinc-100">
                {selectedRoomData ? selectedRoomData.hotel.nama_hotel : '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Edit Form */}
      {bulkEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Update Ketersediaan Massal</CardTitle>
            <CardDescription>
              Update ketersediaan dan harga untuk rentang tanggal tertentu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-start-date">Tanggal Mulai</Label>
                <Input
                  id="bulk-start-date"
                  type="date"
                  value={bulkStartDate}
                  onChange={(e) => setBulkStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-end-date">Tanggal Selesai</Label>
                <Input
                  id="bulk-end-date"
                  type="date"
                  value={bulkEndDate}
                  onChange={(e) => setBulkEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-available">Jumlah Kamar Tersedia</Label>
                <Input
                  id="bulk-available"
                  type="number"
                  min="0"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  value={bulkAvailable}
                  onChange={(e) => setBulkAvailable(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-price">Harga Per Malam (Rp)</Label>
                <Input
                  id="bulk-price"
                  type="number"
                  min="0"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setBulkEditMode(false)}>
                Batal
              </Button>
              <Button onClick={handleBulkUpdate}>
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Kalender Ketersediaan {selectedRoomData?.nama_kamar}</CardTitle>
          <CardDescription>
            Klik pada sel untuk mengubah ketersediaan atau harga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-zinc-100 text-left">Tanggal</th>
                  <th className="border p-2 bg-zinc-100 text-left">Hari</th>
                  <th className="border p-2 bg-zinc-100 text-left">Kamar Tersedia</th>
                  <th className="border p-2 bg-zinc-100 text-left">Harga Per Malam</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((dateObj) => {
                  const dateStr = dateObj.date.toISOString().split('T')[0];
                  const dayData = availabilityData[selectedRoom][dateStr];
                  
                  return (
                    <tr key={dateStr} className={dateObj.isWeekend ? 'bg-blue-50' : ''}>
                      <td className="border p-2">
                        {dateObj.dayNumber} {dateObj.monthName}
                      </td>
                      <td className="border p-2">
                        {dateObj.dayName}
                      </td>
                      <td className="border p-2">
                        {editMode ? (
                          <Input
                            type="number"
                            min="0"
                            value={dayData.available}
                            onChange={(e) => handleAvailabilityChange(dateStr, 'available', parseInt(e.target.value))}
                            className="h-8 w-20"
                          />
                        ) : (
                          <span className={dayData.available === 0 ? 'text-red-500 font-bold' : ''}>
                            {dayData.available}
                          </span>
                        )}
                      </td>
                      <td className="border p-2">
                        {editMode ? (
                          <Input
                            type="number"
                            min="0"
                            value={dayData.price}
                            onChange={(e) => handleAvailabilityChange(dateStr, 'price', parseInt(e.target.value))}
                            className="h-8 w-32"
                          />
                        ) : (
                          formatRupiah(dayData.price)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
