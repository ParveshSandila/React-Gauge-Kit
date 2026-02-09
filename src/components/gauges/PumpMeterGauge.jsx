import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const PumpMeterGauge = ({
    value = 0,
    min = 0,
    max = 120,
    size = 280,
    unit = "PSI",
    label = "WATER PUMP",
    className = "",
    color = "#3b82f6",
}) => {
    const center = size / 2;
    const radius = size * 0.35;
    const angleRange = 240;
    const startAngle = 150;

    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const currentAngle = startAngle + percentage * angleRange;

    const polarToCartesian = (cx, cy, r, angle) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    };

    // Ticks
    const tickItems = [];
    const majors = 7;
    for (let i = 0; i < majors; i++) {
        const angle = startAngle + (i / (majors - 1)) * angleRange;
        const p1 = polarToCartesian(center, center, radius, angle);
        const p2 = polarToCartesian(center, center, radius - 15, angle);
        const val = Math.round(min + (i / (majors - 1)) * (max - min));

        tickItems.push(
            <line
                key={`maj-${i}`}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="#64748b" strokeWidth="2"
            />
        );

        const tPos = polarToCartesian(center, center, radius - 30, angle);
        tickItems.push(
            <text
                key={`lbl-${i}`}
                x={tPos.x} y={tPos.y}
                fill="#94a3b8" fontSize="12" fontWeight="bold"
                textAnchor="middle" alignmentBaseline="middle"
            >
                {val}
            </text>
        );

        if (i < majors - 1) {
            for (let j = 1; j < 5; j++) {
                const subAngle = angle + (j / 5) * (angleRange / (majors - 1));
                const s1 = polarToCartesian(center, center, radius, subAngle);
                const s2 = polarToCartesian(center, center, radius - 8, subAngle);
                tickItems.push(
                    <line
                        key={`min-${i}-${j}`}
                        x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
                        stroke="#475569" strokeWidth="1"
                    />
                );
            }
        }
    }

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            {/* Metal Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[12px] border-slate-700 shadow-inner bg-slate-900" />
            <div className="absolute inset-[10px] rounded-full border-[2px] border-white/10" />

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="z-10 overflow-visible">
                <defs>
                    <filter id="pumpGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Subscale Background */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />

                {/* Ticks */}
                {tickItems}

                {/* Danger Zone */}
                <path
                    d={`M ${polarToCartesian(center, center, radius, startAngle + angleRange * 0.85).x} ${polarToCartesian(center, center, radius, startAngle + angleRange * 0.85).y} 
                       A ${radius} ${radius} 0 0 1 ${polarToCartesian(center, center, radius, startAngle + angleRange).x} ${polarToCartesian(center, center, radius, startAngle + angleRange).y}`}
                    fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="butt"
                />

                {/* Center Bolts (Aesthetic) */}
                <circle cx={center - radius * 0.4} cy={center - radius * 0.4} r="3" fill="#334155" />
                <circle cx={center + radius * 0.4} cy={center - radius * 0.4} r="3" fill="#334155" />
                <circle cx={center} cy={center + radius * 0.5} r="3" fill="#334155" />

                {/* Needle */}
                <motion.g
                    initial={{ rotate: startAngle }}
                    animate={{ rotate: currentAngle }}
                    transition={{ type: "spring", stiffness: 45, damping: 15 }}
                    style={{ originX: `${center}px`, originY: `${center}px` }}
                >
                    <line
                        x1={center} y1={center}
                        x2={center + radius + 10} y2={center}
                        stroke="#f8fafc" strokeWidth="3" strokeLinecap="round"
                        style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.5))" }}
                    />
                    <circle cx={center} cy={center} r="12" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                    <circle cx={center} cy={center} r="5" fill="#64748b" />
                </motion.g>
            </svg>

            {/* Labels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-20">
                <span className="text-2xl font-black text-slate-100 font-mono tracking-widest">{unit}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">{label}</span>

                <div className="mt-4 flex items-center gap-1 bg-slate-950/80 px-4 py-1 rounded border border-slate-800 shadow-lg">
                    <span className="text-xl font-bold text-blue-400 font-mono">
                        {value.toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PumpMeterGauge;
