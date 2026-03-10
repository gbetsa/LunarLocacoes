import { NextResponse } from 'next/server';
import { uploadService } from '../services/UploadService';

export class UploadController {
    async upload(request: Request) {
        try {
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
            }

            // Validações básicas
            if (!file.type.startsWith('image/')) {
                return NextResponse.json({ error: 'O arquivo deve ser uma imagem' }, { status: 400 });
            }

            const imageUrl = await uploadService.uploadImage(file, file.name);

            return NextResponse.json({ url: imageUrl }, { status: 201 });
        } catch (error) {
            console.error('Erro no UploadController:', error);
            return NextResponse.json({ error: 'Erro ao processar upload' }, { status: 500 });
        }
    }
}

export const uploadController = new UploadController();
