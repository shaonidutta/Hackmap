"use client"

import { motion } from "framer-motion"

export default function HeroGraphic() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Main circle - represents the hackathon hub */}
      <motion.div
        className="absolute w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="w-40 h-40 bg-blue-500/30 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 30px rgba(59, 130, 246, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-white font-bold text-xl">HackMap</div>
        </motion.div>
      </motion.div>

      {/* Orbiting elements - represent teams and projects */}
      <OrbitingElement size="w-16 h-16" color="bg-blue-400/40" orbitSize={140} speed={20} delay={0} icon="💻" />

      <OrbitingElement
        size="w-14 h-14"
        color="bg-indigo-400/40"
        orbitSize={140}
        speed={25}
        delay={5}
        icon="🚀"
        offsetAngle={120}
      />

      <OrbitingElement
        size="w-12 h-12"
        color="bg-sky-400/40"
        orbitSize={140}
        speed={15}
        delay={10}
        icon="🔧"
        offsetAngle={240}
      />

      {/* Outer orbiting elements - represent participants */}
      <OrbitingElement size="w-10 h-10" color="bg-blue-300/30" orbitSize={200} speed={30} delay={0} icon="👩‍💻" />

      <OrbitingElement
        size="w-10 h-10"
        color="bg-indigo-300/30"
        orbitSize={200}
        speed={35}
        delay={7}
        icon="👨‍💻"
        offsetAngle={72}
      />

      <OrbitingElement
        size="w-10 h-10"
        color="bg-sky-300/30"
        orbitSize={200}
        speed={25}
        delay={14}
        icon="👩‍🎨"
        offsetAngle={144}
      />

      <OrbitingElement
        size="w-10 h-10"
        color="bg-blue-200/30"
        orbitSize={200}
        speed={40}
        delay={21}
        icon="👨‍🔬"
        offsetAngle={216}
      />

      <OrbitingElement
        size="w-10 h-10"
        color="bg-indigo-200/30"
        orbitSize={200}
        speed={20}
        delay={28}
        icon="👩‍🚀"
        offsetAngle={288}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <motion.circle
          cx="50%"
          cy="50%"
          r="140"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="200"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </svg>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 right-10 w-20 h-20 rounded-full bg-blue-300/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-indigo-300/10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
      />
    </div>
  )
}

interface OrbitingElementProps {
  size: string
  color: string
  orbitSize: number
  speed: number
  delay: number
  icon: string
  offsetAngle?: number
}

function OrbitingElement({ size, color, orbitSize, speed, delay, icon, offsetAngle = 0 }: OrbitingElementProps) {
  return (
    <motion.div
      className={`absolute ${size} ${color} backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-lg`}
      initial={{
        opacity: 0,
        x: 0,
        y: 0,
      }}
      animate={{
        opacity: 1,
        x: `${(orbitSize / 2) * Math.cos((offsetAngle * Math.PI) / 180)}px`,
        y: `${(orbitSize / 2) * Math.sin((offsetAngle * Math.PI) / 180)}px`,
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        x: { duration: 0.5, delay },
      }}
      style={{
        transformOrigin: "center center",
      }}
    >
      <motion.div
        animate={{
          rotate: [offsetAngle, offsetAngle + 360],
        }}
        transition={{
          duration: speed,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay,
        }}
        style={{
          width: orbitSize,
          height: orbitSize,
          position: "absolute",
          borderRadius: "50%",
        }}
      >
        <div
          className={`${size} ${color} backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center shadow-lg`}
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {icon}
        </div>
      </motion.div>
    </motion.div>
  )
}
