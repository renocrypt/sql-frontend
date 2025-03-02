import * as React from "react"
 
import { cn } from "@/lib/utils"
 
interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
}
 
const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, code, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "px-4 py-3 font-mono text-sm bg-muted rounded-md overflow-x-auto",
          className
        )}
        {...props}
      >
        <code>{code}</code>
      </pre>
    )
  }
)
Code.displayName = "Code"
 
export { Code }