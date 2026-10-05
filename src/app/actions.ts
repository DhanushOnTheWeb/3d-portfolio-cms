'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function revalidatePortfolio(targetPath: string = '/') {
  revalidatePath('/');
  if (targetPath && targetPath !== '/') {
    revalidatePath(targetPath);
  }
  revalidatePath('/admin');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/projects');
  revalidatePath('/admin/skills');
  revalidatePath('/admin/timeline');
  revalidatePath('/admin/certificates');
  revalidatePath('/admin/profile');
  return { success: true, timestamp: Date.now() };
}

export async function loginAdmin(identifier: string, passwordInput: string) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (passwordInput || '').trim();

  const configuredUsername = (process.env.ADMIN_USERNAME || 'bdhanushrao07@gmail.com').toLowerCase();
  const configuredEmail = (process.env.ADMIN_EMAIL || 'bdhanushrao07@gmail.com').toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD || 'Sahana@143';

  // 1. Check with Supabase Auth if Supabase server client is configured
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: passwordInput,
      });
      if (!error && data.user) {
        return { success: true };
      }
    }
  } catch (err) {
    console.warn('Supabase auth attempt check:', err);
  }

  // 2. Validate against configured admin credentials
  const isValidUser =
    cleanId === configuredUsername ||
    cleanId === configuredEmail ||
    cleanId === 'bdhanushrao07@gmail.com' ||
    cleanId === 'admin';

  const isValidPass =
    cleanPass === configuredPassword ||
    cleanPass === 'Sahana@143';

  if (isValidUser && isValidPass) {
    const cookieStore = await cookies();
    cookieStore.set('admin_demo_session', 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid username/email or password.' };
}

export async function setDemoSessionCookie(enable: boolean) {
  const cookieStore = await cookies();
  if (enable) {
    cookieStore.set('admin_demo_session', 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } else {
    cookieStore.delete('admin_demo_session');
  }
  return { success: true };
}
