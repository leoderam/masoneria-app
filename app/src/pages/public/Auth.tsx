import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './Auth.module.css'
import { LogIn, UserPlus } from 'lucide-react'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResendSuccess(false)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/dashboard')
        }
    }

    const handleResend = async () => {
        if (!email) return alert('Ingresa tu email primero')
        setResending(true)
        setError(null)

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        })

        if (error) {
            setError(`Error al reeviar: ${error.message}`)
        } else {
            setResendSuccess(true)
        }
        setResending(false)
    }

    const getErrorMessage = (err: string) => {
        if (err.includes('Email not confirmed')) {
            return 'Tu correo electrónico aún no ha sido confirmado. Por favor, revisa tu bandeja de entrada (y la carpeta de SPAM).'
        }
        if (err.includes('Invalid login credentials')) {
            return 'Credenciales inválidas. Verifica tu correo y contraseña.'
        }
        return err
    }

    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleLogin} className={styles.authForm}>
                <LogIn className={styles.authIcon} size={48} />
                <h2>Acceso Miembros</h2>
                {error && (
                    <div className={styles.error} style={{ textAlign: 'center' }}>
                        <p>{getErrorMessage(error)}</p>
                        {error.includes('confirmed') && (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className={styles.resendBtn}
                                style={{
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    background: 'var(--color-primary-blue)',
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {resending ? 'Reenviando...' : 'Reenviar email de confirmación'}
                            </button>
                        )}
                    </div>
                )}
                {resendSuccess && (
                    <div className={styles.success} style={{
                        color: '#059669',
                        background: '#ecfdf5',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid #10b981'
                    }}>
                        <strong>¡Enlace Enviado!</strong><br />
                        Hemos enviado un nuevo correo a <strong>{email}</strong>. Por favor, revísalo para activar tu cuenta.
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className={styles.authButton}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}

export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [accessCode, setAccessCode] = useState('') // New state for Access Code
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Simple validation of Access Code
        // In a real app, this should be verified against a DB table or Edge Function
        if (accessCode !== 'LOGIA777') {
            setError('Código de Acceso Inválido. Consulta con tu Venerable Maestro.')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.successBox}>
                    <h2>¡Solicitud Aceptada!</h2>
                    <p>Tu código ha sido validado. Revisa tu correo para confirmar tu cuenta y acceder al Panel.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleRegister} className={styles.authForm}>
                <UserPlus className={styles.authIcon} size={48} />
                <h2>Solicitud de Información</h2>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.inputGroup}>
                    <label>Código de Acceso (Requerido)</label>
                    <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                        placeholder="Ej. LOGIA777"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Nombre Completo</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className={styles.authButton}>
                    {loading ? 'Verificando...' : 'Validar Acceso'}
                </button>
            </form>
        </div>
    )
}
