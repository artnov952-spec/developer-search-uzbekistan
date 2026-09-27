import * as React from "react"

import { fieldFocus, fieldInvalid, fieldSurface } from "@/lib/field"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full px-3 py-2 text-base md:text-sm",
        fieldSurface,
        fieldFocus,
        fieldInvalid,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
