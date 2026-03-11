import prisma from '@/lib/prisma';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

export class SettingsService {
    async getSettings() {
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    whatsapp: '',
                },
            });
        }

        return settings;
    }

    async updateSettings(whatsapp: string) {
        const settings = await this.getSettings();

        const updated = await prisma.settings.update({
            where: { id: settings.id },
            data: { whatsapp },
        });
        revalidateTag('settings', 'default');
        revalidatePath('/', 'layout');
        return updated;
    }

    async getWhatsAppNumber() {
        const settings = await this.getSettings();
        return settings.whatsapp || '';
    }

    async getWhatsAppLink(message?: string) {
        let number = await this.getWhatsAppNumber();
        // Remove non-numeric characters for the link
        const cleanNumber = number.replace(/\D/g, '');

        // Ensure it starts with 55 if not present (assuming Brazil)
        const finalNumber = cleanNumber.length <= 11 ? `55${cleanNumber}` : cleanNumber;

        let link = `https://wa.me/${finalNumber}`;
        if (message) {
            link += `?text=${encodeURIComponent(message)}`;
        }
        return link;
    }
}

export const settingsService = new SettingsService();
