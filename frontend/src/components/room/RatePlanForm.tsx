import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { RatePlan } from '../../types';
import { rateplanService } from '../../services/rateplan.service';
import { formatRupiah } from '../../lib/utils';
import { Calendar, DollarSign, Loader } from 'lucide-react';

interface RatePlanFormProps {
  roomId: string;
  existingRatePlan?: RatePlan;
  onSave: () => void;
  onCancel?: () => void;
}

export default function RatePlanForm({ roomId, existingRatePlan, onSave, onCancel }: RatePlanFormProps) {
  const isEditMode = !!existingRatePlan;
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<RatePlan>>({
    room_id: roomId,
    nama_rateplan: '',
    deskripsi: '',
    harga_dasar: 0,
    periode_mulai: '',
    periode_selesai: '',
    hari_dalam_minggu: {
      senin: true,
      selasa: true,
      rabu: true,
      kamis: true,
      jumat: true,
      sabtu: true,
      minggu: true
    },
    kebijakan_pembatalan: 'free_cancellation',
    termasuk_sarapan: false,
    minimum_malam: 1,
    maksimum_malam: 30,
    status: 'active',
    prioritas: 0
  });
  
  useEffect(() => {
    if (isEditMode && existingRatePlan) {
      setFormData({
        ...existingRatePlan,
        periode_mulai: new Date(existingRatePlan.periode_mulai).toISOString().split('T')[0],
        periode_selesai: new Date(existingRatePlan.periode_selesai).toISOString().split('T')[0]
      });
    }
  }, [isEditMode, existingRatePlan]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: ['harga_dasar', 'minimum_malam', 'maksimum_malam', 'prioritas'].includes(name)
        ? parseInt(value, 10) || 0
        : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value
    }));
  };
  
  const handleDayToggle = (day: keyof RatePlan['hari_dalam_minggu']) => {
    setFormData(prev => ({
      ...prev,
      hari_dalam_minggu: {
        ...prev.hari_dalam_minggu!,
        [day]: !prev.hari_dalam_minggu![day]
      }
    }));
  };
  
  const validateForm = () => {
    if (!formData.nama_rateplan) {
      setErrorMessage('Nama rate plan wajib diisi');
      return false;
    }
    
    if (!formData.harga_dasar || formData.harga_dasar <= 0) {
      setErrorMessage('Harga dasar harus lebih besar dari 0');
      return false;
    }
    
    if (!formData.periode_mulai || !formData.periode_selesai) {
      setErrorMessage('Periode mulai dan selesai wajib diisi');
      return false;
    }
    
    const startDate = new Date(formData.periode_mulai);
    const endDate = new Date(formData.periode_selesai);
    
    if (startDate > endDate) {
      setErrorMessage('Periode selesai harus setelah periode mulai');
      return false;
    }
    
    if (formData.minimum_malam! > formData.maksimum_malam!) {
      setErrorMessage('Maksimum malam harus lebih besar atau sama dengan minimum malam');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let response;
      
      if (isEditMode && existingRatePlan) {
        response = await rateplanService.update(existingRatePlan._id, formData);
      } else {
        response = await rateplanService.create(formData);
      }
      
      if (response.success) {
        setSuccessMessage(isEditMode 
          ? 'Rate plan berhasil diperbarui' 
          : 'Rate plan berhasil ditambahkan');
        
        setTimeout(() => {
          onSave();
        }, 1500);
      } else {
        throw new Error(response.message || 'Gagal menyimpan rate plan');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Terjadi kesalahan saat menyimpan rate plan';
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Rate Plan' : 'Tambah Rate Plan Baru'}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Perbarui informasi rate plan' 
            : 'Tambahkan rate plan baru untuk kamar ini'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-4 bg-green-100 border-green-400 text-green-700">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nama_rateplan">Nama Rate Plan <span className="text-red-500">*</span></Label>
              <Input
                id="nama_rateplan"
                name="nama_rateplan"
                value={formData.nama_rateplan}
                onChange={handleInputChange}
                placeholder="Contoh: Early Bird, Weekend Special, dll."
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                placeholder="Deskripsi singkat tentang rate plan ini"
                className="flex min-h-20 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="harga_dasar">Harga Dasar <span className="text-red-500">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="harga_dasar"
                  name="harga_dasar"
                  type="number"
                  min="0"
                  value={formData.harga_dasar}
                  onChange={handleInputChange}
                  className="pl-8"
                  required
                />
              </div>
              {formData.harga_dasar! > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatRupiah(formData.harga_dasar!)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prioritas">Prioritas</Label>
              <Input
                id="prioritas"
                name="prioritas"
                type="number"
                min="0"
                value={formData.prioritas}
                onChange={handleInputChange}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Semakin tinggi nilai, semakin tinggi prioritas rate plan ini
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periode_mulai">Periode Mulai <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="periode_mulai"
                  name="periode_mulai"
                  type="date"
                  value={formData.periode_mulai}
                  onChange={handleInputChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periode_selesai">Periode Selesai <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="periode_selesai"
                  name="periode_selesai"
                  type="date"
                  value={formData.periode_selesai}
                  onChange={handleInputChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kebijakan_pembatalan">Kebijakan Pembatalan</Label>
              <select
                id="kebijakan_pembatalan"
                name="kebijakan_pembatalan"
                value={formData.kebijakan_pembatalan}
                onChange={handleInputChange}
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="free_cancellation">Pembatalan Gratis</option>
                <option value="partial_refund">Pengembalian Sebagian</option>
                <option value="non_refundable">Non-Refundable</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="termasuk_sarapan"
                  name="termasuk_sarapan"
                  checked={formData.termasuk_sarapan}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="termasuk_sarapan">Termasuk Sarapan</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimum_malam">Minimum Malam</Label>
              <Input
                id="minimum_malam"
                name="minimum_malam"
                type="number"
                min="1"
                value={formData.minimum_malam}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maksimum_malam">Maksimum Malam</Label>
              <Input
                id="maksimum_malam"
                name="maksimum_malam"
                type="number"
                min="1"
                value={formData.maksimum_malam}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Berlaku pada Hari</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {(Object.keys(formData.hari_dalam_minggu || {}) as Array<keyof RatePlan['hari_dalam_minggu']>).map(day => (
                  <div key={day} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        formData.hari_dalam_minggu?.[day] 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.charAt(0).toUpperCase()}
                    </button>
                    <span className="text-xs mt-1 capitalize">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                isEditMode ? 'Perbarui Rate Plan' : 'Tambah Rate Plan'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
