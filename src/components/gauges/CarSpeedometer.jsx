import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const CarSpeedometer = ({
    value = 0,
    min = 0,
    max = 260,
    size = 350,
    unit = "km/h",
    label = "SPORT",
    className = "",
}) => {
    const center = size / 2;
    const strokeWidth = 10;
    const radius = size * 0.4;
    const angleRange = 270;
    const startAngle = 135;

    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const currentAngle = startAngle + percentage * angleRange;

    const polarToCartesian = (cx, cy, r, angle) => {
        const rad = ((angle - 0) * Math.PI) / 180;
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

    // Ticks
    const majorTicks = 13;
    const minorTicksPerMajor = 4;
    const ticks = [];
    for (let i = 0; i < majorTicks; i++) {
        const angle = startAngle + (i / (majorTicks - 1)) * angleRange;
        const p1 = polarToCartesian(center, center, radius - 5, angle);
        const p2 = polarToCartesian(center, center, radius - 20, angle);
        const val = Math.round(min + (i / (majorTicks - 1)) * (max - min));
        const isRedline = val >= max * 0.8;

        ticks.push(
            <line
                key={`major-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isRedline ? "#ef4444" : "white"}
                strokeWidth="2"
            />
        );

        const textPos = polarToCartesian(center, center, radius - 40, angle);
        ticks.push(
            <text
                key={`text-${i}`}
                x={textPos.x}
                y={textPos.y}
                fill={isRedline ? "#ef4444" : "rgba(255,255,255,0.7)"}
                fontSize="14"
                fontWeight="900"
                textAnchor="middle"
                alignmentBaseline="middle"
                className="font-mono tracking-tighter"
            >
                {val}
            </text>
        );

        if (i < majorTicks - 1) {
            for (let j = 1; j < minorTicksPerMajor; j++) {
                const mAngle = angle + (j / minorTicksPerMajor) * (angleRange / (majorTicks - 1));
                const mp1 = polarToCartesian(center, center, radius - 5, mAngle);
                const mp2 = polarToCartesian(center, center, radius - 12, mAngle);
                const mVal = min + ((i + j / minorTicksPerMajor) / (majorTicks - 1)) * (max - min);
                const isMRedline = mVal >= max * 0.8;

                ticks.push(
                    <line
                        key={`minor-${i}-${j}`}
                        x1={mp1.x}
                        y1={mp1.y}
                        x2={mp2.x}
                        y2={mp2.y}
                        stroke={isMRedline ? "#ef4444" : "rgba(255,255,255,0.3)"}
                        strokeWidth="1"
                    />
                );
            }
        }
    }

    return (
        <div className={cn("relative flex items-center justify-center select-none", className)} style={{ width: size, height: size }}>
            {/* Background / Carbon Fiber Look Overlay */}
            <div className="absolute inset-4 rounded-full bg-[#0a0a0a] border-[1px] border-white/5 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                        backgroundSize: '4px 4px'
                    }}
                />
            </div>

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible z-10">
                <defs>
                    <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>

                {/* Tracking Arc */}
                <path
                    d={describeArc(center, center, radius, startAngle, startAngle + angleRange)}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Redline Arc */}
                <path
                    d={describeArc(center, center, radius, startAngle + angleRange * 0.8, startAngle + angleRange)}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                    strokeOpacity="0.4"
                />

                {/* Active Progress Trail */}
                <motion.path
                    d={describeArc(center, center, radius, startAngle, currentAngle)}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeOpacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Ticks & Labels */}
                {ticks}

                {/* Center Hub */}
                <circle cx={center} cy={center} r="65" fill="#111" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Needle */}
                <motion.g
                    initial={{ rotate: startAngle }}
                    animate={{ rotate: currentAngle }}
                    transition={{ type: "spring", stiffness: 60, damping: 12, mass: 0.8 }}
                    style={{ originX: `${center}px`, originY: `${center}px` }}
                >
                    <path
                        d={`M ${center} ${center - 4} L ${center + radius + 10} ${center} L ${center} ${center + 4} Z`}
                        fill="url(#needleGrad)"
                        style={{ filter: "url(#needleGlow)" }}
                    />
                    <circle cx={center} cy={center} r="12" fill="#111" stroke="#f43f5e" strokeWidth="3" />
                    <circle cx={center} cy={center} r="4" fill="#f43f5e" />
                </motion.g>
            </svg>

            {/* Digital Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none translate-y-8">
                <motion.div
                    className="flex flex-col items-center"
                    key={Math.round(value)}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <span className="text-4xl font-black text-white italic tracking-tighter">
                        {Math.round(value)}
                    </span>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] -mt-1">
                        {unit}
                    </span>
                    <div className="h-[2px] w-8 bg-rose-500/50 mt-2 rounded-full" />
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">
                        {label}
                    </span>
                </motion.div>
            </div>

            {/* Outer Ring Polish */}
            <div className="absolute inset-0 border-[8px] border-white/5 rounded-full pointer-events-none" />
            <div className="absolute inset-[2px] border-[1px] border-white/10 rounded-full pointer-events-none" />
        </div>
    );
};

export default CarSpeedometer;
