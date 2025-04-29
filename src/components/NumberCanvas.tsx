'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameState, GameStateProvider, PlayerConfig } from '../context/GameStateContext';

interface NumberCanvasProps {
  children?: React.ReactNode;
  activatedNumber?: string | null;
  // Direct props for preview mode to work without context
  previewConfig?: PlayerConfig;
}

const NumberCanvas = ({ children, activatedNumber, previewConfig }: NumberCanvasProps) => {
  // If this is being used as a provider wrapper
  if (children) {
    return (
      <GameStateProvider>
        {children}
      </GameStateProvider>
    );
  }

  // Helper function to get the RGB values from a CSS color name
  const getColorStyle = (color: string, opacity: number = 1) => {
    // Create a temporary div to compute the RGB values
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    
    // Get the computed color
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    
    // If we have a valid color value, return it with the opacity; otherwise use fallback
    if (computedColor && computedColor !== 'rgb(0, 0, 0)') {
      const rgb = computedColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
      }
    }
    
    // Fallback to red if color conversion fails
    return `rgba(255, 0, 0, ${opacity})`;
  };

  // For preview mode - use provided config directly if available
  if (activatedNumber && previewConfig) {
    // Using direct props instead of context
    const playerName = previewConfig.name || `Player ${activatedNumber}`;
    const playerColor = previewConfig.color || 'red';
    
    const colorWithIntensity = getColorStyle(playerColor);
    const glowColor = getColorStyle(playerColor, 0.7);

    return (
      <div className="flex items-center justify-center w-full h-full">
        <motion.div 
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.5,
              ease: "easeOut"
            }
          }}
        >
          {/* Pulsing animation for the preview */}
          <motion.div
            className="absolute"
            animate={{
              boxShadow: [
                `0 0 10px ${glowColor}`, 
                `0 0 20px ${glowColor}`, 
                `0 0 10px ${glowColor}`
              ],
              scale: [1, 1.05, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: `8px solid ${colorWithIntensity}`
            }}
          />
          <motion.h1
            className="text-[80px] font-bold z-10"
            animate={{
              textShadow: [
                `0 0 10px ${glowColor}`, 
                `0 0 20px ${glowColor}`, 
                `0 0 10px ${glowColor}`
              ],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              color: colorWithIntensity
            }}
          >
            {playerName}
          </motion.h1>
        </motion.div>
      </div>
    );
  }
  
  // For use inside context - using context
  if (activatedNumber) {
    try {
      const { playerConfigs } = useGameState();
      const playerConfig = playerConfigs[activatedNumber];
      const playerName = playerConfig?.name || `Player ${activatedNumber}`;
      const playerColor = playerConfig?.color || 'red';

      const colorWithIntensity = getColorStyle(playerColor);
      const glowColor = getColorStyle(playerColor, 0.7);
      
      return (
        <div className="flex items-center justify-center w-full h-full">
          <motion.div 
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }}
          >
            {/* Pulsing animation for the preview */}
            <motion.div
              className="absolute"
              animate={{
                boxShadow: [
                  `0 0 10px ${glowColor}`, 
                  `0 0 20px ${glowColor}`, 
                  `0 0 10px ${glowColor}`
                ],
                scale: [1, 1.05, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: `8px solid ${colorWithIntensity}`
              }}
            />
            <motion.h1
              className="text-[80px] font-bold z-10"
              animate={{
                textShadow: [
                  `0 0 10px ${glowColor}`, 
                  `0 0 20px ${glowColor}`, 
                  `0 0 10px ${glowColor}`
                ],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              style={{
                color: colorWithIntensity
              }}
            >
              {playerName}
            </motion.h1>
          </motion.div>
        </div>
      );
    } catch (error) {
      // If context is not available, return an empty div
      return null;
    }
  }
  
  return null;
};

export default NumberCanvas;