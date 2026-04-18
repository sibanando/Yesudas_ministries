import Link from "next/link";
import type { LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";
import type { VariantProps } from "class-variance-authority";

interface ButtonLinkProps
  extends Omit<LinkProps, "href">,
    VariantProps<typeof buttonVariants> {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
