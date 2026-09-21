"use client";

import { useState } from "react";
import { useDict } from "@/components/locale-provider";

export function UpdateInfo() {
  const dict = useDict();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={dict.dataInfoAria}
        aria-expanded={open}
        title={dict.dataInfoAria}
        onClick={() => setOpen((v) => !v)}
        className="-my-2 inline-flex items-center px-1 py-2 align-middle transition hover:text-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>
      {open && (
        <span className="mt-2 block rounded-xl bg-white/10 px-3 py-2 leading-relaxed">
          {dict.dataInfo}
        </span>
      )}
    </>
  );
}
