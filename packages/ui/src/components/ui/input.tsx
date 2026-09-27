import * as React from "react"

import { fieldFocus, fieldInvalid, fieldSurface } from "@/lib/field"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 px-3 py-1 text-base selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none md:text-sm",
        fieldSurface,
        fieldFocus,
        fieldInvalid,
        className
      )}
      {...props}
    />
  )
}

export { Input }
