import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, DollarSign, Edit, Share, Trash2 } from "lucide-react"
import { Idea } from "@shared/schema"
import { cn } from "@/lib/utils"

interface IdeaCardProps {
  idea: Idea
  onEdit?: (id: string) => void
  onShare?: (id: string) => void
  onDelete?: (id: string) => void
  onLike?: (id: string) => void
  onInvest?: (id: string) => void
  showActions?: boolean
  isPublic?: boolean
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return <Badge className="status-badge status-draft">Draft</Badge>
    case "public":
      return <Badge className="status-badge status-public">Public</Badge>
    case "investment_open":
      return <Badge className="status-badge status-investment">Investment Open</Badge>
    default:
      return <Badge className="status-badge">{status}</Badge>
  }
}

export function IdeaCard({ 
  idea, 
  onEdit, 
  onShare, 
  onDelete, 
  onLike, 
  onInvest,
  showActions = true,
  isPublic = false 
}: IdeaCardProps) {
  return (
    <Card className="card-hover" data-testid={`card-idea-${idea.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-2" data-testid={`text-title-${idea.id}`}>
              {idea.title}
            </h4>
            <p className="text-muted-foreground text-sm mb-3" data-testid={`text-description-${idea.id}`}>
              {idea.description}
            </p>
          </div>
          {getStatusBadge(idea.status)}
        </div>

        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <button 
              onClick={() => onLike?.(idea.id)}
              className="flex items-center hover:text-destructive transition-colors"
              data-testid={`button-like-${idea.id}`}
            >
              <Heart className="h-4 w-4 mr-1" />
              <span>{idea.likes}</span>
            </button>
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span data-testid={`text-comments-${idea.id}`}>{idea.comments}</span>
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span data-testid={`text-funding-${idea.id}`}>${idea.funding}</span>
            </span>
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              {isPublic ? (
                <Button 
                  size="sm" 
                  className="gradient-primary"
                  onClick={() => onInvest?.(idea.id)}
                  data-testid={`button-invest-${idea.id}`}
                >
                  Micro-Invest
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(idea.id)}
                    data-testid={`button-edit-${idea.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShare?.(idea.id)}
                    data-testid={`button-share-${idea.id}`}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(idea.id)}
                    data-testid={`button-delete-${idea.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
