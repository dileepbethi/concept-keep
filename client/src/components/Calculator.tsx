import React, { useState, useCallback, useEffect } from 'react';
import { History as HistoryIcon, RotateCcw, Divide, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalculatorButton } from './CalculatorButton';
import { Display } from './Display';
import { History } from './History';
import { calculator, CalculationEntry } from '../utils/calculator';
import { cn } from '@/lib/utils';
import styles from '../App.module.css';

export interface CalculatorProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Main calculator component with logic and layout
 */
export const Calculator: React.FC<CalculatorProps> = ({ className }) => {
  // Calculator state
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<string>('');

  // Load history on component mount
  useEffect(() => {
    setHistory(calculator.getHistory());
  }, []);

  // Handle number input
  const handleNumber = useCallback((num: string) => {
    setError(false);
    
    // If we just finished a calculation, start fresh
    if (lastResult && !expression) {
      setExpression(num);
      setResult(num);
      setLastResult('');
    } else if (result === '0' && !expression) {
      setExpression(num);
      setResult(num);
    } else {
      // Check if the last character was an operator
      const lastChar = expression.slice(-1);
      if (['+', '-', '×', '÷', '^'].includes(lastChar)) {
        setExpression(prev => prev + num);
        setResult(num);
      } else {
        setExpression(prev => prev + num);
        setResult(prev => prev + num);
      }
    }
  }, [expression, result, lastResult]);

  // Handle operator input
  const handleOperator = useCallback((op: string) => {
    setError(false);
    
    if (!expression && result !== '0') {
      // Start with current result
      setExpression(result + op);
      setResult(result);
    } else {
      const lastChar = expression.slice(-1);
      
      // Replace operator if last character is also an operator
      if (['+', '-', '×', '÷', '^'].includes(lastChar)) {
        setExpression(prev => prev.slice(0, -1) + op);
      } else {
        setExpression(prev => prev + op);
      }
      setResult(result);
    }
  }, [expression, result]);

  // Handle equals calculation
  const handleEquals = useCallback(() => {
    if (!expression) return;

    try {
      const calculatedResult = calculator.evaluate(expression);
      const formattedResult = calculator.formatNumber(calculatedResult);
      
      setResult(formattedResult);
      setLastResult(formattedResult);
      setExpression('');
      setError(false);
      
      // Update history
      setHistory(calculator.getHistory());
    } catch (err) {
      setError(true);
      setResult('Error');
    }
  }, [expression]);

  // Handle clear all
  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setError(false);
    setLastResult('');
  }, []);

  // Handle clear entry
  const handleClearEntry = useCallback(() => {
    if (expression) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setResult(newExpression || '0');
    } else {
      setResult('0');
    }
    setError(false);
  }, [expression]);

  // Handle decimal point
  const handleDecimal = useCallback(() => {
    setError(false);
    const currentNumber = result.split(/[+\-×÷^]/).pop() || '';
    if (!currentNumber.includes('.')) {
      const newValue = result === '0' ? '0.' : result + '.';
      setResult(newValue);
      if (expression) {
        setExpression(prev => prev + '.');
      }
    }
  }, [expression, result]);

  // Handle percentage
  const handlePercentage = useCallback(() => {
    try {
      if (result !== '0' && result !== '') {
        const currentValue = parseFloat(result);
        const percentValue = currentValue / 100;
        const formatted = calculator.formatNumber(percentValue);
        setResult(formatted);
        if (expression) {
          setExpression(prev => prev + '%');
        }
      }
    } catch (err) {
      setError(true);
    }
  }, [result, expression]);

  // Handle square root
  const handleSquareRoot = useCallback(() => {
    try {
      if (result !== '0' && result !== '') {
        const currentValue = parseFloat(result);
        const sqrtValue = calculator.sqrt(currentValue);
        const formatted = calculator.formatNumber(sqrtValue);
        setResult(formatted);
        setExpression(`√${currentValue}`);
      }
    } catch (err) {
      setError(true);
      setResult('Error');
    }
  }, [result]);

  // Handle history item click
  const handleHistoryItemClick = useCallback((entry: CalculationEntry) => {
    setResult(entry.result.toString());
    setExpression('');
    setError(false);
  }, []);

  // Handle clear history
  const handleClearHistory = useCallback(() => {
    calculator.clearHistory();
    setHistory([]);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      event.preventDefault();
      
      if (key >= '0' && key <= '9') {
        handleNumber(key);
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('-');
      } else if (key === '*') {
        handleOperator('×');
      } else if (key === '/') {
        handleOperator('÷');
      } else if (key === '^') {
        handleOperator('^');
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === 'Backspace') {
        handleClearEntry();
      } else if (key === '.') {
        handleDecimal();
      } else if (key === '%') {
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleEquals, handleClear, handleClearEntry, handleDecimal, handlePercentage]);

  return (
    <div className={cn(styles.calculator, className)}>
      <div className={styles.calculatorMain}>
        {/* Header with controls */}
        <div className={styles.calculatorHeader}>
          <h2 className={styles.calculatorTitle}>Calculator</h2>
          <div className={styles.calculatorControls}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className={cn(styles.historyToggle, { [styles.active]: showHistory })}
              data-testid="toggle-history"
            >
              <HistoryIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Display */}
        <Display 
          expression={expression}
          result={result}
          error={error}
        />

        {/* Button Grid */}
        <div className={styles.buttonGrid}>
          {/* Row 1 - Functions */}
          <CalculatorButton
            variant="clear"
            onClick={handleClear}
            data-testid="btn-clear"
          >
            AC
          </CalculatorButton>
          <CalculatorButton
            variant="clear"
            onClick={handleClearEntry}
            data-testid="btn-clear-entry"
          >
            CE
          </CalculatorButton>
          <CalculatorButton
            variant="function"
            onClick={handlePercentage}
            data-testid="btn-percentage"
          >
            %
          </CalculatorButton>
          <CalculatorButton
            variant="operator"
            onClick={() => handleOperator('÷')}
            data-testid="btn-divide"
          >
            <Divide className="h-4 w-4" />
          </CalculatorButton>

          {/* Row 2 */}
          <CalculatorButton
            onClick={() => handleNumber('7')}
            data-testid="btn-7"
          >
            7
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumber('8')}
            data-testid="btn-8"
          >
            8
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumber('9')}
            data-testid="btn-9"
          >
            9
          </CalculatorButton>
          <CalculatorButton
            variant="operator"
            onClick={() => handleOperator('×')}
            data-testid="btn-multiply"
          >
            <X className="h-4 w-4" />
          </CalculatorButton>

          {/* Row 3 */}
          <CalculatorButton
            onClick={() => handleNumber('4')}
            data-testid="btn-4"
          >
            4
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumber('5')}
            data-testid="btn-5"
          >
            5
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumber('6')}
            data-testid="btn-6"
          >
            6
          </CalculatorButton>
          <CalculatorButton
            variant="operator"
            onClick={() => handleOperator('-')}
            data-testid="btn-subtract"
          >
            -
          </CalculatorButton>

          {/* Row 4 */}
          <CalculatorButton
            onClick={() => handleNumber('1')}
            data-testid="btn-1"
          >
            1
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumber('2')}
            data-testid="btn-2"
          >
            2
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleNumber('3')}
            data-testid="btn-3"
          >
            3
          </CalculatorButton>
          <CalculatorButton
            variant="operator"
            onClick={() => handleOperator('+')}
            data-testid="btn-add"
          >
            +
          </CalculatorButton>

          {/* Row 5 */}
          <CalculatorButton
            onClick={() => handleNumber('0')}
            span={2}
            data-testid="btn-0"
          >
            0
          </CalculatorButton>
          <CalculatorButton
            onClick={handleDecimal}
            data-testid="btn-decimal"
          >
            .
          </CalculatorButton>
          <CalculatorButton
            variant="equals"
            onClick={handleEquals}
            data-testid="btn-equals"
          >
            =
          </CalculatorButton>

          {/* Scientific functions row */}
          <CalculatorButton
            variant="function"
            onClick={handleSquareRoot}
            data-testid="btn-sqrt"
          >
            √
          </CalculatorButton>
          <CalculatorButton
            variant="function"
            onClick={() => handleOperator('^')}
            data-testid="btn-power"
          >
            x²
          </CalculatorButton>
          <CalculatorButton
            variant="function"
            onClick={() => {
              if (result !== '0') {
                const value = parseFloat(result);
                const reciprocal = 1 / value;
                setResult(calculator.formatNumber(reciprocal));
              }
            }}
            data-testid="btn-reciprocal"
          >
            1/x
          </CalculatorButton>
          <CalculatorButton
            variant="function"
            onClick={() => {
              if (result !== '0') {
                const value = parseFloat(result);
                setResult(calculator.formatNumber(-value));
              }
            }}
            data-testid="btn-negate"
          >
            ±
          </CalculatorButton>
        </div>
      </div>

      {/* History Panel */}
      <History
        history={history}
        onHistoryItemClick={handleHistoryItemClick}
        onClearHistory={handleClearHistory}
        visible={showHistory}
      />
    </div>
  );
};