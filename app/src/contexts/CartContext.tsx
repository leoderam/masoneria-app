import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image_url: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: any) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, delta: number) => void
    clearCart: () => void
    total: number
    itemCount: number
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('masoneria_cart')
        if (saved) setItems(JSON.parse(saved))
    }, [])

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('masoneria_cart', JSON.stringify(items))
    }, [items])

    const addToCart = (product: any) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image_url: product.image_url,
                quantity: 1
            }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const clearCart = () => setItems([])

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart,
            total, itemCount, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}
