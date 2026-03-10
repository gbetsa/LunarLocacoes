'use server';

import { authService } from "@/lib/services/AuthService";
import { redirect } from "next/navigation";

export async function logoutAction() {
    await authService.logout();
    redirect('/');
}
