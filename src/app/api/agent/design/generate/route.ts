import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { callVibeKernel } from '@/lib/kernel-client';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const projectId = formData.get('project_id') as string;
    const prompt = formData.get('prompt') as string;
    const milestoneId = formData.get('milestone_id') as string || 'the_big_idea';

    console.log(`[ARCHIVIST] Ingesting Project: ${projectId}`);

    // 1. ATOMIC NAMING & GRID LOGGING
    // FIX: Changed .document() to .doc()
    const projRef = db.collection('cofounder_boards').doc(projectId);
    const projDoc = await projRef.get();
    
    // Safety: If the project doesn't exist, we'll create a stub for it
    if (!projDoc.exists) {
      console.log(`[ARCHIVIST] Project ${projectId} missing. Creating stub...`);
      await projRef.set({
        project_name: 'UNTITLED PROJECT',
        version: 1,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    let projectName = projDoc.data()?.project_name || 'UNTITLED PROJECT';

    // SILVER TIER: Persist Human Grit (Double-write for Path-Blindness safety)
    // FIX: Changed .document() to .doc()
    await projRef.collection('slots').doc('user_goal').set({
      text: prompt,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Legacy Gasket write
    await projRef.update({
      "vibe_manifest.verbatim_spark": prompt,
      "updated_at": admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. UCC v1.1 HANDSHAKE
    const briefcase = {
      project_id: projectId,
      intent: {
        outcome_type: "STRATEGIC_IGNITION",
        team_archetype: "DISCOVERY_HUB"
      },
      materials: {
        user_goal: prompt,
        brick_catalog: [] 
      },
      state_ref: {
        expected_version: projDoc.data()?.version || 1,
        snowball_ref: `projects/${projectId}/vibe_manifest/narrative_history`
      }
    };

    const kRes = await callVibeKernel(briefcase);

    // 3. NAMING ENGINE: If still untitled, ask Kernel for a name
    if (projectName === 'UNTITLED PROJECT' && kRes.social_response) {
       projectName = kRes.suggested_project_name || projectName;
       await projRef.update({ project_name: projectName });
    }

    // 4. THE FIDELITY BRIDGE (Down-sampling for the Legacy UI)
    return NextResponse.json({
      user_message: kRes.social_response || "The PM is silent, but the work is done.",
      suggested_project_name: projectName,
      manifesto: kRes.data_patch || {},
      status: kRes.status,
      patch: kRes.resource_paper ? {
        dept_id: milestoneId,
        content: kRes.resource_paper 
      } : null
    });

  } catch (error: any) {
    console.error("[ARCHIVIST_FAILURE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
