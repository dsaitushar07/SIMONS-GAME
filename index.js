//for running express,ejs and accessing uuidv4, urlencoded and method-override
require("dotenv").config();

const express = require("express");
var methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();

const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true })); // For form data
app.use(methodOverride("_method"));

//for establishing mysql connection
const { error } = require("console");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
// });

const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL");
    connection.release();
  }
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

let port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.render("started-home.ejs");
});

//handling get started
app.get("/user", (req, res) => {
  res.render("user.ejs");
});

// GET: Show login form
app.get("/user/login", (req, res) => {
  res.render("login2.ejs", { message: null });
});

// POST: Handle login form
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  let a = 0;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.render("login2.ejs", { message: "Server error. Try again." });
    }

    if (results.length === 0) {
      return res.render("login2.ejs", { message: "Wrong username" });
    }

    const user = results[0];

    // Compare passwords directly
    if (user.password !== password) {
      return res.render("login2.ejs", { message: "Wrong password" });
    } else {
      // ✅ Login successful
      let q3 = `SELECT id,email FROM users WHERE username=?`;
      db.query(q3, [username], (err, result) => {
        let id = result[0].id;
        const email = result[0].email;
        const user1 = { id, username, email };
        req.session.user1 = user1;
        res.redirect(`/user/${user1.id}/home`);
      });
    }
  });
});

//handling home route
app.get("/user/:id/home", (req, res) => {
  // ✅ Check if user is logged in
  if (!req.session.user1) {
    return res.redirect("/user/login"); // redirect to login if session is missing
  }

  const id = req.session.user1.id;

  let q1 = `SELECT * FROM users WHERE id="${id}"`;
  db.query(q1, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    let user1 = result[0];
    res.render("home2.ejs", { user1 });
  });
});

// GET: Show registration page
app.get("/user/register", (req, res) => {
  res.render("register.ejs", { message: null });
});

// POST: Handle form submission
app.post("/user/register", async (req, res) => {
  const id = uuidv4();
  const { username, password, email } = req.body;
  const hscore = 0;

  // Check for duplicate username or email
  const checkQuery = `SELECT username, email FROM users WHERE username = ? OR email = ?`;
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      console.error(err);
      return res.render("register.ejs", {
        message: "Server error. Please try again.",
      });
    }

    if (results.length > 0) {
      const taken = results[0];
      if (taken.username === username) {
        return res.render("register.ejs", {
          message: "Username already taken, Please try again",
        });
      } else if (taken.email === email) {
        return res.render("register.ejs", {
          message: "Email already registered, Please try again",
        });
      }
    }

    // Insert new user
    const insertQuery = `INSERT INTO users (id, username, email, password, hscore) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      insertQuery,
      [id, username, email, password, hscore],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.render("register.ejs", {
            message: "Registration failed. Try again.",
          });
        }

        // Registration successful — redirect or show message
        res.redirect(`/user`);
      }
    );
  });
});

//handling game request
app.get("/user/:id/game", (req, res) => {
  let { id } = req.params;
  let q1 = `SELECT * FROM users WHERE id="${id}"`;
  db.query(q1, (err, result) => {
    // console.log(result);
    let user = result[0];
    res.render("game.ejs", { user });
  });
});

app.use(express.json());

//handling game submit
app.post("/user/:id/game/submit", (req, res) => {
  const userId = req.params.id;
  const { hscore } = req.body;

  const query = `UPDATE users SET hscore = ? WHERE id = ?`;
  console.log(hscore);
  db.query(query, [hscore, userId], (err, result) => {
    if (err) {
      console.log("Error updating score:", err);
      return res.status(500).json({ message: "Database error" });
    }
    // console.log(result);
    return res.json({ message: "High score updated successfully" });
  });
});

//handling user profile route

app.get("/user/:id/profile", (req, res) => {
  const userId = req.params.id;

  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = results[0];
    res.render("profile.ejs", { user });
  });
});

//handling edit profile
app.get("/user/:id/edit-choice", (req, res) => {
  const id = req.params.id;
  res.render("edit-options.ejs", { id });
});

//handling delete user
app.get("/user/:id/delete/verify-password", (req, res) => {
  const id = req.params.id;
  const field = req.query.field;
  res.render("delete-verify.ejs", { id, field, error: null });
});

//route to verify password and deleting user
app.delete("/user/:id/delete/verify-password", (req, res) => {
  const { password, field } = req.body;
  const id = req.params.id;

  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Error fetching user.");
    }

    const user = results[0];
    if (user.password === password) {
      let q2 = `DELETE FROM users WHERE id=?`;
      db.query(q2, [id], (err, results) => {
        res.redirect(`/`);
      });
    } else {
      res.render("delete-verify.ejs", {
        id,
        field,
        error: "Incorrect password. Try again.",
      });
    }
  });
});

//route for ask password
app.get("/user/:id/verify-password", (req, res) => {
  const id = req.params.id;
  const field = req.query.field;
  res.render("verify-password.ejs", { id, field, error: null });
});

//route to verify password
app.post("/user/:id/verify-password", (req, res) => {
  const { password, field } = req.body;
  const id = req.params.id;

  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Error fetching user.");
    }

    const user = results[0];
    if (user.password === password) {
      res.redirect(`/user/${id}/edit-field?field=${field}`);
    } else {
      res.render("verify-password.ejs", {
        id,
        field,
        error: "Incorrect password. Try again.",
      });
    }
  });
});

//route to show input for choosen field
app.get("/user/:id/edit-field", (req, res) => {
  const { id } = req.params;
  const field = req.query.field;

  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("User not found or database error.");
    }

    const user = results[0];
    res.render("edit-field.ejs", {
      user,
      field,
      message: null,
      messageType: null,
    });
  });
});

//route handling update
app.patch("/user/:id/edit-field", (req, res) => {
  const { id } = req.params;
  const { field, newValue, password } = req.body;

  if (!["username", "email", "password"].includes(field)) {
    return res.render("edit-field.ejs", {
      user: { id },
      field,
      message: "Invalid field type.",
      messageType: "error",
    });
  }

  const selectUserQuery = `SELECT * FROM users WHERE id = ?`;
  db.query(selectUserQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.render("edit-field.ejs", {
        user: { id },
        field,
        message: "User not found.",
        messageType: "error",
      });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.render("edit-field.ejs", {
        user,
        field,
        message: "Incorrect password.",
        messageType: "error",
      });
    }

    if (field === "username" || field === "email") {
      const checkQuery = `SELECT * FROM users WHERE ${field} = ? AND id != ?`;
      db.query(checkQuery, [newValue, id], (err, dupResults) => {
        if (dupResults.length > 0) {
          return res.render("edit-field.ejs", {
            user,
            field,
            message: `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } already in use.`,
            messageType: "error",
          });
        }

        const updateQuery = `UPDATE users SET ${field} = ? WHERE id = ?`;
        db.query(updateQuery, [newValue, id], () => {
          user[field] = newValue;
          res.redirect(`/user/${id}/profile`);
        });
      });
    } else {
      const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;
      db.query(updateQuery, [newValue, id], () => {
        user[field] = newValue;
        res.redirect(`/user/${id}/profile`);
      });
    }
  });
});

//handling leaderboard

app.get("/user/:id/leaderboard", (req, res) => {
  const userId = req.params.id;

  const rankQuery = `
    SELECT id, username, hscore FROM users
    ORDER BY hscore DESC
    LIMIT 10
  `;

  db.query(rankQuery, (err, results) => {
    if (err) return res.status(500).send("DB error");

    const leaderboard = results.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      hscore: user.hscore,
    }));

    const currentUserEntry = leaderboard.find((u) => u.id === userId);

    res.render("leaderboard.ejs", {
      leaderboard,
      currentUser: currentUserEntry,
      userId,
    });
  });
});

//starting server
app.listen(port, (req, res) => {
  console.log("Server runnning at port:", port);
});
