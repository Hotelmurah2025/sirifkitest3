import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  User, 
  CheckCircle
} from 'lucide-react';

interface BankAccount {
  _id: string;
  hotel: {
    _id: string;
    nama_hotel: string;
  };
  nama_bank: string;
  nomor_rekening: string;
  nama_rekening: string;
  cabang_bank: string;
  is_primary: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockBankAccounts: BankAccount[] = [
  {
    _id: '1',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    nama_bank: 'Bank Central Asia (BCA)',
    nomor_rekening: '1234567890',
    nama_rekening: 'PT. Grand Mercure Jakarta',
    cabang_bank: 'Jakarta Pusat',
    is_primary: true,
    createdAt: '2025-01-15T08:30:00.000Z',
    updatedAt: '2025-01-15T08:30:00.000Z'
  },
  {
    _id: '2',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    nama_bank: 'Bank Mandiri',
    nomor_rekening: '0987654321',
    nama_rekening: 'PT. Grand Mercure Jakarta',
    cabang_bank: 'Jakarta Selatan',
    is_primary: false,
    createdAt: '2025-02-10T10:15:00.000Z',
    updatedAt: '2025-02-10T10:15:00.000Z'
  },
  {
    _id: '3',
    hotel: {
      _id: '2',
      nama_hotel: 'Aston Bandung Hotel & Residence'
    },
    nama_bank: 'Bank Negara Indonesia (BNI)',
    nomor_rekening: '5678901234',
    nama_rekening: 'PT. Aston Bandung',
    cabang_bank: 'Bandung',
    is_primary: true,
    createdAt: '2025-01-20T11:45:00.000Z',
    updatedAt: '2025-01-20T11:45:00.000Z'
  },
  {
    _id: '4',
    hotel: {
      _id: '3',
      nama_hotel: 'Swiss-Belhotel Yogyakarta'
    },
    nama_bank: 'Bank Rakyat Indonesia (BRI)',
    nomor_rekening: '9876543210',
    nama_rekening: 'PT. Swiss-Belhotel Yogyakarta',
    cabang_bank: 'Yogyakarta',
    is_primary: true,
    createdAt: '2025-02-05T09:30:00.000Z',
    updatedAt: '2025-02-05T09:30:00.000Z'
  }
];

export default function BankAccountList() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    hotel_id: '',
    nama_bank: '',
    nomor_rekening: '',
    nama_rekening: '',
    cabang_bank: '',
    is_primary: false
  });

  const filteredBankAccounts = bankAccounts.filter(account => {
    return (
      account.hotel.nama_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.nama_bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.nomor_rekening.includes(searchTerm) ||
      account.nama_rekening.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBankAccounts(mockBankAccounts);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rekening bank ini?')) {
      setBankAccounts(bankAccounts.filter(account => account._id !== id));
    }
  };

  const handleSetPrimary = (id: string) => {
    const updatedAccounts = bankAccounts.map(account => ({
      ...account,
      is_primary: account._id === id
    }));
    setBankAccounts(updatedAccounts);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAccount: BankAccount = {
      _id: `${bankAccounts.length + 1}`,
      hotel: {
        _id: formData.hotel_id,
        nama_hotel: 'Grand Mercure Jakarta' // In a real app, we would fetch the hotel name
      },
      nama_bank: formData.nama_bank,
      nomor_rekening: formData.nomor_rekening,
      nama_rekening: formData.nama_rekening,
      cabang_bank: formData.cabang_bank,
      is_primary: formData.is_primary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    let updatedAccounts = [...bankAccounts];
    if (formData.is_primary) {
      updatedAccounts = updatedAccounts.map(account => ({
        ...account,
        is_primary: account.hotel._id === formData.hotel_id ? false : account.is_primary
      }));
    }
    
    setBankAccounts([...updatedAccounts, newAccount]);
    setShowAddForm(false);
    setFormData({
      hotel_id: '',
      nama_bank: '',
      nomor_rekening: '',
      nama_rekening: '',
      cabang_bank: '',
      is_primary: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rekening Bank</h2>
          <p className="text-muted-foreground">
            Kelola rekening bank untuk penerimaan pembayaran
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Rekening
        </Button>
      </div>

      {/* Add Bank Account Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Rekening Bank</CardTitle>
            <CardDescription>
              Tambahkan rekening bank baru untuk penerimaan pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel_id">Hotel</Label>
                  <select
                    id="hotel_id"
                    name="hotel_id"
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.hotel_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Hotel</option>
                    <option value="1">Grand Mercure Jakarta</option>
                    <option value="2">Aston Bandung Hotel &amp; Residence</option>
                    <option value="3">Swiss-Belhotel Yogyakarta</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_bank">Nama Bank</Label>
                  <Input
                    id="nama_bank"
                    name="nama_bank"
                    placeholder="Contoh: BCA, Mandiri, BNI"
                    value={formData.nama_bank}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomor_rekening">Nomor Rekening</Label>
                  <Input
                    id="nomor_rekening"
                    name="nomor_rekening"
                    placeholder="Masukkan nomor rekening"
                    value={formData.nomor_rekening}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_rekening">Nama Pemilik Rekening</Label>
                  <Input
                    id="nama_rekening"
                    name="nama_rekening"
                    placeholder="Nama pemilik rekening"
                    value={formData.nama_rekening}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cabang_bank">Cabang Bank</Label>
                  <Input
                    id="cabang_bank"
                    name="cabang_bank"
                    placeholder="Contoh: Jakarta Pusat"
                    value={formData.cabang_bank}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_primary"
                    name="is_primary"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.is_primary}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_primary" className="text-sm font-medium">
                    Jadikan sebagai rekening utama
                  </Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Cari berdasarkan nama bank, nomor rekening, atau nama pemilik..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
        <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Bank Account List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data rekening bank...</p>
        </div>
      ) : filteredBankAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Tidak ada rekening bank yang ditemukan. Tambahkan rekening baru atau ubah filter pencarian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBankAccounts.map(account => (
            <Card key={account._id} className={account.is_primary ? 'border-2 border-green-500' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <CardTitle>{account.nama_bank}</CardTitle>
                    {account.is_primary && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Utama
                      </span>
                    )}
                  </div>
                </div>
                <CardDescription>{account.hotel.nama_hotel}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" /> Nomor Rekening
                    </p>
                    <p className="text-sm font-mono">{account.nomor_rekening}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-1 text-muted-foreground" /> Nama Pemilik
                    </p>
                    <p className="text-sm">{account.nama_rekening}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center">
                      <Building className="h-4 w-4 mr-1 text-muted-foreground" /> Cabang
                    </p>
                    <p className="text-sm">{account.cabang_bank}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {!account.is_primary && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSetPrimary(account._id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Jadikan Utama
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(account._id)}
                    disabled={account.is_primary}
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
