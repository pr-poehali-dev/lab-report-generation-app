import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const clients = [
  'ООО "Медицинский центр"',
  'Клиника "Здоровье"',
  'ООО "Лайф Диагностика"',
  'Частная клиника "Медис"',
  'Центр "Диагност"',
];

const priceList = [
  { id: 1, name: 'Общий анализ крови', price: 450, category: 'Анализы крови' },
  { id: 2, name: 'Биохимический анализ крови', price: 1200, category: 'Биохимия' },
  { id: 3, name: 'Анализ на гормоны щитовидной железы', price: 1800, category: 'Биохимия' },
  { id: 4, name: 'УЗИ брюшной полости', price: 2500, category: 'УЗИ' },
  { id: 5, name: 'УЗИ щитовидной железы', price: 1500, category: 'УЗИ' },
  { id: 6, name: 'Анализ крови на сахар', price: 350, category: 'Анализы крови' },
  { id: 7, name: 'Коагулограмма', price: 950, category: 'Анализы крови' },
  { id: 8, name: 'Анализ на холестерин', price: 550, category: 'Биохимия' },
  { id: 9, name: 'УЗИ малого таза', price: 2200, category: 'УЗИ' },
  { id: 10, name: 'Общий анализ мочи', price: 400, category: 'Прочее' },
];

interface CreateReportDialogProps {
  trigger?: React.ReactNode;
}

export default function CreateReportDialog({ trigger }: CreateReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [newClient, setNewClient] = useState<string>('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        const newQuantities = { ...quantities };
        delete newQuantities[serviceId];
        setQuantities(newQuantities);
        return prev.filter(id => id !== serviceId);
      } else {
        setQuantities({ ...quantities, [serviceId]: 1 });
        return [...prev, serviceId];
      }
    });
  };

  const updateQuantity = (serviceId: number, quantity: number) => {
    if (quantity > 0) {
      setQuantities({ ...quantities, [serviceId]: quantity });
    }
  };

  const totalAmount = selectedServices.reduce((sum, serviceId) => {
    const service = priceList.find(s => s.id === serviceId);
    const quantity = quantities[serviceId] || 1;
    return sum + (service?.price || 0) * quantity;
  }, 0);

  const handleCreateReport = () => {
    const client = isNewClient ? newClient : selectedClient;
    const services = selectedServices.map(id => {
      const service = priceList.find(s => s.id === id);
      return {
        ...service,
        quantity: quantities[id] || 1,
        total: (service?.price || 0) * (quantities[id] || 1)
      };
    });

    console.log('Создание отчета:', {
      client,
      date: reportDate,
      services,
      totalAmount
    });

    setOpen(false);
    setSelectedClient('');
    setNewClient('');
    setIsNewClient(false);
    setSelectedServices([]);
    setQuantities({});
  };

  const categories = [...new Set(priceList.map(s => s.category))];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 shadow-lg">
            <Icon name="FileText" className="mr-2" size={18} />
            Создать отчет
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="FileText" className="text-primary" />
            Создание нового отчета
          </DialogTitle>
          <DialogDescription>
            Заполните информацию для формирования отчета по услугам
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-date" className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              Дата отчета
            </Label>
            <Input
              id="report-date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Icon name="Building2" size={16} />
              Заказчик
            </Label>
            
            <div className="flex items-center gap-2 mb-3">
              <Checkbox
                id="new-client"
                checked={isNewClient}
                onCheckedChange={(checked) => setIsNewClient(checked as boolean)}
              />
              <Label htmlFor="new-client" className="text-sm cursor-pointer">
                Новый заказчик
              </Label>
            </div>

            {isNewClient ? (
              <Input
                placeholder="Введите название организации"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
              />
            ) : (
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите заказчика" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Icon name="ClipboardList" size={16} />
              Прайс-лист услуг
            </Label>
            <p className="text-sm text-muted-foreground">
              Выберите услуги и укажите количество
            </p>

            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                    <Icon name="FolderOpen" size={14} />
                    {category}
                  </h4>
                  <div className="space-y-2 pl-4">
                    {priceList
                      .filter(service => service.category === category)
                      .map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              isSelected 
                                ? 'bg-primary/5 border-primary shadow-sm' 
                                : 'bg-background border-border hover:border-primary/50'
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleService(service.id)}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{service.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {service.price.toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="1"
                                  value={quantities[service.id] || 1}
                                  onChange={(e) => updateQuantity(service.id, parseInt(e.target.value) || 1)}
                                  className="w-16 h-8 text-center"
                                />
                                <span className="text-xs text-muted-foreground">шт</span>
                                <Badge variant="secondary" className="ml-2">
                                  {((quantities[service.id] || 1) * service.price).toLocaleString('ru-RU')} ₽
                                </Badge>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Выбрано услуг</p>
                <p className="text-2xl font-bold text-primary">{selectedServices.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Общая сумма</p>
                <p className="text-3xl font-bold text-primary">
                  {totalAmount.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <Icon name="X" className="mr-2" size={16} />
            Отмена
          </Button>
          <Button
            onClick={handleCreateReport}
            disabled={
              (!isNewClient && !selectedClient) ||
              (isNewClient && !newClient.trim()) ||
              selectedServices.length === 0
            }
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="Check" className="mr-2" size={16} />
            Создать отчет
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
