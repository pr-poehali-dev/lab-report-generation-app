import { useState, useMemo } from 'react';
import CreateReportDialog from '@/components/CreateReportDialog';
import StatisticsCards from '@/components/dashboard/StatisticsCards';
import ChartsSection from '@/components/dashboard/ChartsSection';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import InvoicesTabs from '@/components/dashboard/InvoicesTabs';
import { ProtocolData } from '@/components/AddProtocolDialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
  services: string;
  protocols?: Record<string, ProtocolData[]>;
}

const initialInvoices: Invoice[] = [
  { id: '2024-0156', client: 'ООО "Медицинский центр"', amount: 125000, status: 'paid', date: '2024-12-01', services: 'Анализы крови, УЗИ', protocols: {} },
  { id: '2024-0157', client: 'Клиника "Здоровье"', amount: 85000, status: 'pending', date: '2024-12-03', services: 'Биохимия', protocols: {} },
  { id: '2024-0158', client: 'ООО "Лайф Диагностика"', amount: 210000, status: 'paid', date: '2024-12-02', services: 'Комплексное обследование', protocols: {} },
  { id: '2024-0159', client: 'Частная клиника "Медис"', amount: 95000, status: 'overdue', date: '2024-11-28', services: 'Анализы, консультации', protocols: {} },
  { id: '2024-0160', client: 'Центр "Диагност"', amount: 165000, status: 'pending', date: '2024-12-04', services: 'УЗИ, рентген', protocols: {} },
];

const notifications = [
  { id: 1, type: 'success', message: 'Получен платеж 125 000 ₽ от ООО "Медицинский центр"', time: '10 минут назад' },
  { id: 2, type: 'warning', message: 'Счет №2024-0159 просрочен на 6 дней', time: '2 часа назад' },
  { id: 3, type: 'info', message: 'Новый счет создан для Клиника "Здоровье"', time: '5 часов назад' },
];

export default function Index() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const handleProtocolAdd = (invoiceId: string, serviceName: string, protocol: ProtocolData) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => {
        if (invoice.id === invoiceId) {
          const protocols = invoice.protocols || {};
          const serviceProtocols = protocols[serviceName] || [];
          return {
            ...invoice,
            protocols: {
              ...protocols,
              [serviceName]: [...serviceProtocols, protocol]
            }
          };
        }
        return invoice;
      })
    );
  };

  const totalPaid = 2230000;
  const totalPending = 545000;
  const totalOverdue = 95000;
  const servicesCompleted = 342;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Оплачен';
      case 'pending':
        return 'Ожидание';
      case 'overdue':
        return 'Просрочен';
      default:
        return status;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'CheckCircle2';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesSearch = 
        invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.services.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter === 'current-month') {
        const invoiceDate = new Date(invoice.date);
        const now = new Date();
        matchesDate = invoiceDate.getMonth() === now.getMonth() && 
                     invoiceDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === 'last-month') {
        const invoiceDate = new Date(invoice.date);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        matchesDate = invoiceDate.getMonth() === lastMonth.getMonth() && 
                     invoiceDate.getFullYear() === lastMonth.getFullYear();
      }
      
      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [statusFilter, searchQuery, dateFilter]);

  const topClients = useMemo(() => {
    const clientStats = invoices.reduce((acc, invoice) => {
      if (!acc[invoice.client]) {
        acc[invoice.client] = { 
          name: invoice.client, 
          count: 0, 
          total: 0 
        };
      }
      acc[invoice.client].count += 1;
      acc[invoice.client].total += invoice.amount;
      return acc;
    }, {} as Record<string, { name: string; count: number; total: number }>);
    
    return Object.values(clientStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  const topDebtors = useMemo(() => {
    return invoices
      .filter(invoice => invoice.status === 'overdue' || invoice.status === 'pending')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, []);

  const topServices = useMemo(() => {
    const serviceStats = invoices.reduce((acc, invoice) => {
      const services = invoice.services.split(',').map(s => s.trim());
      services.forEach(service => {
        if (!acc[service]) {
          acc[service] = { name: service, count: 0 };
        }
        acc[service].count += 1;
      });
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    
    return Object.values(serviceStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Отчетность лаборатории
            </h1>
            <p className="text-muted-foreground mt-2">Управление услугами и платежами</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.location.href = '/laboratory'}
            >
              <Icon name="FlaskConical" size={18} />
              Журнал испытаний
            </Button>
            <CreateReportDialog />
          </div>
        </div>

        <StatisticsCards
          totalPaid={totalPaid}
          totalPending={totalPending}
          totalOverdue={totalOverdue}
          servicesCompleted={servicesCompleted}
        />

        <ChartsSection />

        <AnalyticsSection
          topClients={topClients}
          topDebtors={topDebtors}
          topServices={topServices}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        <InvoicesTabs
          filteredInvoices={filteredInvoices}
          notifications={notifications}
          selectedInvoice={selectedInvoice}
          setSelectedInvoice={setSelectedInvoice}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getNotificationIcon={getNotificationIcon}
          onProtocolAdd={handleProtocolAdd}
        />
      </div>
    </div>
  );
}