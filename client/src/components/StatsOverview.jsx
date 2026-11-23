import React from 'react';
import { Package, AlertCircle, AlertTriangle, Layers, DollarSign, Archive } from 'lucide-react';

const StatsOverview = ({ stats, onFilterStock }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts ?? 0,
      sub: `${stats.totalCategories || 0} categories`,
      icon: <Package className="w-5 h-5 text-sb-green" />,
      bg: 'bg-sb-soft/60',
      border: 'border-sb-light/80',
      filter: null
    },
    {
      label: 'Low Stock Alert',
      value: stats.lowStock ?? 0,
      sub: 'Items under 15 units',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: stats.lowStock > 0 ? 'Action Needed' : 'Good',
      badgeColor: stats.lowStock > 0 ? 'bg-amber-200 text-amber-800' : 'bg-emerald-100 text-emerald-800',
      filter: 'low_stock'
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStock ?? 0,
      sub: 'Items with 0 inventory',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: stats.outOfStock > 0 ? 'Replenish' : 'Healthy',
      badgeColor: stats.outOfStock > 0 ? 'bg-red-200 text-red-800' : 'bg-emerald-100 text-emerald-800',
      filter: 'out_of_stock'
    },
    {
      label: 'Total Stock Units',
      value: (stats.totalUnits ?? 0).toLocaleString(),
      sub: 'Across all store items',
      icon: <Archive className="w-5 h-5 text-sb-dark" />,
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      filter: null
    },
    {
      label: 'Estimated Retail Value',
      value: `$${(stats.totalValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: 'Total inventory worth',
      icon: <DollarSign className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      filter: null
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => card.filter && onFilterStock && onFilterStock(card.filter)}
          className={`p-4 rounded-2xl border ${card.bg} ${card.border} transition-all duration-200 ${
            card.filter ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center">
              {card.icon}
            </div>
            {card.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-2xl font-black text-gray-900 tracking-tight">{card.value}</p>
          <p className="text-xs font-semibold text-gray-600 mt-0.5">{card.label}</p>
          <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
