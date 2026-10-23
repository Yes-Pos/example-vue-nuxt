# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## SDK

Semua panggilan ke YesPOS lewat **[`@yespos/client`](https://www.npmjs.com/package/@yespos/client)** — SDK yang menandatangani request, memilih outlet, dan **menghitung ulang harga dari API** saat checkout:

```bash
npm install @yespos/client
```

File di `services/yespos/` (atau `server/utils/yespos/`) kini hanya pembungkus tipis di atas SDK, sehingga endpoint `/api/*` tidak berubah. Kode sumber SDK: https://github.com/Yes-Pos/yespos-client-sdk
