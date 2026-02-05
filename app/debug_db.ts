import { supabase } from './src/lib/supabase'

async function debug() {
    console.log('--- DEBUG START ---')

    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current User:', user?.id)

    const { data: memberships } = await supabase.from('memberships').select('*, logias(nombre)')
    console.log('Memberships:', JSON.stringify(memberships, null, 2))

    const { data: events } = await supabase.from('events').select('*')
    console.log('All Events (visible via RLS):', JSON.stringify(events, null, 2))

    const { data: logias } = await supabase.from('logias').select('*')
    console.log('All Logias:', JSON.stringify(logias, null, 2))

    console.log('--- DEBUG END ---')
}

debug()
