import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// DEBUG: verificar si las variables están definidas (TEMPORAL - eliminar después)
console.log('🔍 Verificando credenciales Supabase...')
console.log('URL definida:', supabaseUrl ? '✅ Sí' : '❌ No')
console.log('ANON_KEY definida:', supabaseAnonKey ? '✅ Sí' : '❌ No')
if (supabaseUrl) console.log('URL:', supabaseUrl.substring(0, 30) + '...')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// HELPERS PARA TABLAS
// ============================================================================

// Institutos
export async function getInstitutos() {
  const { data, error } = await supabase
    .from('institutos')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) throw error
  return data
}

// Gestoras
export async function getGestoras() {
  const { data, error } = await supabase
    .from('gestoras')
    .select('*')
    .eq('activa', true)
    .order('scoring', { ascending: false })

  if (error) throw error
  return data
}

// Usuarios
export async function loginUsuario(email, password) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .eq('activo', true)
    .single()

  if (error) throw error
  return data
}

// Lotes de entrada
export async function getLotesEntrada(institutoId = null) {
  let query = supabase
    .from('lotes_entrada')
    .select('*')
    .order('fecha_solicitud', { ascending: false })

  if (institutoId) {
    query = query.eq('instituto_id', institutoId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function crearLoteEntrada(lote) {
  const { data, error } = await supabase
    .from('lotes_entrada')
    .insert(lote)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarLoteEntrada(id, cambios) {
  const { data, error } = await supabase
    .from('lotes_entrada')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Items
export async function getItems(loteOrigenId = null) {
  let query = supabase
    .from('items')
    .select('*')
    .order('fecha_clasificacion', { ascending: false })

  if (loteOrigenId) {
    query = query.eq('lote_origen_id', loteOrigenId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function crearItem(item) {
  const { data, error } = await supabase
    .from('items')
    .insert(item)
    .select()
    .single()

  if (error) throw error
  return data
}

// Lotes de publicación
export async function getLotesPublicacion() {
  const { data, error } = await supabase
    .from('lotes_publicacion')
    .select('*')
    .order('fecha_publicacion', { ascending: false })

  if (error) throw error
  return data
}

export async function crearLotePublicacion(lote) {
  const { data, error } = await supabase
    .from('lotes_publicacion')
    .insert(lote)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarLotePublicacion(id, cambios) {
  const { data, error } = await supabase
    .from('lotes_publicacion')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Solicitudes de gestoras
export async function getSolicitudesGestoras(gestoraId = null) {
  let query = supabase
    .from('solicitudes_gestoras')
    .select('*')
    .order('created_at', { ascending: false })

  if (gestoraId) {
    query = query.eq('gestora_id', gestoraId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function crearSolicitudGestora(solicitud) {
  const { data, error } = await supabase
    .from('solicitudes_gestoras')
    .insert(solicitud)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarSolicitudGestora(id, cambios) {
  const { data, error } = await supabase
    .from('solicitudes_gestoras')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Config
export async function getConfig(key) {
  const { data, error } = await supabase
    .from('config')
    .select('value')
    .eq('key', key)
    .single()

  if (error) throw error
  return data.value
}

// ============================================================================
// HELPERS PARA STORAGE (fotos y certificados)
// ============================================================================

export async function subirImagen(bucket, file, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}

export async function obtenerUrlPublica(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}
