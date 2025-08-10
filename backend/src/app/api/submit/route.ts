import { NextResponse } from 'next/server';
import { Database } from '../../../util/supabase-types'
import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server'

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS(request: NextRequest) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    })
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { uid, img, title, displayName } = body;

        if (!img) {
            return NextResponse.json({ error: 'img is required' }, { 
                status: 400,
                headers: corsHeaders 
            });
        }

        // Log the displayName for debugging but don't store it in the Canvas table
        console.log('Submission from user:', displayName);

        // Prepare the insert data - only include fields that exist in the Canvas table
        const insertData: any = {
            img: img,
            title: title || null,
            elo: 1000,
            updatedAt: new Date().toISOString(),
            display_name: displayName || null
        };

        // Only include uid if it looks like a valid UUID, otherwise let DB auto-generate
        if (uid && uid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            insertData.uid = uid;
        }

        console.log('Inserting data:', insertData);

        const { data, error } = await supabase
            .from('Canvas')
            .insert(insertData)
            .select()

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ 
                error: `Database error: ${error.message}` 
            }, { 
                status: 400,
                headers: corsHeaders 
            });
        }

        console.log('Insert successful:', data);
        return NextResponse.json({ success: true, data }, {
            headers: corsHeaders
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ 
            error: 'Invalid request data' 
        }, { 
            status: 400,
            headers: corsHeaders 
        });
    }
} 