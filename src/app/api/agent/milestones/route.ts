import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('agency_registry').doc('milestones').collection('definitions').get();
    const milestones = snapshot.docs.map(doc => {
      const d = doc.data();
      return { 
        milestone_id: doc.id, 
        ...d,
        // PHYSICAL KEY MAPPING
        bricks: d.research_architecture || [],
        checklist_prompt: d.checklist_prompt || ""
      };
    });
    return NextResponse.json({ milestones });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
