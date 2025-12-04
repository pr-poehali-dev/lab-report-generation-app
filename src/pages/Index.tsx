import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const paymentData = [
  { month: 'Янв', paid: 420000, pending: 85000 },
  { month: 'Фев', paid: 380000, pending: 120000 },
  { month: 'Мар', paid: 520000, pending: 95000 },
  { month: 'Апр', paid: 610000, pending: 70000 },
  { month: 'Май', paid: 580000, pending: 110000 },
  { month: 'Июн', paid: 720000, pending: 65000 },
];

const servicesData = [
  { name: 'Анализ крови', value: 35, color: '#0EA5E9' },
  { name: 'Биохимия', value: 28, color: '#8B5CF6' },
  { name: 'УЗИ', value: 20, color: '#F97316' },
  { name: 'Прочее', value: 17, color: '#10B981' },
];

const invoices = [
  { id: '2024-0156', client: 'ООО "Медицинский центр"', amount: 125000, status: 'paid', date: '2024-12-01', services: 'Анализы крови, УЗИ' },
  { id: '2024-0157', client: 'Клиника "Здоровье"', amount: 85000, status: 'pending', date: '2024-12-03', services: 'Биохимия' },
  { id: '2024-0158', client: 'ООО "Лайф Диагностика"', amount: 210000, status: 'paid', date: '2024-12-02', services: 'Комплексное обследование' },
  { id: '2024-0159', client: 'Частная клиника "Медис"', amount: 95000, status: 'overdue', date: '2024-11-28', services: 'Анализы, консультации' },
  { id: '2024-0160', client: 'Центр "Диагност"', amount: 165000, status: 'pending', date: '2024-12-04', services: 'УЗИ, рентген' },
];

const notifications = [
  { id: 1, type: 'success', message: 'Получен платеж 125 000 ₽ от ООО "Медицинский центр"', time: '10 минут назад' },
  { id: 2, type: 'warning', message: 'Счет №2024-0159 просрочен на 6 дней', time: '2 часа назад' },
  { id: 3, type: 'info', message: 'Новый счет создан для Клиника "Здоровье"', time: '5 часов назад' },
];

export default function Index() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');

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
          <Button className="bg-primary hover:bg-primary/90 shadow-lg">
            <Icon name="FileText" className="mr-2" size={18} />
            Создать отчет
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Оплачено</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="TrendingUp" className="text-primary" size={20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalPaid.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-green-600 mt-2">↑ +12% от прошлого месяца</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ожидают оплаты</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Icon name="Clock" className="text-yellow-600" size={20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{totalPending.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-2">3 счета в обработке</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Просрочено</CardTitle>
                <div className="p-2 bg-red-100 rounded-lg animate-pulse-glow">
                  <Icon name="AlertCircle" className="text-red-600" size={20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalOverdue.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-red-600 mt-2">Требуется внимание</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Выполнено услуг</CardTitle>
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Icon name="Activity" className="text-secondary" size={20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{servicesCompleted}</div>
              <p className="text-xs text-green-600 mt-2">↑ +8% от прошлого месяца</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart3" className="text-primary" />
                Динамика платежей
              </CardTitle>
              <CardDescription>Статистика оплат и задолженностей по месяцам</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="paid" fill="#0EA5E9" name="Оплачено" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="pending" fill="#F97316" name="Ожидание" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" className="text-secondary" />
                Распределение услуг
              </CardTitle>
              <CardDescription>Структура выполненных работ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" className="text-primary" />
                Топ клиентов
              </CardTitle>
              <CardDescription>По количеству заказов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={client.name} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.count} {client.count === 1 ? 'заказ' : client.count < 5 ? 'заказа' : 'заказов'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">
                        {client.total.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="AlertCircle" className="text-destructive" />
                Топ должников
              </CardTitle>
              <CardDescription>Требуют внимания</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDebtors.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="CheckCircle2" className="mx-auto text-green-500 mb-2" size={32} />
                    <p className="text-sm text-muted-foreground">Все долги погашены!</p>
                  </div>
                ) : (
                  topDebtors.map((debtor) => (
                    <div key={debtor.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg hover:shadow-md transition-all">
                      <Icon name="AlertTriangle" className="text-destructive flex-shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{debtor.client}</p>
                        <p className="text-xs text-muted-foreground">№{debtor.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-destructive">
                          {debtor.amount.toLocaleString('ru-RU')} ₽
                        </p>
                        <Badge variant="outline" className={getStatusColor(debtor.status) + ' text-xs'}>
                          {getStatusText(debtor.status)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Star" className="text-accent" />
                Популярные услуги
              </CardTitle>
              <CardDescription>Чаще всего заказывают</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={service.name} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <div className="mt-1 w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-accent h-full transition-all duration-500"
                          style={{ width: `${(service.count / topServices[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-sm text-accent">{service.count}</p>
                      <p className="text-xs text-muted-foreground">раз</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Счета
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Icon name="Bell" size={16} />
              Уведомления
              <Badge variant="destructive" className="ml-1 animate-pulse-glow">2</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Список счетов</CardTitle>
                    <CardDescription>Управление счетами и платежами</CardDescription>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Icon name="Download" size={16} />
                    Экспорт
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Icon name="Search" className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <Input
                          placeholder="Поиск по клиенту, номеру счета или услугам..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-[200px]">
                        <SelectValue placeholder="Статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="paid">Оплачен</SelectItem>
                        <SelectItem value="pending">Ожидание</SelectItem>
                        <SelectItem value="overdue">Просрочен</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full lg:w-[200px]">
                        <SelectValue placeholder="Период" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все периоды</SelectItem>
                        <SelectItem value="current-month">Текущий месяц</SelectItem>
                        <SelectItem value="last-month">Прошлый месяц</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(statusFilter !== 'all' || searchQuery || dateFilter !== 'all') && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Найдено счетов: {filteredInvoices.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStatusFilter('all');
                          setSearchQuery('');
                          setDateFilter('all');
                        }}
                        className="h-7 px-2"
                      >
                        <Icon name="X" size={14} className="mr-1" />
                        Сбросить фильтры
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="FileSearch" className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-muted-foreground">Счета не найдены</p>
                      <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить параметры фильтрации</p>
                    </div>
                  ) : (
                    filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                        selectedInvoice === invoice.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedInvoice(invoice.id)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg">№{invoice.id}</span>
                            <Badge className={getStatusColor(invoice.status)}>
                              {getStatusText(invoice.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{invoice.client}</p>
                          <p className="text-xs text-muted-foreground mt-1">{invoice.services}</p>
                          <p className="text-xs text-muted-foreground mt-1">Дата: {invoice.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {invoice.amount.toLocaleString('ru-RU')} ₽
                          </div>
                          <Button size="sm" className="mt-2" variant={invoice.status === 'paid' ? 'outline' : 'default'}>
                            {invoice.status === 'paid' ? (
                              <>
                                <Icon name="Eye" className="mr-1" size={14} />
                                Просмотр
                              </>
                            ) : (
                              <>
                                <Icon name="Send" className="mr-1" size={14} />
                                Отправить напоминание
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Уведомления о платежах</CardTitle>
                <CardDescription>История операций и важные события</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Alert key={notification.id} className="animate-scale-in">
                      <Icon name={getNotificationIcon(notification.type)} className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start gap-2">
                          <span>{notification.message}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="shadow-lg animate-fade-in bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" className="text-primary" />
              Аналитика за период
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="paid" 
                  stroke="#0EA5E9" 
                  strokeWidth={3}
                  name="Оплачено"
                  dot={{ fill: '#0EA5E9', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Ожидание"
                  dot={{ fill: '#8B5CF6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}