import { useCart } from '../../contexts/CartContext'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CheckoutModal } from './CheckoutModal'

export function CartSidebar() {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, total } = useCart()
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    if (!isCartOpen) return null

    return (
        <>
            <div
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999
                }}
                onClick={() => setIsCartOpen(false)}
            />
            <div style={{
                position: 'fixed', top: 0, right: 0, height: '100vh',
                width: '100%', maxWidth: '400px',
                background: 'var(--color-bg-primary)', boxShadow: '-4px 0 15px rgba(0,0,0,0.3)',
                zIndex: 1000, display: 'flex', flexDirection: 'column',
                transition: 'transform 0.3s ease'
            }}>
                <header style={{
                    padding: '1.5rem', borderBottom: '1px solid var(--color-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ShoppingBag size={20} color="var(--color-primary-gold)" />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Tu Carrito</h2>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        <X size={24} />
                    </button>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '3rem' }}>
                            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Tu carrito está vacío.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem' }}>
                                    <img src={item.image_url} alt={item.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 4 }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{item.name}</h4>
                                        <p style={{ color: 'var(--color-primary-gold)', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 4 }}>
                                                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            style={{
                                width: '100%', padding: '1rem',
                                background: 'var(--color-primary-gold)', color: '#000',
                                border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
                            }}
                        >
                            Proceder al Pago
                        </button>
                    </div>
                )}
            </div>

            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </>
    )
}
