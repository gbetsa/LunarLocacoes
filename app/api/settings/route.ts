import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    whatsapp: '',
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { whatsapp } = body;

        const settings = await prisma.settings.findFirst();

        if (!settings) {
            const newSettings = await prisma.settings.create({
                data: { whatsapp },
            });
            return NextResponse.json(newSettings);
        }

        const updatedSettings = await prisma.settings.update({
            where: { id: settings.id },
            data: { whatsapp },
        });

        return NextResponse.json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
