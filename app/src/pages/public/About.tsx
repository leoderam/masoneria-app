import styles from './PublicPages.module.css'
import masonicWisdom from '../../assets/images/masonic_wisdom_mystic.png'
import masterChair from '../../assets/images/worshipful_master_chair.png'

export function About() {
    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.aboutHeader}>
                <h1 className="fade-in-up">Nuestra Orden</h1>
                <p className="fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                    Una institución universal dedicada a la búsqueda de la verdad y el perfeccionamiento moral de la humanidad.
                </p>
            </div>

            {/* Philosophy Section */}
            <section className={styles.splitSection}>
                <div className={`${styles.splitContent} fade-in-up`}>
                    <h2>Luz y Sabiduría</h2>
                    <p>
                        La Francmasonería es mucho más que una organización fraternal; es una escuela de vida.
                        A través del estudio de nuestros antiguos símbolos y alegorías, buscamos despertar la conciencia
                        del individuo para que se convierta en un mejor ciudadano, padre y amigo.
                    </p>
                    <p>
                        Nuestra filosofía no es dogmática. Respetamos todas las creencias y unimos a hombres
                        de todas las razas, religiones y trasfondos sociales bajo el lazo universal de la fraternidad.
                    </p>
                </div>
                <div className={`${styles.splitImage} fade-in-up`} style={{ animationDelay: '0.2s' }}>
                    <img src={masonicWisdom} alt="Sabiduría Masónica" />
                </div>
            </section>

            {/* Values Grid */}
            <div className={styles.grid} style={{ margin: '6rem 0' }}>
                <div className={`${styles.card} fade-in-up`} style={{ animationDelay: '0.1s' }}>
                    <h3>Libertad</h3>
                    <p>De pensamiento y conciencia, esencial para la búsqueda de la verdad sin cadenas dogmáticas.</p>
                </div>
                <div className={`${styles.card} fade-in-up`} style={{ animationDelay: '0.2s' }}>
                    <h3>Igualdad</h3>
                    <p>Reconocemos a todos los seres humanos como hermanos, sin distinción de rango o fortuna.</p>
                </div>
                <div className={`${styles.card} fade-in-up`} style={{ animationDelay: '0.3s' }}>
                    <h3>Fraternidad</h3>
                    <p>El cemento que une nuestra estructura, promoviendo la solidaridad y el apoyo mutuo.</p>
                </div>
            </div>

            {/* Leadership Section */}
            <section className={`${styles.splitSection} ${styles.reversed}`}>
                <div className={`${styles.splitImage} fade-in-up`}>
                    <img src={masterChair} alt="La Silla del Venerable" />
                </div>
                <div className={`${styles.splitContent} fade-in-up`} style={{ animationDelay: '0.2s' }}>
                    <h2>Gobierno y Liderazgo</h2>
                    <p>
                        La Logia es gobernada por el Venerable Maestro, quien, sentado en el Oriente,
                        dirige los trabajos y vela por la armonía del taller. Su autoridad es simbólica y moral,
                        representando la sabiduría del Rey Salomón.
                    </p>
                    <p>
                        Esta estructura jerárquica no busca el poder, sino el orden. Cada oficial tiene un deber específico,
                        asegurando que el trabajo masónico se realice con fuerza, belleza y sabiduría.
                    </p>
                </div>
            </section>

            <section className={styles.section} style={{ marginTop: '6rem', textAlign: 'center' }}>
                <h2>Trabajo Interior</h2>
                <p>
                    Utilizamos las herramientas de la construcción (la escuadra, el compás, el nivel) como
                    metáforas para la construcción de una sociedad más justa y un individuo más íntegro.
                    Cada masón es, simbólicamente, una piedra que debe ser pulida para formar parte del templo universal.
                </p>
            </section>
        </div>
    )
}
