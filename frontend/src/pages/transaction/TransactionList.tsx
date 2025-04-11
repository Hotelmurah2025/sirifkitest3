import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  CreditCard, 
  Search, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock
} from 'lucide-react';
import { formatRupiah, formatDate } from '../../lib/utils';

interface Transaction {
  _id: string;
  hotel: {
    _id: string;
    nama_hotel: string;
  };
  reservation: {
    _id: string;
    nama_tamu: string;
    check_in: string;
    check_out: string;
    room: {
      nama_kamar: string;
    };
  };
  jumlah_total: number;
  metode_pembayaran: string;
  status_pembayaran: 'unpaid' | 'paid' | 'refunded';
  tanggal_pembayaran: string | null;
  nomor_invoice: string;
  tanggal_invoice: string;
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

const mockTransactions: Transaction[] = [
  {
    _id: '1',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    reservation: {
      _id: '1',
      nama_tamu: 'Budi Santoso',
      check_in: '2025-04-15T14:00:00.000Z',
      check_out: '2025-04-17T12:00:00.000Z',
      room: {
        nama_kamar: 'Deluxe Room'
      }
    },
    jumlah_total: 1700000,
    metode_pembayaran: 'transfer_bank',
    status_pembayaran: 'paid',
    tanggal_pembayaran: '2025-04-02T10:15:00.000Z',
    nomor_invoice: 'INV/2025/04/001',
    tanggal_invoice: '2025-04-01T08:30:00.000Z',
    catatan: 'Pembayaran via BCA',
    createdAt: '2025-04-01T08:30:00.000Z',
    updatedAt: '2025-04-02T10:15:00.000Z'
  },
  {
    _id: '2',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    reservation: {
      _id: '2',
      nama_tamu: 'Dewi Lestari',
      check_in: '2025-04-20T14:00:00.000Z',
      check_out: '2025-04-22T12:00:00.000Z',
      room: {
        nama_kamar: 'Superior Room'
      }
    },
    jumlah_total: 1300000,
    metode_pembayaran: 'credit_card',
    status_pembayaran: 'unpaid',
    tanggal_pembayaran: null,
    nomor_invoice: 'INV/2025/04/002',
    tanggal_invoice: '2025-04-05T10:15:00.000Z',
    catatan: '',
    createdAt: '2025-04-05T10:15:00.000Z',
    updatedAt: '2025-04-05T10:15:00.000Z'
  },
  {
    _id: '3',
    hotel: {
      _id: '2',
      nama_hotel: 'Aston Bandung Hotel & Residence'
    },
    reservation: {
      _id: '3',
      nama_tamu: 'Ahmad Hidayat',
      check_in: '2025-04-10T14:00:00.000Z',
      check_out: '2025-04-13T12:00:00.000Z',
      room: {
        nama_kamar: 'Executive Suite'
      }
    },
    jumlah_total: 3750000,
    metode_pembayaran: 'transfer_bank',
    status_pembayaran: 'paid',
    tanggal_pembayaran: '2025-03-26T14:30:00.000Z',
    nomor_invoice: 'INV/2025/03/005',
    tanggal_invoice: '2025-03-25T11:45:00.000Z',
    catatan: 'Pembayaran via Mandiri',
    createdAt: '2025-03-25T11:45:00.000Z',
    updatedAt: '2025-03-26T14:30:00.000Z'
  },
  {
    _id: '4',
    hotel: {
      _id: '3',
      nama_hotel: 'Swiss-Belhotel Yogyakarta'
    },
    reservation: {
      _id: '4',
      nama_tamu: 'Siti Rahayu',
      check_in: '2025-04-05T14:00:00.000Z',
      check_out: '2025-04-07T12:00:00.000Z',
      room: {
        nama_kamar: 'Deluxe Room'
      }
    },
    jumlah_total: 1600000,
    metode_pembayaran: 'credit_card',
    status_pembayaran: 'paid',
    tanggal_pembayaran: '2025-03-21T09:45:00.000Z',
    nomor_invoice: 'INV/2025/03/003',
    tanggal_invoice: '2025-03-20T09:30:00.000Z',
    catatan: 'Pembayaran via Visa',
    createdAt: '2025-03-20T09:30:00.000Z',
    updatedAt: '2025-03-21T09:45:00.000Z'
  },
  {
    _id: '5',
    hotel: {
      _id: '1',
      nama_hotel: 'Grand Mercure Jakarta'
    },
    reservation: {
      _id: '5',
      nama_tamu: 'Rudi Hartono',
      check_in: '2025-04-25T14:00:00.000Z',
      check_out: '2025-04-27T12:00:00.000Z',
      room: {
        nama_kamar: 'Deluxe Room'
      }
    },
    jumlah_total: 1700000,
    metode_pembayaran: 'transfer_bank',
    status_pembayaran: 'refunded',
    tanggal_pembayaran: '2025-04-03T11:20:00.000Z',
    nomor_invoice: 'INV/2025/04/003',
    tanggal_invoice: '2025-04-02T14:20:00.000Z',
    catatan: 'Pembayaran dikembalikan karena pembatalan',
    createdAt: '2025-04-02T14:20:00.000Z',
    updatedAt: '2025-04-05T16:30:00.000Z'
  }
];

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.reservation.nama_tamu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.hotel.nama_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.nomor_invoice.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status_pembayaran === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const transactionDate = new Date(transaction.createdAt);
      
      if (dateFilter === 'today') {
        matchesDate = 
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === 'this_week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        matchesDate = transactionDate >= startOfWeek;
      } else if (dateFilter === 'this_month') {
        matchesDate = 
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear();
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    if (transaction.status_pembayaran === 'paid') {
      return sum + transaction.jumlah_total;
    }
    return sum;
  }, 0);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleDateFilter = (date: string) => {
    setDateFilter(date);
  };

  const getStatusBadgeClass = (status: Transaction['status_pembayaran']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Transaction['status_pembayaran']) => {
    switch (status) {
      case 'paid':
        return 'Lunas';
      case 'unpaid':
        return 'Belum Bayar';
      case 'refunded':
        return 'Dikembalikan';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'transfer_bank':
        return 'Transfer Bank';
      case 'credit_card':
        return 'Kartu Kredit';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Transaksi</h2>
          <p className="text-muted-foreground">
            Kelola transaksi pembayaran hotel Anda
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/transactions/invoice">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Laporan Invoice
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Ringkasan Transaksi</CardTitle>
          <CardDescription>
            Ringkasan transaksi berdasarkan filter yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Transaksi</p>
              <p className="text-2xl font-bold">{filteredTransactions.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600">{formatRupiah(totalAmount)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Belum Dibayar</p>
              <p className="text-2xl font-bold text-red-600">
                {formatRupiah(
                  filteredTransactions
                    .filter(t => t.status_pembayaran === 'unpaid')
                    .reduce((sum, t) => sum + t.jumlah_total, 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama tamu, hotel, atau nomor invoice..."
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
            Semua Status
          </Button>
          <Button 
            variant={statusFilter === 'paid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('paid')}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Lunas
          </Button>
          <Button 
            variant={statusFilter === 'unpaid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('unpaid')}
          >
            <Clock className="mr-1 h-4 w-4" />
            Belum Bayar
          </Button>
          <Button 
            variant={statusFilter === 'refunded' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleStatusFilter('refunded')}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Dikembalikan
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={dateFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleDateFilter('all')}
        >
          Semua Waktu
        </Button>
        <Button 
          variant={dateFilter === 'today' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleDateFilter('today')}
        >
          Hari Ini
        </Button>
        <Button 
          variant={dateFilter === 'this_week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleDateFilter('this_week')}
        >
          Minggu Ini
        </Button>
        <Button 
          variant={dateFilter === 'this_month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleDateFilter('this_month')}
        >
          Bulan Ini
        </Button>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Memuat data transaksi...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Tidak ada transaksi yang ditemukan. Ubah filter pencarian Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="border p-2 text-left">No. Invoice</th>
                <th className="border p-2 text-left">Tanggal</th>
                <th className="border p-2 text-left">Hotel</th>
                <th className="border p-2 text-left">Tamu</th>
                <th className="border p-2 text-left">Check-in/out</th>
                <th className="border p-2 text-left">Total</th>
                <th className="border p-2 text-left">Metode</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction._id} className="hover:bg-zinc-50">
                  <td className="border p-2 font-medium">{transaction.nomor_invoice}</td>
                  <td className="border p-2">{formatDate(transaction.tanggal_invoice)}</td>
                  <td className="border p-2">{transaction.hotel.nama_hotel}</td>
                  <td className="border p-2">{transaction.reservation.nama_tamu}</td>
                  <td className="border p-2">
                    {formatDate(transaction.reservation.check_in)} - {formatDate(transaction.reservation.check_out)}
                  </td>
                  <td className="border p-2 font-semibold">{formatRupiah(transaction.jumlah_total)}</td>
                  <td className="border p-2">{getPaymentMethodText(transaction.metode_pembayaran)}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeClass(transaction.status_pembayaran)}`}>
                      {getStatusText(transaction.status_pembayaran)}
                    </span>
                  </td>
                  <td className="border p-2">
                    <div className="flex space-x-1">
                      <Link to={`/transactions/${transaction._id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                      {transaction.status_pembayaran === 'unpaid' && (
                        <Button variant="outline" size="sm">
                          Bayar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
