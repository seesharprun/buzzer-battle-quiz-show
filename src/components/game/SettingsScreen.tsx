'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState, PlayerConfig, DEFAULT_COLORS } from '../../context/GameStateContext';
import NumberCanvas from '../NumberCanvas';

// HTML named colors for the color picker
const HTML_COLORS = [
    'Red', 'Blue', 'Yellow', 'Green', 'Cyan',
    'Magenta', 'Orange', 'Purple', 'Pink', 'Black',
    'White', 'Gold', 'Lime', 'Crimson', 'DarkBlue',
    'DodgerBlue', 'DeepPink', 'OrangeRed', 'Indigo', 'Chartreuse'
];

interface PlayerEditorProps {
    playerNumber: string;
    config: PlayerConfig;
    onSave: (config: PlayerConfig) => void;
}

// Component for editing a single player's configuration
const PlayerEditor: React.FC<PlayerEditorProps> = ({ playerNumber, config, onSave }) => {
    const [name, setName] = useState(config.name);
    const [color, setColor] = useState(config.color);
    const { setPreviewPlayer } = useGameState();
    const [isDirty, setIsDirty] = useState(false);
    const [showSaveAnimation, setShowSaveAnimation] = useState(false);
    
    // Track if there are unsaved changes
    useEffect(() => {
        if (name !== config.name || color !== config.color) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [name, color, config.name, config.color]);

    const handleSave = () => {
        onSave({ name, color });
        setIsDirty(false);
        
        // Show save animation
        setShowSaveAnimation(true);
        setTimeout(() => {
            setShowSaveAnimation(false);
        }, 1500);
    };
    
    const handleReset = () => {
        setName(config.name);
        setColor(config.color);
        setIsDirty(false);
    };

    // Set this player as the preview on mount and clear on unmount
    useEffect(() => {
        setPreviewPlayer(playerNumber);
        return () => setPreviewPlayer(null);
    }, [playerNumber, setPreviewPlayer]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-bold mb-2 flex items-center">
                Player {playerNumber}
                {isDirty && (
                    <span className="ml-2 text-amber-400 text-sm" title="Unsaved changes">*</span>
                )}
            </h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                </label>

                <div className="flex justify-between items-center mt-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-2 flex gap-2">
                        <button
                            className="relative px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={handleSave}
                            disabled={!isDirty}
                        >
                            Save
                            {showSaveAnimation && (
                                <motion.span
                                    className="absolute inset-0 bg-green-500 rounded-md z-0"
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                />
                            )}
                        </button>
                        {isDirty && (
                            <button 
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                onClick={handleReset}
                                title="Reset to last saved values"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color
                </label>
                <div className="grid grid-cols-10 gap-1 max-h-32 overflow-y-auto p-2 bg-gray-700 rounded-md">
                    {HTML_COLORS.map((colorName) => (
                        <div
                            key={colorName}
                            className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${color === colorName.toLowerCase() ? 'ring-2 ring-white scale-125' : ''}`}
                            style={{ backgroundColor: colorName }}
                            onClick={() => setColor(colorName.toLowerCase())}
                            title={colorName}
                        />
                    ))}
                </div>
            </div>

            {/* Small preview area */}
            <div className="mt-4 border border-gray-600 rounded-md p-2">
                <div className="text-xs text-gray-400 mb-1">Buzz-in Preview</div>
                <div className="h-20 bg-gray-900 rounded relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div style={{ transform: 'scale(0.25)', transformOrigin: 'center center' }}>
                            <NumberCanvas 
                                activatedNumber={playerNumber} 
                                previewConfig={{ name, color }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsScreen: React.FC = () => {
    const {
        toggleSettings,
        playerConfigs,
        updatePlayerConfig
    } = useGameState();
    
    const [showResetAnimation, setShowResetAnimation] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: -50,
            rotateX: 45
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 50,
            rotateX: -45,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    const handleSaveConfig = (playerNumber: string, newConfig: PlayerConfig) => {
        updatePlayerConfig(playerNumber, newConfig);
    };
    
    const handleResetAllToDefaults = () => {
        // Reset all players to default configuration
        Object.keys(playerConfigs).forEach(playerNumber => {
            const defaultConfig = {
                name: `Player ${playerNumber}`,
                color: DEFAULT_COLORS[parseInt(playerNumber) % DEFAULT_COLORS.length].toLowerCase()
            };
            updatePlayerConfig(playerNumber, defaultConfig);
        });
        
        // Show reset animation
        setShowResetAnimation(true);
        setTimeout(() => {
            setShowResetAnimation(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 perspective-1000">
            <motion.div
                className="relative bg-gray-900 text-white p-6 rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <button
                        onClick={toggleSettings}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Back to Game
                    </button>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h3 className="text-xl font-bold">Player Configuration</h3>
                    <div className="relative">
                        <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                            onClick={handleResetAllToDefaults}
                        >
                            Reset All to Defaults
                        </button>
                        {showResetAnimation && (
                            <motion.span
                                className="absolute inset-0 bg-yellow-500 rounded-md z-0"
                                initial={{ opacity: 0.7 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            />
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(playerConfigs).map((playerNumber) => (
                        <motion.div key={playerNumber} variants={itemVariants}>
                            <PlayerEditor
                                playerNumber={playerNumber}
                                config={playerConfigs[playerNumber]}
                                onSave={(newConfig) => handleSaveConfig(playerNumber, newConfig)}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default SettingsScreen;