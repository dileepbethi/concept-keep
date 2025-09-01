import React from 'react';
import { Calculator } from '@/components/Calculator';

/**
 * Calculator page component - integrates Calculator into the app
 */
export default function CalculatorPage() {
  return (
    <div className="p-6 h-full">
      <Calculator />
    </div>
  );
}