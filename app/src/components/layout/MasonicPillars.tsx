import styles from './MasonicPillars.module.css'

export function MasonicPillars() {
    return (
        <div className={styles.pillarsContainer}>
            {/* Column J */}
            <div className={`${styles.pillar} ${styles.pillarLeft}`}>
                <div className={styles.capital}>
                    <div className={styles.sphere}></div>
                    <span className={styles.letter}>J</span>
                </div>
                <div className={styles.shaft}>
                    <div className={styles.fluting}></div>
                    <div className={styles.fluting}></div>
                    <div className={styles.fluting}></div>
                </div>
                <div className={styles.base}></div>
            </div>

            {/* Column B */}
            <div className={`${styles.pillar} ${styles.pillarRight}`}>
                <div className={styles.capital}>
                    <div className={styles.sphere}></div>
                    <span className={styles.letter}>B</span>
                </div>
                <div className={styles.shaft}>
                    <div className={styles.fluting}></div>
                    <div className={styles.fluting}></div>
                    <div className={styles.fluting}></div>
                </div>
                <div className={styles.base}></div>
            </div>
        </div>
    )
}
