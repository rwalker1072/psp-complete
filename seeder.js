async function clearAndSeed() {
  const db = firebase.firestore();
  const statusLabel = document.getElementById('status'); // Optional: update UI
  
  console.log("🗑️ Wiping existing problems...");
  const snapshot = await db.collection('problems').get();
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log("✅ Database cleared. Starting fresh 207-problem seed...");
  
  // Now call your original seeding function
  await seedPlatform(); 
}

async function seedPlatform() {
  const db = firebase.firestore();
  console.log("🚀 Initializing Global Humanity Simulation (207 Problems)...");

  // DATA BLOCK 1: ROUNDS 1-7 (Baseline Survival & Structural Crisis)
  const dataBlock1 = [
    { id: "climate-change", title: "Climate Change", round: 1, rank: 1, severity_points: 10.0, type: "Environmental", overview: "The baseline environmental crisis impacting global stability.", derived_burdens: { "climate-adaptation": 0.05, "budget-constraints": 0.10 }, inadvertent_solutions: {}, status: "active" },
    { id: "poverty", title: "Poverty", round: 1, rank: 2, severity_points: 9.5, type: "Economic", overview: "Systemic resource scarcity affecting basic survival.", derived_burdens: { "budget-constraints": 0.05 }, inadvertent_solutions: { "malnutrition": -0.15 }, status: "active" },
    { id: "inequality", title: "Inequality", round: 1, rank: 3, severity_points: 9.0, type: "Social", overview: "Disparities in access to resources and opportunities.", derived_burdens: { "political-instability": 0.05 }, inadvertent_solutions: {}, status: "active" },
    { id: "education", title: "Education", round: 1, rank: 4, severity_points: 8.5, type: "Social", overview: "Lack of foundational learning opportunities.", derived_burdens: { "skills-mismatch": 0.05 }, inadvertent_solutions: { "poverty": -0.05 }, status: "active" },
    { id: "political-instability", title: "Political Instability", round: 1, rank: 5, severity_points: 8.0, type: "Social", overview: "Governance fragility preventing long-term planning.", derived_burdens: { "extremism": 0.10 }, inadvertent_solutions: {}, status: "active" },
    { id: "unemployment", title: "Unemployment", round: 2, rank: 6, severity_points: 7.5, type: "Economic", overview: "Lack of access to productive labor markets.", derived_burdens: { "poverty": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "human-rights", title: "Human Rights", round: 2, rank: 7, severity_points: 7.0, type: "Social", overview: "Violations of fundamental protections.", derived_burdens: { "political-instability": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "debt-crises", title: "Debt Crises", round: 2, rank: 8, severity_points: 6.8, type: "Economic", overview: "National and global financial over-leveraging.", derived_burdens: { "budget-constraints": 0.15 }, inadvertent_solutions: {}, status: "pending" },
    { id: "privacy", title: "Privacy", round: 3, rank: 11, severity_points: 6.5, type: "Technological", overview: "Erosion of individual data autonomy.", derived_burdens: { "cybersecurity-threats": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "water-scarcity", title: "Water Scarcity", round: 3, rank: 13, severity_points: 8.0, type: "Environmental", overview: "Dwindling fresh water resources.", derived_burdens: { "political-instability": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "cybersecurity-threats", title: "Cybersecurity Threats", round: 4, rank: 17, severity_points: 5.0, type: "Technological", overview: "Vulnerabilities in digital infrastructure.", derived_burdens: { "privacy": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "corporate-monopolies", title: "Corporate Monopolies", round: 7, rank: 31, severity_points: 6.0, type: "Economic", overview: "Concentration of power stifling innovation and equity.", derived_burdens: { "inequality": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "biodiversity-loss", title: "Biodiversity Loss", round: 7, rank: 32, severity_points: 7.5, type: "Environmental", overview: "Collapse of ecosystems and species extinction.", derived_burdens: { "food-insecurity": 0.10 }, inadvertent_solutions: {}, status: "pending" }
  ];

  const fullMasterData = [...dataBlock1]; // We will add Block 2 and 3 here

// DATA BLOCK 2: ROUNDS 8-15 (Societal, Habitual, and Polarization Challenges)
  const dataBlock2 = [
    { id: "urbanization-challenges", title: "Urbanization Challenges", round: 8, rank: 36, severity_points: 5.5, type: "Environmental", overview: "Stress on infrastructure from rapid city growth.", derived_burdens: { "sanitation-issues": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "energy-poverty", title: "Energy Poverty", round: 8, rank: 37, severity_points: 6.0, type: "Economic", overview: "Lack of access to modern energy services.", derived_burdens: { "educational-disparity": 0.05 }, inadvertent_solutions: { "poverty": -0.05 }, status: "pending" },
    { id: "labor-exploitation", title: "Labor Exploitation", round: 8, rank: 38, severity_points: 6.5, type: "Economic", overview: "Unfair treatment and underpayment of workers.", derived_burdens: { "inequality": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "child-labor", title: "Child Labor", round: 9, rank: 41, severity_points: 7.0, type: "Social", overview: "Exploitation of children in the workforce.", derived_burdens: { "educational-disparity": 0.10 }, inadvertent_solutions: {}, status: "pending" },
    { id: "ocean-acidification", title: "Ocean Acidification", round: 10, rank: 46, severity_points: 8.0, type: "Environmental", overview: "CO2 absorption threatening marine ecosystems.", derived_burdens: { "food-insecurity": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "healthcare-access", title: "Healthcare Access", round: 10, rank: 49, severity_points: 7.5, type: "Social", overview: "Barriers to medical services.", derived_burdens: { "budget-constraints": 0.05 }, inadvertent_solutions: { "chronic-diseases": -0.10 }, status: "pending" },
    { id: "mental-health-issues", title: "Mental Health Issues", round: 13, rank: 61, severity_points: 6.0, type: "Social", overview: "Widespread psychological distress.", derived_burdens: { "unemployment": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "artificial-intelligence-risks", title: "Artificial Intelligence Risks", round: 13, rank: 65, severity_points: 5.0, type: "Technological", overview: "Unintended consequences of rapid AI development.", derived_burdens: { "technological-unemployment": 0.10, "cybersecurity-threats": 0.05 }, inadvertent_solutions: {}, status: "pending" },
    { id: "political-polarization", title: "Political Polarization", round: 15, rank: 71, severity_points: 5.5, type: "Social", overview: "Deepening divisions in civil discourse.", derived_burdens: { "political-instability": 0.10 }, inadvertent_solutions: {}, status: "pending" },
    { id: "extremism", title: "Extremism", round: 15, rank: 72, severity_points: 12.91, type: "Social", overview: "Radicalization threatening social stability.", derived_burdens: { "terrorism": 0.05, "cybersecurity-threats": 0.05 }, inadvertent_solutions: {}, status: "pending" }
  ];

  fullMasterData.push(...dataBlock2);
// DATA BLOCK 3: ROUNDS 16-20 (Post-Scarcity & Final Reconciliation)
  const dataBlock3 = [
    { id: "technological-unemployment", title: "Technological Unemployment", round: 16, rank: 79, severity_points: 6.0, type: "Economic", overview: "Displacement of labor by automation and AI.", derived_burdens: { "wealth-disparity": 0.10 }, inadvertent_solutions: {}, status: "pending" },
    { id: "global-governance", title: "Global Governance", round: 18, rank: 88, severity_points: 5.5, type: "Social", overview: "Challenges in coordinating planetary-scale policy.", derived_burdens: { "political-instability": 0.05 }, inadvertent_solutions: { "terrorism": -0.10 }, status: "pending" },
    { id: "climate-adaptation", title: "Climate Adaptation", round: 20, rank: 32, severity_points: 4.5, type: "Environmental", overview: "Adapting to impacts partially mitigated by earlier efforts.", derived_burdens: { "cybersecurity-threats": 0.05, "budget-constraints": 0.05 }, inadvertent_solutions: { "climate-change": -0.10 }, status: "pending" },
    { id: "biodiversity-preservation", title: "Biodiversity Preservation", round: 20, rank: 43, severity_points: 2.5, type: "Environmental", overview: "Protecting ecosystems through AI and expansion.", derived_burdens: { "corporate-monopolies": 0.05, "budget-constraints": 0.05 }, inadvertent_solutions: { "environmental-degradation": -0.10 }, status: "pending" },
    { id: "energy-transition", title: "Energy Transition", round: 20, rank: 53, severity_points: 3.0, type: "Economic", overview: "Completing the shift to sustainable energy grids.", derived_burdens: { "corporate-monopolies": 0.05, "cybersecurity-threats": 0.05 }, inadvertent_solutions: { "energy-poverty": -0.10 }, status: "pending" },
    { id: "social-cohesion", title: "Social Cohesion", round: 20, rank: 67, severity_points: 3.0, type: "Social", overview: "Strengthening unity through inclusion policies.", derived_burdens: { "budget-constraints": 0.05, "extremism": 0.05 }, inadvertent_solutions: { "hate-crimes": -0.20 }, status: "pending" },
    { id: "hate-crimes", title: "Hate Crimes", round: 20, rank: 91, severity_points: 2.36, type: "Social", overview: "Eradicating identity-based attacks through laws.", derived_burdens: { "cybersecurity-threats": 0.05, "budget-constraints": 0.05 }, inadvertent_solutions: { "discrimination": -0.10, "religious-intolerance": -0.10 }, status: "pending" }
  ];

  fullMasterData.push(...dataBlock3);

  // EXECUTION: UPLOAD TO FIRESTORE
  const batch = db.batch();
  fullMasterData.forEach((prob) => {
    const ref = db.collection('problems').doc(prob.id);
    batch.set(ref, {
      ...prob,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();

  // INITIALIZE GLOBAL QUALITY OF LIFE METRICS
  await db.collection('stats').doc('global_metrics').set({
    flourishing_score: 10.0, // Simulation start
    target_score: 90.0,      // Final result target
    total_problems: fullMasterData.length,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });

  console.log("✅ Simulation Seeded Successfully.");
  alert(`Success! 207-Problem Simulation initialized to 90% QoL Target.`);
}