import { useEffect, useState } from 'react'
import { STAR_POSITIONS } from '../../constants/decorations'
import { TEMP } from './types'
import type { RoomLightCardProps } from './types'

export function RoomLightCard({
  name,
  schedule,
  icon,
  isOn,
  brightness,
  colorTemp,
  onToggle,
}: RoomLightCardProps) {
  const [liveBrightness, setLiveBrightness] = useState(brightness)
  const theme = TEMP[colorTemp]
  const dark = !isOn

  useEffect(() => {
    setLiveBrightness(brightness)
  }, [brightness])

  const brightnessRatio = liveBrightness / 100
  const glowSize = isOn ? 90 + brightnessRatio * 110 : 0
  const glowOpacity = isOn ? 0.18 + brightnessRatio * 0.42 : 0
  const shadowAlpha = isOn
    ? Math.round((0.15 + brightnessRatio * 0.4) * 255).toString(16).padStart(2, '0')
    : '00'
  const ambientOpacity = isOn ? 0.15 + brightnessRatio * 0.35 : 0

  return (
    <div
      className="relative overflow-hidden rounded-3xl flex flex-col p-6 select-none outline-none"
      style={{
        background: isOn ? theme.cardBg : '#0c0e1c',
        boxShadow: isOn
          ? `0 4px 32px ${theme.hex}${shadowAlpha}, 0 1px 3px rgba(0,0,0,0.06)`
          : '0 4px 24px rgba(0,0,0,0.25)',
        transition: 'background 0.5s, box-shadow 0.5s',
      }}
    >
      {dark && (
        <div className="absolute inset-0 pointer-events-none">
          {STAR_POSITIONS.map(([x, y], i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                opacity: 0.25 + (i % 4) * 0.1,
              }}
            />
          ))}
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: ambientOpacity,
          background: `radial-gradient(ellipse at 50% 38%, ${theme.hex}55 0%, transparent 68%)`,
        }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div
            className={`text-[17px] font-semibold leading-none transition-colors duration-500 ${
              isOn ? 'text-stone-800' : 'text-white/70'
            }`}
          >
            {name}
          </div>
          <div
            className={`flex items-center gap-1.5 mt-1.5 transition-opacity duration-400 ${
              isOn ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-bold tracking-widest text-emerald-500 uppercase">Active</span>
          </div>
        </div>
        <div className={`shrink-0 transition-all duration-500 ${isOn ? 'text-stone-400' : 'text-white/25'}`}>
          {icon}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-5 relative z-10">
        <div
          role="button"
          onClick={onToggle}
          className="relative flex items-center justify-center group cursor-pointer"
        >
          {isOn && (
            <div
              className="absolute rounded-full pointer-events-none animate-glow-pulse"
              style={{
                width: 130,
                height: 130,
                background: `radial-gradient(circle, ${theme.hex}33 0%, transparent 70%)`,
              }}
            />
          )}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: glowSize,
              height: glowSize,
              opacity: glowOpacity,
              background: `radial-gradient(circle, ${theme.hex}60 0%, ${theme.hex}18 50%, transparent 72%)`,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              width: 108,
              height: 108,
              background: `radial-gradient(circle, ${
                isOn ? `${theme.hex}28` : 'rgba(255,255,255,0.10)'
              } 0%, transparent 70%)`,
            }}
          />
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 group-active:scale-95"
            style={
              isOn
                ? {
                    background: `linear-gradient(135deg, ${theme.orbFrom}, ${theme.orbTo})`,
                    boxShadow: `0 8px 32px ${theme.hex}${shadowAlpha}, 0 0 0 1px ${theme.hex}22`,
                    border: '1px solid transparent',
                  }
                : {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: 'none',
                  }
            }
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.25"
              stroke={isOn ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.30)'}
              className="transition-all duration-500"
            >
              <path d="M9 18h6m-5 4h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-center relative z-10">
        <div
          className={`text-[12px] font-bold tracking-[0.18em] uppercase transition-colors duration-500 ${
            isOn ? 'text-stone-600' : 'text-white/25'
          }`}
        >
          {isOn ? 'On' : 'Off'}
        </div>
        <div
          className={`flex items-center justify-center gap-2 text-[10px] font-medium mt-2 ${
            dark ? 'text-white/25' : 'text-stone-400'
          }`}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Auto off | {schedule}</span>
        </div>
      </div>
    </div>
  )
}
