import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant: 'primary' | 'outline';
  onClick?: () => void;
  asLink?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export default function Button({
  children,
  variant,
  onClick,
  asLink = false,
  href = '#',
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-md font-medium transition-all";
  
  const variantStyles = {
    primary: "bg-accent text-accent-foreground hover:bg-opacity-80",
    outline: "border border-accent text-accent hover:bg-accent hover:bg-opacity-10",
  };
  
  if (asLink) {
    return (
      <a 
        href={href} 
        className={`${baseStyles} ${variantStyles[variant]} inline-block`}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyles} ${variantStyles[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
