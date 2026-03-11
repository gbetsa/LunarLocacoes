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
    // Busca os dados em paralelo para melhorar a performance
    const [user, products, categories] = await Promise.all([
        authService.getCurrentUser() as Promise<AdminUser | null>,
        productService.getAllProducts({}),
        categoryService.getAllCategories()
    ]);

    return <AdminDashboardContent products={products} categories={categories} user={user} />;
};

export default AdminDashboard;
