import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const LinearGauge = ({
    value = 0,
    min = 0,
    max = 100,
    height = 12,
    width = "100%",
    color = "#3b82f6",
    backgroundColor = "rgba(255, 255, 255, 0.1)",
    label = "",
    showValue = true,
    className = "",
}) => {
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 100);

    return (
        <div className={cn("w-full space-y-2", className)} style={{ maxWidth: width }}>
            <div className="flex justify-between items-end mb-1">
                {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
                {showValue && <span className="text-sm font-bold text-white">{Math.round(value)}%</span>}
            </div>
            <div
                className="relative rounded-full overflow-hidden"
                style={{ height, backgroundColor }}
            >
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

export default LinearGauge;
