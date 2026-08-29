import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://vibe-os-backend-z5kutfhliq-ts.a.run.app/api/v2';
const APP_ID = 'vibe_design_lab';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [manifestRes, historyRes] = await Promise.all([
      fetch(`${BACKEND_URL}/apps/${APP_ID}/manifest`),
      fetch(`${BACKEND_URL}/apps/${APP_ID}/projects/${id}/history`),
    ]);

    if (!manifestRes.ok) throw new Error('Failed to load manifest');
    const entities = await manifestRes.json();
    const project = entities.find((e: any) => e.system_id === id && e.entity_type === 'PROJECT');
    if (!project) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const history = historyRes.ok ? await historyRes.json() : { history: [], brief: null, appendix: null };

    return NextResponse.json({
      project_name: project.display_name || 'UNTITLED',
      vibe_manifest: {
        chatHistory: history.history || [],
        mission_manifesto: {},
        strategyLedger: {},
        layers: {},
        brief: history.brief,
        appendix: history.appendix,
      }
    });
  } catch (e: any) {
    console.error("GET_PROJECT_FAIL", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
