import { useState } from 'react'
import { useCart } from '../../contexts/CartContext'
import { supabase } from '../../lib/supabase'
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react'

interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    if (!isOpen) return null

    const { items, total, clearCart, setIsCartOpen } = useCart()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'payment' | 'success'>('payment')

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Debes iniciar sesión para comprar')

            // 2. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: user.id,
                    total_amount: total,
                    status: 'completed' // Simulated instant payment
                }])
                .select()
                .single()

            if (orderError) throw orderError

            // 3. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }))

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
            if (itemsError) throw itemsError

            // 4. Success
            clearCart()
            setStep('success')

        } catch (error: any) {
            console.error('Payment error:', error)
            alert(`Error al procesar el pago: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleFinish = () => {
        setIsCartOpen(false)
        onClose()
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'var(--color-primary-blue)', /* Solid Blue to hide Store */
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)' /* Subtle blur just in case */
        }}>
            <div style={{
                background: '#ffffff', width: '90%', maxWidth: '480px',
                borderRadius: '16px', padding: '2.5rem', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' /* Deep shadow popup */
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'none', border: 'none', color: '#94a3b8',
                    cursor: 'pointer', transition: 'color 0.2s'
                }}>
                    <X size={24} />
                </button>

                {step === 'payment' ? (
                    <form onSubmit={handlePayment}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Lock size={20} color="#10b981" /> Pago Seguro
                        </h2>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Total a Pagar</span>
                                <span style={{ color: 'var(--color-primary-gold)' }}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Nombre en la Tarjeta</label>
                                <input type="text" required placeholder="Como aparece en la tarjeta" style={{ width: '100%', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Número de Tarjeta</label>
                                <div style={{ position: 'relative' }}>
                                    <CreditCard size={18} style={{ position: 'absolute', top: 12, left: 10, color: '#999' }} />
                                    <input type="text" required placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Expira</label>
                                    <input type="text" required placeholder="MM/YY" style={{ width: '100%', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>CVC</label>
                                    <input type="text" required placeholder="123" style={{ width: '100%', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '1rem', background: '#10b981', color: 'white',
                                border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
                            }}
                        >
                            {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ color: '#10b981' }}>¡Pago Exitoso!</h2>
                        <p>Tu orden ha sido registrada correctamente.</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                            Gracias por contribuir al sostenimiento del taller.
                        </p>
                        <button
                            onClick={handleFinish}
                            style={{
                                padding: '0.75rem 2rem', background: 'var(--color-primary-blue)', color: 'white',
                                border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
