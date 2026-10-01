import React from 'react';
import Card from '../ui/Card';

export const BudgetDashboard = ({ budgetData, currency = 'INR', totalBudget = 200000 }) => {
  if (!budgetData) return null;

  const totalCost = budgetData.totalCost || 178400;
  const userBudget = budgetData.userBudget || totalBudget;
  const remaining = budgetData.remainingBudget !== undefined ? budgetData.remainingBudget : (userBudget - totalCost);
  const breakdown = budgetData.breakdown || [
    { name: 'FLIGHTS', value: 42000, percentage: 24, color: '#C45D3A' },
    { name: 'STAYS', value: 51000, percentage: 30, color: '#17201C' },
    { name: 'FOOD & DINING', value: 30000, percentage: 18, color: '#66705B' },
    { name: 'EXPERIENCES', value: 20000, percentage: 12, color: '#8E9A94' },
    { name: 'TRANSPORT', value: 18000, percentage: 10, color: '#5C6B64' },
    { name: 'BUFFER / MISC', value: 10000, percentage: 6, color: '#D5CDBE' },
  ];

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `;
  const formatCurrency = (val) => `${symbol}${Number(val).toLocaleString()}`;

  return (
    <div className="space-y-12 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
          FINANCIAL ALLOCATION LEDGER
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
          WHERE YOUR MONEY GOES
        </h2>
        <p className="text-xs font-sans text-ink-muted mt-1 max-w-lg">
          Calculated by the Budget Agent: Strict expense distribution across accommodation, transport, admissions, and dining.
        </p>
      </div>

      {/* Large Horizontal Visualization Bars */}
      <div className="space-y-6">
        {breakdown.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="font-bold text-ink uppercase tracking-wider">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-base text-ink">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-[11px] text-ink-muted">
                  ({item.percentage}%)
                </span>
              </div>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full bg-[#E9E3D8] h-3 rounded-none overflow-hidden">
              <div
                className="h-full rounded-none transition-all duration-700 bg-ink"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Metrics Row */}
      <div className="pt-8 border-t border-sand-border grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        <div className="p-4 bg-[#F6F3ED] border border-sand-border">
          <span className="text-[10px] text-ink-muted uppercase block tracking-wider">TOTAL ESTIMATED</span>
          <span className="text-2xl font-serif font-bold text-ink block mt-1">
            {formatCurrency(totalCost)}
          </span>
          <span className="text-[10px] text-ink-muted mt-1 block">All 6 categories combined</span>
        </div>

        <div className="p-4 bg-[#F6F3ED] border border-sand-border">
          <span className="text-[10px] text-ink-muted uppercase block tracking-wider">ALLOCATED BUDGET</span>
          <span className="text-2xl font-serif font-bold text-ink block mt-1">
            {formatCurrency(userBudget)}
          </span>
          <span className="text-[10px] text-ink-muted mt-1 block">Maximum spending ceiling</span>
        </div>

        <div className="p-4 bg-[#172B2A] text-ivory border border-forest-border">
          <span className="text-[10px] text-terracotta uppercase block tracking-wider font-bold">REMAINING CUSHION</span>
          <span className="text-2xl font-serif font-bold text-white block mt-1">
            {formatCurrency(Math.abs(remaining))}
          </span>
          <span className="text-[10px] text-ivory/70 mt-1 block">Unallocated financial buffer</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;
