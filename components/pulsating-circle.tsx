"use client"

import { useEffect, useState } from "react"

interface PulsatingCircleProps {
  isScanning: boolean
}

export function PulsatingCircle({ isScanning }: PulsatingCircleProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!isScanning) return

    let animationFrame: number
    let growing = true
    let currentScale = 1

    const animate = () => {
      if (growing) {
        currentScale += 0.01
        if (currentScale >= 1.2) growing = false
      } else {
        currentScale -= 0.01
        if (currentScale <= 1) growing = true
      }

      setScale(currentScale)
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isScanning])

  if (!isScanning) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="w-72 h-72 rounded-full border-4 border-blue-500 opacity-50"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.01s linear",
        }}
      />
    </div>
  )
}
