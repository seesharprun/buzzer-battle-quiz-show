'use client';

import React, { useRef } from 'react';

const Canvas: React.FC = () => {
  // Define the canvas ref with the correct type
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // If you want to use a custom animation hook, ensure it is implemented and imported correctly.
  // Otherwise, remove this line if not needed.
  // useCanvasAnimation(canvasRef);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
};

export default Canvas;