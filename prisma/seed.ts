import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed...')

    // Criar usuário admin inicial
    const adminEmail = 'admin@lunarlocacoes.com.br'
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Administrador Lunar'
        }
    })
    console.log('Usuário admin criado/verificado.')

    // Categorias baseadas no mock original
    const categoriesData = [
        'Mobiliário', 'Iluminação', 'Decoração', 'Tecnologia',
        'Ferramentas', 'Equipamentos', 'Eletrodomésticos',
        'Veículos', 'Estruturas', 'Cozinha', 'Eventos',
        'Refrigeração', 'Limpeza', 'Profissional', 'Climatização'
    ]

    console.log('Criando categorias...')
    for (const name of categoriesData) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }

    const allCategories = await prisma.category.findMany()
    const catMap = Object.fromEntries(allCategories.map(c => [c.name, c.id]))

    // Produtos baseados no mock original (simplificado para o seed)
    const products = [
        {
            name: 'Maca de Massagem Profissional',
            description: 'Maca dobrável em alumínio, leve e resistente. Ideal para estúdios de tatuagem, massoterapia e estética.',
            available: true,
            rentalPeriod: '1 dia',
            categories: ['Mobiliário', 'Decoração'],
            minQuantity: 1,
            specifications: [
                { label: 'Peso Suportado', value: '250kg' },
                { label: 'Material', value: 'Alumínio e Courvin' },
                { label: 'Peso da Maca', value: '12kg' },
            ]
        },
        {
            name: 'Drone DJI Mini 3 Pro',
            description: 'Drone compacto e potente com câmera 4K HDR. Ideal para filmagens aéreas profissionais e inspeções técnicas.',
            available: true,
            rentalPeriod: '15 dias',
            categories: ['Tecnologia', 'Equipamentos'],
            minQuantity: 1,
            specifications: [
                { label: 'Câmera', value: '4K / 60fps' },
                { label: 'Tempo de Voo', value: '34 minutos' },
                { label: 'Peso', value: '249g' },
            ]
        },
        {
            name: 'Refletor LED 200W RGB',
            description: 'Refletor de alta potência com controle remoto para troca de cores. Perfeito para iluminação cênica de fachadas e eventos.',
            available: true,
            rentalPeriod: '1 dia',
            categories: ['Iluminação', 'Eventos'],
            minQuantity: 2,
            specifications: [
                { label: 'Potência', value: '200W' },
                { label: 'Proteção', value: 'IP66 (A prova d\'água)' },
                { label: 'Cores', value: '16 cores + efeitos' },
            ]
        },
        {
            name: 'Notebook Gamer RTX 3060',
            description: 'Notebook de alto desempenho para edição de vídeo, design gráfico ou gaming de alta performance.',
            available: true,
            rentalPeriod: '15 dias',
            categories: ['Tecnologia', 'Equipamentos'],
            minQuantity: 1,
            specifications: [
                { label: 'GPU', value: 'NVIDIA RTX 3060' },
                { label: 'RAM', value: '16GB DDR4' },
                { label: 'Processador', value: 'Intel i7 12ª Ger' },
            ]
        }
    ]

    console.log('Criando produtos...')
    for (const p of products) {
        // Usa o ID da primeira categoria da lista
        const primaryCategoryId = p.categories[0] ? catMap[p.categories[0]] : undefined;
        // As demais categorias viram tags
        const extraTags = p.categories.slice(1).join(', ');

        await prisma.product.create({
            data: {
                name: p.name,
                description: p.description,
                available: p.available,
                rentalPeriod: p.rentalPeriod,
                minQuantity: p.minQuantity,
                specifications: p.specifications,
                categoryId: primaryCategoryId || null,
                tags: extraTags || null,
                images: [],
            }
        })
    }

    console.log('Seed finalizado com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
