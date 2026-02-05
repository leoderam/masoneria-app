import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { useCart } from '../../contexts/CartContext'
import styles from './Navbar.module.css'
import { LogOut, Menu, ShoppingBag, ChevronDown, ChevronUp, User, Shield } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
    const { user, signOut, isAdmin } = useAuth()
    const { setIsCartOpen, itemCount } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isPublicOpen, setIsPublicOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
        setIsMenuOpen(false)
    }

    const closeMenu = () => setIsMenuOpen(false)

    // Solo mostrar carrito en la tienda
    const showCart = location.pathname.startsWith('/store')

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/" onClick={closeMenu}>COMPÁS & ESCUADRA</Link>
            </div>

            <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>

                {/* SECCIÓN PÚBLICA (Colapsable en móvil) */}
                <div className={styles.navGroup}>
                    <button
                        className={styles.groupToggle}
                        onClick={() => setIsPublicOpen(!isPublicOpen)}
                    >
                        <span>Información Pública</span>
                        {isPublicOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <div className={`${styles.groupContent} ${isPublicOpen ? styles.expanded : ''}`}>
                        <Link to="/" className={styles.navLink} onClick={closeMenu}>Inicio</Link>
                        <Link to="/about" className={styles.navLink} onClick={closeMenu}>Nosotros</Link>
                        <Link to="/ser-mason" className={styles.navLink} onClick={closeMenu}>Ser Masón</Link>
                        <Link to="/faq" className={styles.navLink} onClick={closeMenu}>FAQ</Link>
                        <Link to="/contacto" className={styles.navLink} onClick={closeMenu}>Contacto</Link>
                    </div>
                </div>

                {/* SIEMPRE VISIBLE: TIENDA */}
                <Link to="/store" className={`${styles.navLink} ${styles.storeLink}`} onClick={closeMenu}>
                    Tienda
                </Link>

                {/* SECCIÓN PRIVADA (Más relevante para el usuario logueado) */}
                {user && (
                    <div className={styles.memberSection}>
                        <div className={styles.memberHeader}>
                            <span>Zona Fraternal</span>
                        </div>
                        <Link to="/dashboard" className={`${styles.navLink} ${styles.memberLink}`} onClick={closeMenu}>
                            <User size={16} /> Mi Logia
                        </Link>
                        <Link to="/library" className={`${styles.navLink} ${styles.memberLink}`} onClick={closeMenu}>
                            Biblioteca
                        </Link>
                        {isAdmin && (
                            <Link to="/admin" className={`${styles.navLink} ${styles.adminLink}`} onClick={closeMenu}>
                                <Shield size={16} /> ADMINISTRACIÓN
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.navActions}>
                {!user ? (
                    <Link to="/login" className={styles.navLink} style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Acceso</Link>
                ) : (
                    <button onClick={handleSignOut} title="Cerrar Sesión" className={styles.iconBtn}>
                        <LogOut size={20} />
                    </button>
                )}

                {showCart && (
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={styles.iconBtn}
                        style={{ position: 'relative' }}
                    >
                        <ShoppingBag size={20} />
                        {itemCount > 0 && (
                            <span className={styles.badge}>
                                {itemCount}
                            </span>
                        )}
                    </button>
                )}

                <button className={styles.mobileMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    )
}
