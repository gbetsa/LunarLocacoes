import { MetadataRoute } from 'next';
import { productService } from '@/lib/services/ProductService';

const BASE_URL = 'https://lunarlocacoes.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await productService.getAllProducts();

    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${BASE_URL}/produto/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...productUrls,
    ];
}
