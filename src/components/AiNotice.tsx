import { Info, Sparkles } from "lucide-react";
import { useState } from "react";

export function AiNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>
        {children ??
          "AI-generated draft. Check every fact and edit it in your own voice before you send it."}
      </span>
    </p>
  );
}

export function PromptDisclosure({ system }: { system: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <Info className="size-3.5" />
        {open ? "Hide" : "See"} how this was prompted
      </button>
      {open && (
        <pre className="mt-2 max-h-72 overflow-auto rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {system}
        </pre>
      )}
    </div>
  );
}
