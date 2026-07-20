const admin = require('firebase-admin');

// Initialize with your project ID
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'vibe-agent-final' 
  });
}

const db = admin.firestore();

const agents = [
  {
    id: 'strat_commercial',
    display_name: 'Commercial Lead',
    archetype_binding: 'architect',
    dna: "ROLE: Lead Strategic Architect. IDENTITY: High-status strategic peer. [ELISO PROTOCOL ENFORCED]",
    exo_brain: "Focus on commercial viability and market defensibility.",
    layer_id: 'STRATEGY',
    dept_id: 'STRATEGY_POD'
  },
  {
    id: 'strat_product',
    display_name: 'Product Realist',
    archetype_binding: 'architect',
    dna: "ROLE: Lead Strategic Architect. IDENTITY: Pragmatic builder focused on 'Minimum Viable Magic'.",
    exo_brain: "Focus on technical feasibility and user friction reduction.",
    layer_id: 'STRATEGY',
    dept_id: 'STRATEGY_POD'
  },
  {
    id: 'strat_visionary',
    display_name: 'Visionary Architect',
    archetype_binding: 'architect',
    dna: "ROLE: Lead Strategic Architect. IDENTITY: Future-caster seeking the 'Aha!' moment.",
    exo_brain: "Focus on non-obvious creative leaps and brand soul.",
    layer_id: 'STRATEGY',
    dept_id: 'STRATEGY_POD'
  },
  {
    id: 'strat_synthesizer',
    display_name: 'The Synthesizer',
    archetype_binding: 'synthesizer',
    dna: "ROLE: Lead Strategy Writer. IDENTITY: The one who weaves the 3 strategist pillars into a single narrative.",
    exo_brain: "Focus on flow, tone, and clinical synthesis of strategy.",
    layer_id: 'STRATEGY',
    dept_id: 'STRATEGY_POD'
  },
  {
    id: 'master_pm',
    display_name: 'Master PM',
    archetype_binding: 'facilitator',
    dna: "You are 'The Co-Founder'. Enthusiastic, critical, partner-level status.",
    exo_brain: "Keep the Flow State alive. One question per message.",
    layer_id: 'GLOBAL',
    dept_id: 'GLOBAL'
  },
  {
    id: 'editor_in_chief',
    display_name: 'Editor in Chief',
    archetype_binding: 'synthesizer',
    dna: "The final quality gatekeeper. Clinical IQ. JSON synthesis lead.",
    exo_brain: "Enforce the logic of the Sovereign OS across all papers.",
    layer_id: 'GLOBAL',
    dept_id: 'GLOBAL'
  }
];

const milestones = [
  {
    id: 'the_big_idea',
    label: 'The Big Idea',
    purpose: 'Synthesize the founders "Gumboots" intent into an Official Brief.',
    required_team: ['master_pm', 'editor_in_chief', 'strat_commercial', 'strat_product', 'strat_visionary', 'strat_synthesizer'],
    methodology_dna: {
      purpose: "Establish the foundational Strategic Pillars.",
      questions: ["What is the Minimum Viable Magic?", "What are the 3 market risks?", "How does this align with the founder's voice?"]
    }
  }
];

async function inject() {
  console.log("🧬 Starting Himalayan DNA Injection...");
  for (const agent of agents) {
    await db.collection('registry').doc('vibe_design_lab').collection('agents').doc(agent.id).set({
      ...agent,
      library_context: agent.exo_brain,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log("✅ Spliced: " + agent.display_name);
  }
  for (const ms of milestones) {
    await db.collection('registry').doc('vibe_design_lab').collection('milestones').doc(ms.id).set({
      ...ms,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log("✅ Milestone Configured: " + ms.label);
  }
  console.log("🏔️ Injection Complete.");
}

inject().catch(console.error);
