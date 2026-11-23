export const modalUi = {
  content: "bg-white text-zinc-900 ring-zinc-200",
  header: "bg-white border-0",
  title: "text-zinc-900",
  description: "text-zinc-700",
  body: "bg-white text-zinc-900 border-0",
  footer: "bg-white",
};

export const formFieldUi = {
  label: "text-zinc-800 font-medium",
};

export const formInputUi = {
  root: "w-full",
  base: "bg-white text-zinc-900 ring-zinc-300 placeholder:text-zinc-400 disabled:opacity-100 disabled:text-zinc-900",
};

export const formTextareaUi = {
  root: "w-full",
  base: "bg-white text-zinc-900 ring-zinc-300 placeholder:text-zinc-400",
};

export const formSelectUi = {
  root: "w-full",
  base:
    "bg-white text-zinc-900 ring-zinc-300 data-[state=open]:bg-white hover:bg-white w-full disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-100 disabled:text-zinc-900 disabled:ring-zinc-200",
  value: "text-zinc-900",
  placeholder: "text-zinc-400",
  content: "bg-white text-zinc-900 ring-zinc-300 shadow-lg",
  viewport: "divide-y-0 bg-white",
  input:
    "bg-white text-zinc-900 border-b border-zinc-200 placeholder:text-zinc-400",
  item: "text-zinc-900 data-highlighted:not-data-disabled:before:bg-zinc-100",
  itemLabel: "text-zinc-900",
};

export const checkboxUi = {
  label: "text-zinc-800",
};

export const modalNeutralButtonClass =
  "bg-white text-zinc-700 ring-1 ring-zinc-300 hover:bg-zinc-50";

export const modalPrimaryButtonClass =
  "bg-[#071E48] text-white hover:bg-[#0f2f5f]";

/** Tombol aksi baris tabel (⋯) dipakai lintas halaman. */
export const dataTableRowActionIcon = "i-lucide-ellipsis" as const;

export const dataTableRowActionMenuContent = {
  align: "end" as const,
  side: "bottom" as const,
  sideOffset: 4,
};

export const dataTableRowActionMenuUi = {
  content: "bg-white ring-1 ring-zinc-200 shadow-lg",
  item:
    "text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 active:bg-zinc-100",
  separator: "-mx-1 my-1 h-px bg-zinc-200",
};

/** Gaya trigger tombol titik tiga (seragam lintas halaman). */
export const dataTableRowActionTriggerButtonUi = {
  base:
    "min-h-8 min-w-8 border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-300",
};
