import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100/80 text-zinc-900 shadow hover:bg-zinc-100 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800/70",
        primary:
          "bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400",
        ghost:
          "bg-transparent text-zinc-200 hover:bg-zinc-800/60 dark:text-zinc-200",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
