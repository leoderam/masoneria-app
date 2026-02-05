import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './PublicPages.module.css'
import { ShoppingCart, Tag } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

interface Product {
    id: string
    name: string
    description: string
    price: number
    image_url: string | null
}

export function Store() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_public', true)

            if (data) setProducts(data)
            setLoading(false)
        }
        fetchProducts()
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tienda Simbólica</h1>
            <p className={styles.subtitle}>Libros, arte y artículos de formación masónica.</p>

            {loading ? (
                <div className={styles.loading}>Cargando catálogo...</div>
            ) : products.length === 0 ? (
                <div className={styles.empty}>
                    <Tag size={48} />
                    <p>No hay productos disponibles en este momento.</p>
                </div>
            ) : (
                <div className={styles.productGrid}>
                    {products.map(product => {
                        const hasImage = product.image_url && typeof product.image_url === 'string' && product.image_url.trim() !== ''

                        // Si no tiene imagen, o es una URL rota de Unsplash que falló antes
                        // usamos un placeholder local o el default generado
                        const displayImage = (hasImage ? product.image_url : '/images/products/default.png') as string

                        return (
                            <div key={product.id} className={styles.productCard}>
                                <div className={styles.imagePlaceholder}>
                                    <img
                                        src={displayImage}
                                        alt={product.name}
                                        onError={(e) => {
                                            // Fallback final a la imagen por defecto local si falla la del DB
                                            const target = e.target as HTMLImageElement
                                            if (target.src.indexOf('/images/products/default.png') === -1) {
                                                target.src = '/images/products/default.png'
                                            }
                                        }}
                                        style={{ opacity: 1 }}
                                    />
                                </div>
                                <div className={styles.productInfo}>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <div className={styles.productFooter}>
                                        <span className={styles.price}>${product.price}</span>
                                        <button
                                            className={styles.buyButton}
                                            onClick={() => addToCart(product)}
                                        >
                                            <ShoppingCart size={18} />
                                            Añadir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
