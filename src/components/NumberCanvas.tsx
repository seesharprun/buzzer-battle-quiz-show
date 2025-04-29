'use client';

import { GameStateProvider } from '../context/GameStateContext';

type NumberCanvasProps = {
  children: React.ReactNode;
};

const NumberCanvas = ({ children }: NumberCanvasProps) => {
  return (
    <GameStateProvider>
      {children}
    </GameStateProvider>
  );
};

export default NumberCanvas;