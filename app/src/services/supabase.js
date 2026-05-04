import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '../config/supabase.config'

// Usar credenciales del archivo de configuración
const supabaseUrl = SUPABASE_CONFIG.url
const supabaseAnonKey = SUPABASE_CONFIG.anonKey

console.log('🔍 Conectando a Supabase...')
console.log('URL:', supabaseUrl)

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

export async function actualizarGestora(id, cambios) {
  const { data, error } = await supabase
    .from('gestoras')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

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
  console.log('🔄 Intentando crear item en Supabase:', item)

  const { data, error } = await supabase
    .from('items')
    .insert(item)
    .select()
    .single()

  if (error) {
    console.error('❌ Error de Supabase al crear item:', error)
    throw error
  }

  console.log('✅ Item creado exitosamente:', data)
  return data
}

export async function actualizarItem(id, cambios) {
  const { data, error } = await supabase
    .from('items')
    .update(cambios)
    .eq('id', id)
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

export async function getAllConfig() {
  const { data, error } = await supabase
    .from('config')
    .select('key, value')

  if (error) throw error

  // Convertir array de {key, value} a objeto
  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {})
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
