/**
 * Calculator utility functions for performing mathematical operations
 */

export interface CalculationEntry {
  expression: string;
  result: number;
  timestamp: Date;
}

export class Calculator {
  private static instance: Calculator;
  private history: CalculationEntry[] = [];

  private constructor() {}

  public static getInstance(): Calculator {
    if (!Calculator.instance) {
      Calculator.instance = new Calculator();
    }
    return Calculator.instance;
  }

  /**
   * Safely evaluate a mathematical expression
   */
  public evaluate(expression: string): number {
    try {
      // Remove spaces and validate expression
      const cleanExpression = expression.replace(/\s+/g, '');
      
      // Security check - only allow numbers, operators, and specific functions
      if (!/^[0-9+\-*/.()√^%]+$/.test(cleanExpression)) {
        throw new Error('Invalid characters in expression');
      }

      // Replace calculator symbols with JavaScript equivalents
      let jsExpression = cleanExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)')
        .replace(/\^/g, '**');

      // Handle percentage operations
      jsExpression = this.handlePercentage(jsExpression);

      // Use Function constructor instead of eval for better security
      const result = new Function(`"use strict"; return (${jsExpression})`)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid result');
      }

      // Add to history
      this.addToHistory(expression, result);

      return result;
    } catch (error) {
      throw new Error('Invalid expression');
    }
  }

  /**
   * Handle percentage calculations
   */
  private handlePercentage(expression: string): string {
    // Convert percentage operations like "20%" to "20/100"
    return expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
  }

  /**
   * Add calculation to history
   */
  private addToHistory(expression: string, result: number): void {
    const entry: CalculationEntry = {
      expression,
      result,
      timestamp: new Date()
    };
    
    this.history.unshift(entry);
    
    // Keep only last 50 calculations
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }
  }

  /**
   * Get calculation history
   */
  public getHistory(): CalculationEntry[] {
    return [...this.history];
  }

  /**
   * Clear calculation history
   */
  public clearHistory(): void {
    this.history = [];
  }

  /**
   * Calculate square root
   */
  public sqrt(value: number): number {
    if (value < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(value);
  }

  /**
   * Calculate power
   */
  public power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  /**
   * Calculate percentage
   */
  public percentage(value: number, percentage: number): number {
    return (value * percentage) / 100;
  }

  /**
   * Format number for display
   */
  public formatNumber(num: number): string {
    // Handle very large or very small numbers
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
      return num.toExponential(6);
    }

    // Remove unnecessary decimal places
    const formatted = num.toString();
    if (formatted.includes('.')) {
      return parseFloat(formatted).toString();
    }
    
    return formatted;
  }

  /**
   * Validate if string is a valid number
   */
  public isValidNumber(str: string): boolean {
    return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
  }
}

export const calculator = Calculator.getInstance();