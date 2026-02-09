import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const TemperatureGauge = ({
    value = 24,
    min = -20,
    max = 80,
    size = 300,
    label = "CORE THERMAL SYSTEM",
    className = "",
}) => {
    const center = size / 2;
    const radius = size * 0.38;
    const strokeWidth = 12;
    const startAngle = 135;
    const angleRange = 270;

    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const currentAngle = startAngle + percentage * angleRange;

    const polarToCartesian = (cx, cy, r, angle) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    };

    const describeArc = (cx, cy, r, start, end) => {
        const s = polarToCartesian(cx, cy, r, start);
        const e = polarToCartesian(cx, cy, r, end);
        const largeArc = end - start <= 180 ? "0" : "1";
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    };

    // Technical HUD Markers
    const HUDMarkers = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
        const angle = startAngle + (i / steps) * angleRange;
        const p1 = polarToCartesian(center, center, radius + 20, angle);
        const p2 = polarToCartesian(center, center, radius + 28, angle);
        const isMajor = i % 5 === 0;

        HUDMarkers.push(
            <line
                key={i}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isMajor ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isMajor ? 2 : 1}
            />
        );
    }

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            {/* 1. Deep Background Layer (Inner Glow) */}
            <div className="absolute inset-8 rounded-full bg-slate-950 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />

            {/* 2. Glass Reflection Overlay */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-50 z-30 pointer-events-none"
                style={{
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)'
                }}
            />

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible z-10">
                <defs>
                    <linearGradient id="liquidGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#1e3a8a" /> {/* Deep Blue */}
                        <stop offset="40%" stopColor="#3b82f6" /> {/* Bright Blue */}
                        <stop offset="70%" stopColor="#fbbf24" /> {/* Amber */}
                        <stop offset="100%" stopColor="#ef4444" /> {/* Red */}
                    </linearGradient>

                    <filter id="hudBlur">
                        <feGaussianBlur stdDeviation="4" />
                    </filter>

                    <mask id="arcMask">
                        <path
                            d={describeArc(center, center, radius, startAngle, startAngle + angleRange)}
                            fill="none"
                            stroke="white"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    </mask>
                </defs>

                {/* Background HUD Rings */}
                <circle cx={center} cy={center} r={radius + 40} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <circle cx={center} cy={center} r={radius - 20} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Scale HUD Line */}
                <path
                    d={describeArc(center, center, radius + 20, startAngle, startAngle + angleRange)}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                />

                {/* HUD Markers */}
                {HUDMarkers}

                {/* Main Track */}
                <path
                    d={describeArc(center, center, radius, startAngle, startAngle + angleRange)}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Liquid Progress Arc */}
                <motion.path
                    d={describeArc(center, center, radius, startAngle, currentAngle)}
                    fill="none"
                    stroke="url(#liquidGrad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }}
                />

                {/* Dynamic Tip Point */}
                <motion.circle
                    cx={polarToCartesian(center, center, radius, currentAngle).x}
                    cy={polarToCartesian(center, center, radius, currentAngle).y}
                    r="6"
                    fill="white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ filter: 'drop-shadow(0 0 8px white)' }}
                />

                {/* Inner Scanning Line (HUD Animation) */}
                <motion.path
                    d={describeArc(center, center, radius - 10, startAngle, startAngle + 40)}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ originX: `${center}px`, originY: `${center}px` }}
                />
            </svg>

            {/* Central Info HUD */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                {/* HUD Technical Borders */}
                <div className="w-40 h-40 border border-white/5 rounded-full absolute animate-[pulse_4s_infinite]" />
                <div className="w-32 h-32 border border-white/10 rounded-full absolute" />

                <div className="flex flex-col items-center z-40 bg-slate-900/40 p-6 rounded-full backdrop-blur-sm shadow-xl border border-white/5">
                    <div className="flex items-start">
                        <motion.span
                            key={value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter"
                        >
                            {Math.round(value)}
                        </motion.span>
                        <span className="text-xl font-bold text-blue-400/80 ml-1 mt-2">°C</span>
                    </div>

                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-1" />

                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.6em]">
                        {label}
                    </span>

                    {/* Technical Mini-Graph (Visual Only) */}
                    <div className="flex gap-[2px] mt-4 h-4 items-end">
                        {[0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7].map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-[3px] bg-blue-500/30 rounded-t"
                                animate={{ height: [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`] }}
                                transition={{ duration: 1 + i * 0.2, repeat: Infinity }}
                            />
                        ))}
                    </div>
                </div>

                {/* Sub-label Coordinates */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4 text-[6px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <span>MOD: CRT-99</span>
                    <span>STAT: ACTV</span>
                </div>
            </div>

            {/* Ambient Outer Glow */}
            <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none transition-all duration-1000"
                style={{
                    boxShadow: `0 0 80px ${value < 20 ? '#1e3a8a' : value > 50 ? '#ef4444' : '#fbbf24'}`
                }}
            />
        </div >
    );
};

export default TemperatureGauge;
