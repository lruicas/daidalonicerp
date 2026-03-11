

## Plan: Mejorar el Asistente IA y hacerlo disponible en ambas vistas (Lista y Mapa)

### Situación actual
- `AIAssistantPanel` solo se renderiza dentro de `InventoryMap.tsx` (vista mapa).
- Las sugerencias son puramente basadas en posiciones del mapa (zonas, itemPositions), lo que las hace irrelevantes en la vista lista.
- En la vista lista no hay ningún botón ni panel de IA.

### Cambios propuestos

**1. Mover el botón IA y el panel al nivel de página (`Inventario.tsx`)**
- Añadir un botón flotante ✨ "Asistente IA" en la esquina inferior derecha, visible en ambas vistas.
- Renderizar `AIAssistantPanel` a nivel de página, no dentro de `InventoryMap`.
- Eliminar el botón ✨ duplicado de `InventoryMap.tsx`.

**2. Ampliar las sugerencias para que funcionen sin mapa (vista lista)**
- Añadir nuevos tipos de sugerencia independientes de posiciones:
  - **Stock bajo**: objetos con pocas unidades.
  - **Sin responsable**: objetos sin responsable asignado.
  - **Sin ubicación**: objetos con campo `ubicacion` vacío.
  - **Objetos obsoletos**: estado "Roto" que llevan tiempo sin actualizar.
  - **Distribución por sección**: resumen de desequilibrios.
- Mantener las sugerencias existentes basadas en mapa (coherencia, capacidad, agrupación, reubicación) pero marcarlas como "Solo mapa" para que el usuario sepa que aplican en esa vista.

**3. Mejorar el panel visualmente**
- Añadir un indicador con badge de número de sugerencias pendientes en el botón flotante.
- Separar visualmente las sugerencias en dos grupos: "General" (aplica en ambas vistas) y "Mapa" (solo aplica en vista mapa).

### Archivos a modificar
- **`src/pages/Inventario.tsx`**: Añadir estado `aiOpen`, botón flotante ✨, y renderizar `AIAssistantPanel`.
- **`src/components/inventario/map/AIAssistantPanel.tsx`**: Ampliar `generateSuggestions` con sugerencias generales; añadir prop `view` para contextualizar; mejorar agrupación visual.
- **`src/components/inventario/InventoryMap.tsx`**: Eliminar el botón ✨ y la importación/renderizado de `AIAssistantPanel` (se mueve al padre).

