// Initialize Firebase
firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();

// 1. LOAD DATA & CALCULATE RIPPLES
async function loadProblems() {
    const roundFilter = document.getElementById('round-filter').value;
    const problemList = document.getElementById('problem-list');
    problemList.innerHTML = "Loading simulation data...";

    let query = db.collection('problems').orderBy('rank', 'asc');
    if (roundFilter !== 'all') {
        query = query.where('round', '==', parseInt(roundFilter));
    }

    const snapshot = await query.get();
    problemList.innerHTML = "";

    snapshot.forEach(doc => {
        const p = doc.data();
        const card = document.createElement('div');
        card.className = `card ${p.status}`;
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p class="round-tag">Round ${p.round} | Rank ${p.rank}</p>
            <p>${p.overview}</p>
            <div class="impact">Severity: ${p.severity_points.toFixed(2)} pts</div>
            ${p.status === 'active' ? `<button onclick="resolveProblem('${doc.id}')">Apply Solution</button>` : ''}
        `;
        problemList.appendChild(card);
    });

    updateGlobalStats();
}

// 2. THE RIPPLE ENGINE (Pseudo-Impact Logic)
async function resolveProblem(problemId) {
    const pRef = db.collection('problems').doc(problemId);
    const pDoc = await pRef.get();
    const data = pDoc.data();

    const batch = db.batch();

    // Mark as solved
    batch.update(pRef, { status: 'solved' });

    // Apply Inadvertent Solutions (-10%)
    for (let targetId in data.inadvertent_solutions) {
        const tRef = db.collection('problems').doc(targetId);
        batch.update(tRef, {
            severity_points: firebase.firestore.FieldValue.increment(-0.10 * 10) // Example logic
        });
    }

    // Apply Derived Burdens (+5%)
    for (let targetId in data.derived_burdens) {
        const tRef = db.collection('problems').doc(targetId);
        batch.update(tRef, {
            severity_points: firebase.firestore.FieldValue.increment(0.05 * 10),
            status: 'active' // "Activates" the next problem in the recursion
        });
    }

    await batch.commit();
    loadProblems(); // Refresh UI
}

async function updateGlobalStats() {
    const stats = await db.collection('stats').doc('global_metrics').get();
    const data = stats.data();
    document.getElementById('qol-score').innerText = data.flourishing_score.toFixed(1) + "%";
    document.getElementById('qol-progress').style.width = data.flourishing_score + "%";
}

// Start
loadProblems();