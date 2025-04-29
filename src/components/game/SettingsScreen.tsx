'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState, PlayerConfig } from '../../context/GameStateContext';
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

    const handleSave = () => {
        onSave({ name, color });
    };

    const handleMouseEnter = () => {
        setPreviewPlayer(playerNumber);
    };

    const handleMouseLeave = () => {
        setPreviewPlayer(null);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-bold mb-2">Player {playerNumber}</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

            <div className="flex justify-between mt-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={handleSave}
                >
                    Save
                </button>
                <div
                    className="flex items-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <span className="text-sm text-gray-400 mr-2">Preview:</span>
                    <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>
        </div>
    );
};

const SettingsScreen: React.FC = () => {
    const {
        toggleSettings,
        playerConfigs,
        updatePlayerConfig,
        previewPlayer
    } = useGameState();

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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 perspective-1000">
            {/* Preview panel for buzz-in effect */}
            {previewPlayer !== null && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <NumberCanvas
                        activatedNumber={previewPlayer}
                        previewConfig={playerConfigs[previewPlayer]}
                    />
                </div>
            )}

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

                <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold mb-4 border-b border-gray-700 pb-2"
                >
                    Player Configuration
                </motion.h3>

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