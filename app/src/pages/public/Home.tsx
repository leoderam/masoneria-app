import styles from './Home.module.css'
import { Link } from 'react-router-dom'
import { Shield, BookOpen, Users, Compass, Globe, Award, Play } from 'lucide-react'
import templeModern from '../../assets/images/temple_modern.png'
import symbolModern from '../../assets/images/symbol_modern.png'
import fraternityModern from '../../assets/images/fraternity_modern.png'
import masonicPillars from '../../assets/images/masonic_pillars_mystic.png'
import reelThumb1 from '../../assets/images/reel_thumb_1.png'
import reelRitual from '../../assets/images/reel_ritual.png'
import reelTools from '../../assets/images/reel_tools.png'
import reelPhilosophy from '../../assets/images/reel_philosophy.png'
import { useState, useLayoutEffect, useRef } from 'react'
import { VideoModal } from '../../components/layout/VideoModal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
    const [selectedVideo, setSelectedVideo] = useState<{ title: string, category: string, thumbnail: string } | null>(null)
    const mainRef = useRef<HTMLDivElement>(null)

    const handleOpenVideo = (title: string, category: string, thumbnail: string) => {
        setSelectedVideo({ title, category, thumbnail })
    }

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation: Staggered Entrance
            const tl = gsap.timeline()
            tl.fromTo(`.${styles.heroSymbol}`,
                { opacity: 0, y: -50, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    onComplete: () => {
                        gsap.to(`.${styles.heroSymbol}`, {
                            y: -15,
                            duration: 3,
                            ease: "power1.inOut",
                            yoyo: true,
                            repeat: -1
                        });
                    }
                }
            )
                .fromTo(`.${styles.heroTitle}`,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
                    "-=0.5"
                )
                .fromTo(`.${styles.heroSubtitle}`,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
                    "-=0.7"
                )
                .fromTo(`.${styles.heroActions}`,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
                    "-=0.5"
                )

            // Features Grid Scroll Trigger
            gsap.fromTo(`.${styles.featureCard}`,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: `.${styles.features}`,
                        start: "top 80%",
                    }
                }
            )

            // Degrees/Journey Scroll Trigger
            gsap.fromTo(`.${styles.degreeCard}`,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    stagger: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: `.${styles.degreesGrid}`,
                        start: "top 75%",
                    }
                }
            )

            // Reels Scroll Trigger
            gsap.fromTo(`.${styles.reelCard}`,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: `.${styles.reelsGrid}`,
                        start: "top 85%",
                    }
                }
            )

        }, mainRef)

        return () => ctx.revert()
    }, [])

    return (
        <div className={styles.home} ref={mainRef}>
            {/* Hero Section */}
            <header
                className={styles.hero}
                style={{ backgroundImage: `url(${templeModern})` }}
            >
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <img src={symbolModern} alt="Masonic Symbol" className={styles.heroSymbol} />
                    <h1 className={styles.heroTitle}>La tecnología ordena; el perfeccionamiento transforma.</h1>
                    <p className={styles.heroSubtitle}>
                        Un espacio digital moderno para el estudio, la fraternidad y la gestión organizacional con valores universales.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/ser-mason" className={`${styles.ctaButton} ${styles.primaryBtn}`}>Ser Masón</Link>
                        <Link to="/about" className={`${styles.ctaButton} ${styles.secondaryBtn}`}>Nuestra Orden</Link>
                    </div>
                </div>
            </header>

            {/* Introduction / About Section */}
            <section className={styles.introduction}>
                <div className={styles.introText}>
                    <h2>Masonería Moderna</h2>
                    <p>
                        La masonería es una institución esencialmente filantrópica, filosófica y progresista.
                        Esta aplicación busca modernizar los procesos administrativos y educativos,
                        fomentando la unión entre los hermanos a través de herramientas del siglo XXI,
                        siempre respetando la discreción y los antiguos linderos.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className={styles.features}>
                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}><Shield className={styles.featureIcon} /></div>
                    <h3>Privacidad y Orden</h3>
                    <p>Gestión segura de miembros y archivos con control jerárquico estricto por grado masónico.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}><BookOpen className={styles.featureIcon} /></div>
                    <h3>Biblioteca Digital</h3>
                    <p>Acceso centralizado a documentos, trazados y material de estudio histórico y moderno.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}><Users className={styles.featureIcon} /></div>
                    <h3>Multi-Logia</h3>
                    <p>Arquitectura escalable diseñada para soportar múltiples talleres manteniendo su autonomía.</p>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.iconWrapper}><Compass className={styles.featureIcon} /></div>
                    <h3>Simbolismo</h3>
                    <p>Formación y cultura masónica presentada a través de una interfaz limpia y respetuosa.</p>
                </div>
            </section>

            {/* Journey of the Initiate */}
            <section className={styles.journeySection}>
                <div className={styles.journeyHeader}>
                    <img src={masonicPillars} alt="Columnas Masónicas" className={styles.journeyHeaderImage} />
                    <h2 className="fade-in-up">El Caminar del Iniciado</h2>
                    <p className="fade-in-up">Un sendero de perfeccionamiento gradual, desde la piedra bruta hasta la maestría.</p>
                </div>

                <div className={styles.degreesGrid}>
                    {/* Grado 1: Aprendiz */}
                    <div className={styles.degreeCard}>
                        <div className={styles.degreeIcon}>I</div>
                        <h3>Aprendiz</h3>
                        <p>El silencio y el trabajo sobre uno mismo. La piedra bruta comienza a ser desbastada mediante el estudio de la moral y la virtud.</p>
                        <ul className={styles.degreeFeatures}>
                            <li>Estudio de sí mismo</li>
                            <li>Simbolismo moral</li>
                            <li>Fraternidad básica</li>
                        </ul>
                    </div>

                    {/* Grado 2: Compañero */}
                    <div className={styles.degreeCard}>
                        <div className={styles.degreeIcon}>II</div>
                        <h3>Compañero</h3>
                        <p>El estudio de la ciencia y el arte. El obrero aprende a usar herramientas más complejas para construir el templo social.</p>
                        <ul className={styles.degreeFeatures}>
                            <li>Ciencias liberales</li>
                            <li>Filosofía del trabajo</li>
                            <li>Solidaridad activa</li>
                        </ul>
                    </div>

                    {/* Grado 3: Maestro */}
                    <div className={styles.degreeCard} style={{ borderTop: '4px solid var(--color-gold)' }}>
                        <div className={styles.degreeIcon} style={{ background: 'var(--color-gold)', color: 'white' }}>III</div>
                        <h3>Maestro</h3>
                        <p>La muerte simbólica y el renacimiento. El maestro domina el arte real y guía a los demás con sabiduría y ejemplo.</p>
                        <ul className={styles.degreeFeatures}>
                            <li>Misterios mayores</li>
                            <li>Liderazgo espiritual</li>
                            <li>Plenitud masónica</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.journeyCta}>
                    <Link to="/ser-mason" className={`${styles.ctaButton} ${styles.primaryBtn}`}>
                        Comenzar mi Viaje
                    </Link>
                </div>
            </section>

            {/* Multimedia / Reels Section (New) */}
            <section className={styles.multimediaSection}>
                <h2>Formación Interactiva</h2>
                <div className={styles.reelsGrid}>
                    {/* Reel 1 */}
                    <div className={styles.reelCard} onClick={() => handleOpenVideo('El Origen de la Geometría', 'Historia', reelThumb1)}>
                        <img src={reelThumb1} alt="Simbolismo Geométrico" className={styles.reelThumbnail} />
                        <div className={styles.playOverlay}>
                            <Play fill="currentColor" />
                        </div>
                        <div className={styles.reelInfo}>
                            <span>Historia</span>
                            <h3>El Origen de la Geometría</h3>
                        </div>
                    </div>
                    {/* Reel 2 */}
                    <div className={styles.reelCard} onClick={() => handleOpenVideo('Liturgia y Ritual', 'Ritual', reelRitual)}>
                        <img src={reelRitual} alt="Ritual" className={styles.reelThumbnail} />
                        <div className={styles.playOverlay}>
                            <Play fill="currentColor" />
                        </div>
                        <div className={styles.reelInfo}>
                            <span>Ritual</span>
                            <h3>Misterios del Altar</h3>
                        </div>
                    </div>
                    {/* Reel 3 */}
                    <div className={styles.reelCard} onClick={() => handleOpenVideo('Herramientas Operativas', 'Simbología', reelTools)}>
                        <img src={reelTools} alt="Herramientas" className={styles.reelThumbnail} />
                        <div className={styles.playOverlay}>
                            <Play fill="currentColor" />
                        </div>
                        <div className={styles.reelInfo}>
                            <span>Simbolismo</span>
                            <h3>El Mazo y el Cincel</h3>
                        </div>
                    </div>
                    {/* Reel 4 */}
                    <div className={styles.reelCard} onClick={() => handleOpenVideo('Filosofía Antigua', 'Filosofía', reelPhilosophy)}>
                        <img src={reelPhilosophy} alt="Filosofía" className={styles.reelThumbnail} />
                        <div className={styles.playOverlay}>
                            <Play fill="currentColor" />
                        </div>
                        <div className={styles.reelInfo}>
                            <span>Filosofía</span>
                            <h3>Sabiduría Ancestral</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Global Fraternity Section */}
            <section className={styles.globalSection}>
                <div className={styles.globalContent}>
                    <div className={styles.globalText}>
                        <h2>Fraternidad sin Fronteras</h2>
                        <p>
                            Conecta con logias de todo el país. Nuestra plataforma permite la interconexión
                            respetuosa entre talleres para compartir eventos, tenidas conjuntas y trabajos
                            de investigación, fortaleciendo la cadena de unión universal.
                        </p>
                        <ul className={styles.benefitsList}>
                            <li><Globe size={18} /> Red de logias verificadas</li>
                            <li><Award size={18} /> Certificación de grados digital</li>
                            <li><Users size={18} /> Eventos inter-logias</li>
                        </ul>
                    </div>
                    <div className={styles.globalImageWrapper}>
                        <img src={fraternityModern} alt="Global Fraternity" className={styles.globalImage} />
                    </div>
                </div>
            </section>

            {/* Video Player Modal */}
            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                title={selectedVideo?.title || ''}
                category={selectedVideo?.category || ''}
                thumbnail={selectedVideo?.thumbnail || ''}
            />
        </div>
    )
}
