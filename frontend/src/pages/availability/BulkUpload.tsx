import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, Upload, Download, FileSpreadsheet, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { hotelService } from '../../services/hotel.service';
import { roomService } from '../../services/room.service';
import { availabilityService } from '../../services/availability.service';

export default function BulkUpload() {
  const navigate = useNavigate();
  
  const [hotels, setHotels] = useState<{_id: string, nama_hotel: string}[]>([]);
  const [rooms, setRooms] = useState<{_id: string, hotel_id: string, nama_kamar: string}[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await hotelService.getAll();
        if (response.success && response.data) {
          setHotels(response.data);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, []);
  
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedHotel) {
        setRooms([]);
        return;
      }
      
      try {
        setLoading(true);
        const response = await roomService.getAll(selectedHotel);
        if (response.success && response.data) {
          setRooms(response.data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, [selectedHotel]);
  
  const filteredRooms = rooms;
  
  const handleHotelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hotelId = e.target.value;
    setSelectedHotel(hotelId);
    setSelectedRoom(''); // Reset room selection when hotel changes
  };
  
  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoom(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'csv' && fileExt !== 'xlsx' && fileExt !== 'xls') {
        setErrorMessage('Format file tidak valid. Silakan upload file CSV atau Excel (.xlsx, .xls)');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file terlalu besar. Maksimal 5MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setErrorMessage(null);
    }
  };
  
  const handleDownloadTemplate = () => {
    alert('Template CSV/Excel akan diunduh');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHotel) {
      setErrorMessage('Silakan pilih hotel');
      return;
    }
    
    if (!selectedRoom) {
      setErrorMessage('Silakan pilih tipe kamar');
      return;
    }
    
    if (!file) {
      setErrorMessage('Silakan upload file CSV atau Excel');
      return;
    }
    
    setUploadStatus('uploading');
    setErrorMessage(null);
    
    try {
      const response = await availabilityService.bulkUpload(selectedRoom, file);
      
      if (response.success) {
        setUploadStatus('success');
        setSuccessMessage('Data ketersediaan kamar berhasil diupload');
        
        setTimeout(() => {
          navigate('/availability');
        }, 2000);
      } else {
        throw new Error(response.message || 'Gagal mengupload data ketersediaan kamar');
      }
    } catch (err) {
      const error = err as Error;
      setUploadStatus('error');
      setErrorMessage(error.message || 'Terjadi kesalahan saat mengupload data');
      console.error('Error uploading availability data:', err);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Upload Ketersediaan Kamar
          </h2>
          <p className="text-muted-foreground">
            Upload data ketersediaan dan harga kamar secara massal menggunakan file CSV atau Excel
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/availability')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-100 border-green-400 text-green-700">
          <CheckCircle className="h-5 w-5 mr-2" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5 mr-2" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {loading && (
        <div className="flex items-center justify-center h-20">
          <Loader className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Memuat data...</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Upload file CSV atau Excel yang berisi data ketersediaan dan harga kamar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel_id">Hotel <span className="text-red-500">*</span></Label>
                  <select
                    id="hotel_id"
                    value={selectedHotel}
                    onChange={handleHotelChange}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Pilih Hotel</option>
                    {hotels.map((hotel: {_id: string, nama_hotel: string}) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.nama_hotel}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="room_id">Tipe Kamar <span className="text-red-500">*</span></Label>
                  <select
                    id="room_id"
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!selectedHotel}
                    required
                  >
                    <option value="">Pilih Tipe Kamar</option>
                    {filteredRooms.map(room => (
                      <option key={room._id} value={room._id}>
                        {room.nama_kamar}
                      </option>
                    ))}
                  </select>
                  {!selectedHotel && (
                    <p className="text-xs text-muted-foreground">
                      Pilih hotel terlebih dahulu
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">File CSV/Excel <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleDownloadTemplate}
                    >
                      <Download className="mr-2 h-4 w-4" /> Template
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format file: CSV atau Excel (.xlsx, .xls). Ukuran maks: 5MB.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={uploadStatus === 'uploading' || !file}
                    className="w-full"
                  >
                    {uploadStatus === 'uploading' ? (
                      <>Mengupload...</>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Upload Data
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Panduan Upload</CardTitle>
              <CardDescription>
                Petunjuk untuk mengisi file template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Format Kolom</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>tanggal</strong>: Format YYYY-MM-DD (contoh: 2023-12-31)</li>
                  <li><strong>jumlah_kamar</strong>: Jumlah kamar tersedia pada tanggal tersebut</li>
                  <li><strong>harga</strong>: Harga kamar per malam (dalam Rupiah)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Contoh Data</h3>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  tanggal,jumlah_kamar,harga<br/>
                  2023-12-01,5,850000<br/>
                  2023-12-02,5,850000<br/>
                  2023-12-03,3,950000<br/>
                  ...
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Tips</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Pastikan format tanggal sesuai (YYYY-MM-DD)</li>
                  <li>Jangan gunakan tanda titik atau koma pada harga</li>
                  <li>Jika tanggal sudah ada, data akan diperbarui</li>
                  <li>Maksimal 365 hari (1 tahun) per upload</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDownloadTemplate}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
