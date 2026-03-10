import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { settingsSchema } from '@/lib/validations/settings';

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
        const result = settingsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: result.error.issues[0].message
            }, { status: 400 });
        }

        const { whatsapp } = result.data;

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
