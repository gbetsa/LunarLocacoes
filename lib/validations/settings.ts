import { z } from 'zod';

export const settingsSchema = z.object({
    whatsapp: z.string().min(1, 'Número do WhatsApp é obrigatório'),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
