import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CalculationEntry } from '../utils/calculator';
import styles from '../App.module.css';

export interface HistoryProps {
  /**
   * Array of calculation history entries
   */
  history: CalculationEntry[];
  
  /**
   * Callback when a history item is clicked to reuse the result
   */
  onHistoryItemClick?: (entry: CalculationEntry) => void;
  
  /**
   * Callback when clear history is clicked
   */
  onClearHistory?: () => void;
  
  /**
   * Whether the history panel is visible
   */
  visible: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Calculator history component showing past calculations
 */
export const History: React.FC<HistoryProps> = ({
  history,
  onHistoryItemClick,
  onClearHistory,
  visible,
  className,
}) => {
  if (!visible) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={cn(styles.history, className)}>
      {/* History Header */}
      <div className={styles.historyHeader}>
        <div className={styles.historyTitle}>
          <Clock className="h-4 w-4" />
          <span>History</span>
        </div>
        
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className={styles.clearHistoryButton}
            data-testid="clear-history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* History Content */}
      <ScrollArea className={styles.historyContent}>
        {history.length === 0 ? (
          <div className={styles.historyEmpty}>
            <p>No calculations yet</p>
            <p className="text-xs text-muted-foreground">Your calculation history will appear here</p>
          </div>
        ) : (
          <div className={styles.historyList}>
            {history.map((entry, index) => (
              <div
                key={index}
                className={styles.historyItem}
                onClick={() => onHistoryItemClick?.(entry)}
                data-testid={`history-item-${index}`}
              >
                <div className={styles.historyItemContent}>
                  <div className={styles.historyExpression}>
                    {entry.expression}
                  </div>
                  <div className={styles.historyResult}>
                    = {entry.result.toString()}
                  </div>
                </div>
                <div className={styles.historyTime}>
                  {formatTime(entry.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};