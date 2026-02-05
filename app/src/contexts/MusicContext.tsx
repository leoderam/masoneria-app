import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface MusicContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    volume: number;
    setVolume: (vol: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
    hasInteracted: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.3); // Start at 30% volume
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio
        const audio = new Audio('/audio/ambient_mystic.mp3');
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        // Cleanup
        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
                setHasInteracted(true);
            } catch (error) {
                console.error("Audio playback failed:", error);
            }
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    const setVolume = (val: number) => {
        setVolumeState(val);
        if (val > 0 && isMuted) setIsMuted(false);
    };

    return (
        <MusicContext.Provider value={{ isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute, hasInteracted }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}
