import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { CartSidebar } from '../shop/CartSidebar'
import styles from './Layout.module.css'
import { MusicPlayer } from './MusicPlayer'

export function Layout() {
    return (
        <div className={styles.layout}>
            <MusicPlayer />
            <Navbar />
            <CartSidebar />
            <main className={styles.main}>
                <Outlet />
            </main>
            <footer className={styles.masonicFooter}>
                <div className={styles.checkerboard}></div>
                <p>"La tecnología ordena; el perfeccionamiento transforma."</p>
            </footer>
        </div>
    )
}
