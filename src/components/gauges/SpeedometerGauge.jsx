import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const SpeedometerGauge = ({
    value = 0,
    min = 0,
    max = 100,
    size = 300,
    strokeWidth = 14,
    needleColor = "#f43f5e",
    colors = ["#10b981", "#f59e0b", "#f43f5e"],
    label = "",
    showValue = true,
    className = "",
    ticks = 10,
}) => {
    const radius = (size - strokeWidth - 40) / 2;
    const center = size / 2;

    const angleRange = 240; // Wider range for more "speedo" look
    const startAngle = -210; // Symmetric around bottom centers

    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const needleRotation = startAngle + (percentage * angleRange);

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    // Generate Ticks
    const tickItems = [];
    for (let i = 0; i <= ticks; i++) {
        const angle = startAngle + (i / ticks) * angleRange;
        const p1 = polarToCartesian(center, center, radius + 5, angle);
        const p2 = polarToCartesian(center, center, radius + 15, angle);
        const isMajor = i % 2 === 0;

        tickItems.push(
            <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isMajor ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"}
                strokeWidth={isMajor ? 2 : 1}
            />
        );

        if (isMajor) {
            const labelPos = polarToCartesian(center, center, radius + 30, angle);
            const val = Math.round(min + (i / ticks) * (max - min));
            tickItems.push(
                <text
                    key={`label-${i}`}
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="rgba(255,255,255,0.3)"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {val}
                </text>
            );
        }
    }

    return (
        <div
            className={cn("relative flex flex-col items-center justify-center", className)}
            style={{ width: size, height: size * 0.8 }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="overflow-visible"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="speedoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors[0]} />
                        <stop offset="50%" stopColor={colors[1]} />
                        <stop offset="100%" stopColor={colors[2]} />
                    </linearGradient>
                </defs>

                {/* Outer Background Ring */}
                <path
                    d={describeArc(center, center, radius + 10, startAngle - 5, startAngle + angleRange + 5)}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth + 20}
                    strokeLinecap="round"
                />

                {/* Scale Background */}
                <path
                    d={describeArc(center, center, radius, startAngle, startAngle + angleRange)}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Active Progress */}
                <motion.path
                    d={describeArc(center, center, radius, startAngle, startAngle + (percentage * angleRange))}
                    fill="none"
                    stroke="url(#speedoGrad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))" }}
                />

                {/* Ticks & Labels */}
                {tickItems}

                {/* Needle System */}
                <motion.g
                    initial={{ rotate: startAngle }}
                    animate={{ rotate: needleRotation }}
                    transition={{ type: "spring", stiffness: 40, damping: 10 }}
                    style={{ originX: `${center}px`, originY: `${center}px` }}
                >
                    {/* Needle Pointer */}
                    <path
                        d={`M ${center} ${center - 4} L ${center + radius + 5} ${center} L ${center} ${center + 4} Z`}
                        fill={needleColor}
                        style={{ filter: "drop-shadow(0 0 5px rgba(244, 63, 94, 0.4))" }}
                    />
                    {/* Needle Center Cap */}
                    <circle cx={center} cy={center} r="10" fill="#1e293b" stroke={needleColor} strokeWidth="2" />
                    <circle cx={center} cy={center} r="4" fill={needleColor} />
                </motion.g>
            </svg>

            <div className="absolute bottom-10 flex flex-col items-center text-center">
                {showValue && (
                    <motion.span
                        className="text-5xl font-black text-white tracking-tighter"
                        key={value}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        {Math.round(value)}
                    </motion.span>
                )}
                {label && (
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
};

export default SpeedometerGauge;
