import { put } from '@vercel/blob';
import sharp from 'sharp';

export class UploadService {
    /**
     * Faz o upload de uma imagem otimizada para o Vercel Blob
     * @param file Arquivo original vindo do request
     * @param fileName Nome original do arquivo
     * @returns URL da imagem salva
     */
    async uploadImage(file: File, fileName: string): Promise<string> {
        try {
            // Converte File para Buffer para o Sharp processar
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Otimização com Sharp:
            // 1. Redimensiona (máximo 1024px de largura/altura mantendo proporção)
            // 2. Converte para WebP (formato moderno, super leve e com ótimo suporte)
            // 3. Comprime (80% qualidade)
            // 4. Remove metadados (limpeza de dados EXIF)
            const optimizedBuffer = await sharp(buffer)
                .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80, effort: 6 }) // effort 6 = melhor compressão vs tempo
                .toBuffer();

            // Gera um nome de arquivo amigável (.webp)
            const baseName = fileName.split('.')[0] || 'image';
            const safeFileName = `products/${Date.now()}-${baseName}.webp`;

            const blob = await put(safeFileName, optimizedBuffer, {
                access: 'public',
                contentType: 'image/webp'
            });

            return blob.url;
        } catch (error) {
            console.error('Erro no UploadService com Sharp (WebP):', error);
            throw new Error('Falha ao processar e fazer upload da imagem');
        }
    }
}

export const uploadService = new UploadService();
