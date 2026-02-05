import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './Admin.module.css'
import { Users, Layout, Plus, Edit, Search, GraduationCap, Globe, ShoppingBag, Book, Trash2, BarChart3, TrendingUp, DollarSign, Calendar, UserCheck, MessageSquare } from 'lucide-react'
import { EditMemberModal } from '../../components/admin/EditMemberModal'
import { CreateGrandLodgeModal } from '../../components/admin/CreateGrandLodgeModal'
import { CreateLogiaModal } from '../../components/admin/CreateLogiaModal'
import { AddMemberModal } from '../../components/admin/AddMemberModal'
import { ManageProductModal } from '../../components/admin/ManageProductModal'
import { ManageEventModal } from '../../components/admin/ManageEventModal'
import { ManageResourceModal } from '../../components/admin/ManageResourceModal'

export function AdminManagement() {
    const [grandLogias, setGrandLogias] = useState<any[]>([])
    const [logias, setLogias] = useState<any[]>([])
    const [members, setMembers] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [resources, setResources] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [contactRequests, setContactRequests] = useState<any[]>([])

    // Analytics State
    const [salesByLogia, setSalesByLogia] = useState<any[]>([])
    const [totalRevenue, setTotalRevenue] = useState(0)

    // Tabs state
    const [activeTab, setActiveTab] = useState<'dashboard' | 'institution' | 'products' | 'resources' | 'events' | 'requests'>('dashboard')
    const [viewLevel, setViewLevel] = useState<'GL' | 'LOGIA' | 'MEMBER'>('GL')
    const [selectedGLRef, setSelectedGLRef] = useState<any>(null)
    const [selectedLogiaRef, setSelectedLogiaRef] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Modals State
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [selectedGL, setSelectedGL] = useState<any>(null)
    const [selectedLogia, setSelectedLogia] = useState<any>(null)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [selectedResource, setSelectedResource] = useState<any>(null)

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateGrandModalOpen, setIsCreateGrandModalOpen] = useState(false)
    const [isCreateLogiaModalOpen, setIsCreateLogiaModalOpen] = useState(false)
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)

    // Fetch Data
    const fetchData = async () => {
        setLoading(true)
        try {
            // 1. Fetch Core Data
            const { data: grandData } = await supabase.from('grand_logias').select('*').order('name')
            if (grandData) setGrandLogias(grandData)

            const { data: logiaData } = await supabase.from('logias').select(`*, grand_logia:grand_logia_id (name)`).order('nombre')

            const { data: memberData } = await supabase.from('memberships').select(`
                    id, grade, cargo, is_logia_admin, is_super_admin, user_id, logia_id,
                    profiles:user_id (full_name, email, is_active),
                    logias:logia_id (nombre)
                `)

            const { data: productData } = await supabase.from('products').select('*').order('name')
            if (productData) setProducts(productData)

            const { data: resourceData } = await supabase.from('resources').select('*')
            if (resourceData) setResources(resourceData)

            const { data: eventData } = await supabase.from('events').select(`*, logias:logia_id (nombre)`).order('event_date', { ascending: false })
            if (eventData) setEvents(eventData)

            const { data: requestsData } = await supabase.from('contact_requests').select('*').order('created_at', { ascending: false })
            if (requestsData) setContactRequests(requestsData)

            // 2. Process Members
            const formattedMembers = memberData?.map((m: any) => ({
                membership_id: m.id,
                user_id: m.user_id,
                full_name: m.profiles?.full_name || 'Desconocido',
                email: m.profiles?.email || 'No email',
                is_active: m.profiles?.is_active,
                grade: m.grade,
                cargo: m.cargo,
                logia_name: m.logias?.nombre || 'Sin Logia',
                logia_id: m.logia_id,       // Keep ID for grouping
                is_logia_admin: m.is_logia_admin,
                is_super_admin: m.is_super_admin
            })) || []
            setMembers(formattedMembers)

            if (logiaData) {
                setLogias(logiaData.map((l: any) => ({
                    ...l,
                    grand_logia_name: l.grand_logia?.name || 'Independiente',
                    member_count: formattedMembers.filter(m => m.logia_id === l.id).length
                })))
            }

            // 3. Calculate Sales Analytics
            // Fetch all orders
            const { data: orders } = await supabase.from('orders').select('total_amount, user_id')

            if (orders && formattedMembers.length > 0) {
                const revenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
                setTotalRevenue(revenue)

                // Map Orders to Logias via Memberships
                const salesMap: Record<string, number> = {}

                orders.forEach(order => {
                    const member = formattedMembers.find(m => m.user_id === order.user_id)
                    if (member && member.logia_name) {
                        salesMap[member.logia_name] = (salesMap[member.logia_name] || 0) + (Number(order.total_amount) || 0)
                    } else {
                        salesMap['Sin Afiliación'] = (salesMap['Sin Afiliación'] || 0) + (Number(order.total_amount) || 0)
                    }
                })

                // Convert to array for sorting/display
                const salesArray = Object.entries(salesMap)
                    .map(([name, total]) => ({ name, total }))
                    .sort((a, b) => b.total - a.total)

                setSalesByLogia(salesArray)
            }

        } catch (error) {
            console.error('Error fetching admin data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // HANDLERS
    const handleEditMember = (member: any) => { setSelectedMember(member); setIsEditModalOpen(true) }

    const handleEditGL = (gl: any) => { setSelectedGL(gl); setIsCreateGrandModalOpen(true) }
    const handleEditLogia = (l: any) => { setSelectedLogia(l); setIsCreateLogiaModalOpen(true) }
    const handleEditProduct = (p: any) => { setSelectedProduct(p); setIsProductModalOpen(true) }
    const handleEditEvent = (e: any) => { setSelectedEvent(e); setIsEventModalOpen(true) }
    const handleEditResource = (r: any) => { setSelectedResource(r); setIsResourceModalOpen(true) }

    const handleConfirmEmail = async (userId: string, fullName: string) => {
        if (!window.confirm(`¿Seguro que deseas confirmar manualmente el correo de ${fullName}?`)) return

        setLoading(true)
        try {
            // Call the RPC function we just created
            const { data, error } = await supabase.rpc('confirm_user_manual', {
                target_user_id: userId
            })

            if (error) throw error

            if (data) {
                alert(`¡Correo de ${fullName} confirmado exitosamente!`)
                fetchData()
            } else {
                throw new Error('No se encontró el usuario o ya estaba confirmado.')
            }
        } catch (error: any) {
            alert(`Error al confirmar: ${error.message}`)
        } finally {
            setLoading(true)
            fetchData()
        }
    }

    const handleUpdateRequestStatus = async (requestId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('contact_requests')
                .update({ status: newStatus })
                .eq('id', requestId)

            if (error) throw error
            fetchData()
        } catch (error: any) {
            alert(`Error al actualizar estado: ${error.message}`)
        }
    }

    const handleDelete = async (table: string, id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.')) return
        try {
            const { error } = await supabase.from(table).delete().eq('id', id)
            if (error) throw error
            fetchData()
        } catch (error: any) {
            alert(`Error al eliminar: ${error.message}`)
        }
    }

    const handleCreateClick = () => {
        if (activeTab === 'institution') {
            if (viewLevel === 'GL') { setSelectedGL(null); setIsCreateGrandModalOpen(true) }
            else if (viewLevel === 'LOGIA') { setSelectedLogia(null); setIsCreateLogiaModalOpen(true) }
            else if (viewLevel === 'MEMBER') { setIsAddMemberModalOpen(true) }
        }
        else if (activeTab === 'products') { setSelectedProduct(null); setIsProductModalOpen(true) }
        else if (activeTab === 'events') { setSelectedEvent(null); setIsEventModalOpen(true) }
        else if (activeTab === 'resources') { setSelectedResource(null); setIsResourceModalOpen(true) }
    }


    return (
        <div className={styles.admin}>
            <header className={styles.header}>
                <h1>Panel de Administración</h1>
                <p>Centro de mando general.</p>
            </header>

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'dashboard' ? styles.activeTab : ''}`} onClick={() => setActiveTab('dashboard')}>
                    <BarChart3 size={18} /> Resumen
                </button>
                <button className={`${styles.tab} ${activeTab === 'institution' ? styles.activeTab : ''}`} onClick={() => { setActiveTab('institution'); setViewLevel('GL') }}>
                    <Globe size={18} /> Estructura Masónica
                </button>
                <button className={`${styles.tab} ${activeTab === 'events' ? styles.activeTab : ''}`} onClick={() => setActiveTab('events')}>
                    <Calendar size={18} /> Agenda
                </button>
                <button className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`} onClick={() => setActiveTab('products')}>
                    <ShoppingBag size={18} /> Tienda
                </button>
                <button className={`${styles.tab} ${activeTab === 'resources' ? styles.activeTab : ''}`} onClick={() => setActiveTab('resources')}>
                    <Book size={18} /> Biblioteca
                </button>
                <button className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`} onClick={() => setActiveTab('requests')}>
                    <MessageSquare size={18} /> Solicitudes
                </button>
            </div>

            <div className={styles.content}>
                {activeTab !== 'dashboard' && (
                    <div className={styles.actions}>
                        <div className={styles.breadcrumb}>
                            <button onClick={() => setViewLevel('GL')}>Estructura</button>
                            {selectedGLRef && (
                                <>
                                    <span> / </span>
                                    <button onClick={() => setViewLevel('LOGIA')}>{selectedGLRef.name}</button>
                                </>
                            )}
                            {selectedLogiaRef && (
                                <>
                                    <span> / </span>
                                    <button onClick={() => setViewLevel('MEMBER')}>{selectedLogiaRef.nombre}</button>
                                </>
                            )}
                        </div>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input type="text" placeholder="Buscar..." />
                        </div>
                        <button className={styles.addBtn} onClick={handleCreateClick}>
                            <Plus size={18} />
                            {activeTab === 'institution' ? (
                                viewLevel === 'GL' ? 'Nueva Gran Logia' :
                                    viewLevel === 'LOGIA' ? 'Nueva Logia' : 'Afiliar Hermano'
                            ) : activeTab === 'products' ? 'Nuevo Producto' :
                                activeTab === 'events' ? 'Agendar Trabajo' :
                                    activeTab === 'requests' ? 'Exportar Prospectos' : 'Publicar Trazado'}
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className={styles.loadingState}>Cargando registros...</div>
                ) : activeTab === 'dashboard' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* KPI CARDS */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.5rem', borderRadius: '8px', color: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ingresos Totales</h3>
                                    <DollarSign size={20} color="#FFD700" />
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</div>
                            </div>
                            <div className={styles.kpiCard} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Hermanos Activos</h3>
                                    <Users size={20} color="#3b82f6" />
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{members.length}</div>
                            </div>
                            <div className={styles.kpiCard} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '0.9rem', color: '#666' }}>Logias Simbólicas</h3>
                                    <Layout size={20} color="#10b981" />
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{logias.length}</div>
                            </div>
                        </div>

                        {/* CHARTS / TABLES */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <TrendingUp size={20} /> Ventas por Logia
                            </h3>
                            <table className={styles.table}>
                                <thead>
                                    <tr><th>Logia</th><th>Ventas Totales</th><th>Rendimiento</th></tr>
                                </thead>
                                <tbody>
                                    {salesByLogia.length > 0 ? salesByLogia.map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                                            <td>${item.total.toFixed(2)}</td>
                                            <td>
                                                <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${(item.total / (salesByLogia[0]?.total || 1)) * 100}%`,
                                                        background: idx === 0 ? '#10b981' : '#3b82f6',
                                                        height: '100%'
                                                    }} />
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>No hay datos de ventas registrados</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'institution' ? (
                    viewLevel === 'GL' ? (
                        <div className={styles.folderGrid}>
                            {grandLogias.map(gl => (
                                <div key={gl.id} className={styles.folderCard} onClick={() => { setSelectedGLRef(gl); setViewLevel('LOGIA') }}>
                                    <Globe size={40} className={styles.folderIcon} />
                                    <div className={styles.folderInfo}>
                                        <h3>{gl.name}</h3>
                                        <p>{gl.location || 'Sin ubicación'}</p>
                                    </div>
                                    <div className={styles.folderActions} onClick={e => e.stopPropagation()}>
                                        <button onClick={() => handleEditGL(gl)}><Edit size={16} /></button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete('grand_logias', gl.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : viewLevel === 'LOGIA' ? (
                        <div className={styles.folderGrid}>
                            {logias.filter(l => l.grand_logia_id === selectedGLRef?.id).map(l => (
                                <div key={l.id} className={styles.folderCard} onClick={() => { setSelectedLogiaRef(l); setViewLevel('MEMBER') }}>
                                    <Layout size={40} className={styles.folderIcon} />
                                    <div className={styles.folderInfo}>
                                        <h3>{l.nombre}</h3>
                                        <p>{l.rito}</p>
                                    </div>
                                    <div className={styles.folderActions} onClick={e => e.stopPropagation()}>
                                        <button onClick={() => handleEditLogia(l)}><Edit size={16} /></button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete('logias', l.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr><th>Hermano</th><th>Grado</th><th>Cargo</th><th>Acciones</th></tr>
                            </thead>
                            <tbody>
                                {members.filter(m => m.logia_id === selectedLogiaRef?.id).map(m => (
                                    <tr key={m.membership_id}>
                                        <td><div style={{ fontWeight: 600 }}>{m.full_name}</div></td>
                                        <td><span className={`${styles.gradeBadge} ${styles[`grade${m.grade}`]}`}>{m.grade}º</span></td>
                                        <td>{m.cargo || '-'}</td>
                                        <td>
                                            <div className={styles.tableActions}>
                                                <button
                                                    title="Confirmar Email"
                                                    className={styles.confirmBtn}
                                                    onClick={() => handleConfirmEmail(m.user_id, m.full_name)}
                                                    style={{ color: '#10b981' }}
                                                >
                                                    <UserCheck size={16} /> Confirmar
                                                </button>
                                                <button className={styles.editBtn} onClick={() => handleEditMember(m)}><GraduationCap size={16} /> Editar</button>
                                                <button title="Expulsar" className={styles.deleteBtn} onClick={() => handleDelete('memberships', m.membership_id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : activeTab === 'products' ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 60 }}>Img</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td><img src={p.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /></td>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td>${p.price}</td>
                                    <td>{p.stock_quantity || 0}</td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <button title="Editar" onClick={() => handleEditProduct(p)}><Edit size={16} /></button>
                                            <button title="Eliminar" className={styles.deleteBtn} onClick={() => handleDelete('products', p.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'events' ? (
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Título</th><th>Fecha/Hora</th><th>Logia</th><th>Grado Min.</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {events.map(e => (
                                <tr key={e.id}>
                                    <td style={{ fontWeight: 600 }}>{e.title}</td>
                                    <td>{new Date(e.event_date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{e.logias?.nombre || 'General'}</td>
                                    <td>{e.min_grade}º</td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <button title="Editar" onClick={() => handleEditEvent(e)}><Edit size={16} /></button>
                                            <button title="Eliminar" className={styles.deleteBtn} onClick={() => handleDelete('events', e.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'requests' ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Mensaje</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactRequests.length > 0 ? contactRequests.map(r => (
                                <tr key={r.id}>
                                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 600 }}>{r.full_name}</td>
                                    <td>{r.email}</td>
                                    <td>{r.phone || '-'}</td>
                                    <td style={{ fontSize: '0.85rem', maxWidth: '300px' }}>{r.message}</td>
                                    <td>
                                        <select
                                            value={r.status}
                                            onChange={(e) => handleUpdateRequestStatus(r.id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ddd',
                                                fontSize: '0.8rem',
                                                backgroundColor: r.status === 'pendiente' ? '#fef3c7' : r.status === 'leído' ? '#dcfce7' : '#f3f4f6'
                                            }}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="leído">Leído</option>
                                            <option value="contactado">Contactado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete('contact_requests', r.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No hay solicitudes pendientes</td></tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Título</th><th>Tipo</th><th>Grado Min.</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {resources.map(r => (
                                <tr key={r.id}>
                                    <td style={{ fontWeight: 600 }}>{r.title}</td>
                                    <td><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>{r.type}</span></td>
                                    <td>{r.min_grade}º</td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <button title="Editar" onClick={() => handleEditResource(r)}><Edit size={16} /></button>
                                            <button title="Eliminar" className={styles.deleteBtn} onClick={() => handleDelete('resources', r.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            <EditMemberModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={fetchData}
                member={selectedMember}
            />

            <CreateGrandLodgeModal
                isOpen={isCreateGrandModalOpen}
                onClose={() => setIsCreateGrandModalOpen(false)}
                onUpdate={fetchData}
                initialData={selectedGL}
            />

            <CreateLogiaModal
                isOpen={isCreateLogiaModalOpen}
                onClose={() => setIsCreateLogiaModalOpen(false)}
                onUpdate={fetchData}
                initialData={selectedLogia}
            />

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                onUpdate={fetchData}
            />

            {isProductModalOpen && (
                <ManageProductModal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    product={selectedProduct}
                    onSuccess={fetchData}
                />
            )}

            {isEventModalOpen && (
                <ManageEventModal
                    isOpen={isEventModalOpen}
                    onClose={() => setIsEventModalOpen(false)}
                    event={selectedEvent}
                    onSuccess={fetchData}
                />
            )}

            {isResourceModalOpen && (
                <ManageResourceModal
                    isOpen={isResourceModalOpen}
                    onClose={() => setIsResourceModalOpen(false)}
                    resource={selectedResource}
                    onSuccess={fetchData}
                />
            )}
        </div>
    )
}
