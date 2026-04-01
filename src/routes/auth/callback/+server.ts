import { redirect } from '@sveltejs/kit';
import { createServerSupabase } from '$lib/supabase/server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  if (code) {
    const supabase = createServerSupabase(cookies);
    await supabase.auth.exchangeCodeForSession(code);
  }
  redirect(303, '/');
};
