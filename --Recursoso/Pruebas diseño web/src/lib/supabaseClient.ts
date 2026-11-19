import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true cuando las dos variables de entorno están puestas */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Cliente de Supabase, o `null` si el proyecto aún no está configurado.
 *
 * Devolvemos null a propósito en lugar de crear el cliente con valores de
 * relleno: `createClient` lanza "Invalid supabaseUrl" y eso tumbaría la app
 * entera en cuanto falte una variable. Así, sin configurar, la encuesta
 * sigue funcionando y sencillamente no guarda nada.
 */
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl as string, supabaseAnonKey as string)
    : null;
