export default function MsxOpeningScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground font-light tracking-wide">Opening in MSX…</p>
    </div>
  );
}
