import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  User, 
  Lock, 
  Bell, 
  Save, 
  Upload,
  Hotel
} from 'lucide-react';
import { getInitials } from '../../lib/utils';

interface UserProfile {
  _id: string;
  nama: string;
  email: string;
  role: 'admin' | 'owner' | 'staff';
  hotel_id: string | null;
  hotel_name: string | null;
  foto_profil: string | null;
  telepon: string;
  alamat: string;
  tanggal_bergabung: string;
}

const mockUser: UserProfile = {
  _id: '1',
  nama: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  role: 'owner',
  hotel_id: '1',
  hotel_name: 'Grand Mercure Jakarta',
  foto_profil: null,
  telepon: '081234567890',
  alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
  tanggal_bergabung: '2024-12-15T08:30:00.000Z'
};

export default function UserSettings() {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [profileForm, setProfileForm] = useState({
    nama: user.nama,
    telepon: user.telepon,
    alamat: user.alamat
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email_new_reservation: true,
    email_reservation_cancelled: true,
    email_payment_received: true,
    email_room_availability_low: false,
    email_monthly_report: true
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      nama: profileForm.nama,
      telepon: profileForm.telepon,
      alamat: profileForm.alamat
    });
    setSuccessMessage('Profil berhasil diperbarui');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrorMessage('Konfirmasi password baru tidak cocok');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      setErrorMessage('Password baru harus minimal 8 karakter');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    setSuccessMessage('Password berhasil diperbarui');
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Pengaturan notifikasi berhasil diperbarui');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin Pusat';
      case 'owner':
        return 'Pemilik Hotel';
      case 'staff':
        return 'Staff Hotel';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Akun</h2>
        <p className="text-muted-foreground">
          Kelola profil dan preferensi akun Anda
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* User Profile Card */}
        <Card className="md:w-1/3">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              {user.foto_profil ? (
                <img 
                  src={user.foto_profil} 
                  alt={user.nama} 
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(user.nama)}
                </div>
              )}
              <h3 className="mt-4 text-xl font-semibold">{user.nama}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {getRoleName(user.role)}
              </div>
              {user.hotel_name && (
                <div className="mt-2 flex items-center text-sm">
                  <Hotel className="mr-1 h-4 w-4 text-muted-foreground" />
                  {user.hotel_name}
                </div>
              )}
              <Button variant="outline" size="sm" className="mt-4">
                <Upload className="mr-2 h-4 w-4" /> Ganti Foto Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card className="flex-1">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="mr-2 h-4 w-4 inline" /> Profil
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('password')}
              >
                <Lock className="mr-2 h-4 w-4 inline" /> Password
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4 inline" /> Notifikasi
              </button>
            </nav>
          </div>
          <CardContent className="pt-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={profileForm.nama}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-zinc-100"
                  />
                  <p className="text-xs text-muted-foreground">Email tidak dapat diubah. Hubungi admin untuk mengubah email.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telepon">Nomor Telepon</Label>
                  <Input
                    id="telepon"
                    name="telepon"
                    value={profileForm.telepon}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    rows={3}
                    className="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileForm.alamat}
                    onChange={handleProfileChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                </Button>
              </form>
            )}
            
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Password Saat Ini</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">Password Baru</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Password minimal 8 karakter.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Perbarui Password
                </Button>
              </form>
            )}
            
            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notifikasi Email</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email_new_reservation"
                        name="email_new_reservation"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.email_new_reservation}
                        onChange={handleNotificationChange}
                      />
                      <Label htmlFor="email_new_reservation" className="text-sm font-medium">
                        Reservasi baru
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email_reservation_cancelled"
                        name="email_reservation_cancelled"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.email_reservation_cancelled}
                        onChange={handleNotificationChange}
                      />
                      <Label htmlFor="email_reservation_cancelled" className="text-sm font-medium">
                        Reservasi dibatalkan
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email_payment_received"
                        name="email_payment_received"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.email_payment_received}
                        onChange={handleNotificationChange}
                      />
                      <Label htmlFor="email_payment_received" className="text-sm font-medium">
                        Pembayaran diterima
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email_room_availability_low"
                        name="email_room_availability_low"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.email_room_availability_low}
                        onChange={handleNotificationChange}
                      />
                      <Label htmlFor="email_room_availability_low" className="text-sm font-medium">
                        Ketersediaan kamar menipis
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email_monthly_report"
                        name="email_monthly_report"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notificationSettings.email_monthly_report}
                        onChange={handleNotificationChange}
                      />
                      <Label htmlFor="email_monthly_report" className="text-sm font-medium">
                        Laporan bulanan
                      </Label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Simpan Pengaturan
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
