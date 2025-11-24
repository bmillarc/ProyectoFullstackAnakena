# Frontend Anakena

## Migración de estado a Zustand

Se reemplazaron `AuthContext` y `NotificationContext` por stores de Zustand.

### Stores
- `src/store/teamsStore.ts`: Equipos y jugadores (carga, selección de equipo, fallback mock).
- `src/store/newsStore.ts`: Noticias con orden por fecha, fallback mock y carga única.
- `src/store/calendarStore.ts`: Estado de calendario (mes actual, día seleccionado, eventos, expansión de evento).
- `src/store/storeStore.ts`: Productos tienda + carrito persistente (`persist` middleware), helpers `totalItems`, `findInCart`.

### Cambios principales
1. Eliminados los providers `AuthProvider` y `NotificationProvider` en `App.tsx`.
2. Componentes (`Login.tsx`, `Register.tsx`, `Navbar.tsx`, `ProtectedRoute.tsx`) consumen ahora el estado vía hooks `useAuthStore` y `useNotificationStore`.
3. Añadida dependencia `zustand` en `package.json`.

### Uso rápido
```ts
import { useAuthStore } from '../store/authStore';
const user = useAuthStore(s => s.user);
const login = useAuthStore(s => s.login);

```ts
// Noticias
import { useNewsStore } from '../store/newsStore';
const news = useNewsStore(s => s.news);
```

```ts
// Calendario
import { useCalendarStore } from '../store/calendarStore';
const currentDate = useCalendarStore(s => s.currentDate);
const eventsHoy = useCalendarStore(s => s.getEventsForDate(new Date()));
```

```ts
// Tienda
import { useStoreStore } from '../store/storeStore';
const total = useStoreStore(s => s.totalItems());
const addToCart = useStoreStore(s => s.addToCart);
```
```
- Implementar selectors memoizados (ej: categorías únicas de noticias) usando patrones de funciones derivadas fuera del componente.
- Code splitting para reducir tamaño del bundle.
const showNotification = useNotificationStore(s => s.showNotification);
showNotification('Acción realizada', 'success');
```

### Extender Persistencia
Si deseas persistir más datos o usar `localStorage` directamente, puedes envolver el store con:
```ts
import { persist } from 'zustand/middleware';
export const useExample = create(persist(/* config */));
```

### Próximos pasos sugeridos
- Migrar cualquier otro estado global que aparezca en nuevos contextos a stores de Zustand.
- Aplicar `persist` para carritos de compra o preferencias de usuario.
- Dividir stores por dominio (equipos, noticias, tienda) si crecen.
