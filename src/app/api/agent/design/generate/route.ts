import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://vibe-os-backend-z5kutfhliq-ts.a.run.app/api/v2';
const APP_ID = 'vibe_design_lab';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const projectId = formData.get('project_id') as string;
    const prompt = formData.get('prompt') as string;
    const milestoneId = (formData.get('milestone_id') as string) || undefined;
    const specialistId = (formData.get('specialist_id') as string) || undefined;

    console.log(`[ARCHIVIST] Ingesting Project: ${projectId}`);

    const body: Record<string, any> = {
      agent_id: specialistId || 'master_pm',
      user_message: prompt,
    };
    if (milestoneId) body.milestone_id = milestoneId;

    const res = await fetch(`${BACKEND_URL}/apps/${APP_ID}/projects/${projectId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const kRes = await res.json();
    if (!res.ok) throw new Error(kRes.error || `Backend rejected request: ${res.status}`);

    // THE FIDELITY BRIDGE (Down-sampling for the Legacy UI)
    return NextResponse.json({
      user_message: kRes.social_response || "The PM is silent, but the work is done.",
      manifesto: kRes.data_patch || {},
      status: kRes.status,
      patch: kRes.data_patch ? {
        dept_id: milestoneId || null,
        content: kRes.data_patch
      } : null
    });

  } catch (error: any) {
    console.error("[ARCHIVIST_FAILURE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
