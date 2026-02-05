# Released Embed Demo

A Next.js app demonstrating the Released embed integration, deployable to Vercel.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Released credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import the project in [Vercel](https://vercel.com/new)

3. Add the following environment variables in Vercel's project settings:
   - `RELEASED_SHARED_SECRET` - Your Released shared secret
   - `RELEASED_ACCOUNT_ID` - Your Released account ID
   - `NEXT_PUBLIC_RELEASED_CHANNEL_ID` - Your Released channel ID

4. Deploy!

## Project Structure

```
├── app/
│   ├── api/
│   │   └── released-token/
│   │       └── route.ts    # API route for secure token generation
│   ├── layout.tsx          # Root layout with Released script
│   └── page.tsx            # Main page with Released embed
├── .env.example            # Environment variables template
└── .env.local              # Local environment variables (git-ignored)
```

## How It Works

1. The page component fetches an auth token from `/api/released-token`
2. The API route securely generates a token using your `RELEASED_SHARED_SECRET` (never exposed to the client)
3. The token is passed to the `<released-page>` web component for authenticated access
