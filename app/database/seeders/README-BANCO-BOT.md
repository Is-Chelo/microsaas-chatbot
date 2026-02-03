# Seeder: Banco Crédito Seguro Bot

## 📋 Descripción

Este seeder crea un bot completo para WhatsApp de un banco con sistema de menús interactivos.

## 🏗️ Estructura Creada

### 1. **Agencia** (Agency)
- **ID:** 1
- **Nombre:** Banco Crédito Seguro
- **Estado:** Activo
- **Company ID:** BCS-2026
- **Límite de conexiones:** 10

### 2. **Conexión** (Connection)
- **ID:** 1
- **Nombre:** WhatsApp Banco Crédito
- **Teléfono:** +591 70000000
- **Tipo:** WhatsApp
- **Estado:** Activo
- **Agencia:** Banco Crédito Seguro

### 3. **Bot**
- **ID:** 1
- **Palabra de activación:** "hola"
- **Estado:** Activo
- **Mensaje de bienvenida:** "¡Hola! Bienvenido a Banco Crédito Seguro 🏦"

### 4. **Nodos del Bot** (5 nodos)

#### Nodo 1: `main` (Menú Principal)
Mensaje: "🏦 Bienvenido a Banco Crédito Seguro 💰"

**Opciones:**
- **A:** 💵 Préstamos Disponibles → Va al nodo `prestamos`
- **B:** 📍 Nuestras Sucursales → Ejecuta acción de ubicación
- **C:** 📄 Requisitos Generales → Envía documento PDF
- **D:** 👩‍💼 Hablar con un Asesor → Envía mensaje de contacto

#### Nodo 2: `prestamos` (Tipos de Préstamos)
Mensaje: "💵 Tipos de Préstamos Disponibles"

**Opciones:**
- **1:** 🏠 Préstamo Hipotecario → Va al nodo `hipotecario`
- **2:** 🚗 Préstamo Vehicular → Va al nodo `vehicular`
- **3:** 📱 Préstamo Personal → Va al nodo `personal`
- **4:** ⬅️ Volver al Menú Principal → Va al nodo `main`

#### Nodo 3: `hipotecario` (Préstamo Hipotecario)
Mensaje: "🏠 Préstamo Hipotecario - Financia la casa de tus sueños 💙"

**Opciones:**
- **A:** 📊 Ver Detalles → Muestra información de tasas y plazos
- **B:** 📷 Ver Ejemplo → Envía imagen ilustrativa
- **C:** ⬅️ Volver → Va al nodo `prestamos`

#### Nodo 4: `vehicular` (Préstamo Vehicular)
Mensaje: "🚗 Préstamo Vehicular - Estrena auto hoy mismo 😎"

**Opciones:**
- **A:** 📊 Información → Muestra detalles del préstamo vehicular
- **B:** ⬅️ Volver → Va al nodo `prestamos`

#### Nodo 5: `personal` (Préstamo Personal)
Mensaje: "📱 Préstamo Personal - Dinero rápido para lo que necesites 💳"

**Opciones:**
- **A:** 💡 Beneficios → Muestra beneficios del préstamo
- **B:** 📄 Solicitar Información → Mensaje para dejar datos
- **C:** ⬅️ Volver → Va al nodo `prestamos`

### 5. **Acciones del Bot** (8 acciones)

| ID | Tipo | Descripción |
|----|------|-------------|
| 1 | location | Envía ubicación de sucursal (coordenadas GPS) |
| 2 | file | Envía documento PDF con requisitos |
| 3 | text | Mensaje de contacto con asesor |
| 4 | text | Detalles del préstamo hipotecario |
| 5 | image | Imagen ejemplo de préstamo hipotecario |
| 6 | text | Información del préstamo vehicular |
| 7 | text | Beneficios del préstamo personal |
| 8 | text | Mensaje para solicitar información |

### 6. **Opciones de Nodos** (16 opciones totales)

Cada opción conecta:
- Un nodo origen
- Una clave de opción (A, B, C, 1, 2, 3, etc.)
- Un label descriptivo
- Un nodo destino (next_node_id) O una acción (action_id)
- Un índice de orden

## 🚀 Cómo Ejecutar el Seeder

```bash
# Ejecutar el seeder
npx sequelize-cli db:seed --seed 20260202000000-banco-bot.js

# Revertir el seeder
npx sequelize-cli db:seed:undo --seed 20260202000000-banco-bot.js
```

## ⚠️ Nota Importante sobre Emojis

Este seeder NO incluye emojis en los mensajes debido a que la base de datos no está configurada con charset `utf8mb4`. Si deseas usar emojis, debes:

1. Cambiar el charset de la base de datos a `utf8mb4`
2. Cambiar la collation a `utf8mb4_unicode_ci`
3. Actualizar los mensajes en el seeder para incluir emojis

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────┐
│          MAIN (Menú Principal)          │
│  A: Préstamos                           │
│  B: Sucursales (ubicación)              │
│  C: Requisitos (documento)              │
│  D: Asesor (texto)                      │
└─────────────┬───────────────────────────┘
              │ (A)
              ▼
┌─────────────────────────────────────────┐
│       PRESTAMOS (Tipos de Préstamos)    │
│  1: Hipotecario                         │
│  2: Vehicular                           │
│  3: Personal                            │
│  4: Volver ← MAIN                       │
└─────┬───────┬───────┬───────────────────┘
      │(1)    │(2)    │(3)
      ▼       ▼       ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│HIPOTECARIO│ │VEHICULAR │ │  PERSONAL    │
│A: Detalles│ │A: Info   │ │A: Beneficios │
│B: Imagen  │ │B: Volver │ │B: Solicitar  │
│C: Volver  │ └──────────┘ │C: Volver     │
└──────────┘               └──────────────┘
```

## 💡 Notas Importantes

1. **IDs Fijos:** Los IDs están hardcodeados para facilitar las relaciones. En producción, considera usar IDs auto-incrementales.

2. **Orden de Inserción:** El seeder respeta el orden de las foreign keys:
   - Primero: Agency
   - Segundo: Connection
   - Tercero: Bot
   - Cuarto: BotNodes y BotActions (pueden ir en paralelo)
   - Quinto: BotNodeOptions (depende de nodes y actions)

3. **Tipos de Acciones:**
   - `text`: Mensaje de texto simple
   - `image`: Envía imagen con caption
   - `file`: Envía documento/archivo
   - `location`: Envía ubicación GPS

4. **Navegación:**
   - Si una opción tiene `next_node_id`, navega a ese nodo
   - Si una opción tiene `action_id`, ejecuta esa acción
   - Algunas opciones pueden tener ambos (primero ejecuta acción, luego navega)

## 🔧 Personalización

Para personalizar el bot, modifica:
- **Mensajes:** Edita el campo `message` en los nodos
- **Opciones:** Edita `option_key` y `label` en las opciones
- **Acciones:** Edita el `payload` JSON en las acciones
- **Flujo:** Cambia los `next_node_id` para modificar la navegación
