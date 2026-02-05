import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../features/auth/AuthContext'
import styles from './Library.module.css'
import { FileText, Download, Lock, ExternalLink, Filter } from 'lucide-react'

interface Resource {
    id: string
    title: string
    description: string
    type: string
    storage_path: string | null
    external_url: string | null
    min_grade: number
}

export function Library() {
    const { memberships } = useAuth()
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [filterGrade, setFilterGrade] = useState<number>(0)

    // Get maximum grade of the user across all logias
    const maxUserGrade = Math.max(...memberships.map(m => m.grade), 0)

    useEffect(() => {
        async function fetchResources() {
            const { data } = await supabase
                .from('resources')
                .select('*')
                .order('min_grade', { ascending: true })

            if (data) setResources(data)
            setLoading(false)
        }
        fetchResources()
    }, [])

    const getGradeLabel = (grade: number) => {
        switch (grade) {
            case 1: return 'Aprendiz'
            case 2: return 'Compañero'
            case 3: return 'Maestro'
            default: return 'Público'
        }
    }

    return (
        <div className={styles.library}>
            <header className={styles.header}>
                <h1>Biblioteca Digital</h1>
                <p>Documentos y trazados disponibles para tu grado.</p>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.filterGroup}>
                    <Filter size={18} />
                    <select
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(Number(e.target.value))}
                        className={styles.select}
                    >
                        <option value={0}>Todos los grados</option>
                        <option value={1}>Aprendiz</option>
                        <option value={2}>Compañero</option>
                        <option value={3}>Maestro</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Cargando biblioteca...</div>
            ) : (
                <div className={styles.resourceGrid}>
                    {resources
                        .filter(r => filterGrade === 0 || r.min_grade === filterGrade)
                        .map(resource => {
                            const hasAccess = maxUserGrade >= resource.min_grade
                            return (
                                <div key={resource.id} className={`${styles.resourceCard} ${!hasAccess ? styles.locked : ''}`}>
                                    <div className={styles.resourceType}>
                                        {hasAccess ? <FileText size={24} /> : <Lock size={24} />}
                                    </div>
                                    <div className={styles.resourceInfo}>
                                        <div className={styles.badge}>{getGradeLabel(resource.min_grade)}</div>
                                        <h3>{resource.title}</h3>
                                        <p>{resource.description}</p>

                                        <div className={styles.actions}>
                                            {hasAccess ? (
                                                <>
                                                    {resource.storage_path && (
                                                        <button className={styles.actionBtn}>
                                                            <Download size={16} /> Descargar
                                                        </button>
                                                    )}
                                                    {resource.external_url && (
                                                        <a href={resource.external_url} target="_blank" rel="noreferrer" className={styles.actionBtn}>
                                                            <ExternalLink size={16} /> Ver Externo
                                                        </a>
                                                    )}
                                                </>
                                            ) : (
                                                <span className={styles.lockedText}>Se requiere grado {getGradeLabel(resource.min_grade)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            )}
        </div>
    )
}
