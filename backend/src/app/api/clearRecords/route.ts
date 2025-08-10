import { NextResponse } from 'next/server';
import { Database } from '../../../util/supabase-types'
import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server'

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function DELETE(req: NextRequest) {
    try {
        // First get count of records to be deleted
        const { count } = await supabase
            .from('Canvas')
            .select('*', { count: 'exact', head: true })
            
        // Delete all records
        const { error } = await supabase
            .from('Canvas')
            .delete()
            .gte('id', '00000000-0000-0000-0000-000000000000') // This matches all UUIDs
            
        if (error) {
            throw new Error(error.message);
        }
        
        return NextResponse.json({ 
            success: true, 
            message: 'All Canvas records have been cleared',
            deletedCount: count || 0
        });
    } catch (error) {
        console.log('error:', error);
        return NextResponse.json({ error: 'Failed to clear records' }, { status: 400 });
    }
} 