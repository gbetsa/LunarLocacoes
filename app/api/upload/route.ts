import { uploadController } from '@/lib/controllers/UploadController';

export async function POST(request: Request) {
    return uploadController.upload(request);
}
