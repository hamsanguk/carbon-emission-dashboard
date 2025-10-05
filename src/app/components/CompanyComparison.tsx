'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Row = { name: string; total: number };

export default function CompanyComparison({ data }: { data: Row[] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Company Comparison (범위 합계)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#6b9" stroke="#1a3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
