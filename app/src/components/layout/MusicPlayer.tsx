import { useMusic } from '../../contexts/MusicContext'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import styles from './MusicPlayer.module.css'

export function MusicPlayer() {
    const { isPlaying, togglePlay, isMuted, toggleMute, hasInteracted } = useMusic()

    if (!hasInteracted && !isPlaying) {
        return (
            <div className={styles.initialPrompt} onClick={togglePlay}>
                <span className={styles.pulse}>🎵</span>
                <span>Activar Ambiente</span>
            </div>
        )
    }

    return (
        <div className={styles.playerContainer}>
            <button className={styles.controlBtn} onClick={togglePlay} title={isPlaying ? "Pausar" : "Reproducir"}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className={styles.controlBtn} onClick={toggleMute} title={isMuted ? "Activar Sonido" : "Silenciar"}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
        </div>
    )
}
