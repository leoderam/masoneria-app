import { useState } from 'react'
import styles from './PublicPages.module.css'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "¿Es la Masonería una religión?",
            answer: "No. La Masonería no es una religión ni una sustituta de ella. Es una escuela de moral y filosofía que exige a sus miembros creer en un Ser Supremo, pero deja a cada individuo la libertad de practicar su propia fe."
        },
        {
            question: "¿Es una sociedad secreta?",
            answer: "No, es una sociedad 'discreta'. Nuestros fines son públicos, nuestras sedes son conocidas y nuestros miembros no ocultan su pertenencia. Lo que mantenemos en reserva son nuestros métodos de reconocimiento y rituales simbólicos, como parte de una tradición centenaria."
        },
        {
            question: "¿Qué hacen los masones en sus reuniones?",
            answer: "Nuestras reuniones (llamadas Tenidas) se centran en el estudio de símbolos, la presentación de trabajos filosóficos (Trazados) y la práctica de rituales que fomentan la introspección, el orden y la fraternidad."
        },
        {
            question: "¿Cuáles son los requisitos para ingresar?",
            answer: "Ser mayor de edad, tener libertad de pensamiento, poseer una solvencia moral reconocida y creer en un principio superior. No se requiere una posición económica alta, pero sí la capacidad de cubrir las cuotas de mantenimiento del taller."
        },
        {
            question: "¿Aceptan mujeres?",
            answer: "Históricamente la masonería fue masculina, pero hoy existen Logias Femeninas y Mixtas que trabajan con el mismo rigor y seriedad, manteniendo la independencia administrativa entre obediencias según sus tratados."
        }
    ]

    return (
        <div className={styles.container}>
            <header className={styles.heroSection}>
                <h1 className={styles.title}>Preguntas Frecuentes</h1>
                <p className={styles.subtitle}>
                    Aclara tus dudas sobre la Orden y descubre la verdad detrás de los mitos.
                </p>
            </header>

            <div className={styles.faqSection}>
                {faqs.map((faq, index) => (
                    <div key={index} className={styles.faqItem}>
                        <button
                            className={styles.faqQuestion}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <span>{faq.question}</span>
                            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {openIndex === index && (
                            <div className={styles.faqAnswer}>
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <section className={styles.callToAction} style={{ marginTop: '4rem' }}>
                <div className={styles.ctaContent}>
                    <HelpCircle size={48} style={{ color: 'var(--color-gold)', marginBottom: '1rem' }} />
                    <h2>¿Tienes más dudas?</h2>
                    <p>
                        Estamos abiertos a dialogar con hombres y mujeres de buena voluntad.
                        Contáctanos y un Maestro Masón se pondrá en contacto contigo.
                    </p>
                    <button className={styles.ctaButton}>Enviar Mensaje</button>
                </div>
            </section>
        </div>
    )
}
