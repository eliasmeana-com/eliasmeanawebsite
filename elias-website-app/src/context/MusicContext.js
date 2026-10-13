import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Howl } from 'howler';

const musicReq = require.context('../Music', false, /\.mp3$/);
const imageReq = require.context('../Music', false, /\.(png|jpe?g)$/);

export const songPaths = musicReq.keys().map(songKey => {
  const baseName = songKey.replace('./', '').replace('.mp3', '');

  let coverUrl = null;
  const possibleImages = [`./${baseName}.jpg`, `./${baseName}.jpeg`, `./${baseName}.png`];

  for (const imgPath of possibleImages) {
    if (imageReq.keys().includes(imgPath)) {
      coverUrl = imageReq(imgPath);
      break;
    }
  }

  return {
    title: baseName,
    url: musicReq(songKey),
    cover: coverUrl,
  };
});

export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const soundRef = useRef(null);
  const animationRef = useRef(null);
  const isPlayingRef = useRef(false);
  const volumeRef = useRef(0.8);
  const mutedRef = useRef(false);

  const currentTrack = songPaths[currentTrackIndex];

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const updateProgress = useCallback(() => {
    if (soundRef.current && soundRef.current.playing()) {
      setProgress(soundRef.current.seek() || 0);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % songPaths.length);
  }, []);

  // Create / rebuild the sound whenever the track changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const newSound = new Howl({
      src: [currentTrack.url],
      html5: isMobile,
      volume: mutedRef.current ? 0 : volumeRef.current,
      onend: handleNext,
      onload: () => setDuration(newSound.duration()),
      onplay: () => {
        animationRef.current = requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      },
    });

    soundRef.current = newSound;
    setProgress(0);

    if (isPlayingRef.current) {
      newSound.play();
    }

    return () => {
      newSound.unload();
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentTrackIndex, isMobile, updateProgress, handleNext, currentTrack.url]);

  const play = useCallback(() => {
    if (!soundRef.current) return;
    soundRef.current.play();
    setIsPlaying(true);
    isPlayingRef.current = true;
    setHasPlayed(true);
    setDismissed(false);
    animationRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  const pause = useCallback(() => {
    if (!soundRef.current) return;
    soundRef.current.pause();
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const next = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const previous = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + songPaths.length) % songPaths.length);
  }, []);

  const seek = useCallback((value) => {
    if (soundRef.current) {
      soundRef.current.seek(value);
      setProgress(value);
    }
  }, []);

  const selectTrack = useCallback((index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    isPlayingRef.current = true;
    setHasPlayed(true);
    setDismissed(false);
  }, []);

  const dismissMini = useCallback(() => {
    setDismissed(true);
  }, []);

  const changeVolume = useCallback((value) => {
    const clamped = Math.max(0, Math.min(1, value));
    volumeRef.current = clamped;
    setVolume(clamped);
    if (clamped > 0) {
      mutedRef.current = false;
      setMuted(false);
    }
    if (soundRef.current) {
      soundRef.current.volume(clamped);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    if (soundRef.current) {
      soundRef.current.volume(nextMuted ? 0 : volumeRef.current);
    }
  }, []);

  const value = useMemo(() => ({
    songPaths,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    progress,
    duration,
    hasPlayed,
    dismissed,
    volume,
    muted,
    play,
    pause,
    toggle,
    next,
    previous,
    seek,
    selectTrack,
    dismissMini,
    changeVolume,
    toggleMute,
  }), [currentTrack, currentTrackIndex, isPlaying, progress, duration, hasPlayed, dismissed, volume, muted, play, pause, toggle, next, previous, seek, selectTrack, dismissMini, changeVolume, toggleMute]);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return ctx;
}
