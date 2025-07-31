import express from "express";
import fetch from "node-fetch";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretshhh";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLIENT_ID = process.env.GITHUB_APP_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/auth", async (req, res) => {
  const code = req.query.code;

  // 👇 If no code, this is the login START — redirect to GitHub
  if (!code) {
    const redirectUri = `${process.env.BASE_URL}/api/auth`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
    return res.redirect(githubAuthUrl);
  }

  // 👇 Otherwise, continue with your existing token exchange logic
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) return res.status(400).json({ error: tokenData.error_description });

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    const jwtToken = jwt.sign(
      {
        iss: "custom-auth",
        provider: "github",
        login: userData.login,
        name: userData.name || userData.login,
        id: userData.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.send(`
      <script>
        window.opener.postMessage(
          { token: "${jwtToken}", provider: "github" },
          "*"
        );
        window.close();
      </script>
    `);
    
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`CMS auth proxy running at http://localhost:${PORT}`);
});
