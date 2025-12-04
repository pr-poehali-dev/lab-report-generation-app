import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StatisticsCardsProps {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  servicesCompleted: number;
}

export default function StatisticsCards({ totalPaid, totalPending, totalOverdue, servicesCompleted }: StatisticsCardsProps) {
  return (
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
          <p className="text-xs text-muted-foreground mt-2">3 неоплаченных счета</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Просрочено</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <Icon name="AlertTriangle" className="text-red-600" size={20} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{totalOverdue.toLocaleString('ru-RU')} ₽</div>
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <Icon name="AlertCircle" size={12} />
            Требуется внимание
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Услуг выполнено</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon name="CheckCircle2" className="text-green-600" size={20} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{servicesCompleted}</div>
          <p className="text-xs text-muted-foreground mt-2">За текущий месяц</p>
        </CardContent>
      </Card>
    </div>
  );
}
