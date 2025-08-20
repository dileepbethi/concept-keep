import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { IdeaCard } from "@/components/idea-card"
import { Idea } from "@shared/schema"
import { apiRequest } from "@/lib/queryClient"
import { queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

export default function Explorer() {
  const [filter, setFilter] = useState<string>("latest")
  const { toast } = useToast()

  const { data: publicIdeas = [], isLoading } = useQuery<Idea[]>({
    queryKey: ["/api/ideas/public", filter],
  })

  const likeIdeaMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      return apiRequest("POST", `/api/ideas/${ideaId}/like`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/public"] })
    },
    onError: () => {
      toast({ title: "Failed to like idea", variant: "destructive" })
    },
  })

  const investMutation = useMutation({
    mutationFn: async ({ ideaId, amount }: { ideaId: string; amount: string }) => {
      return apiRequest("POST", "/api/investments", { ideaId, amount })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/public"] })
      toast({ title: "Investment successful!" })
    },
    onError: () => {
      toast({ title: "Failed to invest", variant: "destructive" })
    },
  })

  const handleLike = (ideaId: string) => {
    likeIdeaMutation.mutate(ideaId)
  }

  const handleInvest = (ideaId: string) => {
    const amount = prompt("Enter investment amount:")
    if (amount && parseFloat(amount) > 0) {
      investMutation.mutate({ ideaId, amount })
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Public Idea Explorer</h2>
          <div className="flex space-x-2">
            <Button
              variant={filter === "latest" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("latest")}
              data-testid="button-filter-latest"
            >
              Latest
            </Button>
            <Button
              variant={filter === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("trending")}
              data-testid="button-filter-trending"
            >
              Trending
            </Button>
            <Button
              variant={filter === "most_funded" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("most_funded")}
              data-testid="button-filter-funded"
            >
              Most Funded
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onLike={handleLike}
              onInvest={handleInvest}
              isPublic={true}
            />
          ))}
        </div>

        {publicIdeas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No public ideas found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
