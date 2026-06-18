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

## Estructura

```
src/
├── app/          # Pantalles i rutes
├── components/   # Components reutilitzables
├── constants/    # Colors i tema
├── hooks/        # Hooks personalitzats
├── providers/    # Context API providers
├── schemas/      # Esquemes de validació Zod
├── services/     # Serveis de dades
├── stores/       # Zustand stores
├── types/        # TypeScript types i dades mock
└── utils/        # Funcions utilitàries
```

## Branca de desenvolupament

- `develop` — branca principal de desenvolupament
- `task-project-setup` — Tasca 1: configuració del projecte
- `task-client-management` — Tasca 2: manteniment de clients
- `task-app-state` — Tasca 3: estat de l'aplicació

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
