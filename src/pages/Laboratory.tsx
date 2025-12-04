import { useState } from 'react';
import TestJournal, { TestSample } from '@/components/TestJournal';
import TestProtocolGenerator from '@/components/TestProtocolGenerator';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Laboratory() {
  const [samples, setSamples] = useState<TestSample[]>([]);

  const handleSampleAdd = (sample: TestSample) => {
    setSamples([...samples, sample]);
  };

  const handleClear = () => {
    if (window.confirm('Очистить журнал испытаний? Все данные будут удалены.')) {
      setSamples([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Icon name="FlaskConical" size={32} className="text-primary" />
              Журнал испытаний бетона
            </h1>
            <p className="text-muted-foreground mt-2">
              Строительная лаборатория ООО "СМТ НЛМК"
            </p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TestJournal onSampleAdd={handleSampleAdd} />
          <TestProtocolGenerator samples={samples} onClear={handleClear} />
        </div>
      </div>
    </div>
  );
}
