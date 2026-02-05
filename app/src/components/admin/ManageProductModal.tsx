import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './AdminModal.module.css'
import { X, Save, Tag, DollarSign, Image as ImageIcon, Box, AlignLeft } from 'lucide-react'

interface ManageProductModalProps {
    isOpen: boolean
    onClose: () => void
    product?: any
    onSuccess: () => void
}

export function ManageProductModal({ isOpen, onClose, product, onSuccess }: ManageProductModalProps) {
    if (!isOpen) return null

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [driveUrl, setDriveUrl] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (product) {
            setName(product.name || '')
            setPrice(product.price?.toString() || '')
            setStock(product.stock_quantity?.toString() || '0')
            setImageUrl(product.image_url || '')
            setDriveUrl(product.drive_url || '')
            setDescription(product.description || '')
        } else {
            setName('')
            setPrice('')
            setStock('0')
            setImageUrl('')
            setDriveUrl('')
            setDescription('')
        }
    }, [product, isOpen])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !price) return alert('Nombre y Precio son obligatorios')

        setLoading(true)
        const productData = {
            name,
            price: parseFloat(price),
            stock_quantity: parseInt(stock),
            image_url: imageUrl,
            drive_url: driveUrl,
            description,
            is_public: true
        }

        try {
            if (product) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData])
                if (error) throw error
            }

            onSuccess()
            onClose()
        } catch (error: any) {
            console.error('Error saving product:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2><Tag size={24} /> {product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </header>

                <form onSubmit={handleSave} className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label>Nombre del Producto</label>
                        <div className={styles.inputWrapper}>
                            <Tag className={styles.inputIcon} size={18} />
                            <input className={styles.formInput} type="text" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.fieldGroup}>
                            <label>Precio</label>
                            <div className={styles.inputWrapper}>
                                <DollarSign className={styles.inputIcon} size={18} />
                                <input className={styles.formInput} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Stock</label>
                            <div className={styles.inputWrapper}>
                                <Box className={styles.inputIcon} size={18} />
                                <input className={styles.formInput} type="number" value={stock} onChange={e => setStock(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>URL Imagen</label>
                        <div className={styles.inputWrapper}>
                            <ImageIcon className={styles.inputIcon} size={18} />
                            <input className={styles.formInput} type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Link de Google Drive (Opcional)</label>
                        <div className={styles.inputWrapper}>
                            <Box className={styles.inputIcon} size={18} />
                            <input className={styles.formInput} type="text" value={driveUrl} onChange={e => setDriveUrl(e.target.value)} placeholder="https://drive.google.com/..." />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Descripción</label>
                        <div className={styles.inputWrapper}>
                            <AlignLeft className={styles.inputIcon} size={18} style={{ top: 12 }} />
                            <textarea
                                className={styles.formTextarea}
                                style={{ paddingLeft: '2.75rem' }}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Breve detalle del producto..."
                            />
                        </div>
                    </div>

                    <footer className={styles.actions}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
                        <button type="submit" disabled={loading} className={styles.btnSave}>
                            <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
}

