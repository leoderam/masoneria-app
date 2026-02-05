import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { createClient } from '@supabase/supabase-js' // Import direct client creator
import styles from './EditMemberModal.module.css'
import { X, Search, UserPlus, Layout, Key, User, Mail } from 'lucide-react'

interface AddMemberModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}

export function AddMemberModal({ isOpen, onClose, onUpdate }: AddMemberModalProps) {
    if (!isOpen) return null

    // Mode: 'search' | 'create'
    const [mode, setMode] = useState<'search' | 'create'>('search')

    // Search Mode State
    const [emailQuery, setEmailQuery] = useState('')
    const [foundUser, setFoundUser] = useState<any>(null)

    // Create Mode State
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newName, setNewName] = useState('')

    // Common State
    const [selectedLogiaId, setSelectedLogiaId] = useState('')
    const [grade, setGrade] = useState(1)
    const [availableLogias, setAvailableLogias] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searching, setSearching] = useState(false)

    // Fetch Logias
    useEffect(() => {
        if (isOpen) {
            supabase.from('logias').select('id, nombre').then(({ data }) => {
                if (data) {
                    setAvailableLogias(data)
                    if (data.length > 0) setSelectedLogiaId(data[0].id)
                }
            })
        }
    }, [isOpen])

    const handleSearch = async () => {
        if (!emailQuery) return
        setSearching(true)
        setFoundUser(null)
        try {
            // NOTE: Searching profiles directly.
            // Ensure RLS allows reading profiles for admins.
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .ilike('email', emailQuery)
                .single()

            if (error) {
                console.log('User search error:', error)
                alert('Usuario no encontrado. Intenta "Registrar Nuevo".')
            } else {
                setFoundUser(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSearching(false)
        }
    }

    // Advanced: Create User without logging out Admin
    const handleRegister = async () => {
        if (!newEmail || !newPassword || !newName || !selectedLogiaId) {
            return alert('Todos los campos son obligatorios')
        }

        setLoading(true)
        try {
            // 1. Create a TEMPORARY client to sign up the user
            // This prevents the Admin's session from being replaced
            const tempClient = createClient(
                import.meta.env.VITE_SUPABASE_URL,
                import.meta.env.VITE_SUPABASE_ANON_KEY,
                { auth: { persistSession: false } } // Critical: Do not persist!
            )

            // 2. Sign Up (Create Auth User)
            const { data: authData, error: authError } = await tempClient.auth.signUp({
                email: newEmail,
                password: newPassword,
                options: {
                    data: { full_name: newName }
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('No se pudo crear el usuario')

            const newUserId = authData.user.id

            // 3. Create Profile (Master Client)
            // Note: Trigger usually handles this, but we force it just in case
            await supabase.from('profiles').upsert({
                id: newUserId,
                email: newEmail,
                full_name: newName,
                role: 'member'
            })

            // 4. Create Membership (Master Client)
            const { error: memberError } = await supabase
                .from('memberships')
                .insert([{
                    user_id: newUserId,
                    logia_id: selectedLogiaId,
                    grade: grade,
                    cargo: 'Sin Cargo'
                }])

            if (memberError) throw memberError

            alert(`¡Hermano ${newName} registrado y afiliado correctamente!`)
            onUpdate()
            onClose()

        } catch (error: any) {
            console.error('Error creating user:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleAddMember = async () => {
        if (!foundUser || !selectedLogiaId) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('memberships')
                .insert([{
                    user_id: foundUser.id,
                    logia_id: selectedLogiaId,
                    grade: grade,
                    cargo: 'Sin Cargo'
                }])

            if (error) throw error

            alert('Hermano afiliado exitosamente.')
            onUpdate()
            onClose()
        } catch (error: any) {
            console.error('Error adding member:', error)
            alert(`Error: ${error.message || 'Ya es miembro de esta logia probablemente.'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <h2>Gestión de Membresía</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </header>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--color-border)' }}>
                    <button
                        onClick={() => {
                            setMode('search')
                            setFoundUser(null) // Clear found user when switching modes
                        }}
                        style={{
                            padding: '10px',
                            borderBottom: mode === 'search' ? '2px solid var(--color-primary-gold)' : 'none',
                            fontWeight: mode === 'search' ? 'bold' : 'normal',
                            color: mode === 'search' ? 'var(--color-primary-gold)' : 'var(--color-text-muted)',
                            background: 'none'
                        }}
                    >
                        Buscar Existente
                    </button>
                    <button
                        onClick={() => {
                            setMode('create')
                            setFoundUser(null) // Clear found user when switching modes
                        }}
                        style={{
                            padding: '10px',
                            borderBottom: mode === 'create' ? '2px solid var(--color-primary-gold)' : 'none',
                            fontWeight: mode === 'create' ? 'bold' : 'normal',
                            color: mode === 'create' ? 'var(--color-primary-gold)' : 'var(--color-text-muted)',
                            background: 'none'
                        }}
                    >
                        Registrar Nuevo
                    </button>
                </div>

                {mode === 'search' ? (
                    // SEARCH MODE
                    <>
                        <div className={styles.formGroup}>
                            <label>Buscar por Email</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                                    <input
                                        type="email"
                                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                                        value={emailQuery}
                                        onChange={e => setEmailQuery(e.target.value)}
                                        placeholder="usuario@email.com"
                                    />
                                </div>
                                <button className={styles.saveBtn} style={{ width: 'auto', padding: '0 1rem' }} onClick={handleSearch} disabled={searching}>
                                    {searching ? '...' : 'Buscar'}
                                </button>
                            </div>
                        </div>

                        {foundUser && (
                            <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                                <p style={{ fontWeight: 600, color: 'var(--color-primary-blue)' }}>Usuario Encontrado:</p>
                                <p>{foundUser.full_name || 'Sin Nombre'}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{foundUser.email}</p>
                            </div>
                        )}
                    </>
                ) : (
                    // CREATE MODE
                    <>
                        <div className={styles.formGroup}>
                            <label>Nombre Completo (QH)</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                                <input
                                    type="text"
                                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email Oficial</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                                <input
                                    type="email"
                                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Contraseña Provisional</label>
                            <div style={{ position: 'relative' }}>
                                <Key size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                                <input
                                    type="password"
                                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="******"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Common Fields: Logia & Grade */}
                {(foundUser || mode === 'create') && (
                    <>
                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label>Asignar a Logia</label>
                            <div style={{ position: 'relative' }}>
                                <Layout size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                                <select
                                    style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)' }}
                                    value={selectedLogiaId}
                                    onChange={e => setSelectedLogiaId(e.target.value)}
                                >
                                    {availableLogias.map(l => (
                                        <option key={l.id} value={l.id}>{l.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Grado Inicial</label>
                            <select
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                                value={grade}
                                onChange={e => setGrade(parseInt(e.target.value))}
                            >
                                <option value={1}>1º Aprendiz</option>
                                <option value={2}>2º Compañero</option>
                                <option value={3}>3º Maestro</option>
                            </select>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                            <button
                                className={styles.saveBtn}
                                onClick={mode === 'create' ? handleRegister : handleAddMember}
                                disabled={loading || (mode === 'search' && !foundUser)}
                            >
                                <UserPlus size={18} />
                                {loading ? 'Procesando...' : mode === 'create' ? 'Registrar y Afiliar' : 'Afiliar Hermano'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
