import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "primary", asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  // Ánh xạ variant sang class Bootstrap
  const variantClass = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    danger: "bg-danger text-white",
    outline: "border border-secondary text-secondary",
  }[variant];

  return (
    <Comp
      data-slot="badge"
      className={cn("badge", variantClass, className)}
      {...props}
    />
  );
}

export { Badge };
