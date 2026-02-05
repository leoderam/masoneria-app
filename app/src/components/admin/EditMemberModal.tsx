import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './EditMemberModal.module.css'
import { X, Save, Shield } from 'lucide-react'

interface EditMemberModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
    member: any
}

export function EditMemberModal({ isOpen, onClose, onUpdate, member }: EditMemberModalProps) {
    if (!isOpen || !member) return null

    const [grade, setGrade] = useState(member.grade || 1)
    const [cargo, setCargo] = useState(member.cargo || '')
    const [isAdmin, setIsAdmin] = useState(member.is_logia_admin || false)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('memberships')
                .update({
                    grade: parseInt(grade.toString()),
                    cargo,
                    is_logia_admin: isAdmin
                })
                .eq('id', member.membership_id) // We'll need to make sure we pass the membership ID

            if (error) throw error

            onUpdate() // Refresh parent data
            onClose()
        } catch (error) {
            console.error('Error updating member:', error)
            alert('Error al actualizar el miembro.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <h2>Editar Membresía</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className={styles.userInfo}>
                    <div className={styles.avatarPlaceholder}>
                        {member.full_name?.charAt(0) || 'H'}
                    </div>
                    <div>
                        <strong>{member.full_name}</strong>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{member.email}</div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Grado Masónico</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)}>
                        <option value={1}>1º Aprendiz</option>
                        <option value={2}>2º Compañero</option>
                        <option value={3}>3º Maestro</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Cargo en Logia</label>
                    <input
                        type="text"
                        value={cargo}
                        onChange={e => setCargo(e.target.value)}
                        placeholder="Ej: Secretario, Tesorero, Ninguno"
                    />
                </div>

                <div className={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={e => setIsAdmin(e.target.checked)}
                        id="isAdmin"
                    />
                    <label htmlFor="isAdmin" style={{ marginBottom: 0, cursor: 'pointer' }}>
                        <Shield size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
                        Es Administrador (Venerable Maestro)
                    </label>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                        <Save size={18} />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    )
}
