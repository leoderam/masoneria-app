import styles from './VideoModal.module.css'
import { X, Play, Volume2, Share } from 'lucide-react'
import { useState, useEffect } from 'react'

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    category: string
    thumbnail: string
}

export function VideoModal({ isOpen, onClose, title, category, thumbnail }: VideoModalProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let interval: any
        if (isOpen && isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false)
                        return 100
                    }
                    return prev + 0.5
                })
            }, 100)
        }
        return () => clearInterval(interval)
    }, [isOpen, isPlaying])

    useEffect(() => {
        if (isOpen) {
            setIsPlaying(true)
            setProgress(0)
        } else {
            setIsPlaying(false)
            setProgress(0)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} color="#fff" />
                </button>

                <div className={styles.videoContainer}>
                    {/* Simulated Video Content */}
                    <img src={thumbnail} alt={title} className={styles.videoBackground} />

                    {/* Visualizer / Animation Layer */}
                    <div className={`${styles.visualizer} ${isPlaying ? styles.active : ''}`}>
                        <div className={styles.pulseCircle}></div>
                        <div className={styles.rotatingSquare}></div>
                    </div>

                    <div className={styles.controlsOverlay}>
                        <div className={styles.topBar}>
                            <span className={styles.categoryTag}>{category}</span>
                            <div className={styles.topActions}>
                                <Volume2 size={20} />
                            </div>
                        </div>

                        <div className={styles.centerPlay} onClick={() => setIsPlaying(!isPlaying)}>
                            {!isPlaying && <div className={styles.playIconWrapper}><Play fill="white" size={40} /></div>}
                        </div>

                        <div className={styles.bottomBar}>
                            <div className={styles.videoInfo}>
                                <h3>{title}</h3>
                                <p>Explorando los misterios del arte real.</p>
                            </div>

                            <div className={styles.actions}>
                                <div className={styles.actionBtn}>
                                    <Share size={24} />
                                    <span>Compartir</span>
                                </div>
                            </div>

                            <div className={styles.progressBarContainer}>
                                <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
