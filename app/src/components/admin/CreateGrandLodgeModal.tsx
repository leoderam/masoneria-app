import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './EditMemberModal.module.css' // Reusing styles for consistency
import { X, Save, Globe, MapPin } from 'lucide-react'

interface CreateGrandLodgeModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
    initialData?: any
}

export function CreateGrandLodgeModal({ isOpen, onClose, onUpdate, initialData }: CreateGrandLodgeModalProps) {
    if (!isOpen) return null

    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [foundedAt, setFoundedAt] = useState('')
    const [website, setWebsite] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '')
            setLocation(initialData.location || '')
            setFoundedAt(initialData.founded_at || '')
            setWebsite(initialData.website || '')
        } else {
            setName('')
            setLocation('')
            setFoundedAt('')
            setWebsite('')
        }
    }, [initialData, isOpen])

    const handleSave = async () => {
        if (!name) return alert('El nombre es obligatorio')

        setLoading(true)
        try {
            if (initialData) {
                // Update
                const { error } = await supabase
                    .from('grand_logias')
                    .update({ name, location, founded_at: foundedAt || null, website })
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('grand_logias')
                    .insert([{ name, location, founded_at: foundedAt || null, website }])
                if (error) throw error
            }

            onUpdate()
            onClose()
        } catch (error: any) {
            console.error('Error saving grand logia:', error)
            alert(`Error: ${error.message || 'Desconocido'} \n ${error.details || ''}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <h2>{initialData ? 'Editar Gran Logia' : 'Nueva Gran Logia'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className={styles.formGroup}>
                    <label>Nombre de la Jurisdicción</label>
                    <div style={{ position: 'relative' }}>
                        <Globe size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                        <input
                            type="text"
                            style={{ paddingLeft: '2.5rem' }}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ej: Gran Logia Unida de Veracruz"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Ubicación (Oriente)</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                        <input
                            type="text"
                            style={{ paddingLeft: '2.5rem' }}
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Ej: Puerto de Veracruz"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Fecha de Fundación (Opcional)</label>
                    <input
                        type="date"
                        value={foundedAt}
                        onChange={e => setFoundedAt(e.target.value)}
                    />
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                        <Save size={18} />
                        {loading ? 'Creando...' : 'Crear Jurisdicción'}
                    </button>
                </div>
            </div>
        </div>
    )
}
