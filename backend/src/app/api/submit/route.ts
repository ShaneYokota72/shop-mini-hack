import { NextResponse } from 'next/server';
import { Database } from '../../../util/supabase-types'
import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server'

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { uid, img } = body;

        if (!uid || !img) {
            return NextResponse.json({ error: 'uid and img are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('Canvas')
            .insert({
                uid: uid,
                img: img,
                elo: 1000,
                updatedAt: new Date().toISOString()
            })
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.log('error:', error);
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
} 