import type React from "react";

type AppBarProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export const AppBar: React.FC<AppBarProps> = ({ className, children }) => {
  return (
    <div
      role="banner"
      className={`flex justify-between px-4 py-3 bg-transparent rounded-b-lg backdrop-blur border-b border-border shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
};

type AppBarTitleProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export const AppBarTitle: React.FC<AppBarTitleProps> = ({
  className,
  children,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {children}
    </div>
  );
};

type AppBarActionsProps = {
  className?: string | undefined;
  children: React.ReactNode;
};

export const AppBarActions: React.FC<AppBarActionsProps> = ({
  className,
  children,
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className ?? ""}`}>
      {children}
    </div>
  );
};
