// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(window.firebaseConfig);
}
const db = firebase.firestore();

// 1. NAVIGATION LOGIC
function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    // Show the selected one (We'll create these sections as we go)
    const activeSection = document.getElementById(`${tabId}-tab`);
    if (activeSection) activeSection.style.display = 'block';
    
    // Update button styling
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// 2. LOAD DATA & CALCULATE RIPPLES
async function loadProblems() {
    const roundFilter = document.getElementById('round-filter').value;
    const problemList = document.getElementById('problem-list');
    problemList.innerHTML = "<p>Analyzing the 20-Round Simulation...</p>";

    try {
        let query = db.collection('problems').orderBy('rank', 'asc');
        
        if (roundFilter !== 'all') {
            query = query.where('round', '==', parseInt(roundFilter));
        }

        const snapshot = await query.get();
        problemList.innerHTML = "";

        snapshot.forEach(doc => {
            const p = doc.data();
            // SAFETY CHECK: Ensure severity_points exists before calling .toFixed()
            const severity = (p.severity_points !== undefined) ? p.severity_points.toFixed(2) : "0.00";
            
            const card = document.createElement('div');
            card.className = `card ${p.status || 'pending'}`;
            card.innerHTML = `
                <h3>${p.title}</h3>
                <p class="round-tag">Round ${p.round} | Rank ${p.rank}</p>
                <p>${p.overview || 'No overview available.'}</p>
                <div class="impact">Severity: ${severity} pts</div>
                ${p.status === 'active' ? `<button onclick="resolveProblem('${doc.id}')">Apply Solution</button>` : ''}
            `;
            problemList.appendChild(card);
        });

        updateGlobalStats();
    } catch (error) {
        console.error("Error loading problems:", error);
        problemList.innerHTML = "<p style='color:red'>Permission Denied. Check Firestore Rules.</p>";
    }
}

// 3. THE RIPPLE ENGINE
async function resolveProblem(problemId) {
    try {
        const pRef = db.collection('problems').doc(problemId);
        const pDoc = await pRef.get();
        const data = pDoc.data();

        const batch = db.batch();

        // 1. Mark current as solved
        batch.update(pRef, { status: 'solved' });

        // 2. Apply Inadvertent Solutions (-10% of current value)
        if (data.inadvertent_solutions) {
            for (let targetId in data.inadvertent_solutions) {
                const tRef = db.collection('problems').doc(targetId);
                const tDoc = await tRef.get();
                if (tDoc.exists) {
                    const currentSev = tDoc.data().severity_points || 0;
                    batch.update(tRef, { severity_points: currentSev * 0.90 });
                }
            }
        }

        // 3. Apply Derived Burdens (+5% and Activate)
        if (data.derived_burdens) {
            for (let targetId in data.derived_burdens) {
                const tRef = db.collection('problems').doc(targetId);
                const tDoc = await tRef.get();
                if (tDoc.exists) {
                    const currentSev = tDoc.data().severity_points || 0;
                    batch.update(tRef, { 
                        severity_points: currentSev * 1.05,
                        status: 'active' 
                    });
                }
            }
        }

        await batch.commit();
        console.log(`✅ ${problemId} resolved. Ripples applied.`);
        loadProblems(); 
    } catch (error) {
        console.error("Ripple Engine Error:", error);
        alert("Action failed. Check console for permission details.");
    }
}

async function updateGlobalStats() {
    try {
        const stats = await db.collection('stats').doc('global_metrics').get();
        if (stats.exists) {
            const data = stats.data();
            document.getElementById('qol-score').innerText = (data.flourishing_score || 0).toFixed(1) + "%";
            document.getElementById('qol-progress').style.width = (data.flourishing_score || 0) + "%";
        }
    } catch (e) {
        console.warn("Global metrics not yet available.");
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    loadProblems();
    // Default to registry tab
    const regTab = document.getElementById('registry-tab');
    if (regTab) regTab.style.display = 'block';
});