'use client';

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
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = [
  'rgb(0, 212, 255)',
  'rgb(176, 38, 255)',
  'rgb(255, 0, 110)',
  'rgb(0, 255, 136)',
  'rgb(255, 234, 0)',
];

interface ChartData {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

interface LineChartProps {
  data: ChartData[];
  dataKeys: string[];
  xAxisKey?: string;
}

export function CustomLineChart({ data, dataKeys, xAxisKey = 'name' }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(20, 20, 32, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface BarChartProps {
  data: ChartData[];
  dataKey: string;
  xAxisKey?: string;
}

export function CustomBarChart({ data, dataKey, xAxisKey = 'name' }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(20, 20, 32, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey={dataKey} fill="rgb(0, 212, 255)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: ChartData[];
  dataKey?: string;
  nameKey?: string;
}

export function CustomPieChart({ data, dataKey = 'value', nameKey = 'name' }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(20, 20, 32, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
