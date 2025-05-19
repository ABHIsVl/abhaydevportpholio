import { ReactNode } from 'react';

type CustomScrollbarProps = {
  children: ReactNode;
  height?: string;
  className?: string;
};

export default function CustomScrollbar({
  children,
  height = 'h-auto',
  className = '',
}: CustomScrollbarProps) {
  return (
    <div className={`overflow-y-auto ${height} ${className}`}>
      {children}
    </div>
  );
}
