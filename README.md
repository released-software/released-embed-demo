# Released Embed Demo

A Next.js app demonstrating how to embed a [Released](https://released.so) portal with server-side user authentication. This allows your users to access the roadmap without needing to log in separately.

**Live Demo:** [https://released-embed-demo.vercel.app](https://released-embed-demo.vercel.app)

## Features

- **Server-side token generation** - Your shared secret stays secure on the server
- **User impersonation** - Authenticate users with their existing session
- **Dark mode support** - Matches the embed to your app's theme
- **Vercel-ready** - One-click deploy to Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Released account with embed access
- Your Released credentials (shared secret, account ID, channel ID)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/released-software/released-embed-demo.git
   cd released-embed-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Released credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Freleased-software%2Freleased-embed-demo&env=RELEASED_SHARED_SECRET,RELEASED_ACCOUNT_ID,NEXT_PUBLIC_RELEASED_CHANNEL_ID&envDescription=Released%20API%20credentials%20from%20your%20Released%20dashboard&project-name=released-embed-demo)

### Option 2: Manual Deploy

1. Push this code to your Git repository

2. Import the project in [Vercel](https://vercel.com/new)

3. Add the following environment variables in Vercel's project settings:
   | Variable | Description |
   |----------|-------------|
   | `RELEASED_SHARED_SECRET` | Your Released shared secret (keep this private!) |
   | `RELEASED_ACCOUNT_ID` | Your Released account ID |
   | `NEXT_PUBLIC_RELEASED_CHANNEL_ID` | The channel ID for the roadmap to display |

4. Deploy!

### Domain Whitelist

After deploying, add your Vercel domain to the allowed origins in your Released embed settings to prevent `invalid_origin` errors.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── released-token/
│   │       └── route.ts    # API route for secure token generation
│   ├── layout.tsx          # Root layout with Released script
│   └── page.tsx            # Main page with Released embed
├── public/
│   └── released-logo.svg   # Released logo
├── .env.example            # Environment variables template
└── .env.local              # Local environment variables (git-ignored)
```

## How It Works

```
┌─────────────┐     1. Request page      ┌─────────────┐
│             │ ──────────────────────▶  │             │
│   Browser   │                          │  Next.js    │
│             │ ◀──────────────────────  │  Server     │
└─────────────┘     2. Return HTML       └─────────────┘
       │                                        │
       │ 3. Fetch token                         │
       │    (POST /api/released-token)          │
       ▼                                        ▼
┌─────────────┐                          ┌─────────────┐
│  Released   │ ◀────────────────────── │  Released   │
│   Embed     │     4. Generate token    │    API      │
│             │        (server-side)     │             │
└─────────────┘                          └─────────────┘
```

1. User visits the page
2. The page component calls `/api/released-token`
3. The API route securely generates a token using your `RELEASED_SHARED_SECRET` (never exposed to the client)
4. The token is passed to the `<released-page>` web component
5. The embed authenticates the user automatically

## Customization

### Dark Mode

The embed supports dark mode via the `color-scheme` attribute:

```html
<released-page 
  channel-id="your-channel-id" 
  auth-token="token"
  color-scheme="dark"
></released-page>
```

### User Information

Modify `app/api/released-token/route.ts` to pull user information from your actual authentication system:

```typescript
// Replace this with your actual user session
const currentUser = {
  id: session.user.id,
  email: session.user.email,
  name: session.user.name,
  avatar: session.user.image,
};
```

## License

Apache-2.0

## Links

- [Released](https://released.so) - Product changelog and roadmap platform
- [Released Documentation](https://docs.released.so) - Full documentation
- [Vercel](https://vercel.com) - Deployment platform
