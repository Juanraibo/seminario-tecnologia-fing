// Normalizar datos de Supabase (snake_case) a camelCase para el frontend

export function normalizeUsuario(usuario) {
  if (!usuario) return null
  return {
    ...usuario,
    institutoId: usuario.instituto_id,
    gestoraId: usuario.gestora_id,
  }
}

export function normalizeLote(lote) {
  if (!lote) return null
  return {
    ...lote, // Mantener todos los campos originales (snake_case)
    tipo: 'entrada', // Identificar como lote de entrada
    institutoId: lote.instituto_id,
    instituto_id: lote.instituto_id, // Mantener snake_case
    gestoraAsignada: lote.gestora_asignada,
    gestoraAsignada_id: lote.gestora_asignada_id,
    fechaSolicitud: lote.fecha_solicitud,
    fecha_solicitud: lote.fecha_solicitud, // Mantener snake_case
    fechaRecepcionEcopunto: lote.fecha_recepcion_ecopunto,
    fecha_recepcion_ecopunto: lote.fecha_recepcion_ecopunto, // Mantener snake_case
    fechaClasificacionCompleta: lote.fecha_clasificacion_completa,
    fecha_clasificacion_completa: lote.fecha_clasificacion_completa, // Mantener snake_case
    itemsClasificados: lote.items_clasificados,
    items_clasificados: lote.items_clasificados, // Mantener snake_case
    pesoDeclaradoAproxKg: lote.peso_declarado_aprox_kg,
    peso_declarado_aprox_kg: lote.peso_declarado_aprox_kg, // Mantener snake_case
    descripcion: lote.descripcion,
    observaciones: lote.observaciones,
  }
}

export function normalizeItem(item) {
  if (!item) return null
  return {
    ...item, // Mantener todos los campos originales (snake_case)
    loteOrigenId: item.lote_origen_id,
    lote_origen_id: item.lote_origen_id, // Mantener snake_case
    institutoId: item.instituto_id,
    instituto_id: item.instituto_id, // Mantener snake_case
    pesoKg: item.peso_kg,
    peso_kg: item.peso_kg, // Mantener ambos para compatibilidad
    co2Kg: item.co2_kg,
    co2_kg: item.co2_kg, // Mantener ambos
    co2Source: item.co2_source,
    co2_source: item.co2_source, // Mantener snake_case
    fotoUrl: item.foto_url,
    foto_url: item.foto_url, // Mantener snake_case
    clasificadoPorIa: item.clasificado_por_ia,
    clasificado_por_ia: item.clasificado_por_ia, // Mantener snake_case
    confianzaIa: item.confianza_ia,
    confianza_ia: item.confianza_ia, // Mantener snake_case
    lotePublicadoId: item.lote_publicado_id,
    lote_publicado_id: item.lote_publicado_id, // Mantener snake_case
    fechaClasificacion: item.fecha_clasificacion,
    fecha_clasificacion: item.fecha_clasificacion, // Mantener snake_case
  }
}

export function normalizeLotePublicacion(lote) {
  if (!lote) return null
  return {
    ...lote,
    tipo: 'publicacion', // Identificar como lote de publicación
    cantidadItems: lote.cantidad_items,
    cantidad_items: lote.cantidad_items, // Mantener ambos para compatibilidad
    pesoTotalKg: lote.peso_total_kg,
    peso_total_kg: lote.peso_total_kg, // Mantener ambos para compatibilidad
    co2TotalKg: lote.co2_total_kg,
    gestoraAsignada_id: lote.gestora_asignada_id,
    fechaPublicacion: lote.fecha_publicacion,
    fechaAsignacion: lote.fecha_asignacion,
    fechaRetiro: lote.fecha_retiro,
    fechaCertificado: lote.fecha_certificado,
    certificadoUrl: lote.certificado_url,
  }
}

export function normalizeGestora(gestora) {
  if (!gestora) return null
  return {
    ...gestora,
    emailContacto: gestora.email_contacto,
    habilitacion_ministerio: gestora.activa, // mapeo temporal
  }
}

export function normalizeInstituto(instituto) {
  if (!instituto) return null
  return {
    ...instituto,
    emailContacto: instituto.email_contacto,
  }
}
