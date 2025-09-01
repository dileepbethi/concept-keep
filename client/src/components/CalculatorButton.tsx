import React from 'react';
import { cn } from '@/lib/utils';
import styles from '../App.module.css';

export interface CalculatorButtonProps {
  /**
   * The text or symbol to display on the button
   */
  children: React.ReactNode;
  
  /**
   * Click handler for the button
   */
  onClick: () => void;
  
  /**
   * Button variant for different styling
   */
  variant?: 'default' | 'operator' | 'equals' | 'clear' | 'function';
  
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button spans multiple columns
   */
  span?: number;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Test identifier for automated testing
   */
  'data-testid'?: string;
}

/**
 * Reusable calculator button component with different variants and styles
 */
export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  span = 1,
  disabled = false,
  className,
  'data-testid': testId,
}) => {
  const buttonClass = cn(
    styles.calculatorButton,
    styles[`button-${variant}`],
    styles[`button-${size}`],
    {
      [styles.buttonDisabled]: disabled,
      [styles[`span-${span}`]]: span > 1,
    },
    className
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
      type="button"
    >
      <span className={styles.buttonContent}>
        {children}
      </span>
    </button>
  );
};