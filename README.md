# 🧠 Simon's Game

A browser-based memory game inspired by the classic **Simon Game**, built with a full stack architecture. Players must repeat an increasingly long sequence of colors to test their memory. The app features user authentication, profile management, high score tracking, and leaderboard page using a MySQL database.

---

## 🚀 Features

- 🎮 **Interactive Gameplay**: Classic Simon memory challenge
- 🧑‍💼 **User Registration & Login**: Secure authentication flow
- 📊 **High Score Tracking**: Tracks user performance over time
- 👤 **Profile Management**: View individual scores and stats
- 🌐 **RESTful API**: Structured endpoints for gameplay and user operations
- 🎨 **Responsive UI**: Dynamic EJS templates with animations

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Templating**: EJS with dynamic page rendering
- **Tools**: Git, npm

---

## 📁 Project Structure

Simons-Game/
├── public/ # Static assets (CSS, JS, images)
├── views/ # EJS templates
├── routes/ # Express route handlers
├── models/ # DB schema and logic
├── config/ # DB connection and config
├── app.js # Main server file
├── package.json
├── .env

---

## 🧪 How to Run Locally

### Prerequisites

- Node.js & npm
- MySQL server
- `.env` file with DB credentials

### Setup Instructions

```bash
git clone https://github.com/your-username/simons-game.git
cd simons-game
npm install
```

### Configure .env

DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=simons_game
SESSION_SECRET=yourSecret

### Run the app

node app.js

📜 License
This project is for educational and demonstration purposes only.
MIT License.
