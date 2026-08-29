import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ActionVariant = "primary" | "secondary" | "ghost" | "dark";

function actionClassName(
  variant: ActionVariant,
  className?: string,
): string {
  return ["action", `action-${variant}`, className].filter(Boolean).join(" ");
}

interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
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
    <a className={actionClassName(variant, className)} {...props}>
      {children}
    </a>
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
