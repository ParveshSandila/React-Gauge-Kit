# 🚀 React Gauge Kit

A premium, high-performance collection of reusable React gauge components built with **SVG**, **Framer Motion**, and **Tailwind CSS**. Designed for modern dashboards and data visualization.

![React Gauge Preview](https://img.shields.io/badge/React-18-blue)
![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-purple)
![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-blue)

## ✨ Features

- **Crystal Clear Rendering**: Built entirely with SVG for infinite scalability.
- **Fluid Animations**: Smooth, hardware-accelerated transitions powered by Framer Motion.
- **Fully Customizable**: Control sizes, colors, gradients, stroke widths, and labels via props.
- **Modern Aesthetics**: Premium dark-mode ready designs with glows and gradients.
- **Zero Configuration**: Easy to drop into any React + Tailwind project.

---

## 📦 Installation

1. **Install Peer Dependencies**:
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   ```

2. **Add the Utility Function**:
   Ensure you have a `cn` utility (usually in `src/lib/utils.js`):
   ```javascript
   import { clsx } from "clsx";
   import { twMerge } from "tailwind-merge";
   
   export function cn(...inputs) {
     return twMerge(clsx(inputs));
   }
   ```

3. **Copy Components**:
   Copy the desired components from `src/components/gauges/` into your project.

---

## 🛠 Usage Examples

### 1. Circular Gauge (with Gradients)
```jsx
<CircularGauge 
  value={75} 
  label="Storage Used" 
  gradientColors={["#0ea5e9", "#22c55e", "#eab308"]} 
  size={220} 
  strokeWidth={18} 
/>
```

### 2. Speedometer Gauge
```jsx
<SpeedometerGauge 
  value={65} 
  label="Network Traffic" 
  needleColor="#f43f5e"
/>
```

### 3. Radial Gauge (Clean Design)
```jsx
<RadialGauge 
  value={88} 
  label="Success Rate" 
  color="#8b5cf6" 
  size={320} 
  strokeWidth={16} 
/>
```

### 4. Linear Gauge
```jsx
<LinearGauge 
  value={45} 
  label="CPU Loading" 
  color="#10b981" 
/>
```

---

## 🎨 Component API

| Component | Key Props | Description |
| :--- | :--- | :--- |
| `CircularGauge` | `value`, `gradientColors`, `size`, `strokeWidth` | Classic circular progress with gradient support. |
| `Speedometer` | `value`, `min`, `max`, `needleColor`, `ticks` | High-precision meter with animated needle and scale. |
| `RadialGauge` | `value`, `startAngle`, `endAngle`, `size` | Customizable arc gauge for technical dashboards. |
| `LinearGauge` | `value`, `height`, `width`, `color` | Horizontal bar for simple metrics. |
| `ProgressUnit` | `value`, `thickness`, `showPercent` | Minimal units for comparing multiple stats. |

---

## 📝 License

Distributed under the MIT License. Built with precision for the React community.
