import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const CircularGauge = ({
    value = 0,
    min = 0,
    max = 100,
    size = 200,
    strokeWidth = 15,
    color = "#3b82f6",
    gradientColors = null, // Array of colors for gradient
    backgroundColor = "rgba(255, 255, 255, 0.1)",
    label = "",
    showValue = true,
    className = "",
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const offset = circumference - percentage * circumference;

    const gradientId = `circular-grad-${label.replace(/\s+/g, '-').toLowerCase() || 'default'}`;

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 overflow-visible"
            >
                <defs>
                    {gradientColors && (
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            {gradientColors.map((color, index) => (
                                <stop
                                    key={index}
                                    offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                                    stopColor={color}
                                />
                            ))}
                        </linearGradient>
                    )}
                </defs>

                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={gradientColors ? `url(#${gradientId})` : color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ strokeDasharray: circumference }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {showValue && (
                    <motion.span
                        className="text-3xl font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {Math.round(value)}%
                    </motion.span>
                )}
                {label && <span className="text-sm text-slate-400 mt-1">{label}</span>}
            </div>
        </div>
    );
};

export default CircularGauge;
