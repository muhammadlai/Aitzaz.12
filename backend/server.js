const http = require("http");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const FRONTEND_URL = process.env.FRONTEND_URL || "https://muhammadlai.github.io/Aitzaz.12";
const sessions = new Map();

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_URL,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function sendJson(res, status, data) {
  res.writeHead(status, { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function configStatus() {
  const names = ["OPENAI_API_KEY","GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET"];
  return Object.fromEntries(names.map(name => [name, Boolean(process.env[name])]));
}

function body(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", c => { raw += c; if (raw.length > 2_000_000) req.destroy(); });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("Invalid JSON")); } });
    req.on("error", reject);
  });
}

async function openAI(prompt) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured on the backend.");
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", input: prompt })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "OpenAI request failed");
  return data.output_text || "";
}

function gmailRedirect() {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/gmail.readonly"
  });
  return "https://accounts.google.com/o/oauth2/v2/auth?" + p;
}

async function gmailToken(code) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
      grant_type: "authorization_code"
    })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error_description || "Google OAuth failed");
  return data;
}

async function gmailMessages(accessToken) {
  const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "Gmail API failed");
  return data.messages || [];
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204, corsHeaders); return res.end(); }
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/health")
      return sendJson(res, 200, { ok: true, service: "earning-robot-backend", timestamp: new Date().toISOString() });

    if (req.method === "GET" && url.pathname === "/api/config/status")
      return sendJson(res, 200, { ok: true, providers: configStatus() });

    if (req.method === "GET" && url.pathname === "/api/ai/status")
      return sendJson(res, 200, { ok: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_MODEL || "gpt-5-mini" });

    if (req.method === "POST" && url.pathname === "/api/ai/proposal") {
      const b = await body(req);
      if (!b.taskTitle) return sendJson(res, 400, { ok: false, error: "taskTitle is required" });
      const prompt = `Write a concise professional freelance proposal for this task. Do not invent experience, prices, guarantees, or client facts. Task: ${b.taskTitle}. Requirements: ${b.requirements || "Not provided"}. Skills: ${b.skills || "Not provided"}. Budget: ${b.budget || "Not provided"}`;
      return sendJson(res, 200, { ok: true, proposal: await openAI(prompt) });
    }

    if (req.method === "GET" && url.pathname === "/api/gmail/connect") {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI)
        return sendJson(res, 503, { ok: false, error: "Google OAuth is not configured." });
      return sendJson(res, 200, { ok: true, url: gmailRedirect() });
    }

    if (req.method === "GET" && url.pathname === "/api/gmail/callback") {
      const code = url.searchParams.get("code");
      if (!code) return sendJson(res, 400, { ok: false, error: "Missing OAuth code" });
      const token = await gmailToken(code);
      const id = crypto.randomUUID();
      sessions.set(id, { accessToken: token.access_token, refreshToken: token.refresh_token, createdAt: Date.now() });
      res.writeHead(302, { Location: `${FRONTEND_URL}/?gmail=connected&session=${encodeURIComponent(id)}` });
      return res.end();
    }

    if (req.method === "GET" && url.pathname === "/api/gmail/messages") {
      const id = url.searchParams.get("session");
      const session = sessions.get(id);
      if (!session) return sendJson(res, 401, { ok: false, error: "Gmail session not found. Connect Gmail first." });
      return sendJson(res, 200, { ok: true, messages: await gmailMessages(session.accessToken) });
    }

    return sendJson(res, 404, { ok: false, error: "Not found" });
  } catch (e) {
    return sendJson(res, 500, { ok: false, error: e.message || "Server error" });
  }
});

server.listen(PORT, "0.0.0.0", () => console.log(`Earning Robot backend listening on port ${PORT}`));
