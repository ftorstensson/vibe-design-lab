import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const rosterSnap = await db.collection('agency_roster').get();
    const roster = rosterSnap.docs.map(doc => {
      const d = doc.data();
      return { 
        id: doc.id, 
        ...d,
        // PHYSICAL KEY MAPPING
        display_name: d.human_name || d.display_name || doc.id,
        system_prompt: d.system_prompt_l1 || d.system_prompt || "",
        optimization_target: d.optimization_target || "",
        loss_function: d.loss_function || "",
        physics_constraints: d.physics_constraints || "",
        exo_brain: d.exo_brain || ""
      };
    });
    return NextResponse.json({ roster });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
