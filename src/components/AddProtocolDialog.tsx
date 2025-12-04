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
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
            <Input
              id="methodology"
              placeholder="Например: ГОСТ 12345-2020, МУК 4.2.123-18"
              value={formData.methodology}
              onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
            />
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
