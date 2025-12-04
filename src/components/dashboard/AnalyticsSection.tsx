import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AnalyticsSectionProps {
  topClients: Array<{ name: string; count: number; total: number }>;
  topDebtors: Array<{ id: string; client: string; amount: number; status: string }>;
  topServices: Array<{ name: string; count: number }>;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function AnalyticsSection({ 
  topClients, 
  topDebtors, 
  topServices, 
  getStatusColor, 
  getStatusText 
}: AnalyticsSectionProps) {
  return (
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
  );
}
