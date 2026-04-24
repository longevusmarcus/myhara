import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { detectMsxLaunch, markMsxEntitled, type MsxContext } from "@/lib/msxBridge";

type BootStatus = "idle" | "booting" | "ready" | "failed";
type FailStage = "verify" | "bootstrap" | "set_session" | "get_session" | null;

type MsxBoot = {
  status: BootStatus;
  inMsx: boolean;
  failStage: FailStage;
  failDetail?: string;
};

const Ctx = createContext<MsxBoot>({ status: "idle", inMsx: false, failStage: null });

export function useMsxBoot() {
  return useContext(Ctx);
}

export function MsxBootProvider({ children }: { children: ReactNode }) {
  const [boot, setBoot] = useState<MsxBoot>(() => {
    const ctx: MsxContext = detectMsxLaunch();
    return {
      status: ctx.launched ? "booting" : "idle",
      inMsx: ctx.launched || ctx.inIframe,
      failStage: null,
    };
  });

  useEffect(() => {
    const ctx = detectMsxLaunch();
    if (!ctx.launched) return;

    let cancelled = false;
    (async () => {
      try {
        // 1. Bootstrap a real Supabase session (server-side re-verifies the token).
        const { data, error } = await supabase.functions.invoke("msx-session-bootstrap", {
          body: { token: ctx.token, appSlug: ctx.appSlug },
        });
        if (cancelled) return;
        if (error || !data?.ok || !data.access_token || !data.refresh_token) {
          const stage = (data?.stage as string | undefined) ?? "bootstrap";
          setBoot({
            status: "failed",
            inMsx: true,
            failStage: stage === "msx_verify" ? "verify" : "bootstrap",
            failDetail: data?.error ?? error?.message,
          });
          return;
        }

        // 2. Hydrate the client session.
        const { error: setErr } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        if (cancelled) return;
        if (setErr) {
          setBoot({ status: "failed", inMsx: true, failStage: "set_session", failDetail: setErr.message });
          return;
        }

        // 3. Confirm session is live.
        const { data: sessionData, error: getErr } = await supabase.auth.getSession();
        if (cancelled) return;
        if (getErr || !sessionData.session) {
          setBoot({ status: "failed", inMsx: true, failStage: "get_session", failDetail: getErr?.message });
          return;
        }

        // 4. Bypass native paywall.
        markMsxEntitled();
        setBoot({ status: "ready", inMsx: true, failStage: null });
      } catch (e) {
        if (!cancelled) {
          setBoot({ status: "failed", inMsx: true, failStage: "bootstrap", failDetail: String(e) });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <Ctx.Provider value={boot}>{children}</Ctx.Provider>;
}
