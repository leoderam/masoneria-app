import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './AdminModal.module.css'
import { X, Calendar, Lock, Globe, Type, AlignLeft, Shield } from 'lucide-react'

interface ManageEventModalProps {
    isOpen: boolean
    onClose: () => void
    event?: any
    onSuccess: () => void
}

export function ManageEventModal({ isOpen, onClose, event, onSuccess }: ManageEventModalProps) {
    if (!isOpen) return null

    const [loading, setLoading] = useState(false)
    const [logias, setLogias] = useState<any[]>([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        logia_id: '',
        min_grade: 1,
        event_date: '',
        is_public: false
    })

    useEffect(() => {
        const fetchLogias = async () => {
            const { data } = await supabase.from('logias').select('id, nombre').order('nombre')
            if (data) setLogias(data)
        }
        fetchLogias()

        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                logia_id: event.logia_id || '',
                min_grade: event.min_grade || 1,
                event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
                is_public: event.is_public || false
            })
        } else {
            // Reset form when opening for a new event
            setFormData({
                title: '',
                description: '',
                logia_id: '',
                min_grade: 1,
                event_date: '',
                is_public: false
            })
        }
    }, [event, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const dataToSave = {
            ...formData,
            logia_id: formData.logia_id === '' ? null : formData.logia_id
        }

        try {
            if (event) {
                const { error } = await supabase
                    .from('events')
                    .update(dataToSave)
                    .eq('id', event.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([dataToSave])
                if (error) throw error
            }
            onSuccess()
            onClose()
        } catch (error: any) {
            alert('Error guardando evento: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2><Calendar size={24} /> {event ? 'Editar Trabajo' : 'Agendar Nuevo Trabajo'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label>Título del Trabajo / Tenida</label>
                        <div className={styles.inputWrapper}>
                            <Type className={styles.inputIcon} size={18} />
                            <input
                                className={styles.formInput}
                                type="text" required value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej. Tenida Ordinaria de 1er Grado"
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Descripción / Trazado</label>
                        <div className={styles.inputWrapper}>
                            <AlignLeft className={styles.inputIcon} size={18} style={{ top: 12 }} />
                            <textarea
                                className={styles.formTextarea}
                                style={{ paddingLeft: '2.75rem' }}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Orden del día, temas a tratar..."
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label>Logia</label>
                            <div className={styles.inputWrapper}>
                                <Shield className={styles.inputIcon} size={18} />
                                <select
                                    className={styles.formSelect}
                                    required value={formData.logia_id}
                                    onChange={e => setFormData({ ...formData, logia_id: e.target.value })}
                                >
                                    <option value="">Seleccionar...</option>
                                    {logias.map(l => (
                                        <option key={l.id} value={l.id}>{l.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Grado Mínimo</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} size={18} />
                                <select
                                    className={styles.formSelect}
                                    value={formData.min_grade}
                                    onChange={e => setFormData({ ...formData, min_grade: parseInt(e.target.value) })}
                                >
                                    <option value={1}>Aprendiz (1º)</option>
                                    <option value={2}>Compañero (2º)</option>
                                    <option value={3}>Maestro (3º)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Fecha y Hora</label>
                        <div className={styles.inputWrapper}>
                            <Calendar className={styles.inputIcon} size={18} />
                            <input
                                className={styles.formInput}
                                type="datetime-local" required value={formData.event_date}
                                onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox" checked={formData.is_public}
                            onChange={e => setFormData({ ...formData, is_public: e.target.checked })}
                        />
                        <Globe size={14} /> Hacer público (Visible en Web Externa)
                    </label>

                    <footer className={styles.actions}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
                        <button type="submit" disabled={loading} className={styles.btnSave}>
                            {loading ? 'Procesando...' : event ? 'Guardar Cambios' : 'Agendar Trabajo'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
}

