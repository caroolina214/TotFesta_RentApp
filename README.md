# TotFesta 🎉

Aplicació de lloguer d'articles per a festes i celebracions.

## Tecnologies

- Expo SDK 56
- React Native 0.85
- Gluestack UI v3 + NativeWind v4
- Expo Router v3
- TypeScript

## Estructura

```

src/
├── app/          # Pantalles i rutes
├── components/   # Components reutilitzables
├── constants/    # Colors i tema
├── hooks/        # Hooks personalitzats
├── schemas/      # Esquemes de validació Zod
├── services/     # Serveis de dades
├── store/        # Zustand stores
├── types/        # TypeScript types i dades mock
└── utils/        # Funcions utilitàries

```

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
