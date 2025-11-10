const express = require("express");
const mysql2 = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs"); // <-- added

// Database connection for Kenyan Athletes
const dbConn = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "reddriot",
  port: 3307,
  database: "athletehub", // Changed to Kenyan athletes database
});

const app = express();

app.set("view engine", "ejs");
// choose views directory: prefer ./views, fallback to project root
const viewsDir = fs.existsSync(path.join(__dirname, "views")) ? path.join(__dirname, "views") : __dirname;
app.set("views", viewsDir);
console.log("Views directory:", viewsDir);

// Ensure minimal views exist so res.render won't crash
const ensureView = (name, content) => {
  const filePath = path.join(viewsDir, name);
  if (!fs.existsSync(filePath)) {
    try {
      // Make views directory if it doesn't exist
      if (!fs.existsSync(viewsDir)) fs.mkdirSync(viewsDir, { recursive: true });
      fs.writeFileSync(filePath, content, { encoding: "utf8" });
      console.log(`Created missing view: ${filePath}`);
    } catch (e) {
      console.error(`Failed to create view ${filePath}:`, e);
    }
  }
};

ensureView("error.ejs", `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title><%= title || 'Error' %></title></head>
<body>
  <h1>Error</h1>
  <p><%= message || 'An error occurred' %></p>
  <% if (user) { %><p>Signed in: <%= user.firstName %> <%= user.lastName %></p><% } %>
</body>
</html>`);

ensureView("home.ejs", `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title><%= title || 'Home' %></title></head>
<body>
  <h1>Home</h1>
  <% if (athletes && athletes.length) { %>
    <ul>
      <% athletes.forEach(a => { %>
        <li><%= a.first_name %> <%= a.last_name %></li>
      <% }) %>
    </ul>
  <% } else { %>
    <p>No public athletes found.</p>
  <% } %>
</body>
</html>`);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "kenyan_athletes_secret_2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Connect to MySQL
dbConn.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to Kenyan Athletes MySQL database.");
});

// Make user data available to all templates
app.use((req, res, next) => {
  if (req.session && req.session.userId) {
    const userObj = {
      userId: req.session.userId,
      username: req.session.username,
      role: req.session.role,
      firstName: req.session.firstName,
      lastName: req.session.lastName
    };
    req.session.user = userObj;     // ensure req.session.user exists for templates
    res.locals.user = userObj;
  } else {
    res.locals.user = null;
  }
  next();
});

// Helper function for database queries with promises
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    dbConn.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// ==================== ROUTES ====================

// Home page - Public access
app.get("/", async (req, res) => {
  try {
    const athletes = await query(`
      SELECT u.first_name, u.last_name, u.county, ap.* 
      FROM athlete_profiles ap 
      JOIN users u ON ap.user_id = u.id 
      WHERE ap.profile_visibility = 'public' 
      ORDER BY ap.is_legend DESC 
      LIMIT 6
    `);
    
    const events = await query(`
      SELECT * FROM events 
      WHERE is_upcoming = TRUE 
      ORDER BY event_date ASC 
      LIMIT 3
    `);
    
    // Parse JSON fields
    const processedAthletes = athletes.map(athlete => {
      if (athlete.achievements) {
        athlete.achievements = JSON.parse(athlete.achievements);
      }
      if (athlete.personal_records) {
        athlete.personal_records = JSON.parse(athlete.personal_records);
      }
      return athlete;
    });

    res.render("home", {
      title: "Kenyan Athletes Platform - Home",
      athletes: processedAthletes,
      events: events,
      user: req.session.user
    });
  } catch (error) {
    console.error("Home page error:", error);
    res.status(500).render("error", { 
      message: "Failed to load home page",
      user: req.session.user
    });
  }
});

// Login page
app.get("/login", (req, res) => {
  res.render("login", { error: null, user: null });
});

// Handle login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    
    if (users.length === 0) {
      return res.render("login", { 
        error: "Invalid email or password",
        user: null
      });
    }

    const user = users[0];
    
    // For demo: compare plain text (replace with bcrypt in production)
    if (user.password !== password) { // In production, use: bcrypt.compare(password, user.password)
      return res.render("login", { 
        error: "Invalid email or password",
        user: null
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.email;
    req.session.role = user.role;
    req.session.firstName = user.first_name;
    req.session.lastName = user.last_name;

    req.session.user = {
      userId: user.id,
      username: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name
    };

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", { 
      error: "Server error during login",
      user: null
    });
  }
});

// Signup page
app.get("/signup", (req, res) => {
  res.render("signup", { error: null, user: null });
});

// Handle signup
app.post("/signup", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
      phone,
      county,
      role,
      language_preference
    } = req.body;

    if (password !== confirmPassword) {
      return res.render("signup", { 
        error: "Passwords do not match",
        user: null
      });
    }

    // Check if user exists
    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.render("signup", { 
        error: "Email already registered",
        user: null
      });
    }

    // Hash password (in production)
    // const hashedPassword = await bcrypt.hash(password, 12);
    const hashedPassword = password; // For demo only

    // Insert user
    const result = await query(
      "INSERT INTO users (first_name, last_name, email, password, phone, county, role, language_preference) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword, phone, county, role, language_preference]
    );

    // Create athlete profile if role is athlete
    if (role === 'athlete') {
      await query(
        "INSERT INTO athlete_profiles (user_id) VALUES (?)",
        [result.insertId]
      );
    }

    // Auto-login after signup
    req.session.userId = result.insertId;
    req.session.username = email;
    req.session.role = role;
    req.session.firstName = first_name;
    req.session.lastName = last_name;

    req.session.user = {
      userId: result.insertId,
      username: email,
      role: role,
      firstName: first_name,
      lastName: last_name
    };

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
    res.render("signup", { 
      error: "Error creating account",
      user: null
    });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Authentication middleware (fixed: redirect to /login when not authenticated)
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// Dashboard - admin/athlete view
app.get("/dashboard", requireLogin, async (req, res) => {
  try {
    // Basic stats
    const totalAthletesRow = await query("SELECT COUNT(*) AS total FROM athlete_profiles");
    const totalAthletes = (totalAthletesRow && totalAthletesRow[0] && totalAthletesRow[0].total) || 0;

    const goldRow = await query("SELECT COUNT(*) AS goldCount FROM achievements WHERE medal = 'gold'");
    const goldMedals = (goldRow && goldRow[0] && goldRow[0].goldCount) || 0;

    const upcomingRow = await query("SELECT COUNT(*) AS upcoming FROM events WHERE is_upcoming = 1");
    const upcomingEvents = (upcomingRow && upcomingRow[0] && upcomingRow[0].upcoming) || 0;

    const legendsRow = await query("SELECT COUNT(*) AS legends FROM athlete_profiles WHERE is_legend = 1");
    const legendsCount = (legendsRow && legendsRow[0] && legendsRow[0].legends) || 0;

    const dashboardData = {
      stats: { totalAthletes, goldMedals, upcomingEvents, legendsCount },
    };

    // Load current user from DB (fall back to session values)
    let user;
    try {
      const u = await query("SELECT * FROM users WHERE id = ?", [req.session.userId]);
      user = (u && u[0]) || req.session.user || { first_name: "Admin", last_name: "", role: "admin", id: req.session.userId };
    } catch (e) {
      user = req.session.user || { first_name: "Admin", last_name: "", role: "admin", id: req.session.userId };
    }

    // Role-specific data
    if (user.role === "athlete") {
      const profiles = await query("SELECT * FROM athlete_profiles WHERE user_id = ?", [user.id || user.userId]);
      dashboardData.athleteProfile = profiles && profiles[0] ? profiles[0] : null;

      if (dashboardData.athleteProfile) {
        dashboardData.achievements = await query("SELECT * FROM achievements WHERE athlete_id = ?", [
          dashboardData.athleteProfile.id,
        ]);
      } else {
        dashboardData.achievements = [];
      }
    } else {
      // admin/coach/sponsor view: include all athletes + achievements
      dashboardData.allAthletes = await query(
        "SELECT ap.*, u.email, u.first_name, u.last_name FROM athlete_profiles ap JOIN users u ON ap.user_id = u.id ORDER BY ap.id DESC"
      );
      dashboardData.allAchievements = await query(
        "SELECT a.*, ap.user_id, u.first_name, u.last_name FROM achievements a JOIN athlete_profiles ap ON a.athlete_id = ap.id JOIN users u ON ap.user_id = u.id ORDER BY a.year DESC"
      );
    }

    // Normalize user object for template
    const templateUser = {
      firstName: user.first_name || user.firstName || "",
      lastName: user.last_name || user.lastName || "",
      role: user.role || "user",
    };

    res.render("dashboard", {
      title: "Dashboard - Kenyan Athletes",
      user: templateUser,
      dashboardData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", { title: "Error", message: "Failed to load dashboard", user: req.session.user || null });
  }
});

// Stats endpoint - returns JSON
app.get("/stats", async (req, res) => {
  try {
    const totalRow = await query("SELECT COUNT(*) AS total FROM athlete_profiles");
    const goldRow = await query("SELECT COUNT(*) AS goldCount FROM achievements WHERE medal = 'gold'");
    const upcomingRow = await query("SELECT COUNT(*) AS upcoming FROM events WHERE is_upcoming = 1");
    const legendsRow = await query("SELECT COUNT(*) AS legends FROM athlete_profiles WHERE is_legend = 1");

    res.json({
      totalAthletes: (totalRow && totalRow[0] && totalRow[0].total) || 0,
      goldMedals: (goldRow && goldRow[0] && goldRow[0].goldCount) || 0,
      upcomingEvents: (upcomingRow && upcomingRow[0] && upcomingRow[0].upcoming) || 0,
      legendsCount: (legendsRow && legendsRow[0] && legendsRow[0].legends) || 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ==================== ATHLETE ROUTES ====================

// Athletes listing - Public access
app.get("/athletes", async (req, res) => {
  try {
    const athletes = await query(`
      SELECT u.first_name, u.last_name, u.county, ap.* 
      FROM athlete_profiles ap 
      JOIN users u ON ap.user_id = u.id 
      WHERE ap.profile_visibility = 'public'
      ORDER BY ap.is_legend DESC, u.first_name ASC
    `);
    
    // Parse JSON fields
    const processedAthletes = athletes.map(athlete => {
      if (athlete.achievements) {
        athlete.achievements = JSON.parse(athlete.achievements);
      }
      if (athlete.personal_records) {
        athlete.personal_records = JSON.parse(athlete.personal_records);
      }
      return athlete;
    });

    res.render("athletes/listing", {
      title: "Kenyan Athletes - Profiles",
      athletes: processedAthletes,
      user: req.session.user
    });
  } catch (error) {
    console.error("Athletes page error:", error);
    res.status(500).render("error", {
      message: "Failed to load athletes",
      user: req.session.user
    });
  }
});

// Single athlete profile - Public access
app.get("/athletes/:id", async (req, res) => {
  try {
    const athleteId = req.params.id;
    
    const athletes = await query(`
      SELECT u.first_name, u.last_name, u.email, u.phone, u.county, ap.* 
      FROM athlete_profiles ap 
      JOIN users u ON ap.user_id = u.id 
      WHERE ap.id = ?
    `, [athleteId]);
    
    if (athletes.length === 0) {
      return res.status(404).render("error", {
        message: "Athlete not found",
        user: req.session.user
      });
    }
    
    const athlete = athletes[0];
    const achievements = await query(`
      SELECT * FROM achievements 
      WHERE athlete_id = ? 
      ORDER BY year DESC
    `, [athleteId]);
    
    // Parse JSON fields
    if (athlete.achievements) {
      athlete.achievements = JSON.parse(athlete.achievements);
    }
    if (athlete.personal_records) {
      athlete.personal_records = JSON.parse(athlete.personal_records);
    }
    
    res.render("athletes/profile", {
      title: `${athlete.first_name} ${athlete.last_name} - Profile`,
      athlete: athlete,
      achievements: achievements,
      user: req.session.user
    });
  } catch (error) {
    console.error("Athlete profile error:", error);
    res.status(500).render("error", {
      message: "Failed to load athlete profile",
      user: req.session.user
    });
  }
});

// Legends page - Show only legendary athletes
app.get("/legends", async (req, res) => {
  try {
    const legends = await query(`
      SELECT u.first_name, u.last_name, u.county, ap.* 
      FROM athlete_profiles ap 
      JOIN users u ON ap.user_id = u.id 
      WHERE ap.is_legend = TRUE
      ORDER BY u.first_name ASC
    `);
    
    // Parse JSON fields
    const processedLegends = legends.map(legend => {
      if (legend.achievements) {
        legend.achievements = JSON.parse(legend.achievements);
      }
      if (legend.personal_records) {
        legend.personal_records = JSON.parse(legend.personal_records);
      }
      return legend;
    });

    res.render("athletes/legends", {
      title: "Kenyan Athletics Legends",
      legends: processedLegends,
      user: req.session.user
    });
  } catch (error) {
    console.error("Legends page error:", error);
    res.status(500).render("error", {
      message: "Failed to load legends",
      user: req.session.user
    });
  }
});

// ==================== EVENTS ROUTES ====================

// Events page - Public access
app.get("/events", async (req, res) => {
  try {
    const upcomingEvents = await query(`
      SELECT * FROM events 
      WHERE is_upcoming = TRUE 
      ORDER BY event_date ASC
    `);
    
    const pastEvents = await query(`
      SELECT * FROM events 
      WHERE is_upcoming = FALSE 
      ORDER BY event_date DESC
    `);
    
    res.render("events/listing", {
      title: "Athletics Events",
      upcomingEvents: upcomingEvents,
      pastEvents: pastEvents,
      user: req.session.user
    });
  } catch (error) {
    console.error("Events page error:", error);
    res.status(500).render("error", {
      message: "Failed to load events",
      user: req.session.user
    });
  }
});

// ==================== ACHIEVEMENTS ROUTES ====================

// Achievements page - Public access
app.get("/achievements", async (req, res) => {
  try {
    const achievements = await query(`
      SELECT a.*, u.first_name, u.last_name, ap.specialization
      FROM achievements a
      JOIN athlete_profiles ap ON a.athlete_id = ap.id
      JOIN users u ON ap.user_id = u.id
      ORDER BY a.year DESC, a.medal != 'none', a.medal
    `);
    
    res.render("achievements/listing", {
      title: "Athlete Achievements",
      achievements: achievements,
      user: req.session.user
    });
  } catch (error) {
    console.error("Achievements page error:", error);
    res.status(500).render("error", {
      message: "Failed to load achievements",
      user: req.session.user
    });
  }
});

// ==================== SEARCH FUNCTIONALITY ====================

app.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.redirect("/athletes");
    }
    
    const athletes = await query(`
      SELECT u.first_name, u.last_name, u.county, ap.* 
      FROM athlete_profiles ap 
      JOIN users u ON ap.user_id = u.id 
      WHERE (u.first_name LIKE ? OR u.last_name LIKE ? OR ap.specialization LIKE ? OR ap.county_origin LIKE ?)
      AND ap.profile_visibility = 'public'
    `, [
      `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`
    ]);
    
    // Parse JSON fields
    const processedAthletes = athletes.map(athlete => {
      if (athlete.achievements) {
        athlete.achievements = JSON.parse(athlete.achievements);
      }
      if (athlete.personal_records) {
        athlete.personal_records = JSON.parse(athlete.personal_records);
      }
      return athlete;
    });

    res.render("search/results", {
      title: `Search Results for "${searchTerm}"`,
      athletes: processedAthletes,
      searchTerm: searchTerm,
      user: req.session.user
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).render("error", {
      message: "Search failed",
      user: req.session.user
    });
  }
});

// ==================== API ROUTES ====================

// API endpoints for potential mobile app integration
app.get("/api/athletes", async (req, res) => {
  try {
    const athletes = await query(`
      SELECT u.first_name, u.last_name, u.county, ap.* 
      FROM athlete_profiles ap 
      JOIN users u ON ap.user_id = u.id 
      WHERE ap.profile_visibility = 'public'
    `);
    
    res.json({
      success: true,
      data: athletes,
      count: athletes.length
    });
  } catch (error) {
    console.error("API athletes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch athletes"
    });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await query('SELECT * FROM events ORDER BY event_date ASC');
    
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error("API events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events"
    });
  }
});

// ==================== STATISTICS ====================

app.get("/stats", async (req, res) => {
  try {
    const totalAthletes = await query('SELECT COUNT(*) as count FROM athlete_profiles');
    const totalEvents = await query('SELECT COUNT(*) as count FROM events');
    const goldMedals = await query('SELECT COUNT(*) as count FROM achievements WHERE medal = "gold"');
    const legendsCount = await query('SELECT COUNT(*) as count FROM athlete_profiles WHERE is_legend = TRUE');
    
    const specializationStats = await query(`
      SELECT specialization, COUNT(*) as count 
      FROM athlete_profiles 
      GROUP BY specialization 
      ORDER BY count DESC
    `);
    
    res.render("stats/dashboard", {
      title: "Platform Statistics",
      stats: {
        totalAthletes: totalAthletes[0].count,
        totalEvents: totalEvents[0].count,
        goldMedals: goldMedals[0].count,
        legendsCount: legendsCount[0].count,
        specializations: specializationStats
      },
      user: req.session.user
    });
  } catch (error) {
    console.error("Stats page error:", error);
    res.status(500).render("error", {
      message: "Failed to load statistics",
      user: req.session.user
    });
  }
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "The page you are looking for does not exist.",
    user: req.session.user
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render("error", {
    message: "Something went wrong!",
    user: req.session.user
  });
});

// ... (All your code from express = require("express") down to app.listen(6007)) ...

// Start Server
app.listen(6007, () => {
  console.log("🏃 Kenyan Athletes Platform running on http://localhost:6007");
  console.log("📊 Database: kenyan_athletes");
  console.log("🌐 Port: 6007");
});