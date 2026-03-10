import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    images: z.array(z.string()).min(1, 'Pelo menos uma imagem é obrigatória'),
    available: z.boolean().default(true),
    rentalPeriod: z.string().min(1, 'Período de locação é obrigatório'),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    specifications: z.array(z.any()).min(1, 'Pelo menos uma especificação é obrigatória'),
    minQuantity: z.number().int().min(1, 'Quantidade mínima deve ser pelo menos 1'),
    tags: z.string().min(1, 'Tags são obrigatórias'),
});

export type ProductInput = z.infer<typeof productSchema>;
