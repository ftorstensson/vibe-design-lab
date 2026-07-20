const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'vibe-agent-final' });
const db = admin.firestore();

async function verify() {
  const path = "registry/vibe_design_lab/milestones/the_big_idea";
  const doc = await db.doc(path).get();
  
  if (!doc.exists) {
    console.log("❌ ERROR: Path not found.");
    return;
  }

  const data = doc.data();
  const rawString = JSON.stringify(data);
  const targetString = "Spell out the actual thing";
  
  console.log("🔍 [VERIFICATION] Scanning " + path + "...");
  
  if (rawString.includes(targetString)) {
    console.log("✅ MATCH FOUND: The 'Gumboots' string exists in this document.");
    console.log("\n--- CLINICAL COORDINATES ---");
    console.log("PATH: " + path);
    console.log("FIELD: research_architecture (Array)");
    
    // Find the specific brick containing the string
    const brick = data.research_architecture.find(b => JSON.stringify(b).includes(targetString));
    console.log("\n--- TARGET BRICK DATA ---");
    console.log(JSON.stringify(brick, null, 2));
  } else {
    console.log("❌ STRING NOT FOUND. The OS is looking in the wrong place.");
  }
}
verify().catch(console.error);
