"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface CompassLogoProps {
  size?: number
  showWordmark?: boolean
  href?: string
  className?: string
}

export function CompassLogo({
  size = 32,
  showWordmark = true,
  href = "/",
  className = "",
}: CompassLogoProps) {
  const logo = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer ring */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Compass circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#C9A961"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Cardinal points */}
          <text
            x="16"
            y="5"
            textAnchor="middle"
            fontSize="4"
            fill="#C9A961"
            fontFamily="serif"
            fontWeight="600"
          >
            N
          </text>
          <text
            x="16"
            y="30"
            textAnchor="middle"
            fontSize="4"
            fill="#4A6B5C"
            fontFamily="serif"
          >
            S
          </text>
          <text
            x="29"
            y="17"
            textAnchor="middle"
            fontSize="4"
            fill="#4A6B5C"
            fontFamily="serif"
          >
            E
          </text>
          <text
            x="3"
            y="17"
            textAnchor="middle"
            fontSize="4"
            fill="#4A6B5C"
            fontFamily="serif"
          >
            W
          </text>
          {/* Tick marks */}
          <line x1="16" y1="3" x2="16" y2="6" stroke="#C9A961" strokeWidth="1" />
          <line x1="16" y1="26" x2="16" y2="29" stroke="#4A6B5C" strokeWidth="0.75" />
          <line x1="3" y1="16" x2="6" y2="16" stroke="#4A6B5C" strokeWidth="0.75" />
          <line x1="26" y1="16" x2="29" y2="16" stroke="#4A6B5C" strokeWidth="0.75" />
        </svg>
        {/* Animated needle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          whileHover={{ rotate: 360 }}
        >
          <svg
            width={size * 0.5}
            height={size * 0.5}
            viewBox="0 0 16 16"
            fill="none"
          >
            {/* North needle (brass) */}
            <polygon points="8,1 6.5,8 8,7 9.5,8" fill="#C9A961" />
            {/* South needle (dark) */}
            <polygon points="8,15 6.5,8 8,9 9.5,8" fill="#1F3A2F" />
            <circle cx="8" cy="8" r="1.5" fill="#C9A961" />
          </svg>
        </motion.div>
      </div>

      {showWordmark && (
        <span
          className="font-display font-semibold text-forest-deep"
          style={{
            fontSize: size * 0.56,
            letterSpacing: "-0.02em",
            fontVariationSettings: "'opsz' 144",
          }}
        >
          LCA-Kompas
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{logo}</Link>
  }
  return logo
}

export function LoadingCompass({ size = 48 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="24"
            cy="24"
            r="21"
            stroke="#B8C5B0"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="21"
            stroke="#C9A961"
            strokeWidth="2"
            fill="none"
            strokeDasharray="66"
            strokeDashoffset="44"
            strokeLinecap="round"
          />
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        >
          <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 10,12 12,11 14,12" fill="#C9A961" />
            <polygon points="12,22 10,12 12,13 14,12" fill="#1F3A2F" />
            <circle cx="12" cy="12" r="2" fill="#C9A961" />
          </svg>
        </motion.div>
      </div>
      <p className="text-sm text-moss font-sans">Indlæser...</p>
    </div>
  )
}
