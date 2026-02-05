import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { useCart } from '../../contexts/CartContext'
import styles from './Navbar.module.css'
import { LogOut, Menu, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
    const { user, signOut, isAdmin } = useAuth()
    const { setIsCartOpen, itemCount } = useCart()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">COMPÁS & ESCUADRA</Link>
            </div>

            <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
                <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                <Link to="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
                <Link to="/ser-mason" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Ser Masón</Link>
                <Link to="/faq" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                <Link to="/contacto" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contacto</Link>
                <Link to="/store" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Tienda</Link>

                {user && (
                    <>
                        <Link to="/dashboard" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Mi Logia</Link>
                        <Link to="/library" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Biblioteca</Link>
                        {isAdmin && <Link to="/admin" className={`${styles.navLink} ${styles.adminLink}`} onClick={() => setIsMenuOpen(false)}>Admin</Link>}
                    </>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto', paddingRight: '1rem' }}>
                {!user ? (
                    <Link to="/login" className={styles.navLink} style={{ fontSize: '0.85rem' }}>Acceso</Link>
                ) : (
                    <button onClick={handleSignOut} title="Cerrar Sesión" style={{ color: 'var(--color-gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut size={20} />
                    </button>
                )}

                <button
                    onClick={() => setIsCartOpen(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer', position: 'relative' }}
                >
                    <ShoppingBag size={20} />
                    {itemCount > 0 && (
                        <span style={{
                            position: 'absolute', top: -8, right: -8,
                            background: '#ef4444', color: 'white',
                            fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold'
                        }}>
                            {itemCount}
                        </span>
                    )}
                </button>
                <button className={styles.mobileMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    )
}
