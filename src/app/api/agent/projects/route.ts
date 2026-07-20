import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function GET() {
  try {
    const docs = await db.collection('cofounder_boards')
      .orderBy('updated_at', 'desc')
      .limit(50)
      .get();
    
    const projects = docs.docs.map(d => ({
      thread_id: d.id,
      project_name: d.data().project_name || 'Untitled',
      updated_at: d.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      is_pinned: d.data().is_pinned || false
    }));
    
    return NextResponse.json({ projects });
  } catch (e: any) {
    console.error("GET_PROJECTS_FAIL", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { thread_id, project_name } = body;
    
    // FIX: Changed .document() to .doc()
    await db.collection('cofounder_boards').doc(thread_id).set({
      project_name: project_name || 'UNTITLED PROJECT',
      is_pinned: false,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      vibe_manifest: {
        version: 1,
        strategyLedger: {},
        chatHistory: []
      }
    });

    console.log(`[FOUNDATION] Project Created: ${thread_id}`);
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error("CREATE_PROJECT_FAIL", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
