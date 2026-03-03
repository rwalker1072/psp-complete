// seed-firebase.js — run once to load ingested data into Firestore
// Loads config from firebase-config.js (no hard-coding)

const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Load config from the separate file (same as index.html uses)
const configModule = require('./firebase-config');
const firebaseConfig = configModule.firebaseConfig;

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const seedData = async () => {
  try {
    // Seed core problems from "Grok 100 problems solved simulation.pdf"
    const problems = db.collection('problems');

    await problems.doc('climate-change').set({
      rank: 1,
      title: 'Climate Change',
      type: 'Environmental',
      overview: 'Driven by emissions, threatening ecosystems and humanity.',
      solutions: [
        { text: 'Transition to renewables by 2050, carbon capture', status: 'in progress', org: 'Climeworks', orgType: 'Company' },
        { text: 'Strict regulations, sustainable land use, carbon tax', status: 'exists', org: 'IPCC', orgType: 'International Organization' }
      ],
      derivedProblems: ['Economic disruption → Unemployment (Rank 11)', 'High costs → Debt Crises (Rank 31)', 'Political resistance → Political Instability (Rank 5)'],
      qolImpact: -20,
      inadvertentSolutions: ['Pollution reduced by 30%', 'Deforestation reduced by 25%']
    });

    await problems.doc('global-poverty').set({
      rank: 2,
      title: 'Global Poverty',
      type: 'Social/Economic',
      overview: 'Widespread lack of resources and opportunity.',
      solutions: [
        { text: 'Microfinance initiatives', status: 'exists', org: 'Grameen Bank', orgType: 'NGO' },
        { text: 'Social welfare programs', status: 'exists', org: 'UNDP', orgType: 'International Organization' }
      ]
    });

    // Seed utopia from "What if everything were solved_.pdf"
    const utopia = db.collection('utopia').doc('post-scarcity');
    await utopia.set({
      title: 'Post-Scarcity Utopia',
      qol: 95,
      description: 'Abundance, harmony, creativity unbound — but risk of ennui and stagnation.',
      pros: ['Creative explosion', 'No scarcity', 'Deep social connections'],
      cons: ['Existential void', 'Psychological stagnation', 'Loss of purpose from struggle']
    });

    console.log('Seeded core data into Firestore!');
  } catch (error) {
    console.error('Seed failed:', error);
  }
};

seedData();