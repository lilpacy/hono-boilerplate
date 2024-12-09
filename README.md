# 🔥 Hono + ⚡️ Supabase Boilerplate

This project is a backend boilerplate built using the Hono framework. Cloudfare Workers are used to host the backend. It includes integration with Supabase and handles user authentication and authorization.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/goktugcy/hono-boilerplate/blob/main/LICENSE)
![GitHub Created At](https://img.shields.io/github/created-at/goktugcy/hono-boilerplate)
![GitHub Repo stars](https://img.shields.io/github/stars/goktugcy/hono-boilerplate?style=flat)
![GitHub forks](https://img.shields.io/github/forks/goktugcy/hono-boilerplate?style=flat)

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

## Authentication 🛡 
 
The boilerplate includes an authentication middleware that checks if the user is authenticated. The middleware is used in the routes.ts file to protect routes that require authentication.

```ts
import { authMiddleware } from './middlewares/authMiddleware';

router.get('/countries', authMiddleware, CountryController.index);
```
#### Token Extraction: The middleware extracts the accessToken and refreshToken from the request cookies.

#### Token Verification: 
* If the accessToken is expired but the refreshToken is valid, it requests a new accessToken using the refreshToken.
* If both tokens are missing, it responds with an error.
* If the accessToken is present, it verifies the token using Supabase's authentication service.

## Supabase Client Usage ⚡️

The project uses two Supabase clients: `supabaseAnon` and `supabaseService`. These clients are created in the [`getSupabaseClient`](src/db/supabaseClient.ts) function in [src/db/supabaseClient.ts](src/db/supabaseClient.ts).

### `supabaseAnon`

The `supabaseAnon` client is used for operations that do not require elevated privileges. It is created using the anonymous key (`SUPABASE_ANON_KEY`) and is configured to not automatically refresh tokens, persist sessions, or detect sessions in URLs.

Example usage:
```ts
import { getSupabaseClient } from "./src/db/supabaseClient";

const getCountries = async (c: Context) => {
  const { supabaseAnon } = getSupabaseClient(c);
  let { data: countries, error } = await supabaseAnon.from("countries").select("*");

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json(countries, 200);
};
```

### `supabaseService`

The `supabaseService` client is used for operations that require elevated privileges, such as authentication and user management. It is created using the service key (`SUPABASE_SERVICE_KEY`).

Example usage:
```ts
import { getSupabaseClient } from "./src/db/supabaseClient";

const login = async (c: Context) => {
  const { supabaseService } = getSupabaseClient(c);
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  const { data, error } = await supabaseService.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  const accessToken = data.session?.access_token;
  const refreshToken = data.session?.refresh_token;

  if (!accessToken || !refreshToken) {
    return c.json({ error: "Token creation failed" }, 500);
  }

  setAuthCookies(c, accessToken, refreshToken);

  return c.json({ message: "Login successful", accessToken, refreshToken }, 200);
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.