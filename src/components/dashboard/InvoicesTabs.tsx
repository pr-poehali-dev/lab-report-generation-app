import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
  services: string;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface InvoicesTabsProps {
  filteredInvoices: Invoice[];
  notifications: Notification[];
  selectedInvoice: string | null;
  setSelectedInvoice: (id: string | null) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getNotificationIcon: (type: string) => string;
}

export default function InvoicesTabs({
  filteredInvoices,
  notifications,
  selectedInvoice,
  setSelectedInvoice,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  getStatusColor,
  getStatusText,
  getNotificationIcon,
}: InvoicesTabsProps) {
  return (
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
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileText" className="text-primary" />
                  Список счетов
                </CardTitle>
                <CardDescription>Все счета на оплату услуг</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Input
                  placeholder="Поиск по клиенту или номеру..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64"
                  icon={<Icon name="Search" size={16} />}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
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
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все время</SelectItem>
                    <SelectItem value="current-month">Этот месяц</SelectItem>
                    <SelectItem value="last-month">Прошлый месяц</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedInvoice === invoice.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Icon name="Building2" size={18} className="text-primary" />
                            {invoice.client}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">Счет №{invoice.id}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {new Date(invoice.date).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Package" size={14} />
                          {invoice.services}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{invoice.amount.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <Button
                        variant={selectedInvoice === invoice.id ? 'default' : 'outline'}
                        size="sm"
                      >
                        <Icon name={selectedInvoice === invoice.id ? 'ChevronUp' : 'ChevronDown'} size={16} />
                      </Button>
                    </div>
                  </div>
                  {selectedInvoice === invoice.id && (
                    <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Заказчик</p>
                          <p className="font-medium">{invoice.client}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Дата выставления</p>
                          <p className="font-medium">{new Date(invoice.date).toLocaleDateString('ru-RU')}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg sm:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Услуги</p>
                          <p className="font-medium">{invoice.services}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Icon name="Mail" size={16} className="mr-2" />
                          Отправить
                        </Button>
                        <Button variant="default" size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                          <Icon name="Edit" size={16} className="mr-2" />
                          Редактировать
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Счетов не найдено</p>
                  <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить фильтры поиска</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Bell" className="text-primary" />
              Уведомления
            </CardTitle>
            <CardDescription>Важные события и напоминания</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Alert
                  key={notification.id}
                  className={`border-l-4 ${
                    notification.type === 'success'
                      ? 'border-l-green-500 bg-green-50'
                      : notification.type === 'warning'
                      ? 'border-l-yellow-500 bg-yellow-50'
                      : 'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <Icon name={getNotificationIcon(notification.type)} size={18} />
                  <AlertDescription className="ml-2">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-medium">{notification.message}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
