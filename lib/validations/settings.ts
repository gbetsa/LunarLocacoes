import { z } from 'zod';

export const settingsSchema = z.object({
    whatsapp: z.string().min(1, 'Número do WhatsApp é obrigatório'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
