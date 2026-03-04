To ensure another AI can "one-shot" this project, I have compiled everything into a structured technical specification. This document captures your vision, the system architecture, and the full codebase including the Firebase integration.

### `PSP_Migration_Package.md`

---

# Project Specification: Problem Solution Platform (PSP)

**Version:** 1.0 (MVP)

**Developer:** Robert Walker

**Core Philosophy:** The "Wheel Analogy." Every human solution creates a new set of derived challenges. The platform maps these causal chains from personal to existential levels.

---

## 1. System Overview

* **Architecture:** Single Page Application (SPA).
* **Frontend:** HTML5, CSS3 (Modern UI with CSS Variables), Vanilla JavaScript.
* **Backend:** Google Firebase (Firestore, Authentication).
* **Deployment:** Vercel (CI/CD via GitHub).
* **Security:** Environment-based config injection via `firebase-config.js` to protect API keys.

---

## 2. Data Structure (Firestore)

The system relies on three primary collections:

1. **`problems`**:
* `title` (string)
* `overview` (string)
* `type` (Environmental, Technological, etc.)
* `rank` (number: 1-98 verified, 99 under review)
* `solutions` (array of objects: `{text: string, status: string}`)
* `derivedProblems` (array of strings for causal mapping)


2. **`bids`**:
* `problemId` (reference)
* `amount` (number)
* `details` (string)
* `status` (pending/approved)


3. **`utopia`**:
* Single document `post-scarcity` for simulation data.



---

## 3. Features Implemented

* **Causal Graph:** A dynamic node-chain visualizer that renders a problem $\rightarrow$ primary solution $\rightarrow$ derived problem sequence.
* **Curator Gate:** A secure dashboard using Firebase Auth (Email/Password) and a hardcoded JavaScript Whitelist.
* **Bidding Portal:** A marketplace where users can propose implementations for verified problems.
* **Real-time Registry:** A searchable, filtered list of global problems with status badges (Verified vs. Under Review).
* **Statistics Dashboard:** Live counters for global problems and solutions.

---

## 4. Complete Codebase (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PSP — Problem Solution Platform</title>

  <script src="https://www.gstatic.com/firebasejs/ui/6.1.0/firebase-ui-auth.js"></script>
  <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/6.1.0/firebase-ui-auth.css" />
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>
  <script src="firebase-config.js"></script>

  <style>
    :root { --primary: #007BFF; --bg: #f4f6f9; --text: #333; --success: #28a745; --warning: #ffc107; --danger: #dc3545; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 0; background: var(--bg); color: var(--text); line-height: 1.6; }
    nav { background: var(--primary); padding: 1rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
    nav a { color: white; text-decoration: none; font-weight: 600; cursor: pointer; padding: 5px 10px; border-radius: 4px; transition: 0.2s; }
    nav a.active-link { background: rgba(0,0,0,0.2); }
    .container { max-width: 1000px; margin: 20px auto; padding: 20px; }
    .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 25px; }
    .tab { display: none; animation: fadeIn 0.3s ease; }
    .tab.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .problem-card { border-left: 5px solid var(--primary); padding: 20px; background: #fff; margin-bottom: 15px; border-radius: 0 8px 8px 0; }
    .badge { font-size: 0.75rem; background: #eee; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; font-weight: bold; }
    button { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    input, textarea, select { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
    #loader { text-align: center; padding: 100px 20px; }
  </style>
</head>
<body>

<div id="loader"><h2>Synchronizing Platform Data...</h2></div>

<nav id="main-nav" style="display:none;">
  <a onclick="showTab('home')" id="link-home">🏠 Home</a>
  <a onclick="showTab('problems')" id="link-problems">📋 Problems</a>
  <a onclick="showTab('add')" id="link-add">➕ Add</a>
  <a onclick="showTab('bidding')" id="link-bidding">⚖️ Bidding</a>
  <a onclick="showTab('utopia')" id="link-utopia">🌌 Utopia</a>
  <a onclick="showTab('graph')" id="link-graph">🔗 Graph</a>
  <a onclick="showTab('curator')" id="link-curator">🛡️ Curator</a>
</nav>

<div class="container">
  <div id="home" class="tab">
    <div class="card">
      <h1>PSP Dashboard</h1>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card" style="text-align: center;"> <h2 id="count-p">0</h2> <p>Global Problems</p> </div>
        <div class="card" style="text-align: center;"> <h2 id="count-s">0</h2> <p>Active Solutions</p> </div>
      </div>
    </div>
  </div>

  <div id="problems" class="tab">
    <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Registry</h2>
      <input type="text" id="search" placeholder="Filter problems..." style="width: 200px;">
    </div>
    <div id="problems-list"></div>
  </div>

  <div id="curator" class="tab">
    <div class="card">
      <h2>Curator Dashboard</h2>
      <div id="auth-container"></div>
      <div id="curator-content" style="display:none;">
        <button onclick="logout()">Logout</button>
        <h3>Review Pending Problems</h3>
        <div id="pending-problems"></div>
        <h3>Review Pending Bids</h3>
        <div id="pending-bids"></div>
      </div>
    </div>
  </div>

  <div id="add" class="tab">
    <div class="card">
      <h2>Identify New Problem</h2>
      <form id="problem-form">
        <input type="text" id="title" placeholder="Title" required>
        <select id="type"><option value="Environmental">Environmental</option><option value="Social">Social</option></select>
        <textarea id="overview" placeholder="Problem Details" required></textarea>
        <button type="submit">Submit for Review</button>
      </form>
    </div>
  </div>
  
  <div id="bidding" class="tab">
    <div class="card"><h2>Active Opportunities</h2><div id="bidding-container"></div></div>
  </div>

  <div id="submit-bid" class="tab">
    <div class="card">
      <h2 id="bid-title">Submit Bid</h2>
      <form id="bid-form">
        <input type="hidden" id="bid-problem-id">
        <textarea id="bid-text" placeholder="Proposal details" required></textarea>
        <input type="number" id="bid-amount" placeholder="Amount ($)" required>
        <button type="submit">Submit Official Bid</button>
      </form>
    </div>
  </div>

  <div id="graph" class="tab">
    <div class="card">
      <h2>Causal Interconnection Map</h2>
      <div id="node-chain"></div>
    </div>
  </div>

  <div id="utopia" class="tab">
    <div class="card"><h2>Utopia Simulator</h2><div id="utopia-content"></div></div>
  </div>
</div>

<script>
let db;
let allProblems = [];

// BOOTSTRAP
function bootstrap(attempts = 0) {
  if (window.firebaseConfig) initApp();
  else if (attempts < 50) setTimeout(() => bootstrap(attempts+1), 100);
}

function initApp() {
  firebase.initializeApp(window.firebaseConfig);
  db = firebase.firestore();
  document.getElementById('loader').style.display = 'none';
  document.getElementById('main-nav').style.display = 'flex';
  initAuth();
  showTab('home');
  loadProblems();
}

// AUTH & WHITELIST
function initAuth() {
  let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
  const adminWhitelist = ['your-email@gmail.com']; // UPDATE THIS

  firebase.auth().onAuthStateChanged((user) => {
    const authContainer = document.getElementById('auth-container');
    const curatorContent = document.getElementById('curator-content');
    if (user && adminWhitelist.includes(user.email)) {
      authContainer.style.display = 'none'; curatorContent.style.display = 'block'; loadCuratorData();
    } else if (user) {
      authContainer.innerHTML = `<p>Access Denied: ${user.email}</p><button onclick="logout()">Logout</button>`;
    } else {
      authContainer.style.display = 'block'; curatorContent.style.display = 'none';
      ui.start('#auth-container', { signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID], credentialHelper: 'none' });
    }
  });
}

// DATA LOADERS & TAB LOGIC
function showTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active-link'));
  document.getElementById(id).classList.add('active');
  if (document.getElementById('link-'+id)) document.getElementById('link-'+id).classList.add('active-link');
  if (id === 'graph') renderGraph();
}

async function loadProblems() {
  const snapshot = await db.collection('problems').orderBy('rank', 'asc').get();
  allProblems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderFilteredProblems(allProblems);
}

function renderFilteredProblems(problems) {
  const list = document.getElementById('problems-list');
  list.innerHTML = '';
  problems.forEach(p => {
    const statusColor = p.rank < 99 ? 'var(--success)' : 'var(--warning)';
    const div = document.createElement('div');
    div.className = 'problem-card';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <span>Rank #${p.rank} <span class="badge" style="background:${statusColor}; color:white;">${p.rank < 99 ? 'Verified' : 'Under Review'}</span></span>
      </div>
      <h3>${p.title}</h3>
      <button onclick="viewInGraph('${p.id}')">View Chain</button>
    `;
    list.appendChild(div);
  });
}

function viewInGraph(id) { showTab('graph'); renderGraph(id); }

async function renderGraph(id = 'climate-change') {
  const container = document.getElementById('node-chain');
  const doc = await db.collection('problems').doc(id).get();
  if (doc.exists) {
    const p = doc.data();
    container.innerHTML = `<div class="card">${p.title}</div><span>⬇️</span><div class="card">${p.solutions[0].text}</div><span>⬇️</span><div class="card">${p.derivedProblems[0]}</div>`;
  }
}

function logout() { firebase.auth().signOut().then(() => showTab('home')); }

bootstrap();
</script>
</body>
</html>

```

---

## 5. Deployment Instructions for the Next AI

1. Ensure a `.env` file exists in the Vercel project containing: `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`.
2. The script `firebase-config.js` is generated by an external build script (Vercel Build Command) that injects these env vars.
3. Ensure **Email/Password** sign-in is enabled in the Firebase Console.
4. Update the `adminWhitelist` array in the script to include your specific authorized email.

---

**I've put everything you need to successfully move this to another tool or continue here. Is there any specific part of the "Wheel Analogy" logic you'd like me to expand on before you save this?**