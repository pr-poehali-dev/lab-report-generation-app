import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
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

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" className="text-primary" />
            Динамика платежей
          </CardTitle>
          <CardDescription>Помесячная статистика за полугодие</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
                stroke="#F97316" 
                strokeWidth={3} 
                name="Ожидание"
                dot={{ fill: '#F97316', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" className="text-secondary" />
            Сравнение по месяцам
          </CardTitle>
          <CardDescription>Оплаченные и ожидающие платежи</CardDescription>
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
  );
}
