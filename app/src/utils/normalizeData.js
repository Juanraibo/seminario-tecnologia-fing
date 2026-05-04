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
    ...lote,
    institutoId: lote.instituto_id,
    gestoraAsignada: lote.gestora_asignada,
    gestoraAsignada_id: lote.gestora_asignada_id,
    fechaSolicitud: lote.fecha_solicitud,
    fechaRecepcionEcopunto: lote.fecha_recepcion_ecopunto,
    fechaClasificacionCompleta: lote.fecha_clasificacion_completa,
    itemsClasificados: lote.items_clasificados,
    pesoDeclaradoAproxKg: lote.peso_declarado_aprox_kg,
  }
}

export function normalizeItem(item) {
  if (!item) return null
  return {
    ...item,
    loteOrigenId: item.lote_origen_id,
    institutoId: item.instituto_id,
    pesoKg: item.peso_kg,
    co2Kg: item.co2_kg,
    co2Source: item.co2_source,
    fotoUrl: item.foto_url,
    clasificadoPorIa: item.clasificado_por_ia,
    confianzaIa: item.confianza_ia,
    lotePublicadoId: item.lote_publicado_id,
    fechaClasificacion: item.fecha_clasificacion,
  }
}

export function normalizeLotePublicacion(lote) {
  if (!lote) return null
  return {
    ...lote,
    cantidadItems: lote.cantidad_items,
    pesoTotalKg: lote.peso_total_kg,
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
