import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MSX_ENTITLED_KEY = "msx_entitled";
const MSX_SLUG_KEY = "msx_app_slug";
const MSX_TOKEN_KEY = "msx_launch_token";

export type MsxState = {
  checking: boolean;
  entitled: boolean;
  accessMode?: string;
};

/**
 * Reads msx_launch_token + msx_app_slug from URL or sessionStorage,
 * verifies through our secure backend (which holds MSX_TOKEN),
 * and marks the session as MSX-entitled to bypass the native paywall.
 */
export function useMsxLaunch(): MsxState {
  const [state, setState] = useState<MsxState>({
    checking: true,
    entitled: sessionStorage.getItem(MSX_ENTITLED_KEY) === "true" || localStorage.getItem("hara_paid") === "true",
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenFromUrl = url.searchParams.get("msx_launch_token");
    const slugFromUrl = url.searchParams.get("msx_app_slug");

    if (tokenFromUrl) sessionStorage.setItem(MSX_TOKEN_KEY, tokenFromUrl);
    if (slugFromUrl) sessionStorage.setItem(MSX_SLUG_KEY, slugFromUrl);

    const launchToken = sessionStorage.getItem(MSX_TOKEN_KEY);
    const slug = sessionStorage.getItem(MSX_SLUG_KEY) ?? "hara";

    if (!launchToken) {
      setState((s) => ({ ...s, checking: false }));
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("msx-launch-verify", {
          body: { launchToken, slug },
        });
        if (error) throw error;

        const accessMode = data?.accessMode;
        const entitled = accessMode === "full";
        if (entitled) {
          sessionStorage.setItem(MSX_ENTITLED_KEY, "true");
          // Bypass native paywall while in-shell
          localStorage.setItem("hara_paid", "true");
        }
        setState({ checking: false, entitled, accessMode });

        // Clean tokens from the URL bar
        if (tokenFromUrl || slugFromUrl) {
          url.searchParams.delete("msx_launch_token");
          url.searchParams.delete("msx_app_slug");
          window.history.replaceState({}, "", url.toString());
        }
      } catch (e) {
        console.error("MSX launch verify failed", e);
        setState({ checking: false, entitled: false });
      }
    })();
  }, []);

  return state;
}
