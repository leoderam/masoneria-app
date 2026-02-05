import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

interface Profile {
    id: string
    full_name: string | null
    is_active: boolean
}

interface Membership {
    logia_id: string
    grade: number
    cargo: string | null
    is_logia_admin: boolean
    is_super_admin: boolean
}

interface AuthContextType {
    user: User | null
    session: Session | null
    profile: Profile | null
    memberships: Membership[]
    loading: boolean
    isAdmin: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [memberships, setMemberships] = useState<Membership[]>([])
    const [loading, setLoading] = useState(true)

    // Calculate admin status derived from memberships
    const isAdmin = memberships.some(m => m.is_super_admin || m.is_logia_admin)

    useEffect(() => {
        // ... (rest of useEffect logic stays same, implied by not changing it)
        // Check if Supabase client is valid
        if (!supabase) {
            setLoading(false)
            return
        }

        const initAuth = async () => {
            try {
                // Check active session
                const { data, error } = await supabase.auth.getSession()

                if (error) throw error

                setSession(data.session)
                setUser(data.session?.user ?? null)

                if (data.session?.user) {
                    await fetchUserData(data.session.user.id)
                }
            } catch (error) {
                console.warn('Auth initialization error (likely due to missing credentials):', error)
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchUserData(session.user.id)
            } else {
                setProfile(null)
                setMemberships([])
                // Don't set loading false here as it might conflict with init
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchUserData(userId: string) {
        try {
            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            setProfile(profileData)

            // Fetch memberships
            const { data: membershipData } = await supabase
                .from('memberships')
                .select('logia_id, grade, cargo, is_logia_admin, is_super_admin')
                .eq('user_id', userId)

            setMemberships(membershipData || [])
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = {
        user,
        session,
        profile,
        memberships,
        loading,
        isAdmin,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
