import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const RadialGauge = ({
    value = 0,
    min = 0,
    max = 100,
    size = 240,
    strokeWidth = 12,
    startAngle = -210,
    endAngle = 30,
    color = "#8b5cf6",
    backgroundColor = "rgba(255, 255, 255, 0.05)",
    label = "",
    showValue = true,
    className = "",
    segments = 40, // Number of dashed segments for a technical look
}) => {
    const radius = (size - strokeWidth - 20) / 2;
    const center = size / 2;

    const angleRange = endAngle - startAngle;
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const currentAngle = startAngle + (percentage * angleRange);

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

    // Calculate tip position for the glow point
    const tipPos = polarToCartesian(center, center, radius, currentAngle);

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="overflow-visible"
            >
                <defs>
                    <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                    <filter id="radialGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Background Track (Clean Solid Line) */}
                <path
                    d={describeArc(center, center, radius, startAngle, endAngle)}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Progress Arc */}
                <motion.path
                    d={describeArc(center, center, radius, startAngle, currentAngle)}
                    fill="none"
                    stroke={`url(#radialGrad)`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {showValue && (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-5xl font-black tracking-tighter text-white">
                            {Math.round(value)}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-[-4px]">
                            Units
                        </span>
                    </motion.div>
                )}
                {label && (
                    <span className="absolute bottom-12 text-xs font-bold text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
};

export default RadialGauge;
