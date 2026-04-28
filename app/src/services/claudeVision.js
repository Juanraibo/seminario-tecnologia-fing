/**
 * claudeVision.js
 * Servicio de clasificación de imágenes RAEE usando OpenRouter API.
 *
 * Implementa HU-E02: Recepción y Clasificación con Asistencia IA
 *
 * OpenRouter actúa como proxy unificado hacia múltiples modelos de IA.
 * Usamos Google Gemini 2.0 Flash (FREE) por su excelente relación calidad/precio en visión.
 * La API es compatible con el estándar OpenAI (chat/completions).
 *
 * TODO(producción): mover esta llamada a un backend para no exponer la API key en el cliente.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELO = import.meta.env.VITE_OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet";
const TIMEOUT_MS = 30000; // 30 segundos — aumentado para modelos más robustos

/**
 * Categorías válidas según Decreto 292/024 de Uruguay.
 * Se cargan desde config.json en producción; aquí como fallback.
 */
const CATEGORIAS_RAEE = [
  "Equipos de Informática y Telecomunicaciones",
  "Equipos de Audio y Video",
  "Baterías y Acumuladores",
  "Electrodomésticos de Línea Blanca",
  "Equipos de Iluminación",
  "Herramientas Eléctricas y Electrónicas",
  "Equipos Médicos",
  "Otros RAEE",
];

/**
 * Clasifica una imagen de RAEE usando Claude via OpenRouter.
 *
 * @param {string} base64Image - Imagen en formato base64 (sin el prefijo data:image/...)
 * @param {string} mediaType - Tipo MIME de la imagen (ej: "image/jpeg")
 * @param {string[]} categorias - Lista de categorías válidas (opcional, usa las del decreto por defecto)
 * @returns {Promise<{categoria: string, confianza: string, observacion: string}>}
 * @throws {Error} Si la API no responde o devuelve un error
 */
export async function clasificarImagenRAEE(
  base64Image,
  mediaType = "image/jpeg",
  categorias = CATEGORIAS_RAEE
) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_OPENROUTER_API_KEY no está configurada. Revisá tu archivo .env.local"
    );
  }

  const prompt = `Sos un clasificador experto de RAEE (Residuos de Aparatos Eléctricos y Electrónicos) según el Decreto 292/024 de Uruguay.

Analizá la imagen y clasificá los residuos electrónicos que ves.

Categorías válidas:
${categorias.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Respondé ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin explicaciones fuera del JSON:
{
  "categoria": "<una de las categorías listadas arriba, exactamente como está escrita>",
  "confianza": "<alto|medio|bajo>",
  "observacion": "<descripción breve de lo que ves en la imagen, máximo 2 oraciones>"
}`;

  // Implementar timeout manualmente con AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Headers opcionales de OpenRouter para tracking
        "HTTP-Referer": "https://github.com/Juanraibo/seminario-tecnologia-fing",
        "X-Title": "EcoFIng MVP - Seminario Tecnologias FIng",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${base64Image}`,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Mensajes de error más descriptivos
      let errorMsg = `Error ${response.status}`;

      if (response.status === 401) {
        errorMsg = "API key inválida o no configurada. Revisá tu archivo .env.local";
      } else if (response.status === 402) {
        errorMsg = "Sin créditos en OpenRouter. Agregá créditos o usá clasificación manual";
      } else if (response.status === 429) {
        errorMsg = "Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo";
      } else if (errorData.error?.message) {
        errorMsg = errorData.error.message;
      } else {
        errorMsg = `Error de la API: ${response.statusText}. Podés clasificar manualmente.`;
      }

      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Debug: mostrar respuesta completa si hay problema
    console.log("Respuesta OpenRouter:", data);

    const contenido = data.choices?.[0]?.message?.content;

    if (!contenido) {
      console.error("Respuesta sin contenido:", data);
      throw new Error("La IA no devolvió una clasificación válida. Intentá clasificar manualmente o volvé a intentar con otra foto.");
    }

    // Limpiar posibles bloques de código markdown que el modelo pueda agregar
    const jsonLimpio = contenido
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const resultado = JSON.parse(jsonLimpio);

    // Validar que la categoría devuelta sea una de las válidas
    if (!categorias.includes(resultado.categoria)) {
      // Si devuelve una categoría desconocida, la mapeamos a "Otros RAEE"
      console.warn(
        `IA devolvió categoría desconocida: "${resultado.categoria}". Usando "Otros RAEE".`
      );
      resultado.categoria = "Otros RAEE";
      resultado.confianza = "bajo";
    }

    return resultado;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(
        `La IA no respondió en ${TIMEOUT_MS / 1000} segundos. Intentá clasificar manualmente.`
      );
    }

    throw error;
  }
}

/**
 * Convierte un File o Blob a base64.
 * Utilidad para usar antes de llamar a clasificarImagenRAEE.
 *
 * @param {File|Blob} file
 * @returns {Promise<{base64: string, mediaType: string}>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result; // "data:image/jpeg;base64,/9j/..."
      const [header, base64] = result.split(",");
      const mediaType = header.replace("data:", "").replace(";base64", "");
      resolve({ base64, mediaType });
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
}
