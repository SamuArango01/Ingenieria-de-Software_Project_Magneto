"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, Cell } from 'recharts';
import { CustomTooltip } from "../ui/CustomTooltip";
import { OverviewResponse } from "../types/overview";

interface ChartsSectionProps {
  overviewData: OverviewResponse | null;
}

export function ChartsSection({ overviewData }: Readonly<ChartsSectionProps>) {
  const [activeChart, setActiveChart] = useState<'bar' | 'line'>('bar');

  const { totalInterviews, monthlyAverage, monthlyTarget } = useMemo(() => {
    if (!overviewData?.interviewsByMonth?.length) {
      return {
        totalInterviews: 0,
        monthlyAverage: 0,
        monthlyTarget: 18
      };
    }

    const interviewsData = overviewData.interviewsByMonth;
    const total = interviewsData.reduce((sum, item) => sum + item.total, 0);
    const average = total / interviewsData.length;
    const target = 18;

    return {
      totalInterviews: total,
      monthlyAverage: Math.round(average * 10) / 10,
      monthlyTarget: target
    };
  }, [overviewData]);


  const chartData = useMemo(() => {
    if (!overviewData?.interviewsByMonth?.length) return [];
    
    return overviewData.interviewsByMonth.map((item, index) => ({
      month: item.month,
      interviews: item.total,
      id: `month-${index}-${item.month}`,
      target: monthlyTarget,
      color: item.total >= monthlyTarget ? "#10B981" : "#3B82F6",
    }));
  }, [overviewData?.interviewsByMonth, monthlyTarget]);


  if (!overviewData?.interviewsByMonth?.length) {
    return (
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-2xl shadow-xl">
        <CardContent className="p-6">
          <div className="text-center text-gray-400 py-12">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay datos disponibles para mostrar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-2xl shadow-xl">
      <CardHeader className="pb-4 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-white text-xl font-bold">
                Desempeño de Entrevistas
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Real: {totalInterviews}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Meta: {monthlyTarget}/mes</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex gap-1 bg-gray-700 rounded-lg p-1 border border-gray-600">
              <button 
                onClick={() => setActiveChart('bar')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeChart === 'bar' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <BarChart3 className="w-3 h-3 inline mr-1" />
                Barras
              </button>
              <button 
                onClick={() => setActiveChart('line')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeChart === 'line' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Líneas
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'bar' ? (
              <BarChart 
                data={chartData} 
                margin={{ top: 25, right: 50, left: 20, bottom: 10 }} 
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#374151" 
                  horizontal={true}
                  vertical={false}
                  strokeOpacity={0.5}
                />
                
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                  tick={{ fill: '#D1D5DB' }}
                />
                
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                  width={40}
                  tick={{ fill: '#D1D5DB' }}
                  domain={[0, 'dataMax + 5']}
                />
                
                <Tooltip 
                  content={<CustomTooltip average={monthlyAverage} target={monthlyTarget} />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                
                <ReferenceLine 
                  y={monthlyTarget} 
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2.5}
                  label={{
                    value: `META`,
                    position: 'right', 
                    fill: '#10B981',
                    fontSize: 12,
                    fontWeight: 'bold',
                    offset: 10
                  }}
                />
                
                <Bar 
                  dataKey="interviews" 
                  name="Entrevistas Realizadas"
                  radius={[6, 6, 0, 0]}
                  barSize={100} 
                >
                  {chartData.map((entry) => (
                    <Cell 
                      key={entry.id} 
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart 
                data={chartData} 
                margin={{ top: 25, right: 50, left: 20, bottom: 10 }} 
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#374151" 
                  horizontal={true}
                  vertical={false}
                  strokeOpacity={0.5}
                />
                
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                  tick={{ fill: '#D1D5DB' }}
                />
                
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                  width={40}
                  tick={{ fill: '#D1D5DB' }}
                  domain={[0, 'dataMax + 5']}
                />
                
                <Tooltip 
                  content={<CustomTooltip average={monthlyAverage} target={monthlyTarget} />}
                  cursor={{ stroke: '#4B5563', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                
                <ReferenceLine 
                  y={monthlyTarget} 
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2.5}
                  label={{
                    value: `META`, 
                    position: 'right', 
                    fill: '#10B981',
                    fontSize: 12,
                    fontWeight: 'bold',
                    offset: 10
                  }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ 
                    fill: '#3B82F6', 
                    strokeWidth: 2,
                    r: 5,
                    stroke: '#1E40AF'
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: '#1E40AF',
                    stroke: '#3B82F6',
                    strokeWidth: 2
                  }}
                  name="Entrevistas Realizadas"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded"></div>
              <span className="text-gray-300">Debajo de la meta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <span className="text-gray-300">Sobre la meta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-2 bg-transparent border-2 border-green-500 border-dashed"></div>
              <span className="text-gray-300">Meta: {monthlyTarget} entrevistas</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-blue-400 font-bold text-2xl">{monthlyAverage}</div>
              <div className="text-gray-400 text-sm">Promedio/mes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}