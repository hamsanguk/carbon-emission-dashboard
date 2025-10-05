'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TrendChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Monthly Trend (누적)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="yearMonth" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="cumulative" stroke="#22C55E" fill="#BBF7D0" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
