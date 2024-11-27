# 🔥 Hono + ⚡️ Supabase Boilerplate

This project is a backend boilerplate built using the Hono framework. Cloudfare Workers are used to host the backend. It includes integration with Supabase and handles user authentication and authorization.

## Installation 🚀

After cloning the repository, install the necessary dependencies by running:

```sh
bun install
```

## Configuration ✨

Edit the `.wrangler.toml` file to include the necessary environment variables:

```sh
STAGE = "dev" # dev or prod
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=

```

## Structure 🎄

```
.
├── src
│   ├── controllers
│   │   ├── AuthController.ts
│   │   ├── CountryController.ts
│   ├── middlewares
│   │   ├── authMiddleware.ts
│   ├── db
│   │   ├── supabaseClient.ts
│   ├── routes.ts
│   ├── helpers.ts
├── index.ts
├── wrangler.toml
├── package.json
├── README.md
├── tsconfig.json
├── .gitignore
├── bun.lockb

```

## Usage 🍻

To start the server, run:

```sh
bun dev
```

Deploy the server to Cloudfare Workers by running:

```sh
bun run deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
