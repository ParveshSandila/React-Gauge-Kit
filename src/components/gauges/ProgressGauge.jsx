import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const ProgressGauge = ({
    value = 0,
    color = "#ec4899",
    backgroundColor = "rgba(255, 255, 255, 0.1)",
    thickness = 8,
    size = 120,
    label = "",
    showPercent = true,
    className = "",
}) => {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(Math.max(value / 100, 0), 1);
    const offset = circumference - percentage * circumference;

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90"
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={backgroundColor}
                        strokeWidth={thickness}
                        fill="none"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={thickness}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{ strokeDasharray: circumference }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    {showPercent && (
                        <span className="text-lg font-bold" style={{ color }}>
                            {Math.round(value)}%
                        </span>
                    )}
                </div>
            </div>
            {label && <span className="text-sm font-medium text-slate-400">{label}</span>}
        </div>
    );
};

export default ProgressGauge;
