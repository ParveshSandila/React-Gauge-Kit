import { useState, useEffect } from 'react'
import CircularGauge from './components/gauges/CircularGauge'
import LinearGauge from './components/gauges/LinearGauge'
import SpeedometerGauge from './components/gauges/SpeedometerGauge'
import RadialGauge from './components/gauges/RadialGauge'
import ProgressGauge from './components/gauges/ProgressGauge'

function App() {
    const [value, setValue] = useState(65)

    useEffect(() => {
        const interval = setInterval(() => {
            setValue(Math.floor(Math.random() * 100))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
            <header className="mb-16 text-center max-w-2xl mx-auto">
                <h1 className="text-5xl font-black mb-4 tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                        React Gauge Kit
                    </span>
                </h1>
                <p className="text-slate-400 text-lg">
                    A collection of high-performance, customizable, and beautifully animated gauge components for modern web applications.
                </p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Circular Gauge */}
                <section className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center hover:border-blue-500/50 transition-colors group">
                    <h2 className="text-xl font-bold mb-8 text-slate-200 group-hover:text-blue-400 transition-colors">Circular Gauge</h2>
                    <CircularGauge
                        value={value}
                        label="Storage Used"
                        gradientColors={["#0ea5e9", "#22c55e", "#eab308"]}
                        size={220}
                        strokeWidth={18}
                    />
                </section>

                {/* Linear Gauge */}
                <section className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center hover:border-emerald-500/50 transition-colors group">
                    <h2 className="text-xl font-bold mb-8 text-slate-200 group-hover:text-emerald-400 transition-colors">Linear Gauge</h2>
                    <div className="w-full space-y-12">
                        <LinearGauge value={value} label="CPU Loading" color="#10b981" height={16} />
                        <LinearGauge value={100 - value} label="Memory Usage" color="#f59e0b" height={16} />
                    </div>
                </section>

                {/* Speedometer Gauge */}
                <section className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center overflow-hidden hover:border-red-500/50 transition-colors group">
                    <h2 className="text-xl font-bold mb-12 text-slate-200 group-hover:text-red-400 transition-colors">Speedometer</h2>
                    <SpeedometerGauge value={value} label="Network Traffic" />
                </section>

                {/* Radial Gauge */}
                <section className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center hover:border-purple-500/50 transition-colors group">
                    <h2 className="text-xl font-bold mb-8 text-slate-200 group-hover:text-purple-400 transition-colors">Radial Gauge</h2>
                    <RadialGauge value={value} label="Success Rate" color="#8b5cf6" size={320} strokeWidth={16} />
                </section>

                {/* Progress Gauges */}
                <section className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center hover:border-pink-500/50 transition-colors group">
                    <h2 className="text-xl font-bold mb-8 text-slate-200 group-hover:text-pink-400 transition-colors">Progress Units</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <ProgressGauge value={value} label="Uptime" color="#ec4899" size={100} />
                        <ProgressGauge value={100 - value} label="Tasks" color="#06b6d4" size={100} />
                        <ProgressGauge value={Math.min(value + 20, 100)} label="Download" color="#84cc16" size={100} />
                        <ProgressGauge value={Math.max(value - 20, 0)} label="Upload" color="#f43f5e" size={100} />
                    </div>
                </section>

                {/* Info Card */}
                <section className="bg-blue-600 p-8 rounded-3xl border border-blue-500 flex flex-col justify-center text-left">
                    <h2 className="text-2xl font-black mb-4">Ready for Production</h2>
                    <p className="text-blue-100 mb-6">
                        All components are built with SVG for crystal clear rendering at any size. Framer Motion ensures smooth, hardware-accelerated animations.
                    </p>
                    <div className="flex gap-2">
                        <span className="bg-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">React 18</span>
                        <span className="bg-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Tailwind CSS</span>
                        <span className="bg-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Framer Motion</span>
                    </div>
                </section>
            </main>

            <footer className="mt-20 text-center text-slate-500 text-sm">
                &copy; 2026 React Gauge Kit. Built with precision.
            </footer>
        </div>
    )
}

export default App
