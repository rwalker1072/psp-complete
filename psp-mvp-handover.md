# Problem Solution Platform (PSP) — Complete Handover for MVP Code Generation

**To Claude / Gemini:**

This is a full handover for Bob Walker's "Problem Solution Platform" (PSP). Use this to generate a clean, modern, functional MVP codebase.

## 1. Vision & Core Concept

PSP is an "everything app" for mapping and solving human problems — from personal to global/existential.

Core loop:
- Identify problems (crowdsourced, hierarchical, unique IDs).
- Propose solutions (rated, iterated, with feasibility/cost/timeline/impact).
- Derive new ("child") problems created by solutions → form chains (Problem → Solution → Problem → ...).
- Iterate until all known problems are resolved.
- Then explore "What if everything were solved? What do humans do next?" (utopia simulator, post-scarcity scenarios, purpose in perfection).

Philosophical anchor:
- Solutions create new problems (wheel analogy: pottery wheel flipped for transportation).
- Sci-fi → Sci-Fact scale (1–10) tracks idea maturity.
- Quality of Life (QoL 0–100) evolves from subjective to objective.

Goal: Minimize human problems, accelerate resolutions by decades, map interconnections, crowdsource investment/building, answer "Now what?" when problems are minimized.

## 2. Current State (What Bob Has Already)

Bob has a working static prototype with these pages (all HTML/CSS/JS, Firebase Auth + Firestore for persistence, Vercel hosting):

- Home — intro & navigation
- Problems — list top problems/solutions (placeholder, needs Firestore fetch)
- Graph View — interactive drag-and-drop nodes (basic chains)
- Utopia Simulator — QoL & Sci-Fi/Sci-Fact sliders + dynamic text
- Bidding Portal — submit/view bids on solutions
- Project Management — add/track projects linked to solutions
- Bidding Results & Awards — winning bids summary
- Social Curation — post/promote comments, curator workflow
- Discussion Forum — threaded posts/replies
- Curator Dashboard — approve/reject/flag
- Advertising Portal — submit ads + select creative partners
- Search & Filter — real-time search across types
- Rerank — drag-and-drop prioritization
- Add Problem — form for problem + up to 5 solutions
- Profile — login/register (Firebase Auth)
- Notifications/Activity Feed
- Help/FAQ/Support
- Legal/About/Vision
- Contribute/Donate

Tech stack:
- Pure HTML/CSS/JS (no frameworks)
- Firebase Auth + Firestore (compat SDK via <script> tags)
- Chart.js + Sortable.js
- Vercel hosting

Firestore is connected. Collections seeded: `problems` and `utopia` (sample data below).

## 3. Seeding Data (Critical — Include This)

Bob has ingested data from PDFs/simulations (207 problems, Round 1–20, utopia views, etc.). Seed Firestore with at least these core items so the app displays real content:

- **Collection: `problems`** (example documents)
  - Document ID: `climate-change`
    - rank: 1
    - title: "Climate Change"
    - type: "Environmental"
    - overview: "Driven by emissions, threatening ecosystems and humanity."
    - solutions: array of objects (text, status, org, orgType)
    - derivedProblems: array of strings (e.g., "Economic disruption → Unemployment (Rank 11)")
    - qolImpact: -20
    - inadvertentSolutions: array of strings (e.g., "Pollution reduced by 30%")

  - Document ID: `global-poverty`
    - rank: 2
    - title: "Global Poverty"
    - type: "Social/Economic"
    - overview: "Widespread lack of resources and opportunity."
    - solutions: array of objects
    - derivedProblems: array

- **Collection: `utopia`** (example document)
  - Document ID: `post-scarcity`
    - title: "Post-Scarcity Utopia"
    - qol: 95
    - description: "Abundance, harmony, creativity unbound — but risk of ennui and stagnation."
    - pros: array (e.g., "Creative explosion", "No scarcity")
    - cons: array (e.g., "Existential void", "Psychological stagnation")

Generate code to seed this data (e.g., Node script or manual Firestore instructions) and load it in the app (e.g., fetch in Problems tab, Utopia simulator).

## 4. Task for You

Generate a **clean, modern MVP codebase** based on the above.

Focus on:
- Single-page app feel with tabs/navigation
- Full Firestore data loading (Problems tab shows seeded data, graph/utopia pull from collections)
- Fix loading issues (placeholder clearing, error handling, empty snapshot)
- Basic CRUD for problems/solutions (add/edit with auth check)
- Improve UX (loading states, mobile-friendly)
- Keep deployable to Vercel (static + Firebase SDKs via <script> tags)

Do NOT use React/Vue — keep pure HTML/JS.

Output:
- Full `index.html` (merged, with all tabs)
- Any new/updated JS/CSS files
- Instructions for Vercel + Firebase setup

Thank you — Bob wants this investor/demo-ready with seeded data visible.