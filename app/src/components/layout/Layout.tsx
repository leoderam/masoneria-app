import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { CartSidebar } from '../shop/CartSidebar'
import styles from './Layout.module.css'
import { MusicPlayer } from './MusicPlayer'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export function Layout() {
    const mainRef = useRef<HTMLDivElement>(null)
    const location = useLocation()

    useLayoutEffect(() => {
        // Simple page fade transition on route change
        gsap.fromTo(mainRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
        )
    }, [location.pathname])

    return (
        <div className={styles.layout}>
            <MusicPlayer />
            <Navbar />
            <CartSidebar />
            <main className={styles.main} ref={mainRef}>
                <Outlet />
            </main>
            <footer className={styles.masonicFooter}>
                <div className={styles.checkerboard}></div>
                <p>"La tecnología ordena; el perfeccionamiento transforma."</p>
            </footer>
        </div>
    )
}
