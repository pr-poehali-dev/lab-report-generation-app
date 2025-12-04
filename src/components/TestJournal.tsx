import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export interface TestSample {
  id: string;
  sampleNumber: string;
  dateReceived: string;
  dateTested: string;
  materialType: string;
  concreteClass: string;
  age: number;
  sampleShape: 'cube' | 'cylinder';
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  actualArea: number;
  destructiveLoad: number;
  compressiveStrength: number;
  testConditions: string;
  performer: string;
  notes: string;
}

interface TestJournalProps {
  invoiceId?: string;
  onSampleAdd: (sample: TestSample) => void;
}

export default function TestJournal({ invoiceId, onSampleAdd }: TestJournalProps) {
  const [formData, setFormData] = useState<Partial<TestSample>>({
    sampleNumber: '',
    dateReceived: new Date().toISOString().split('T')[0],
    dateTested: new Date().toISOString().split('T')[0],
    materialType: 'Бетон тяжелый',
    concreteClass: '',
    age: 28,
    sampleShape: 'cube',
    dimensions: { length: 100, width: 100, height: 100 },
    actualArea: 10000,
    destructiveLoad: 0,
    compressiveStrength: 0,
    testConditions: 'Нормальные условия (20±2°C, влажность >95%)',
    performer: '',
    notes: '',
  });

  const { toast } = useToast();

  const calculateArea = () => {
    const { length, width } = formData.dimensions || {};
    if (length && width) {
      const area = length * width;
      setFormData({ ...formData, actualArea: area });
    }
  };

  const calculateStrength = () => {
    const { destructiveLoad, actualArea } = formData;
    if (destructiveLoad && actualArea) {
      const strength = (destructiveLoad * 1000) / actualArea;
      setFormData({ ...formData, compressiveStrength: parseFloat(strength.toFixed(2)) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sampleNumber || !formData.destructiveLoad) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
      });
      return;
    }

    const sample: TestSample = {
      id: `sample-${Date.now()}`,
      sampleNumber: formData.sampleNumber!,
      dateReceived: formData.dateReceived!,
      dateTested: formData.dateTested!,
      materialType: formData.materialType!,
      concreteClass: formData.concreteClass || '',
      age: formData.age!,
      sampleShape: formData.sampleShape!,
      dimensions: formData.dimensions!,
      actualArea: formData.actualArea!,
      destructiveLoad: formData.destructiveLoad!,
      compressiveStrength: formData.compressiveStrength!,
      testConditions: formData.testConditions!,
      performer: formData.performer!,
      notes: formData.notes || '',
    };

    onSampleAdd(sample);

    toast({
      title: 'Образец добавлен',
      description: `Образец №${sample.sampleNumber} внесен в журнал`,
    });

    setFormData({
      ...formData,
      sampleNumber: '',
      destructiveLoad: 0,
      compressiveStrength: 0,
      notes: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="ClipboardList" className="text-primary" />
          Журнал испытаний по ГОСТ 10180-2012
        </CardTitle>
        <CardDescription>
          Определение прочности бетона на сжатие
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-2">
              <Label htmlFor="sampleNumber" className="text-xs font-semibold">
                № образца *
              </Label>
              <Input
                id="sampleNumber"
                placeholder="Например: 001-2024"
                value={formData.sampleNumber}
                onChange={(e) => setFormData({ ...formData, sampleNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateReceived" className="text-xs font-semibold">
                Дата получения
              </Label>
              <Input
                id="dateReceived"
                type="date"
                value={formData.dateReceived}
                onChange={(e) => setFormData({ ...formData, dateReceived: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTested" className="text-xs font-semibold">
                Дата испытания
              </Label>
              <Input
                id="dateTested"
                type="date"
                value={formData.dateTested}
                onChange={(e) => setFormData({ ...formData, dateTested: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="materialType">Вид бетона</Label>
              <Select
                value={formData.materialType}
                onValueChange={(value) => setFormData({ ...formData, materialType: value })}
              >
                <SelectTrigger id="materialType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Бетон тяжелый">Бетон тяжелый</SelectItem>
                  <SelectItem value="Бетон легкий">Бетон легкий</SelectItem>
                  <SelectItem value="Бетон мелкозернистый">Бетон мелкозернистый</SelectItem>
                  <SelectItem value="Бетон ячеистый">Бетон ячеистый</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concreteClass">Класс бетона</Label>
              <Select
                value={formData.concreteClass}
                onValueChange={(value) => setFormData({ ...formData, concreteClass: value })}
              >
                <SelectTrigger id="concreteClass">
                  <SelectValue placeholder="Выберите класс" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B7.5">B7.5</SelectItem>
                  <SelectItem value="B10">B10</SelectItem>
                  <SelectItem value="B12.5">B12.5</SelectItem>
                  <SelectItem value="B15">B15</SelectItem>
                  <SelectItem value="B20">B20</SelectItem>
                  <SelectItem value="B22.5">B22.5</SelectItem>
                  <SelectItem value="B25">B25</SelectItem>
                  <SelectItem value="B30">B30</SelectItem>
                  <SelectItem value="B35">B35</SelectItem>
                  <SelectItem value="B40">B40</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Возраст бетона (сутки)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 28 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampleShape">Форма образца</Label>
              <Select
                value={formData.sampleShape}
                onValueChange={(value: 'cube' | 'cylinder') => 
                  setFormData({ 
                    ...formData, 
                    sampleShape: value,
                    dimensions: value === 'cube' 
                      ? { length: 100, width: 100, height: 100 }
                      : { length: 150, width: 150, height: 150 }
                  })
                }
              >
                <SelectTrigger id="sampleShape">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cube">Куб</SelectItem>
                  <SelectItem value="cylinder">Цилиндр</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Icon name="Ruler" size={16} />
              Геометрические параметры
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length" className="text-xs">Длина (мм)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={formData.dimensions?.length}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, length: parseFloat(e.target.value) }
                  })}
                  onBlur={calculateArea}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="width" className="text-xs">Ширина (мм)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"
                  value={formData.dimensions?.width}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, width: parseFloat(e.target.value) }
                  })}
                  onBlur={calculateArea}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-xs">Высота (мм)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.dimensions?.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, height: parseFloat(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualArea" className="text-xs">Рабочая площадь (мм²)</Label>
              <Input
                id="actualArea"
                type="number"
                value={formData.actualArea}
                onChange={(e) => setFormData({ ...formData, actualArea: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Icon name="Gauge" size={16} />
              Результаты испытания
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destructiveLoad">Разрушающая нагрузка (кН) *</Label>
                <Input
                  id="destructiveLoad"
                  type="number"
                  step="0.1"
                  value={formData.destructiveLoad}
                  onChange={(e) => setFormData({ ...formData, destructiveLoad: parseFloat(e.target.value) })}
                  onBlur={calculateStrength}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compressiveStrength" className="flex items-center gap-2">
                  Прочность на сжатие (МПа)
                  <span className="text-xs text-muted-foreground">(автоматически)</span>
                </Label>
                <Input
                  id="compressiveStrength"
                  type="number"
                  value={formData.compressiveStrength}
                  readOnly
                  className="bg-green-100 font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testConditions">Условия испытания</Label>
            <Textarea
              id="testConditions"
              value={formData.testConditions}
              onChange={(e) => setFormData({ ...formData, testConditions: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="performer">Исполнитель</Label>
            <Input
              id="performer"
              placeholder="ФИО специалиста"
              value={formData.performer}
              onChange={(e) => setFormData({ ...formData, performer: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Примечания</Label>
            <Textarea
              id="notes"
              placeholder="Особенности испытания, дефекты образца"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 gap-2">
              <Icon name="Plus" size={16} />
              Добавить в журнал
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Icon name="RotateCcw" size={16} />
              Очистить
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
