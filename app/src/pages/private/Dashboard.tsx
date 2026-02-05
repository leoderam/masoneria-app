import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../features/auth/AuthContext'
import styles from './Dashboard.module.css'
import { Shield, Calendar, BookOpen, AlertCircle } from 'lucide-react'

export function Dashboard() {
    const { profile, memberships } = useAuth()
    const [events, setEvents] = useState<any[]>([])
    const [logiaNames, setLogiaNames] = useState<Record<string, string>>({})
    const [loadingEvents, setLoadingEvents] = useState(true)

    const getGradeName = (grade: number) => {
        switch (grade) {
            case 1: return 'Aprendiz'
            case 2: return 'Compañero'
            case 3: return 'Maestro'
            default: return 'Miembro'
        }
    }

    const getGradeColor = (grade: number) => {
        switch (grade) {
            case 1: return '#3b82f6' // Blue
            case 2: return '#eab308' // Yellow/Gold
            case 3: return '#ef4444' // Red
            default: return '#6b7280'
        }
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (memberships.length === 0) {
                setLoadingEvents(false)
                return
            }

            const ids = memberships.map(m => m.logia_id)

            try {
                // Fetch Logia Names
                const { data: logiaData } = await supabase
                    .from('logias')
                    .select('id, nombre')
                    .in('id', ids)

                if (logiaData) {
                    const namesMap = logiaData.reduce((acc: any, curr: any) => {
                        acc[curr.id] = curr.nombre
                        return acc
                    }, {})
                    setLogiaNames(namesMap)
                }

                // Fetch Events
                const { data: eventData, error } = await supabase
                    .from('events')
                    .select('*')
                    .in('logia_id', ids)
                    .gte('event_date', new Date().toISOString())
                    .order('event_date', { ascending: true })
                    .limit(5)

                if (error) throw error
                setEvents(eventData || [])
            } catch (error) {
                console.error('Dashboard Fetch Error:', error)
            } finally {
                setLoadingEvents(false)
            }
        }

        fetchDashboardData()
    }, [memberships])

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Bienvenido, {profile?.full_name || 'Hermano'}</h1>
                <p>Tu progreso masónico y actividades recientes.</p>
            </header>

            <div className={styles.statsGrid}>
                {memberships.length === 0 ? (
                    <div className={styles.noMembership}>
                        <AlertCircle size={40} />
                        <p>No tienes logias asociadas todavía. Por favor contacta al secretario de tu logia.</p>
                    </div>
                ) : (
                    memberships.map((m, idx) => (
                        <div key={idx} className={styles.membershipCard}>
                            <Shield className={styles.cardIcon} />
                            <div>
                                <h3>{logiaNames[m.logia_id] || `Cargando Logia...`}</h3>
                                <p className={styles.grade}>{getGradeName(m.grade)}</p>
                                {m.cargo && <p className={styles.cargo}>{m.cargo}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Calendar size={22} color="var(--color-gold)" />
                    <h2>Agenda Masónica</h2>
                </div>
                <p className={styles.sectionSub}>Próximos Trabajos y Tenidas</p>

                {loadingEvents ? (
                    <div className={styles.loading}>Sincronizando con el Gran Oriente...</div>
                ) : events.length === 0 ? (
                    <div className={styles.emptyState}>No hay trabajos agendados próximamente.</div>
                ) : (
                    <div className={styles.eventsList}>
                        {events.map(event => (
                            <div key={event.id} className={styles.eventCard} style={{ borderLeft: `5px solid ${getGradeColor(event.min_grade)}` }}>
                                <div className={styles.eventDate}>
                                    <span className={styles.day}>{new Date(event.event_date).getDate()}</span>
                                    <span className={styles.month}>{new Date(event.event_date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                </div>
                                <div className={styles.eventContent}>
                                    <h3>{event.title}</h3>
                                    <p className={styles.eventTime}>
                                        {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {logiaNames[event.logia_id] || 'General'}
                                    </p>
                                    <p className={styles.eventDesc}>{event.description}</p>
                                    <span className={styles.gradeBadge} style={{ border: `1px solid ${getGradeColor(event.min_grade)}`, color: getGradeColor(event.min_grade) }}>
                                        Grado {event.min_grade}º
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <BookOpen size={22} color="var(--color-gold)" />
                    <h2>Trazados y Temas</h2>
                </div>
                <p className={styles.sectionSub}>Publicaciones y Reflexiones del Taller</p>
                <div className={styles.emptyState}>
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Explora los últimos trazados de arquitectura publicados por los hermanos.</p>
                </div>
            </section>
        </div>
    )
}
