import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://vibe-os-backend-z5kutfhliq-ts.a.run.app/api/v2';
const APP_ID = 'vibe_design_lab';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/apps/${APP_ID}/projects`);
    const projects = await res.json();
    if (!res.ok) throw new Error(projects.error || 'Failed to list projects');

    return NextResponse.json({
      projects: projects.map((p: any) => ({
        thread_id: p.system_id,
        project_name: p.display_name || 'Untitled',
        updated_at: p.updated_at ? new Date(p.updated_at * 1000).toISOString() : new Date().toISOString(),
        is_pinned: p.is_pinned || false
      }))
    });
  } catch (e: any) {
    console.error("GET_PROJECTS_FAIL", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_name } = body;

    const res = await fetch(`${BACKEND_URL}/apps/${APP_ID}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: project_name || 'UNTITLED PROJECT' }),
    });
    const project = await res.json();
    if (!res.ok) throw new Error(project.error || 'Failed to create project');

    console.log(`[FOUNDATION] Project Created: ${project.system_id}`);
    return NextResponse.json({ status: 'success', thread_id: project.system_id });
  } catch (error: any) {
    console.error("CREATE_PROJECT_FAIL", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
