# TotFesta 🎉

Aplicació de lloguer d'articles per a festes i celebracions.

## Tecnologies

- Expo SDK 56
- React Native 0.85
- Gluestack UI v3 + NativeWind v4
- Expo Router v3
- TypeScript
- Zustand
- AsyncStorage
- Supabase
- TanStack React Query
- Firebase

## Estructura

```
src/
├── app/          # Pantalles i rutes
├── components/   # Components reutilitzables
├── config/       # Configuració de Supabase
├── constants/    # Colors i tema
├── hooks/        # Hooks personalitzats
├── providers/    # Context API providers
├── schemas/      # Esquemes de validació Zod
├── services/     # Serveis de dades (Supabase)
├── stores/       # Zustand stores
├── types/        # TypeScript types
└── utils/        # Funcions utilitàries
```

## Branca de desenvolupament

- `develop` — branca principal de desenvolupament
- `task-project-setup` — Tasca 1: configuració del projecte
- `task-client-management` — Tasca 2: manteniment de clients
- `task-app-state` — Tasca 3: estat de l'aplicació
- `task-backend-react-query` — Tasca 4: consum de backend
- `task-storage-login` — Tasca 5: storage i login
- `task-push-notifications` — Tasca 6: notificacions push
- `task-free-improvement` — Tasca 7: millora lliure

<br>

## Funcionalitats implementades

### Tasca 1: Creació del projecte

- Pantalla de login
- Fonts i paleta de colors personalitzades
- Component DiscoBall (Lottie)

### Tasca 2: Manteniment de clients

- Autenticació guard amb redirecció automàtica
- Tab navigator (Inici + Clients)
- Pantalla Home amb resum de pedidos i operativa del dia
- Llistat de clients amb cerca per nom, email i telèfon
- Detall de client amb dades de contacte i últims pedidos
- Formulari de creació i edició de clients
- Validació amb React Hook Form + Zod
- Soft delete i activació de clients amb confirmació
- Dades mock per a proves

### Tasca 3: Estat de l'aplicació

- Context API per a autenticació (AuthProvider)
- Zustand store per a dades de l'usuari (useUserStore)
- Persistència de sessió amb AsyncStorage
- Guard d'autenticació real amb navegació protegida
- Pantalla de perfil amb edició de nom i logout
- Pantalla de preferències amb selector de tema (clar/fosc)
- Tema persistent entre sessions
- Navegació diferenciada per rol (Admin/Operari)
- Home mostra informació de l'usuari autenticat

### Tasca 4: Consum de backend i React Query

- Supabase configurat com a backend
- Base de dades amb taules de clients, pedidos, productes i usuaris
- Eliminació de dades mock del frontend
- Serveis centralitzats per a clients i pedidos
- React Query per a gestió de dades (useQuery i useMutation)
- Loading states i error handling a totes les pantalles
- Cacheo automàtic i invalidació de queries
- CRUD de clients connectat a Supabase

### Tasca 5: Storage i Login

- Autenticació real amb Supabase Auth (login i registre)
- Pantalla de registre amb validació i sincronització a la taula usuarios
- Persistència de sessió gestionada per Supabase Auth
- Avatar de perfil amb Supabase Storage
- Canvi i previsualització d'avatar des del perfil
- Actualització de nom sincronitzada amb Supabase

### Tasca 6: Notificacions push

- Implementació de notificacions push amb firebase al afegir un nou client

### Tasca 7: Millora lliure

- Catàleg de productes accessible per a usuaris no registrats i registrats
- Actualització del registre per a la creació de clients, amb un procés més clar i eficient
- Els clients poden crear pedidos per a ells mateixos des de l’aplicació
- Els administradors i operaris poden crear pedidos per a qualsevol client, mantenint permisos diferenciats segons el rol
