import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  ArrowLeft, 
  Trash2,
  Plus,
  Minus,
  DollarSign,
  Loader
} from 'lucide-react';
import { formatRupiah } from '../../lib/utils';
import { roomService } from '../../services/room.service';
import { hotelService } from '../../services/hotel.service';
import { rateplanService } from '../../services/rateplan.service';
import RatePlanForm from '../../components/room/RatePlanForm';
import { RatePlan } from '../../types';



const bedTypes = [
  'Single Bed',
  'Twin Bed',
  'Double Bed',
  'Queen Size',
  'King Size',
  'Triple Bed',
  'Quad Bed'
];

const availableFacilities = [
  'AC',
  'TV',
  'Minibar',
  'Wifi',
  'Kamar Mandi Dalam',
  'Bathtub',
  'Shower',
  'Balkon',
  'Pemandangan Kota',
  'Pemandangan Laut',
  'Pemandangan Gunung',
  'Dapur',
  'Ruang Tamu',
  'Meja Kerja',
  'Brankas',
  'Pengering Rambut',
  'Setrika',
  'Kulkas',
  'Mesin Kopi',
  'Akses Difabel'
];


export default function AddEditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [rateplans, setRateplans] = useState<RatePlan[]>([]);
  const [loadingRateplans, setLoadingRateplans] = useState(false);
  const [showAddRatePlan, setShowAddRatePlan] = useState(false);
  const [editingRatePlan, setEditingRatePlan] = useState<RatePlan | null>(null);
  
  const [formData, setFormData] = useState({
    hotel_id: '',
    nama_kamar: '',
    tipe_tempat_tidur: '',
    fasilitas_kamar: [] as string[],
    harga_default: 0,
    kapasitas: 2,
    jumlah_kamar: 1,
    foto_kamar: [] as string[]
  });
  
  const [newFacility, setNewFacility] = useState('');
  
  const [roomImagesPreview, setRoomImagesPreview] = useState<string[]>([]);
  
  const [hotels, setHotels] = useState<{_id: string, nama_hotel: string}[]>([]);
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelService.getAll();
        if (response.success && response.data) {
          setHotels(response.data);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    
    fetchHotels();
    
    if (isEditMode && id) {
      setLoading(true);
      setErrorMessage(null);
      
      const fetchRoomData = async () => {
        try {
          const response = await roomService.getById(id);
          
          if (response.success && response.data) {
            const roomData = response.data;
            
            setFormData({
              hotel_id: roomData.hotel_id,
              nama_kamar: roomData.nama_kamar,
              tipe_tempat_tidur: roomData.tipe_tempat_tidur,
              fasilitas_kamar: [...roomData.fasilitas_kamar],
              harga_default: roomData.harga_default,
              kapasitas: roomData.kapasitas || 2,
              jumlah_kamar: roomData.jumlah_kamar || 1,
              foto_kamar: []
            });
            
            console.log('Fetched room data:', roomData); // Tambahkan logging
            setRoomImagesPreview(roomData.foto_kamar || []);
            
            fetchRateplans(roomData._id);
          } else {
            throw new Error(response.message || 'Gagal memuat data kamar');
          }
        } catch (err) {
          const error = err as Error;
          setErrorMessage(error.message || 'Terjadi kesalahan saat memuat data kamar');
          console.error('Error fetching room data:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRoomData();
    }
  }, [isEditMode, id]);
  
  const fetchRateplans = async (roomId: string) => {
    if (!roomId) return;
    
    setLoadingRateplans(true);
    try {
      const response = await rateplanService.getAll(roomId);
      if (response.success && response.data) {
        setRateplans(response.data);
      }
    } catch (error) {
      console.error('Error fetching rateplans:', error);
    } finally {
      setLoadingRateplans(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['harga_default', 'kapasitas', 'jumlah_kamar'].includes(name) 
        ? parseInt(value, 10) || 0 
        : value
    });
  };
  
  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => {
      const facilities = [...prev.fasilitas_kamar];
      if (facilities.includes(facility)) {
        return {
          ...prev,
          fasilitas_kamar: facilities.filter(f => f !== facility)
        };
      } else {
        return {
          ...prev,
          fasilitas_kamar: [...facilities, facility]
        };
      }
    });
  };
  
  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.fasilitas_kamar.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        fasilitas_kamar: [...prev.fasilitas_kamar, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };
  
  const handleRoomImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          newPreviews.push(result);
          
          if (newPreviews.length === files.length) {
            setRoomImagesPreview(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveRoomImage = (index: number) => {
    setRoomImagesPreview(prev => prev.filter((_, i) => i !== index));
  };
  
  const incrementValue = (field: 'kapasitas' | 'jumlah_kamar') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] + 1
    }));
  };
  
  const decrementValue = (field: 'kapasitas' | 'jumlah_kamar') => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(1, prev[field] - 1)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hotel_id) {
      setErrorMessage('Silakan pilih hotel');
      return;
    }
    
    if (!formData.nama_kamar) {
      setErrorMessage('Nama kamar wajib diisi');
      return;
    }
    
    if (!formData.tipe_tempat_tidur) {
      setErrorMessage('Tipe tempat tidur wajib dipilih');
      return;
    }
    
    if (formData.harga_default <= 0) {
      setErrorMessage('Harga kamar harus lebih besar dari 0');
      return;
    }
    
    if (roomImagesPreview.length === 0) {
      setErrorMessage('Minimal satu foto kamar wajib diupload');
      return;
    }
    
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const formDataObj = new FormData();
      
      formDataObj.append('hotel_id', formData.hotel_id);
      formDataObj.append('nama_kamar', formData.nama_kamar);
      formDataObj.append('tipe_tempat_tidur', formData.tipe_tempat_tidur);
      formDataObj.append('harga_default', formData.harga_default.toString());
      formDataObj.append('kapasitas', formData.kapasitas.toString());
      formDataObj.append('jumlah_kamar', formData.jumlah_kamar.toString());
      
      formDataObj.append('fasilitas_kamar', JSON.stringify(formData.fasilitas_kamar));
      
      const newRoomImages = roomImagesPreview.filter(img => img.startsWith('data:image'));
      for (let i = 0; i < newRoomImages.length; i++) {
        const imgBlob = await fetch(newRoomImages[i]).then(r => r.blob());
        formDataObj.append('foto_kamar', imgBlob, `room_${i}.jpg`);
      }
      
      let response;
      if (isEditMode && id) {
        response = await roomService.update(id, formDataObj);
      } else {
        response = await roomService.create(formDataObj);
      }
      
      if (response.success) {
        setSuccessMessage(isEditMode ? 'Kamar berhasil diperbarui' : 'Kamar baru berhasil ditambahkan');
        
        setTimeout(() => {
          navigate('/rooms');
        }, 1500);
      } else {
        throw new Error(response.message || 'Gagal menyimpan data kamar');
      }
    } catch (err) {
      const error = err as Error;
      setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan data kamar');
      console.error('Error saving room data:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Memuat data kamar...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Kamar' : 'Tambah Kamar Baru'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Perbarui informasi dan detail kamar' 
              : 'Tambahkan tipe kamar baru ke sistem'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-100 border-green-400 text-green-700">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Masukkan informasi dasar tentang kamar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hotel_id">Hotel <span className="text-red-500">*</span></Label>
                <select
                  id="hotel_id"
                  name="hotel_id"
                  value={formData.hotel_id}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  key={`hotel-select-${formData.hotel_id}`} // Tambahkan key untuk memaksa re-render
                >
                  <option value="">Pilih Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.nama_hotel}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama_kamar">Nama Kamar <span className="text-red-500">*</span></Label>
                <Input
                  id="nama_kamar"
                  name="nama_kamar"
                  value={formData.nama_kamar}
                  onChange={handleInputChange}
                  placeholder="Contoh: Deluxe Room, Superior Room, dll."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipe_tempat_tidur">Tipe Tempat Tidur <span className="text-red-500">*</span></Label>
                <select
                  id="tipe_tempat_tidur"
                  name="tipe_tempat_tidur"
                  value={formData.tipe_tempat_tidur}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Pilih Tipe Tempat Tidur</option>
                  {bedTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="harga_default">Harga Per Malam <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="harga_default"
                    name="harga_default"
                    type="number"
                    min="0"
                    value={formData.harga_default}
                    onChange={handleInputChange}
                    className="pl-8"
                    required
                  />
                </div>
                {formData.harga_default > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatRupiah(formData.harga_default)}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kapasitas">Kapasitas Tamu</Label>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => decrementValue('kapasitas')}
                    disabled={formData.kapasitas <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="kapasitas"
                    name="kapasitas"
                    type="number"
                    min="1"
                    value={formData.kapasitas}
                    onChange={handleInputChange}
                    className="mx-2 text-center"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => incrementValue('kapasitas')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jumlah_kamar">Jumlah Kamar</Label>
                <div className="flex items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => decrementValue('jumlah_kamar')}
                    disabled={formData.jumlah_kamar <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="jumlah_kamar"
                    name="jumlah_kamar"
                    type="number"
                    min="1"
                    value={formData.jumlah_kamar}
                    onChange={handleInputChange}
                    className="mx-2 text-center"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => incrementValue('jumlah_kamar')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fasilitas Kamar</CardTitle>
            <CardDescription>
              Pilih fasilitas yang tersedia di kamar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableFacilities.map(facility => (
                <div key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`facility-${facility}`}
                    checked={formData.fasilitas_kamar.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor={`facility-${facility}`} className="text-sm font-medium">
                    {facility}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Input
                placeholder="Tambah fasilitas lainnya"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddFacility} variant="outline">
                Tambah
              </Button>
            </div>
            
            {formData.fasilitas_kamar.some(f => !availableFacilities.includes(f)) && (
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Fasilitas Tambahan:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.fasilitas_kamar
                    .filter(f => !availableFacilities.includes(f))
                    .map(facility => (
                      <div 
                        key={facility} 
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {facility}
                        <button 
                          type="button" 
                          className="ml-1 text-blue-700 hover:text-blue-900"
                          onClick={() => handleFacilityToggle(facility)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Foto Kamar</CardTitle>
            <CardDescription>
              Upload foto-foto kamar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="foto_kamar">Foto Kamar <span className="text-red-500">*</span></Label>
              <Input
                id="foto_kamar"
                name="foto_kamar"
                type="file"
                accept="image/*"
                multiple
                onChange={handleRoomImagesChange}
              />
              <p className="text-xs text-muted-foreground">
                Upload beberapa foto untuk kamar. Format: JPG, PNG. Ukuran maks: 5MB per foto.
              </p>
              
              {roomImagesPreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {roomImagesPreview.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Room Preview ${index + 1}`} 
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleRemoveRoomImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {isEditMode && id && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rate Plans</CardTitle>
                <CardDescription>
                  Kelola rate plan untuk kamar ini
                </CardDescription>
              </div>
              <Button 
                type="button" 
                onClick={() => setShowAddRatePlan(true)}
                disabled={showAddRatePlan}
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Rate Plan
              </Button>
            </CardHeader>
            <CardContent>
              {showAddRatePlan && (
                <RatePlanForm 
                  roomId={id} 
                  onSave={() => {
                    setShowAddRatePlan(false);
                    fetchRateplans(id);
                  }}
                  onCancel={() => setShowAddRatePlan(false)}
                />
              )}
              
              {loadingRateplans ? (
                <div className="flex justify-center items-center h-24">
                  <Loader className="h-6 w-6 animate-spin text-primary mr-2" />
                  <p>Memuat rate plans...</p>
                </div>
              ) : rateplans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Belum ada rate plan untuk kamar ini</p>
                  <p className="text-sm mt-2">Rate plan memungkinkan Anda mengatur harga berbeda berdasarkan periode dan kebijakan tertentu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rateplans.map((rateplan) => (
                    <Card key={rateplan._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{rateplan.nama_rateplan}</h3>
                            <div className={`px-2 py-1 text-xs rounded-full ${
                              rateplan.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rateplan.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </div>
                          </div>
                          
                          {rateplan.deskripsi && (
                            <p className="text-sm text-muted-foreground mb-4">{rateplan.deskripsi}</p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Harga Dasar</p>
                              <p className="text-muted-foreground">{formatRupiah(rateplan.harga_dasar)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Periode</p>
                              <p className="text-muted-foreground">
                                {new Date(rateplan.periode_mulai).toLocaleDateString('id-ID')} - {new Date(rateplan.periode_selesai).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Kebijakan Pembatalan</p>
                              <p className="text-muted-foreground">
                                {rateplan.kebijakan_pembatalan === 'free_cancellation' && 'Pembatalan Gratis'}
                                {rateplan.kebijakan_pembatalan === 'partial_refund' && 'Pengembalian Sebagian'}
                                {rateplan.kebijakan_pembatalan === 'non_refundable' && 'Non-Refundable'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 md:p-6 flex flex-row md:flex-col justify-end items-center gap-2 border-t md:border-t-0 md:border-l">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingRatePlan(rateplan)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={async () => {
                              if (window.confirm('Apakah Anda yakin ingin menghapus rate plan ini?')) {
                                try {
                                  const response = await rateplanService.delete(rateplan._id);
                                  if (response.success) {
                                    fetchRateplans(id);
                                  }
                                } catch (error) {
                                  console.error('Error deleting rateplan:', error);
                                }
                              }
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {editingRatePlan && (
                <div className="mt-6">
                  <RatePlanForm 
                    roomId={id} 
                    existingRatePlan={editingRatePlan}
                    onSave={() => {
                      setEditingRatePlan(null);
                      fetchRateplans(id);
                    }}
                    onCancel={() => setEditingRatePlan(null)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/rooms')}
          >
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : isEditMode ? 'Perbarui Kamar' : 'Tambah Kamar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
