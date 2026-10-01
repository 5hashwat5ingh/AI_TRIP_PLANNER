import React from 'react';
import { CloudSun, Sun, CloudRain } from 'lucide-react';

export const WeatherWidget = ({ weatherData, destination = 'Japan' }) => {
  if (!weatherData) return null;

  const forecast = weatherData.forecast || [];

  return (
    <div className="space-y-10 paper-card p-6 sm:p-10 bg-white border border-sand-border">
      {/* Header */}
      <div className="pb-6 border-b border-sand-border">
        <span className="text-[10px] font-mono tracking-[0.25em] text-terracotta uppercase font-bold block mb-1">
          METEOROLOGICAL LEDGER
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight uppercase">
          DESTINATION CLIMATE & FORECAST
        </h2>
        <p className="text-xs font-sans text-ink-muted mt-1 max-w-lg">
          Analyzed by Weather Agent: Factoring precipitation probabilities into daily timetable scheduling.
        </p>
      </div>

      {/* Climate Overview Banner */}
      <div className="p-6 bg-[#F6F3ED] border border-sand-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono text-terracotta uppercase font-bold tracking-widest block mb-1">
            AVERAGE EXPEDITION CLIMATE
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            {weatherData.averageTempC || 22}°C · {weatherData.overallClimate}
          </h3>
        </div>
        <p className="text-xs font-sans text-ink-muted max-w-md leading-relaxed">
          {weatherData.advisory}
        </p>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecast.map((day) => (
          <div key={day.day} className="p-5 bg-white border border-sand-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-sand-border">
              <span className="font-bold text-ink uppercase">DAY {day.day}</span>
              <span className="text-[10px] text-ink-muted">{day.date}</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-serif font-bold text-ink">{day.tempC}°C</span>
              <span className="text-[10px] text-terracotta font-bold uppercase">{day.rainProbability}% RAIN</span>
            </div>

            <p className="text-xs font-sans font-semibold text-ink">{day.condition}</p>
            <p className="text-[11px] font-sans text-ink-muted leading-snug">{day.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
