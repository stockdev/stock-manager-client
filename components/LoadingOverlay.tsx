import React from 'react'
import { motion } from 'framer-motion'

const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/95 backdrop-blur-md">
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity
            }}
            style={{
              padding: "2px"
            }}
          >
            <div className="w-full h-full bg-gray-900 rounded-full" />
          </motion.div>
  
          <motion.div
            className="relative w-24 h-24 flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity
            }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3"
                initial={{
                  opacity: 0.1,
                  scale: 0.5,
                }}
                animate={{
                  opacity: [0.1, 1, 0.1],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) ${i * 30}%, rgb(168, 85, 247) ${i * 60}%)`,
                  borderRadius: "50%",
                  transform: `rotate(${i * 30}deg) translateY(-32px)`,
                }}
              />
            ))}
  
            <motion.div
              className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
  
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0
              }}
              animate={{
                x: Math.sin(i) * 50,
                y: Math.cos(i) * 50,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
  
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading...
          </motion.div>
        </div>
      </div>
    );
}

export default LoadingOverlay;

