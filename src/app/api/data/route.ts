import { NextResponse } from 'next/server';
import { getAllData } from '@/core/services/storage-service';

export async function GET() {
    try {
        const data = await getAllData();
        return NextResponse.json({
            success: true,
            data
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
