import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { dashboardAPI } from '../../services/api';

interface ChartData {
  month: string;
  revenue: number;
  expenses: number;
}

export const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await dashboardAPI.getFinancials();
        if (response.success) {
          // Transform the data into the format needed for the chart
          const monthlyData: ChartData[] = Object.entries(response.financials.monthly_revenue)
            .map(([month, revenue]) => ({
              month: formatMonth(month),
              revenue: revenue as number,
              expenses: getMonthlyExpenses(month, response.financials.expense_by_category)
            }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
          
          setChartData(monthlyData);
        }
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr);
    return date.toLocaleString('default', { month: 'short' });
  };

  const getMonthlyExpenses = (month: string, expensesByCategory: Record<string, number>) => {
    // For now, we'll evenly distribute the expenses across months
    // In a real application, you would want to get the actual monthly expense data
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    return totalExpenses / 12;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue vs Expenses</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue vs Expenses</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};