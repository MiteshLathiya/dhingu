import { useCallback, useRef, useEffect } from 'react';
import * as soundLib from '../lib/sounds';

/**
 * Custom hook for playing sound effects in React components
 * Provides easy access to all 16 sound effects with proper cleanup
 */
export function useSounds() {
  // Store cleanup functions for sounds that need them (typing, ambient)
  const cleanupFunctions = useRef<Record<string, () => void>>({});

  // Play sound and store cleanup function if needed
  const playSound = useCallback((soundName: string) => {
    switch (soundName) {
      case 'welcomeScreen':
        soundLib.playWelcomeScreen();
        break;
      case 'buttonClick':
        soundLib.playButtonClick();
        break;
      case 'screenTransition':
        soundLib.playScreenTransition();
        break;
      case 'giftBoxOpen':
        soundLib.playGiftBoxOpen();
        break;
      case 'heartBurst':
        soundLib.playHeartBurst();
        break;
      case 'loveLetterOpen':
        soundLib.playLoveLetterOpen();
        break;
      case 'typing':
        // Store cleanup function for typing
        cleanupFunctions.current['typing'] = soundLib.playTyping();
        break;
      case 'memoryReveal':
        soundLib.playMemoryReveal();
        break;
      case 'heartCatch':
        soundLib.playHeartCatch();
        break;
      case 'gameComplete':
        soundLib.playGameComplete();
        break;
      case 'countdownTick':
        soundLib.playCountdownTick();
        break;
      case 'candleBlow':
        soundLib.playCandleBlow();
        break;
      case 'fireworks':
        soundLib.playFireworks();
        break;
      case 'romanticKiss':
        soundLib.playRomanticKiss();
        break;
      case 'unlockHeart':
        soundLib.playUnlockHeart();
        break;
      case 'ambientLoop':
        // Store cleanup function for ambient
        cleanupFunctions.current['ambientLoop'] = soundLib.playAmbientLoop();
        break;
      default:
        console.warn(`Sound "${soundName}" not found`);
    }
  }, []);

  // Stop a specific looping sound
  const stopSound = useCallback((soundName: string) => {
    const cleanup = cleanupFunctions.current[soundName];
    if (cleanup) {
      cleanup();
      delete cleanupFunctions.current[soundName];
    }
  }, []);

  // Stop all playing sounds
  const stopAllSounds = useCallback(() => {
    Object.values(cleanupFunctions.current).forEach(cleanup => cleanup());
    cleanupFunctions.current = {};
  }, []);

  // Set volume
  const setVolume = useCallback((value: number) => {
    soundLib.setSoundVolume(value);
  }, []);

  // Mute/unmute
  const setMuted = useCallback((muted: boolean) => {
    soundLib.setSoundMuted(muted);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    setVolume,
    setMuted,
  };
}

// Individual sound hooks for convenience
export const useWelcomeScreen = () => useCallback(() => soundLib.playWelcomeScreen(), []);
export const useButtonClick = () => useCallback(() => soundLib.playButtonClick(), []);
export const useScreenTransition = () => useCallback(() => soundLib.playScreenTransition(), []);
export const useGiftBoxOpen = () => useCallback(() => soundLib.playGiftBoxOpen(), []);
export const useHeartBurst = () => useCallback(() => soundLib.playHeartBurst(), []);
export const useLoveLetterOpen = () => useCallback(() => soundLib.playLoveLetterOpen(), []);
export const useTyping = () => useCallback(() => soundLib.playTyping(), []);
export const useMemoryReveal = () => useCallback(() => soundLib.playMemoryReveal(), []);
export const useHeartCatch = () => useCallback(() => soundLib.playHeartCatch(), []);
export const useGameComplete = () => useCallback(() => soundLib.playGameComplete(), []);
export const useCountdownTick = () => useCallback(() => soundLib.playCountdownTick(), []);
export const useCandleBlow = () => useCallback(() => soundLib.playCandleBlow(), []);
export const useFireworks = () => useCallback(() => soundLib.playFireworks(), []);
export const useRomanticKiss = () => useCallback(() => soundLib.playRomanticKiss(), []);
export const useUnlockHeart = () => useCallback(() => soundLib.playUnlockHeart(), []);
export const useAmbientLoop = () => useCallback(() => soundLib.playAmbientLoop(), []);