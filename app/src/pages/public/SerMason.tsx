import styles from './PublicPages.module.css'
import { Shield, Heart, Crown, UserCheck } from 'lucide-react'

export function SerMason() {
    return (
        <div className={styles.container}>
            <header className={styles.heroSection}>
                <h1 className={styles.title}>¿Qué es ser Masón?</h1>
                <p className={styles.subtitle}>
                    "Hombre libre y de buenas costumbres, que nace a la luz para trabajar por la humanidad."
                </p>
            </header>

            <section className={styles.philosophyGrid}>
                <div className={styles.philosophyCard}>
                    <div className={styles.iconCircle}>
                        <Shield size={32} />
                    </div>
                    <h3>Ser Persona Libre</h3>
                    <p>
                        La libertad es nuestra piedra angular. Un masón debe entrar a la Orden por su propia voluntad,
                        libre de prejuicios, dogmas cegadores y dependencias que nublen su juicio.
                        Es el soberano de sus propios pensamientos.
                    </p>
                </div>

                <div className={styles.philosophyCard}>
                    <div className={styles.iconCircle}>
                        <Heart size={32} />
                    </div>
                    <h3>De Buenas Costumbres</h3>
                    <p>
                        Buscamos hombres de honor. La rectitud en la vida privada y pública, la honestidad
                        en el trabajo y el respeto por la palabra empeñada son los cimientos sobre los
                        que construimos nuestro templo interior.
                    </p>
                </div>

                <div className={styles.philosophyCard}>
                    <div className={styles.iconCircle}>
                        <Crown size={32} />
                    </div>
                    <h3>Creencia en un Principio</h3>
                    <p>
                        Respetamos la fe de cada individuo, pero exigimos el reconocimiento de un
                        Principio Superior. Bajo la alegoría del Gran Arquitecto del Universo,
                        unimos a hombres de distintos credos en una fraternidad universal.
                    </p>
                </div>

                <div className={styles.philosophyCard}>
                    <div className={styles.iconCircle}>
                        <UserCheck size={32} />
                    </div>
                    <h3>Deseo de Superación</h3>
                    <p>
                        La Masonería no es una meta, sino un viaje. Requiere una mente abierta al estudio,
                        un corazón dispuesto a la fraternidad y la voluntad de transformarse de
                        piedra bruta en piedra labrada.
                    </p>
                </div>
            </section>

            <section className={styles.callToAction}>
                <div className={styles.ctaContent}>
                    <h2>¿Sientes el llamado del Arte Real?</h2>
                    <p>
                        Si reúnes estas características y buscas un espacio de reflexión filosófica,
                        estudio simbólico y perfeccionamiento moral, puedes solicitar tu ingreso.
                    </p>
                    <button className={styles.ctaButton}>Iniciar Contacto</button>
                </div>
            </section>
        </div>
    )
}
