// MSX launch detection + token persistence.
// Detects msx_launch_token from URL or sessionStorage so it survives SPA nav.

const TOKEN_KEY = "msx_launch_token";
const SLUG_KEY = "msx_app_slug";
const ENTITLED_KEY = "msx_entitled";

export type MsxContext = {
  launched: boolean;
  inIframe: boolean;
  token: string | null;
  appSlug: string;
};

export function detectMsxLaunch(): MsxContext {
  let inIframe = false;
  try {
    inIframe = window.self !== window.top;
  } catch {
    inIframe = true;
  }

  let token: string | null = null;
  let slug = "hara";

  try {
    const url = new URL(window.location.href);
    const tokenFromUrl = url.searchParams.get("msx_launch_token");
    const slugFromUrl = url.searchParams.get("msx_app_slug");
    if (tokenFromUrl) {
      sessionStorage.setItem(TOKEN_KEY, tokenFromUrl);
      // Strip from URL so it doesn't leak
      url.searchParams.delete("msx_launch_token");
      url.searchParams.delete("msx_app_slug");
      window.history.replaceState({}, "", url.toString());
    }
    if (slugFromUrl) sessionStorage.setItem(SLUG_KEY, slugFromUrl);
    token = sessionStorage.getItem(TOKEN_KEY);
    slug = sessionStorage.getItem(SLUG_KEY) ?? "hara";
  } catch {
    /* SSR or storage unavailable */
  }

  return {
    launched: Boolean(token),
    inIframe,
    token,
    appSlug: slug,
  };
}

export function isMsxEntitled(): boolean {
  try {
    return sessionStorage.getItem(ENTITLED_KEY) === "true";
  } catch {
    return false;
  }
}

export function markMsxEntitled() {
  try {
    sessionStorage.setItem(ENTITLED_KEY, "true");
    // The native paywall reads localStorage.hara_paid — flip it so it's bypassed.
    localStorage.setItem("hara_paid", "true");
  } catch {
    /* ignore */
  }
}

export function clearMsxLaunch() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SLUG_KEY);
    sessionStorage.removeItem(ENTITLED_KEY);
  } catch {
    /* ignore */
  }
}
