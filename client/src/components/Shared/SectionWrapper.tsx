import { ReactNode } from 'react';

type SectionWrapperProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export default function SectionWrapper({ children, id, className = '' }: SectionWrapperProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
