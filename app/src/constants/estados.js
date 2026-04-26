export const ESTADOS_LOTE = {
  PENDIENTE_ENVIO:  "Pendiente envío Ecopunto",
  EN_ECOPUNTO:      "En Ecopunto",
  CLASIFICADO:      "Clasificado (no publicado)",
  DISPONIBLE:       "Disponible para retiro",
  SOLICITADO:       "Solicitado por Gestora/s",
  RETIRO_APROBADO:  "Retiro Aprobado — Pendiente de Certificado",
  FINALIZADO:       "Finalizado",
}

export const COLORES_ESTADO = {
  [ESTADOS_LOTE.PENDIENTE_ENVIO]: "bg-yellow-100 text-yellow-800",
  [ESTADOS_LOTE.EN_ECOPUNTO]:     "bg-blue-100 text-blue-800",
  [ESTADOS_LOTE.CLASIFICADO]:     "bg-gray-100 text-gray-700",
  [ESTADOS_LOTE.DISPONIBLE]:      "bg-green-100 text-green-800",
  [ESTADOS_LOTE.SOLICITADO]:      "bg-orange-100 text-orange-800",
  [ESTADOS_LOTE.RETIRO_APROBADO]: "bg-purple-100 text-purple-800",
  [ESTADOS_LOTE.FINALIZADO]:      "bg-emerald-100 text-emerald-800",
}
