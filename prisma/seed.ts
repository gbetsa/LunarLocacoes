import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed...')

    // Criar usuário admin inicial usando variáveis de ambiente
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME

    if (!adminEmail || !adminPassword || !adminName) {
        throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD e ADMIN_NAME são obrigatórios no .env')
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail as string }
    })

    if (existingAdmin) {
        await prisma.user.update({
            where: { id: existingAdmin.id },
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: adminName
            }
        })
        console.log('Usuário admin atualizado.')
    } else {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: adminName
            }
        })
        console.log('Usuário admin criado.')
    }

    console.log('Seed de admin finalizado com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
