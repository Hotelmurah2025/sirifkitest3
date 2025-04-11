import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  ArrowLeft, 
  Upload,
  Trash2,
  Loader
} from 'lucide-react';
import { hotelService } from '../../services/hotel.service';

import { Hotel } from '../../types';

const availableFacilities = [
  'WiFi Gratis',
  'Kolam Renang',
  'Gym',
  'Spa',
  'Restoran',
  'Bar',
  'Ruang Rapat',
  'Ballroom',
  'Layanan Kamar 24 Jam',
  'Parkir Valet',
  'Sarapan Gratis',
  'Transportasi Bandara',
  'Concierge',
  'Laundry',
  'Taman',
  'Area Bermain Anak',
  'Akses Difabel',
  'Penyewaan Sepeda',
  'Pusat Bisnis',
  'Keamanan 24 Jam'
];

export default function AddEditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama_hotel: '',
    alamat: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    telepon: '',
    email: '',
    website: '',
    deskripsi: '',
    bintang: 3,
    fasilitas: [] as string[],
    foto_cover: '',
    foto_hotel: [] as string[]
  });
  
  const [newFacility, setNewFacility] = useState('');
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [hotelImagesPreview, setHotelImagesPreview] = useState<string[]>([]);
  
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      setErrorMessage(null);
      
      const fetchHotelData = async () => {
        try {
          const response = await hotelService.getById(id);
          
          if (response.success && response.data) {
            const hotelData = response.data;
            
            setFormData({
              nama_hotel: hotelData.nama_hotel,
              alamat: hotelData.alamat,
              kota: hotelData.kota,
              provinsi: hotelData.provinsi,
              kode_pos: hotelData.kode_pos,
              telepon: hotelData.telepon,
              email: hotelData.email,
              website: hotelData.website,
              deskripsi: hotelData.deskripsi,
              bintang: hotelData.bintang,
              fasilitas: [...hotelData.fasilitas],
              foto_cover: hotelData.foto_cover,
              foto_hotel: [...hotelData.foto_hotel]
            });
            
            setCoverImagePreview(hotelData.foto_cover);
            setHotelImagesPreview([...hotelData.foto_hotel]);
          } else {
            throw new Error(response.message || 'Gagal memuat data hotel');
          }
        } catch (err) {
          const error = err as Error;
          setErrorMessage(error.message || 'Terjadi kesalahan saat memuat data hotel');
          console.error('Error fetching hotel data:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchHotelData();
    }
  }, [isEditMode, id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bintang' ? parseInt(value, 10) : value
    });
  };
  
  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => {
      const facilities = [...prev.fasilitas];
      if (facilities.includes(facility)) {
        return {
          ...prev,
          fasilitas: facilities.filter(f => f !== facility)
        };
      } else {
        return {
          ...prev,
          fasilitas: [...facilities, facility]
        };
      }
    });
  };
  
  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.fasilitas.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        fasilitas: [...prev.fasilitas, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          foto_cover: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleHotelImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      const newImages: string[] = [];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          newPreviews.push(result);
          newImages.push(result);
          
          if (newPreviews.length === files.length) {
            setHotelImagesPreview(prev => [...prev, ...newPreviews]);
            setFormData(prev => ({
              ...prev,
              foto_hotel: [...prev.foto_hotel, ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveHotelImage = (index: number) => {
    setHotelImagesPreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      foto_hotel: prev.foto_hotel.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_hotel) {
      setErrorMessage('Nama hotel wajib diisi');
      return;
    }
    
    if (!formData.alamat || !formData.kota || !formData.provinsi) {
      setErrorMessage('Alamat, kota, dan provinsi wajib diisi');
      return;
    }
    
    if (!formData.telepon) {
      setErrorMessage('Nomor telepon wajib diisi');
      return;
    }
    
    if (!formData.foto_cover) {
      setErrorMessage('Foto cover hotel wajib diupload');
      return;
    }
    
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const formDataObj = new FormData();
      
      formDataObj.append('nama_hotel', formData.nama_hotel);
      formDataObj.append('alamat', formData.alamat);
      formDataObj.append('kota', formData.kota);
      formDataObj.append('provinsi', formData.provinsi);
      formDataObj.append('kode_pos', formData.kode_pos);
      formDataObj.append('telepon', formData.telepon);
      formDataObj.append('email', formData.email);
      formDataObj.append('website', formData.website);
      formDataObj.append('deskripsi', formData.deskripsi);
      formDataObj.append('bintang', formData.bintang.toString());
      
      formDataObj.append('fasilitas', JSON.stringify(formData.fasilitas));
      
      if (formData.foto_cover.startsWith('data:image')) {
        const coverBlob = await fetch(formData.foto_cover).then(r => r.blob());
        formDataObj.append('foto_cover', coverBlob, 'cover.jpg');
      }
      
      const newHotelImages = formData.foto_hotel.filter(img => img.startsWith('data:image'));
      for (let i = 0; i < newHotelImages.length; i++) {
        const imgBlob = await fetch(newHotelImages[i]).then(r => r.blob());
        formDataObj.append('foto_hotel', imgBlob, `hotel_${i}.jpg`);
      }
      
      let response;
      if (isEditMode && id) {
        response = await hotelService.update(id, formDataObj);
      } else {
        response = await hotelService.create(formDataObj);
      }
      
      if (response.success) {
        setSuccessMessage(isEditMode ? 'Hotel berhasil diperbarui' : 'Hotel baru berhasil ditambahkan');
        
        setTimeout(() => {
          navigate('/hotels');
        }, 1500);
      } else {
        throw new Error(response.message || 'Gagal menyimpan data hotel');
      }
    } catch (err) {
      const error = err as Error;
      setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan data hotel');
      console.error('Error saving hotel data:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Memuat data hotel...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Hotel' : 'Tambah Hotel Baru'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Perbarui informasi dan detail hotel Anda' 
              : 'Tambahkan properti hotel baru ke sistem'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/hotels')}>
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
              Masukkan informasi dasar tentang hotel Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama_hotel">Nama Hotel <span className="text-red-500">*</span></Label>
                <Input
                  id="nama_hotel"
                  name="nama_hotel"
                  value={formData.nama_hotel}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama hotel"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bintang">Bintang Hotel</Label>
                <select
                  id="bintang"
                  name="bintang"
                  value={formData.bintang}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={1}>1 Bintang</option>
                  <option value={2}>2 Bintang</option>
                  <option value={3}>3 Bintang</option>
                  <option value={4}>4 Bintang</option>
                  <option value={5}>5 Bintang</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">Alamat <span className="text-red-500">*</span></Label>
                <Input
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap hotel"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kota">Kota <span className="text-red-500">*</span></Label>
                <Input
                  id="kota"
                  name="kota"
                  value={formData.kota}
                  onChange={handleInputChange}
                  placeholder="Masukkan kota"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="provinsi">Provinsi <span className="text-red-500">*</span></Label>
                <Input
                  id="provinsi"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleInputChange}
                  placeholder="Masukkan provinsi"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kode_pos">Kode Pos</Label>
                <Input
                  id="kode_pos"
                  name="kode_pos"
                  value={formData.kode_pos}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode pos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telepon">Telepon <span className="text-red-500">*</span></Label>
                <Input
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor telepon"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email hotel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Masukkan website hotel"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="deskripsi">Deskripsi Hotel</Label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi hotel"
                  rows={4}
                  className="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fasilitas Hotel</CardTitle>
            <CardDescription>
              Pilih fasilitas yang tersedia di hotel Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableFacilities.map(facility => (
                <div key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`facility-${facility}`}
                    checked={formData.fasilitas.includes(facility)}
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
            
            {formData.fasilitas.some(f => !availableFacilities.includes(f)) && (
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Fasilitas Tambahan:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.fasilitas
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
            <CardTitle>Foto Hotel</CardTitle>
            <CardDescription>
              Upload foto cover dan galeri foto hotel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="foto_cover">Foto Cover Hotel <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-4">
                {coverImagePreview ? (
                  <div className="relative w-40 h-40 overflow-hidden rounded-md">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => {
                        setCoverImagePreview(null);
                        setFormData(prev => ({ ...prev, foto_cover: '' }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-sm">Upload Cover</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <Input
                    id="foto_cover"
                    name="foto_cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className={coverImagePreview ? "hidden" : ""}
                  />
                  {coverImagePreview && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('foto_cover')?.click()}
                    >
                      Ganti Foto Cover
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Foto cover akan ditampilkan sebagai gambar utama hotel. Format: JPG, PNG. Ukuran maks: 5MB.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foto_hotel">Galeri Foto Hotel</Label>
              <Input
                id="foto_hotel"
                name="foto_hotel"
                type="file"
                accept="image/*"
                multiple
                onChange={handleHotelImagesChange}
              />
              <p className="text-xs text-muted-foreground">
                Upload beberapa foto untuk galeri hotel. Format: JPG, PNG. Ukuran maks: 5MB per foto.
              </p>
              
              {hotelImagesPreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {hotelImagesPreview.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Hotel Preview ${index + 1}`} 
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleRemoveHotelImage(index)}
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
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/hotels')}
          >
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : isEditMode ? 'Perbarui Hotel' : 'Tambah Hotel'}
          </Button>
        </div>
      </form>
    </div>
  );
}
