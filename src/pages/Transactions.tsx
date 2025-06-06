
import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionStatsCards } from '@/components/transactions/TransactionStatsCards';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { toast } from 'sonner';

const Transactions = () => {
  usePageView();
  const { transactions, stats, loading, fetchTransactions } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_hash?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Apply filters when they change
  useEffect(() => {
    fetchTransactions({
      type: filterType,
      status: filterStatus,
      dateRange,
      sortBy
    });
  }, [filterType, filterStatus, dateRange, sortBy, fetchTransactions]);

  const handleRefresh = () => {
    fetchTransactions({
      type: filterType,
      status: filterStatus,
      dateRange,
      sortBy
    });
    toast.success('Transactions refreshed');
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Status', 'Coin', 'Amount', 'Fees', 'Hash'].join(','),
      ...filteredTransactions.map(t => [
        new Date(t.created_at).toLocaleDateString(),
        t.type,
        t.status,
        t.coins?.name || 'N/A',
        t.amount,
        t.fees || 0,
        t.transaction_hash || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8" />
              Transaction History
            </h1>
            <p className="text-gray-600 mt-2">Track all your cryptocurrency transactions and activities</p>
          </div>
        </div>

        <TransactionStatsCards stats={stats} />

        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onTypeChange={setFilterType}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        <TransactionTable 
          transactions={filteredTransactions} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Transactions;
