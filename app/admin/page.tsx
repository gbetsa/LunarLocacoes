import type { Metadata } from 'next';
import React from 'react';
import { authService } from '@/lib/services/AuthService';
import { productService } from '@/lib/services/ProductService';
import { categoryService } from '@/lib/services/CategoryService';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';

import { AdminUser } from '@/lib/controllers/AuthController';

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Painel administrativo da Lunar Locações.",
    robots: { index: false, follow: false },
};


const AdminDashboard = async () => {
    // Busca o usuário logado via servidor para garantir segurança extra
    const user = (await authService.getCurrentUser()) as AdminUser | null;

    // Busca os dados reais para o dashboard
    const products = await productService.getAllProducts({});
    const categories = await categoryService.getAllCategories();

    return <AdminDashboardContent products={products} categories={categories} user={user} />;
};

export default AdminDashboard;
