import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'coral'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`cq-btn cq-btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
