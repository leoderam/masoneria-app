import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './EditMemberModal.module.css'
import { X, Save, Layout, MapPin, Hash, Globe } from 'lucide-react'

interface CreateLogiaModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
    initialData?: any
}

export function CreateLogiaModal({ isOpen, onClose, onUpdate, initialData }: CreateLogiaModalProps) {
    if (!isOpen) return null

    const [nombre, setNombre] = useState('')
    const [rito, setRito] = useState('Escocés Antiguo y Aceptado')
    const [ubicacion, setUbicacion] = useState('')
    const [grandLogiaId, setGrandLogiaId] = useState('')
    const [grandLogias, setGrandLogias] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // Fetch Grand Logias for the dropdown
    useEffect(() => {
        async function fetchGL() {
            const { data } = await supabase.from('grand_logias').select('id, name')
            if (data) {
                setGrandLogias(data)
                // Default to the first one if available and not set
                if (data.length > 0 && !grandLogiaId && !initialData) {
                    setGrandLogiaId(data[0].id)
                }
            }
        }
        if (isOpen) fetchGL()
    }, [isOpen])

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre || '')
            setRito(initialData.rito || 'Escocés Antiguo y Aceptado')
            setUbicacion(initialData.ubicacion || '')
            setGrandLogiaId(initialData.grand_logia_id || '')
        } else {
            setNombre('')
            setUbicacion('')
            setRito('Escocés Antiguo y Aceptado')
        }
    }, [initialData, isOpen])

    const handleSave = async () => {
        if (!nombre || !grandLogiaId) return alert('Nombre y Gran Logia son obligatorios')

        setLoading(true)
        try {
            if (initialData) {
                const { error } = await supabase
                    .from('logias')
                    .update({ nombre, rito, ubicacion, grand_logia_id: grandLogiaId })
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('logias')
                    .insert([{ nombre, rito, ubicacion, grand_logia_id: grandLogiaId }])
                if (error) throw error
            }

            onUpdate()
            onClose()
        } catch (error: any) {
            console.error('Error saving logia:', error)
            alert(`Error: ${error.message || 'Desconocido'} `)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <h2>{initialData ? 'Editar Logia' : 'Nueva Logia Simbólica'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className={styles.formGroup}>
                    <label>Nombre del Taller</label>
                    <div style={{ position: 'relative' }}>
                        <Layout size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                        <input
                            type="text"
                            style={{ paddingLeft: '2.5rem' }}
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej: Fénix No. 5"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Jurisdicción (Gran Logia)</label>
                    <div style={{ position: 'relative' }}>
                        <Globe size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                        <select
                            style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                            value={grandLogiaId}
                            onChange={e => setGrandLogiaId(e.target.value)}
                        >
                            {grandLogias.map(gl => (
                                <option key={gl.id} value={gl.id}>{gl.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Rito</label>
                    <div style={{ position: 'relative' }}>
                        <Hash size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                        <select
                            style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
                            value={rito}
                            onChange={e => setRito(e.target.value)}
                        >
                            <option value="Escocés Antiguo y Aceptado">Escocés Antiguo y Aceptado</option>
                            <option value="York">York</option>
                            <option value="Nacional Mexicano">Nacional Mexicano</option>
                            <option value="Francés (Moderno)">Francés (Moderno)</option>
                            <option value="Emulación">Emulación</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Ubicación</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                        <input
                            type="text"
                            style={{ paddingLeft: '2.5rem' }}
                            value={ubicacion}
                            onChange={e => setUbicacion(e.target.value)}
                            placeholder="Ej: Calle Masónica 33, Centro"
                        />
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                        <Save size={18} />
                        {loading ? 'Creando...' : 'Fundar Logia'}
                    </button>
                </div>
            </div>
        </div>
    )
}
