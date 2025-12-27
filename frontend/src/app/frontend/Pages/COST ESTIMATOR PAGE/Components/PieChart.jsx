import React, { useMemo } from "react";

export default function PieChart({ data }) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const radius = 50; // Reduced from 80
  const cx = 50;
  const cy = 50;
  const outerMargin = 20; // Reduced from 24
  let cumulative = 0;

  const arcs = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const midAngle = (startAngle + endAngle) / 2;
    const lineStartX = cx + radius * Math.cos(midAngle);
    const lineStartY = cy + radius * Math.sin(midAngle);
    const lineEndX = cx + (radius + 16) * Math.cos(midAngle);
    const lineEndY = cy + (radius + 16) * Math.sin(midAngle);
    const isRight = Math.cos(midAngle) >= 0;
    const labelX = lineEndX + (isRight ? 8 : -8);
    const labelY = lineEndY;
    const anchor = isRight ? "start" : "end";
    const percent = total > 0 ? Math.round((d.value / total) * 100) : 0;

    return (
      <g key={i}>
        <path d={path} fill={d.color} stroke="#ffffff" strokeWidth="2">
          <title>{`${d.label}: ${d.value.toLocaleString()} (${percent}%)`}</title>
        </path>
        {/* leader line */}
        {d.value > 0 && (
          <g>
            <line x1={lineStartX} y1={lineStartY} x2={lineEndX} y2={lineEndY} stroke="#6b7280" strokeWidth="1" />
            <text 
              x={labelX} 
              y={labelY} 
              textAnchor={anchor} 
              alignmentBaseline="middle" 
              className="text-xs font-semibold text-gray-700 bg-white/80 px-1.5 py-0.5 rounded" 
              pointerEvents="none"
              style={{ 
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                fontSize: '10px'
              }}
            >
              {`${d.label}: $${d.value.toLocaleString()}`}
            </text>
          </g>
        )}
      </g>
    );
  });

  return (
    <div className="relative">
      <svg
        viewBox={`${-outerMargin} ${-outerMargin} ${160 + outerMargin * 2} ${160 + outerMargin * 2}`}
        className="w-64 h-64 drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>
        
        {/* Background circle with subtle gradient */}
        <circle cx={cx} cy={cy} r={radius + 8} fill="#f8fafc" />
        <circle cx={cx} cy={cy} r={radius} fill="#f1f5f9" filter="url(#glow)" />
        
        {/* Chart segments */}
        {total > 0 ? arcs : (
          <circle cx={cx} cy={cy} r={radius} fill="#e2e8f0" />
        )}
        
        {/* Inner circle with subtle shadow */}
        <circle cx={cx} cy={cy} r={30} fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
        
        {/* Center total label */}
        <text 
          x={cx} 
          y={cy - 5} 
          textAnchor="middle" 
          alignmentBaseline="middle" 
          className="text-gray-600 text-[10px] font-medium"
        >
          Total
        </text>
        <text 
          x={cx} 
          y={cy + 15} 
          textAnchor="middle" 
          alignmentBaseline="middle" 
          className="text-gray-700 text-sm font-bold"
        >
          ${total.toLocaleString()}
        </text>
        
        {/* Add a subtle animation ring when there's data */}
        {total > 0 && (
          <circle 
            cx={cx} 
            cy={cy} 
            r={radius + 4} 
            fill="none" 
            stroke="rgba(99, 102, 241, 0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
      
      {/* Legend */}
      {total > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
