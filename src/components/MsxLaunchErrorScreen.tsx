export default function MsxLaunchErrorScreen({ stage, detail }: { stage: string | null; detail?: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-light">We couldn't open Hara from MSX</h1>
      <p className="text-sm text-muted-foreground">Stage: <code className="text-foreground">{stage ?? "unknown"}</code></p>
      {detail && <p className="text-xs text-muted-foreground/70 max-w-md break-words">{detail}</p>}
      <p className="text-xs text-muted-foreground/60 mt-4">Please relaunch the app from the MSX shell.</p>
    </div>
  );
}
