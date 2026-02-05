import styles from './PublicPages.module.css'
import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function Contact() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        try {
            // 1. Guardar en Supabase
            const { error } = await supabase
                .from('contact_requests')
                .insert([{
                    full_name: formData.fullName,
                    email: formData.email,
                    message: formData.message
                }])

            if (error) throw error

            // 2. Preparar mensaje para WhatsApp
            const waNumber = "523300000000" // NUMERO DE EJEMPLO - El usuario debería configurar el real
            const waMessage = `Hola, mi nombre es ${formData.fullName}. Estoy interesado en la Masonería.\n\nEmail: ${formData.email}\nMotivo: ${formData.message}`
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`

            // 3. Abrir WhatsApp
            window.open(waUrl, '_blank')

            setStatus('success')
            setFormData({ fullName: '', email: '', message: '' })
        } catch (error) {
            console.error('Error saving contact request:', error)
            setStatus('error')
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.heroSection}>
                <h1 className={styles.title}>Contacto e Ingreso</h1>
                <p className={styles.subtitle}>
                    ¿Buscas la Luz? Envíanos un mensaje y un Hermano se pondrá en contacto contigo para guiarte.
                </p>
            </header>

            <div className={styles.contactContainer}>
                <div className={styles.contactInfo}>
                    <h2>Buscad y Hallaréis</h2>
                    <p>
                        La Masonería no hace proselitismo. Sin embargo, nuestras puertas están abiertas
                        para hombres y mujeres libres de espíritu que busquen su perfeccionamiento.
                    </p>

                    <div className={styles.infoItems}>
                        <div className={styles.infoItem}>
                            <Mail className={styles.infoIcon} />
                            <div>
                                <strong>Correo Electrónico</strong>
                                <p>contacto@compasyescuadra.com</p>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <MapPin className={styles.infoIcon} />
                            <div>
                                <strong>Oriente de Guadalajara</strong>
                                <p>Calle de la Fraternidad #33, Jalisco, México.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.masonicNotice}>
                        <p>
                            <em>
                                "La Masonería es una forma de vida, un compromiso con la verdad y la virtud."
                            </em>
                        </p>
                    </div>
                </div>

                <div className={styles.contactFormWrapper}>
                    {status === 'success' ? (
                        <div className={styles.successMessage}>
                            <CheckCircle size={48} color="var(--color-gold)" />
                            <h2>Solicitud Enviada</h2>
                            <p>Tu mensaje ha sido registrado y enviado por WhatsApp. Un Hermano te contactará pronto.</p>
                            <button onClick={() => setStatus('idle')} className={styles.secondaryBtn} style={{ marginTop: '1rem' }}>
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Tu nombre..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Mensaje / Motivo de interés</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Cuéntanos por qué buscas ingresar..."
                                        rows={5}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            {status === 'error' && (
                                <p className={styles.errorText}>Hubo un error al enviar tu solicitud. Inténtalo de nuevo.</p>
                            )}
                            <button
                                type="submit"
                                className={styles.ctaButton}
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={status === 'loading'}
                            >
                                <Send size={18} /> {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
