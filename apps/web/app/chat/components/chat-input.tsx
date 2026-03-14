"use client";

import { SendHorizontal } from "lucide-react";
import { useCallback, useRef } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder: string;
}

export function ChatInput({ onSend, disabled, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  function handleSubmit() {
    const el = textareaRef.current;
    if (!el) {
      return;
    }

    const value = el.value.trim();
    if (!value || disabled) {
      return;
    }

    onSend(value);
    el.value = "";
    el.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t border-border-muted bg-surface px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          onInput={handleResize}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-xl border border-border-muted bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:border-primary focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          aria-label="Send message"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
