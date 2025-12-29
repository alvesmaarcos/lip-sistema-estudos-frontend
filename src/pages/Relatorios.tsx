import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/contexts/StudyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { truncateLabel } from '@/lib/utils'; 

const COLOR_MAP: Record<string, string> = {
  blue: 'hsl(var(--discipline-blue))',
  purple: 'hsl(var(--discipline-purple))',
  green: 'hsl(var(--discipline-green))',
  red: 'hsl(var(--discipline-red))',
  orange: 'hsl(var(--discipline-orange))',
  navy: 'hsl(var(--discipline-navy))',
  default: 'hsl(var(--primary))'
};

const timeToDecimal = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
};

export default function Relatorios() {
  const { studyRecords, getTotalHours, getReviewsCompleted, getPendingReviews } = useStudy();
  const isMobile = useIsMobile(); 

  const chartData = useMemo(() => {
    const disciplineStats: Record<string, { name: string; hours: number; color: string }> = {};

    studyRecords.forEach((record) => {
      const { discipline, disciplineColor, timeSpent } = record;

      if (!disciplineStats[discipline]) {
        disciplineStats[discipline] = {
          name: discipline,
          hours: 0,
          color: COLOR_MAP[disciplineColor] || COLOR_MAP.default
        };
      }
      disciplineStats[discipline].hours += timeToDecimal(timeSpent);
    });

    const data = Object.values(disciplineStats).map(stat => ({
      ...stat,
      hours: Number(stat.hours.toFixed(1))
    }));

    return data.sort((a, b) => b.hours - a.hours);
  }, [studyRecords]);


  return (
    <MainLayout title="Relatórios e Estatísticas">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalHours().toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Tempo acumulado de estudo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões Feitas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getReviewsCompleted()}</div>
            <p className="text-xs text-muted-foreground">Ciclos concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingReviews()}</div>
            <p className="text-xs text-muted-foreground">Precisa de atenção</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1 md:col-span-4">
        <CardHeader>
          <CardTitle>Desempenho por Disciplina</CardTitle>
        </CardHeader>
        <CardContent className="pl-0 md:pl-2">
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  
                  <XAxis 
                    dataKey="name" 
                    className="text-[10px] md:text-xs font-medium" 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="hsl(var(--muted-foreground))"
                    interval={0}
                    tickFormatter={(name) => truncateLabel(name, isMobile, chartData.length)}
                  />
                  
                  <YAxis 
                    className="text-xs font-medium" 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="hsl(var(--muted-foreground))"
                    unit="h"
                  />

                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    labelFormatter={(label) => label} 
                    formatter={(value: number) => [`${value} horas`, 'Tempo dedicado']}
                  />
                  
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground">
              <p>Nenhum dado registrado ainda.</p>
              <p className="text-sm">Registre seus estudos para ver o gráfico.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}