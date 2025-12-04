import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const METHODOLOGIES = [
  { value: 'ГОСТ 5802, п.9.4.7 - п.9.4.8; п.9.5 - п.9.6', label: 'ГОСТ 5802 (Прочность растворов)' },
  { value: 'ГОСТ 18105, п.5; п.8', label: 'ГОСТ 18105 (Расчетный метод для бетона)' },
  { value: 'ГОСТ 10180, п.7.2', label: 'ГОСТ 10180 (Прочность бетона на сжатие)' },
  { value: 'ГОСТ 28570, п.8; п.9', label: 'ГОСТ 28570 (Прочность бетона)' },
  { value: 'ГОСТ 22690, п.7.4', label: 'ГОСТ 22690 (Прочность бетона)' },
  { value: 'ГОСТ 12730.1, п.7', label: 'ГОСТ 12730.1 (Плотность бетона)' },
  { value: 'ГОСТ 8735, п.3', label: 'ГОСТ 8735 (Зерновой состав песка)' },
  { value: 'ГОСТ 8735, п.10', label: 'ГОСТ 8735 (Влажность песка)' },
  { value: 'ГОСТ 5180, п.9', label: 'ГОСТ 5180 (Плотность грунта)' },
  { value: 'ГОСТ 5180, п.12', label: 'ГОСТ 5180 (Плотность сухого грунта)' },
  { value: 'ГОСТ 5180, п.8', label: 'ГОСТ 5180 (Граница раскатывания)' },
  { value: 'ГОСТ 5180, п.7', label: 'ГОСТ 5180 (Граница текучести)' },
  { value: 'ГОСТ 5180, п.5', label: 'ГОСТ 5180 (Влажность грунта)' },
  { value: 'ГОСТ 5180, п.13', label: 'ГОСТ 5180 (Плотность частиц грунта)' },
  { value: 'ГОСТ 25100, п. Б.1.2', label: 'ГОСТ 25100 (Плотность скелета грунта)' },
  { value: 'ГОСТ 25100, п. Б.2.2', label: 'ГОСТ 25100 (Содержание частиц)' },
  { value: 'ГОСТ 25100, п. Б.2.8; п. Б.2.9', label: 'ГОСТ 25100 (Число пластичности)' },
  { value: 'ГОСТ 12536, п.4.2', label: 'ГОСТ 12536 (Гранулометрический состав)' },
  { value: 'ГОСТ 30416, п.5.4', label: 'ГОСТ 30416 (Пробоподготовка)' },
  { value: 'Паспорт плотномера В-1', label: 'Плотномер пенетрационный В-1 (Коэффициент уплотнения)' },
];

interface AddProtocolDialogProps {
  invoiceId: string;
  serviceName: string;
  onProtocolAdd: (protocol: ProtocolData) => void;
}

export interface ProtocolData {
  number: string;
  date: string;
  performer: string;
  methodology: string;
  result: string;
  notes: string;
}

export default function AddProtocolDialog({ invoiceId, serviceName, onProtocolAdd }: AddProtocolDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProtocolData>({
    number: '',
    date: new Date().toISOString().split('T')[0],
    performer: '',
    methodology: '',
    result: '',
    notes: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number.trim()) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Укажите номер протокола',
      });
      return;
    }

    onProtocolAdd(formData);
    
    toast({
      title: 'Протокол добавлен',
      description: `Протокол №${formData.number} успешно привязан к услуге "${serviceName}"`,
    });

    setFormData({
      number: '',
      date: new Date().toISOString().split('T')[0],
      performer: '',
      methodology: '',
      result: '',
      notes: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Icon name="FileText" size={16} />
          Добавить протокол
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="ClipboardCheck" className="text-primary" />
            Добавление протокола испытаний
          </DialogTitle>
          <DialogDescription>
            Счет №{invoiceId} • Услуга: {serviceName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocol-number" className="flex items-center gap-2">
                <Icon name="Hash" size={14} />
                Номер протокола *
              </Label>
              <Input
                id="protocol-number"
                placeholder="Например: П-2024-1234"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol-date" className="flex items-center gap-2">
                <Icon name="Calendar" size={14} />
                Дата протокола
              </Label>
              <Input
                id="protocol-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="performer" className="flex items-center gap-2">
              <Icon name="User" size={14} />
              Исполнитель / Специалист
            </Label>
            <Input
              id="performer"
              placeholder="ФИО специалиста лаборатории"
              value={formData.performer}
              onChange={(e) => setFormData({ ...formData, performer: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="methodology" className="flex items-center gap-2">
              <Icon name="BookOpen" size={14} />
              Методика испытаний
            </Label>
            <Select
              value={formData.methodology}
              onValueChange={(value) => setFormData({ ...formData, methodology: value })}
            >
              <SelectTrigger id="methodology">
                <SelectValue placeholder="Выберите методику из списка аккредитации" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {METHODOLOGIES.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Другая методика (ввести вручную)</SelectItem>
              </SelectContent>
            </Select>
            {formData.methodology === 'custom' && (
              <Input
                placeholder="Введите методику вручную"
                value={formData.methodology === 'custom' ? '' : formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="result" className="flex items-center gap-2">
              <Icon name="CheckSquare" size={14} />
              Результат испытаний
            </Label>
            <Textarea
              id="result"
              placeholder="Краткое описание результатов испытаний"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Icon name="FileEdit" size={14} />
              Примечания
            </Label>
            <Textarea
              id="notes"
              placeholder="Дополнительная информация, особенности, замечания"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className="gap-2">
              <Icon name="Save" size={16} />
              Сохранить протокол
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}