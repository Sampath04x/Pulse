// components/charts/TrendLineChart.jsx
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '8px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
      border: '1px solid rgba(47,125,90,0.1)',
      fontSize: 13,
      fontWeight: 600,
    }}>
      <div style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: 11, marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--color-primary)' }}>{payload[0]?.value}%</div>
    </div>
  );
};

export function TrendLineChart({ data, dataKey = 'rate', height = 160 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-muted)', fontFamily: 'Inter' }}
        />
        <YAxis
          domain={[40, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-muted)', fontFamily: 'Inter' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="var(--chart-line, #2F7D5A)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: 'var(--chart-dot, #2F7D5A)', strokeWidth: 0 }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
