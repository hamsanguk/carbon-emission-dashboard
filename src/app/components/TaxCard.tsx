export default function TaxCard({ totalTons }: { totalTons: number }) {
  const tax = Math.round(totalTons * 10); // $10/1tCO2e
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <h3 className="font-semibold text-lg mb-2">Estimated Carbon Tax</h3>
      <p className="text-3xl font-bold text-accent">${tax}</p>
      <p className="text-sm text-slate-500 mt-1">($10 per ton, USD)</p>
    </div>
  );
}