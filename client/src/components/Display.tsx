import React from 'react';
import { cn } from '@/lib/utils';
import styles from '../App.module.css';

export interface DisplayProps {
  /**
   * Current expression being entered
   */
  expression: string;
  
  /**
   * Current result or value to display
   */
  result: string;
  
  /**
   * Whether there's an error state
   */
  error?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Calculator display component showing current input and result
 */
export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  error = false,
  className,
}) => {
  return (
    <div className={cn(styles.display, { [styles.displayError]: error }, className)}>
      {/* Expression line - shows the current input/calculation */}
      <div className={styles.displayExpression}>
        {expression || '0'}
      </div>
      
      {/* Result line - shows the calculated result */}
      <div className={styles.displayResult}>
        {error ? 'Error' : result}
      </div>
    </div>
  );
};