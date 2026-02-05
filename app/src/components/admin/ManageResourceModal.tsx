import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './AdminModal.module.css'
import { X, Save, Book, Type, AlignLeft, Shield, Globe } from 'lucide-react'

interface ManageResourceModalProps {
    isOpen: boolean
    onClose: () => void
    resource?: any
    onSuccess: () => void
}

export function ManageResourceModal({ isOpen, onClose, resource, onSuccess }: ManageResourceModalProps) {
    if (!isOpen) return null

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'pdf', // default
        external_url: '',
        logia_id: '',
        min_grade: 1,
        is_public: false
    })

    useEffect(() => {
        if (resource) {
            setFormData({
                title: resource.title || '',
                description: resource.description || '',
                type: resource.type || 'pdf',
                external_url: resource.external_url || '',
                logia_id: resource.logia_id || '',
                min_grade: resource.min_grade || 1,
                is_public: resource.is_public || false
            })
        }
    }, [resource, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const dataToSave = {
            ...formData,
            logia_id: formData.logia_id === '' ? null : formData.logia_id
        }

        try {
            if (resource) {
                const { error } = await supabase
                    .from('resources')
                    .update(dataToSave)
                    .eq('id', resource.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('resources')
                    .insert([dataToSave])
                if (error) throw error
            }
            onSuccess()
            onClose()
        } catch (error: any) {
            alert('Error guardando recurso/trazado: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2><Book size={24} /> {resource ? 'Editar Publicación' : 'Publicar Trazado / Recurso'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label>Título del Trazado</label>
                        <div className={styles.inputWrapper}>
                            <Type className={styles.inputIcon} size={18} />
                            <input
                                className={styles.formInput}
                                type="text" required value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej. El Simbolismo de la Piedra Bruta"
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Contenido / Resumen</label>
                        <div className={styles.inputWrapper}>
                            <AlignLeft className={styles.inputIcon} size={18} style={{ top: 12 }} />
                            <textarea
                                className={styles.formTextarea}
                                style={{ paddingLeft: '2.75rem' }}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Escribe aquí el tema o una breve descripción..."
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label>Tipo de Recurso</label>
                            <select
                                className={styles.formSelect}
                                style={{ paddingLeft: '1rem' }}
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="pdf">Documento PDF</option>
                                <option value="video">Video</option>
                                <option value="link">Enlace Externo</option>
                                <option value="trazado">Trazado (Puro Texto)</option>
                            </select>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Grado de Audiencia</label>
                            <div className={styles.inputWrapper}>
                                <Shield className={styles.inputIcon} size={18} />
                                <select
                                    className={styles.formSelect}
                                    value={formData.min_grade}
                                    onChange={e => setFormData({ ...formData, min_grade: parseInt(e.target.value) })}
                                >
                                    <option value={1}>Aprendices (1º+)</option>
                                    <option value={2}>Compañeros (2º+)</option>
                                    <option value={3}>Sólo Maestros (3º)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>URL (Si aplica)</label>
                        <div className={styles.inputWrapper}>
                            <Globe className={styles.inputIcon} size={18} />
                            <input
                                className={styles.formInput}
                                type="text" value={formData.external_url}
                                onChange={e => setFormData({ ...formData, external_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <footer className={styles.actions}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
                        <button type="submit" disabled={loading} className={styles.btnSave}>
                            <Save size={18} /> {loading ? 'Publicando...' : resource ? 'Guardar Cambios' : 'Publicar'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
}
