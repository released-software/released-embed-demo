const express = require('express');
const app = express();
const port = 3002;

// --- CONFIGURATION ---
// Replace these with values from your Released Settings
const CONFIG = {
  SHARED_SECRET: 'bK2Oa_e9ASm_c-qyV7sYMf35epiazKbGnBZcfB2TZRnzaMtYnKBkMfEbsJICZQaa-rn-hHxw5trOjForiTG-aA', 
  ACCOUNT_ID: '0bd8025b-0103-429b-a8e5-a1baf7a921d7',
  CHANNEL_ID: '49d0412e-182f-4339-8c99-f5e98b200112'
};

// const CONFIG = {
// SHARED_SECRET: 'YOUR_SHARED_SECRET', 
//   ACCOUNT_ID: 'YOUR_ACCOUNT_ID',
//   CHANNEL_ID: 'YOUR_CHANNEL_ID'
// };

// --- MOCK USER DATA ---
// In a real app, these details would come from your database or session
const currentUser = {
  id: "user_12345", 
  email: "john.doe@example.com",
  name: "John Doe",
  avatar: "https://ui-avatars.com/api/?name=John+Doe"
};

// --- THE ROUTE ---
app.get('/', async (req, res) => {
  try {
    // 1. Generate the Auth Token server-side
    // This keeps your SHARED_SECRET safe (never send it to the browser!)
    const tokenResponse = await fetch("https://accounts.producthub.dev/auth/api/impersonation/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.SHARED_SECRET}`
      },
      body: JSON.stringify({
        account_id: CONFIG.ACCOUNT_ID,
        user_id: currentUser.id,
        user_email: currentUser.email,
        profile: {
          name: currentUser.name,
          avatar_url: currentUser.avatar
        }
      }),
    });

    if (!tokenResponse.ok) {
        throw new Error(`API Error: ${tokenResponse.statusText}`);
    }    
    
    const data = await tokenResponse.json();
    console.log("Token: " + data);
    const releasedToken = data; // The token needed for the embed

    // 2. Serve the HTML with the token injected
    // Note: Ensure you include the Released script tag in the head
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Released Embed Example</title>
          <script src="https://embed-staging.released.so/1/embed.js" defer></script>
          </head>
        <body style="font-family: sans-serif; padding-top: 40px;">
          
          <h1>Welcome back, ${currentUser.name}</h1>
          <p>Below is the roadmap, authenticated specifically for you.</p>
          
          <hr />

          <released-page 
            channel-id="${CONFIG.CHANNEL_ID}" 
            auth-token="${releasedToken}">
          </released-page>

        </body>
      </html>
    `);

  } catch (error) {
    console.error("Token generation failed:", error);
    res.status(500).send("Error generating authentication token. Check server logs.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app running at http://localhost:${port}`);
});