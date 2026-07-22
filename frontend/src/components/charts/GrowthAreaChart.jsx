// components/charts/GrowthAreaChart.jsx
// Apple-style: thin line, gradient fill, no grid, no axes lines, grow-on-hover dot
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
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
      color: 'var(--color-text)',
    }}>
      <div style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: 11, marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--color-primary)' }}>
          {p.value.toFixed(1)} <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>/ 5</span>
        </div>
      ))}
    </div>
  );
};

export function GrowthAreaChart({ data, dataKey = 'score', height = 180 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--chart-fill-start, rgba(47,125,90,0.18))" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--chart-fill-end,   rgba(47,125,90,0))" stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-muted)', fontFamily: 'Inter' }}
        />
        <YAxis
          domain={[0, 5]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-muted)', fontFamily: 'Inter' }}
          ticks={[1, 2, 3, 4, 5]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="var(--chart-line, #2F7D5A)"
          strokeWidth={2}
          fill="url(#greenGrad)"
          dot={false}
          activeDot={{ r: 5, fill: 'var(--chart-dot, #2F7D5A)', strokeWidth: 0 }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
