import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Supabase Setup
const normalizeUrl = (url: string) => {
  if (!url) return "";
  try {
    let normalized = url.trim().replace(/^"|"$/g, '').trim();
    if (normalized && !normalized.startsWith('http')) {
      normalized = `https://${normalized}`;
    }
    const urlObj = new URL(normalized);
    return urlObj.origin;
  } catch (e) {
    return url;
  }
};

const getSupabaseKey = () => {
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^"|"$/g, '').trim();
  const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || "").trim().replace(/^"|"$/g, '').trim();
  
  if (serviceKey && serviceKey !== "your_service_role_key" && serviceKey.length > 20) return serviceKey;
  if (anonKey && anonKey !== "your_actual_key_here" && anonKey.length > 20) return anonKey;
  return "";
};

const supabaseUrl = normalizeUrl(process.env.VITE_SUPABASE_URL || "https://rdluhgxvfzlbpggcaaha.supabase.co");
const supabaseKey = getSupabaseKey() || "missing_key";

const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey, {
  auth: {
    persistSession: false
  }
});

const JWT_SECRET = (process.env.JWT_SECRET || "fallback_secret_for_development").trim().replace(/^"|"$/g, '');

// Log startup config (masked)
console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
console.log(`[SERVER] Vercel: ${process.env.VERCEL ? 'Yes' : 'No'}`);
console.log(`[SUPABASE] Base URL: ${supabaseUrl}`);
console.log(`[AUTH] JWT_SECRET Length: ${JWT_SECRET.length}`);

app.use(cors());
app.use(express.json());

// Request logging for debug
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API REQUEST] ${req.method} ${req.path}`);
  }
  next();
});
app.use(cookieParser());

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ message: "Session expired. Please login again." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.clearCookie("admin_token", { path: "/" });
      return res.status(403).json({ message: "Invalid or expired session" });
    }
    req.user = user;
    next();
  });
};

// --- AUTH API ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  
  // Fallbacks to match common user input from screenshots
  const adminUser = process.env.ADMIN_USERNAME || "Nasir";
  const adminPass = process.env.ADMIN_PASSWORD || "Azhar@789";

  console.log(`[AUTH] Login attempt for: ${username}`);

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("admin_token", token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: "lax",
      path: "/",
      maxAge: 86400000 
    });
    console.log(`[AUTH] Login successful for: ${username}`);
    return res.json({ success: true, token });
  }

  console.log(`[AUTH] Login failed for: ${username}`);
  res.status(401).json({ message: "Invalid credentials" });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("admin_token", { path: "/" });
  res.json({ success: true });
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  res.json({ user: req.user });
});

// --- CONTENT API (Public & Private) ---

// Supabase Error Formatter
const formatSupabaseError = (error: any, table: string, operation: string) => {
  console.error(`[DATABASE] ${operation} error for table "${table}":`, JSON.stringify(error, null, 2));
  
  if (error.code === '42P01') {
    return {
      status: 404,
      json: {
        message: `Table '${table}' not found. Please run the setup script in /supabase_setup.sql in your Supabase SQL Editor.`,
        code: error.code
      }
    };
  }

  if (error.message?.toLowerCase().includes('bucket not found')) {
    return {
      status: 404,
      json: {
        message: `Storage bucket not found. Please create a public bucket named 'portfolio' in your Supabase dashboard.`,
        code: error.code
      }
    };
  }

  return {
    status: 500,
    json: {
      message: error.message || `Database error during ${operation} on ${table}`,
      code: error.code,
      details: error.details,
      hint: error.hint
    }
  };
};

// Generic fetch function (Public)
const getCollection = async (table: string, res: any) => {
  try {
    console.log(`[DATABASE] Fetching from table: ${table}`);
    
    if (!supabaseUrl) {
        return res.status(500).json({ message: "Supabase URL is not configured on the server." });
    }

    // Basic fetch
    console.log(`[SUPABASE] Executing query on table: ${table} via client: ${supabaseUrl}`);
    const { data, error } = await supabase.from(table).select("*");
    
    if (error) {
      const formatted = formatSupabaseError(error, table, 'FETCH');
      return res.status(formatted.status).json(formatted.json);
    }

    if (!data) {
        return res.json([]);
    }

    // Sort in-memory fallback
    const sortedData = [...data].sort((a: any, b: any) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (a.id && b.id) return b.id - a.id;
      return 0;
    });
    
    res.json(sortedData);
  } catch (error: any) {
    console.error(`[SERVER] Unexpected error fetching ${table}:`, error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

app.get("/api/about", (req, res) => getCollection("about", res));
app.get("/api/education", (req, res) => getCollection("education", res));
app.get("/api/skills", (req, res) => getCollection("skills", res));
app.get("/api/posts", (req, res) => getCollection("posts", res));

app.get("/api/contact", async (req, res) => {
  try {
    const { data, error } = await supabase.from("contact").select("*").limit(1).maybeSingle();
    if (error) {
       console.error("Supabase contact error:", error);
       return res.status(500).json({ message: error.message });
    }
    res.json(data || {});
  } catch (error: any) {
    console.error("Error fetching contact:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Admin CRUD (Protected)
app.get("/api/admin/:table", authenticateToken, async (req, res) => {
  const { table } = req.params;
  return getCollection(table, res);
});

app.post("/api/admin/:table", authenticateToken, async (req, res) => {
  const { table } = req.params;
  try {
    const payload = { ...req.body };
    delete payload.id;
    delete payload.created_at;

    const { data, error } = await supabase.from(table).insert([payload]).select();
    if (error) {
      const formatted = formatSupabaseError(error, table, 'INSERT');
      return res.status(formatted.status).json(formatted.json);
    }
    if (!data || data.length === 0) throw new Error("No data returned from insert");
    res.status(201).json(data[0]);
  } catch (error: any) {
    console.error(`POST /api/admin/${table} error:`, error);
    res.status(500).json({ message: error.message || "Insert failed" });
  }
});

app.put("/api/admin/:table/:id", authenticateToken, async (req, res) => {
  const { table, id } = req.params;
  try {
    const payload = { ...req.body };
    delete payload.id;
    delete payload.created_at;

    const { data, error } = await supabase.from(table).update(payload).eq("id", id).select();
    if (error) {
      const formatted = formatSupabaseError(error, table, 'UPDATE');
      return res.status(formatted.status).json(formatted.json);
    }
    if (!data || data.length === 0) throw new Error("Record not found or update failed");
    res.json(data[0]);
  } catch (error: any) {
    console.error(`PUT /api/admin/${table}/${id} error:`, error);
    res.status(500).json({ message: error.message || "Update failed" });
  }
});

app.delete("/api/admin/:table/:id", authenticateToken, async (req, res) => {
  const { table, id } = req.params;
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      const formatted = formatSupabaseError(error, table, 'DELETE');
      return res.status(formatted.status).json(formatted.json);
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/admin/${table}/${id} error:`, error);
    res.status(500).json({ message: error.message || "Delete failed" });
  }
});

// --- VITE MIDDLEWARE ---
async function setupVite(app: express.Express) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SERVER] Mode: Development (Vite)");
    // Dynamic import to avoid crash in production
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[SERVER] Mode: Production");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
  }
}

// Initialize server but don't block
setupVite(app).then(() => {
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.get("*", (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: "API route not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not on Vercel
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SERVER] Ready at http://localhost:${PORT}`);
    });
  }
}).catch(err => {
  console.error("[SERVER] Fatal startup error:", err);
});

export default app;
