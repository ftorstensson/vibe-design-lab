import { v4 as uuidv4 } from 'uuid';

const KERNEL_URL = "https://vibe-kernel-534939227554.australia-southeast1.run.app/kernel/invoke";

export interface KernelBriefcase {
  app_id: string;
  project_id: string;
  idempotency_key: string;
  intent: {
    outcome_type: string;
    team_archetype: string;
  };
  materials: {
    user_goal: string;
    brick_catalog: any[];
  };
  state_ref: {
    expected_version: number;
    snowball_ref: string;
  };
}

export async function callVibeKernel(briefcase: Partial<KernelBriefcase>) {
  const fullBriefcase = {
    app_id: "vibe_design_lab",
    idempotency_key: uuidv4(),
    contract_version: "1.1",
    ...briefcase,
  };

  console.log(`[UCC_HANDSHAKE] Sending briefcase to Sydney: ${fullBriefcase.idempotency_key}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 150000); // 150s timeout

  try {
    const response = await fetch(KERNEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullBriefcase),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kernel Rejected: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
        throw new Error("Kernel Handshake Timed Out (150s)");
    }
    throw error;
  }
}
