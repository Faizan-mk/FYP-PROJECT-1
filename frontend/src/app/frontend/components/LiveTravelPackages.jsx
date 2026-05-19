import React from 'react';
import { motion } from 'framer-motion';

export function formatPkr(n) {
    if (n == null || Number.isNaN(Number(n))) return '—';
    try {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
        }).format(Number(n));
    } catch {
        return `PKR ${Math.round(Number(n)).toLocaleString()}`;
    }
}

function typeStyle(pt) {
    if (pt === 'solo')
        return {
            label: 'Solo',
            className: 'bg-amber-400/95 text-slate-900 border-amber-200',
        };
    if (pt === 'group')
        return {
            label: 'Group ×3',
            className: 'bg-violet-500/95 text-white border-violet-300',
        };
    return {
        label: 'Family',
        className: 'bg-emerald-500/95 text-white border-emerald-300',
    };
}

export function PackageCard({ pkg, index = 0 }) {
    const tag = typeStyle(pkg.packageType);
    const hasDeal = pkg.discountPercent > 0;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.35) }}
            className="group relative flex flex-col rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl ring-1 ring-slate-200/80 min-h-[420px]"
        >
            <div className="absolute inset-0">
                <img
                    src={pkg.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center sm:object-[center_28%] transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/10" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-6 sm:p-7 mt-auto">
                <div className="flex flex-wrap gap-2 mb-3">
                    <span
                        className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${tag.className}`}
                    >
                        {tag.label}
                    </span>
                    <span className="inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur text-white border border-white/25">
                        {pkg.durationDays} days
                    </span>
                    {hasDeal && (
                        <span className="inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-500 text-white border border-rose-300 shadow-lg">
                            −{pkg.discountPercent}% {pkg.offerLabel || 'Offer'}
                        </span>
                    )}
                    {pkg.pricingSource === 'amadeus_activities+catalog' && (
                        <span className="inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-sky-500/95 text-white border border-sky-200 shadow-lg">
                            Amadeus API
                        </span>
                    )}
                </div>

                <p className="text-white/85 text-xs font-bold uppercase tracking-wide mb-1">
                    {pkg.destinationName}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug line-clamp-2">
                    {pkg.title}
                </h3>

                <p className="mt-3 text-white/80 text-sm font-semibold flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-lg">
                        🏢
                    </span>
                    <span>
                        {pkg.agency?.name}
                        <span className="text-white/50 font-bold text-xs ml-1">({pkg.agency?.code})</span>
                    </span>
                </p>

                <div className="mt-6 pt-5 border-t border-white/15">
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            {hasDeal && (
                                <p className="text-white/50 text-sm font-bold line-through mb-0.5">
                                    {formatPkr(pkg.basePricePKR)}
                                </p>
                            )}
                            <p className="text-3xl font-black text-white tracking-tight">
                                {formatPkr(pkg.currentPricePKR)}
                            </p>
                            <p className="text-[11px] font-bold text-white/60 mt-1 uppercase tracking-wider">
                                {pkg.pricingSource === 'amadeus_activities+catalog'
                                    ? `Amadeus area · ${pkg.amadeusActivitySamples || 0} rates · PKR est.`
                                    : 'Catalog estimate · PKR'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        <a
                            href={pkg.bookViaAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex justify-center items-center gap-2 rounded-2xl bg-white text-slate-900 font-black text-sm py-3.5 shadow-lg hover:bg-indigo-50 transition-colors"
                        >
                            Book via agency site
                            <span aria-hidden>↗</span>
                        </a>
                        <a
                            href={pkg.agencyWebsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex justify-center items-center rounded-2xl border-2 border-white/40 text-white font-black text-sm py-3.5 hover:bg-white/10 transition-colors"
                        >
                            Visit {pkg.agency?.name}
                        </a>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
