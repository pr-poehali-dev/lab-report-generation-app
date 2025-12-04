import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { TestSample } from './TestJournal';

interface TestProtocolGeneratorProps {
  samples: TestSample[];
  onClear: () => void;
}

export default function TestProtocolGenerator({ samples, onClear }: TestProtocolGeneratorProps) {
  if (samples.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Добавьте образцы в журнал для формирования протокола
          </p>
        </CardContent>
      </Card>
    );
  }

  const avgStrength = samples.reduce((sum, s) => sum + s.compressiveStrength, 0) / samples.length;
  const minStrength = Math.min(...samples.map(s => s.compressiveStrength));
  const maxStrength = Math.max(...samples.map(s => s.compressiveStrength));

  const generateProtocolPDF = () => {
    const protocolWindow = window.open('', '_blank');
    if (!protocolWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Протокол испытаний по ГОСТ 10180-2012</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11pt; 
            line-height: 1.4;
            color: #000;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .header h1 { 
            font-size: 14pt; 
            font-weight: bold; 
            margin: 5px 0;
          }
          .header p { 
            font-size: 10pt; 
            margin: 3px 0;
          }
          .info-block {
            margin: 15px 0;
            padding: 10px;
            background: #f5f5f5;
            border: 1px solid #ddd;
          }
          .info-row {
            display: flex;
            margin: 5px 0;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            font-size: 10pt;
          }
          th, td { 
            border: 1px solid #000; 
            padding: 8px 5px; 
            text-align: center;
          }
          th { 
            background: #e0e0e0; 
            font-weight: bold;
          }
          .summary {
            margin: 20px 0;
            padding: 15px;
            background: #fff3cd;
            border: 2px solid #ffc107;
          }
          .summary-item {
            margin: 8px 0;
            font-size: 11pt;
          }
          .summary-label {
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #000;
            padding-top: 15px;
          }
          .signature-block {
            margin: 30px 0;
            display: flex;
            justify-content: space-between;
          }
          .signature {
            width: 45%;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            margin: 5px 0 3px 0;
            height: 20px;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ПРОТОКОЛ ИСПЫТАНИЙ №____</h1>
          <p>Определение прочности бетона на сжатие</p>
          <p><strong>ГОСТ 10180-2012</strong> Бетоны. Методы определения прочности по контрольным образцам</p>
        </div>

        <div class="info-block">
          <div class="info-row">
            <span class="info-label">Дата проведения испытаний:</span>
            <span>${samples[0]?.dateTested || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Вид бетона:</span>
            <span>${samples[0]?.materialType || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Класс бетона:</span>
            <span>${samples[0]?.concreteClass || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Возраст бетона:</span>
            <span>${samples[0]?.age || '-'} суток</span>
          </div>
          <div class="info-row">
            <span class="info-label">Условия испытания:</span>
            <span>${samples[0]?.testConditions || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Исполнитель:</span>
            <span>${samples[0]?.performer || '-'}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th rowspan="2">№ образца</th>
              <th colspan="3">Размеры образца, мм</th>
              <th rowspan="2">Рабочая площадь, мм²</th>
              <th rowspan="2">Разрушающая нагрузка, кН</th>
              <th rowspan="2">Прочность на сжатие, МПа</th>
              <th rowspan="2">Примечания</th>
            </tr>
            <tr>
              <th>Длина</th>
              <th>Ширина</th>
              <th>Высота</th>
            </tr>
          </thead>
          <tbody>
            ${samples.map((sample, index) => `
              <tr>
                <td>${sample.sampleNumber}</td>
                <td>${sample.dimensions.length.toFixed(1)}</td>
                <td>${sample.dimensions.width.toFixed(1)}</td>
                <td>${sample.dimensions.height.toFixed(1)}</td>
                <td>${sample.actualArea.toFixed(0)}</td>
                <td>${sample.destructiveLoad.toFixed(1)}</td>
                <td><strong>${sample.compressiveStrength.toFixed(2)}</strong></td>
                <td style="text-align: left; font-size: 9pt;">${sample.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <h3 style="margin-top: 0;">РЕЗУЛЬТАТЫ ИСПЫТАНИЙ</h3>
          <div class="summary-item">
            <span class="summary-label">Количество образцов:</span> ${samples.length} шт.
          </div>
          <div class="summary-item">
            <span class="summary-label">Средняя прочность на сжатие:</span> <strong>${avgStrength.toFixed(2)} МПа</strong>
          </div>
          <div class="summary-item">
            <span class="summary-label">Минимальная прочность:</span> ${minStrength.toFixed(2)} МПа
          </div>
          <div class="summary-item">
            <span class="summary-label">Максимальная прочность:</span> ${maxStrength.toFixed(2)} МПа
          </div>
        </div>

        <div class="footer">
          <p><strong>ЗАКЛЮЧЕНИЕ:</strong></p>
          <p>Прочность бетона на сжатие в возрасте ${samples[0]?.age || '-'} суток составляет <strong>${avgStrength.toFixed(2)} МПа</strong>.</p>
          <p>Испытания проведены в соответствии с требованиями ГОСТ 10180-2012.</p>

          <div class="signature-block">
            <div class="signature">
              <p>Испытания провел:</p>
              <div class="signature-line"></div>
              <p style="font-size: 9pt; margin: 0;">подпись / расшифровка</p>
            </div>
            <div class="signature">
              <p>Руководитель лаборатории:</p>
              <div class="signature-line"></div>
              <p style="font-size: 9pt; margin: 0;">подпись / расшифровка</p>
            </div>
          </div>

          <p style="margin-top: 30px; font-size: 9pt; text-align: center;">
            Строительная лаборатория ООО "СМТ НЛМК"<br>
            398017, Липецкая область, г. Липецк, ул. Фестивальная, д. 10
          </p>
        </div>

        <div class="no-print" style="text-align: center; margin: 20px; padding: 20px; background: #f0f0f0;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 14pt; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px;">
            Печать протокола
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 14pt; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 5px; margin-left: 10px;">
            Закрыть
          </button>
        </div>
      </body>
      </html>
    `;

    protocolWindow.document.write(html);
    protocolWindow.document.close();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="FileCheck" className="text-primary" />
            Протокол испытаний
          </span>
          <Badge variant="secondary" className="text-lg">
            {samples.length} образц{samples.length === 1 ? 'а' : 'ов'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-muted-foreground mb-1">Средняя прочность</p>
            <p className="text-2xl font-bold text-blue-700">{avgStrength.toFixed(2)} МПа</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-muted-foreground mb-1">Минимальная</p>
            <p className="text-2xl font-bold text-orange-700">{minStrength.toFixed(2)} МПа</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-muted-foreground mb-1">Максимальная</p>
            <p className="text-2xl font-bold text-green-700">{maxStrength.toFixed(2)} МПа</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">№</th>
                <th className="p-2 text-center">Размеры (мм)</th>
                <th className="p-2 text-center">Площадь (мм²)</th>
                <th className="p-2 text-center">Нагрузка (кН)</th>
                <th className="p-2 text-center">Прочность (МПа)</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample, index) => (
                <tr key={sample.id} className="border-t">
                  <td className="p-2">{sample.sampleNumber}</td>
                  <td className="p-2 text-center text-xs">
                    {sample.dimensions.length} × {sample.dimensions.width} × {sample.dimensions.height}
                  </td>
                  <td className="p-2 text-center">{sample.actualArea}</td>
                  <td className="p-2 text-center">{sample.destructiveLoad.toFixed(1)}</td>
                  <td className="p-2 text-center font-semibold text-primary">
                    {sample.compressiveStrength.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <Button onClick={generateProtocolPDF} className="flex-1 gap-2" size="lg">
            <Icon name="FileText" size={18} />
            Сформировать протокол
          </Button>
          <Button onClick={onClear} variant="outline" className="gap-2">
            <Icon name="Trash2" size={16} />
            Очистить журнал
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
