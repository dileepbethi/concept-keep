import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IdeaAnalysis } from "./idea-analysis"
import { Idea } from "@shared/schema"

interface IdeaAnalysisDrawerProps {
  idea: Idea | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IdeaAnalysisDrawer({ idea, open, onOpenChange }: IdeaAnalysisDrawerProps) {
  if (!idea) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-4xl">
        <SheetHeader className="mb-6">
          <SheetTitle>AI Fundamental Analysis</SheetTitle>
          <SheetDescription>
            Comprehensive analysis powered by AI to evaluate market potential, risks, and growth opportunities.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full -mx-6 px-6">
          <IdeaAnalysis idea={idea} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}