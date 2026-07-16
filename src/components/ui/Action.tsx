import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

type ActionVariant = "primary" | "secondary" | "ghost" | "dark";

function actionClassName(
  variant: ActionVariant,
  className?: string,
): string {
  return ["action", `action-${variant}`, className].filter(Boolean).join(" ");
}

interface ActionLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: ActionVariant;
}

export function ActionLink({
  children,
  className,
  variant = "primary",
  ...props
}: ActionLinkProps) {
  return (
    <Link className={actionClassName(variant, className)} {...props}>
      {children}
    </Link>
  );
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ActionVariant;
}

export function ActionButton({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={actionClassName(variant, className)}
      type={type}
      {...props}
    />
  );
}
