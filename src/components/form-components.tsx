"use client";

import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "./ui/button";

type FormActionsProps = {
  asChild?: boolean;
  children: React.ReactNode;
};

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  asChild,
}) => {
  const Comp = asChild ? Slot : "div";

  return <Comp className="flex justify-end space-x-2">{children}</Comp>;
};

type FormSubmitProps = {
  children: React.ReactNode;
  className?: string | undefined;
};

export const FormSubmit: React.FC<FormSubmitProps> = ({
  children,
  className,
}) => {
  const {
    formState: { isValid, isSubmitting, isDirty },
  } = useFormContext();

  if (React.isValidElement(children) && children.type === "button") {
    return React.cloneElement(children, {
      type: "submit",
      disabled: !isValid || isSubmitting,
    } as React.ButtonHTMLAttributes<HTMLButtonElement>);
  }

  const label = typeof children === "string" ? children : "Submit";

  return (
    <Button
      type="submit"
      disabled={!isDirty || !isValid || isSubmitting}
      className={`${className}`}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting ? "Loading..." : label}
    </Button>
  );
};
