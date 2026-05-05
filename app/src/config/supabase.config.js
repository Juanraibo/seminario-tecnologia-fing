// Configuración de Supabase
// Las credenciales se cargan desde variables de entorno
// Configurar en Vercel: Project Settings → Environment Variables

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
}
