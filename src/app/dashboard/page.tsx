export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Fleet Overview</h2>
        <p className="text-gray-500">Fleet monitoring metrics coming soon.</p>
        <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">3</div>
            <div className="text-sm text-gray-400">Active Bots</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400">---</div>
            <div className="text-sm text-gray-400">Messages/Day</div>
          </div>
        </div>
      </div>
    </div>
  );
}