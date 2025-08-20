import { useQuery } from "@tanstack/react-query"
import { Lightbulb, Globe, DollarSign, Users } from "lucide-react"
import { StatsCard } from "@/components/stats-card"
import { IdeaCard } from "@/components/idea-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Idea, User } from "@shared/schema"
import { useState } from "react"

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user/current"],
  })

  const { data: userStats } = useQuery<{ ideasCount: number; followersCount: number; investmentsCount: number; totalFunding: number }>({
    queryKey: ["/api/user/user-1/stats"],
  })

  const { data: globalStats } = useQuery<{ totalIdeas: number; publicIdeas: number; totalFunding: number }>({
    queryKey: ["/api/stats"],
  })

  const { data: userIdeas = [] } = useQuery<Idea[]>({
    queryKey: ["/api/ideas/user/user-1"],
  })

  const filteredIdeas = userIdeas.filter(idea => {
    if (statusFilter === "all") return true
    return idea.status === statusFilter
  })

  const handleEditIdea = (id: string) => {
    console.log("Edit idea:", id)
  }

  const handleShareIdea = (id: string) => {
    console.log("Share idea:", id)
  }

  const handleDeleteIdea = (id: string) => {
    console.log("Delete idea:", id)
  }

  if (!currentUser || !userStats || !globalStats) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Ideas"
          value={userStats.ideasCount}
          icon={Lightbulb}
          color="primary-blue"
        />
        <StatsCard
          title="Public Ideas"
          value={globalStats.publicIdeas}
          icon={Globe}
          color="success"
        />
        <StatsCard
          title="Total Funding"
          value={`$${globalStats.totalFunding.toLocaleString()}`}
          icon={DollarSign}
          color="primary-purple"
        />
        <StatsCard
          title="Followers"
          value={userStats.followersCount || 156}
          icon={Users}
          color="warning"
        />
      </div>

      {/* Recent Ideas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Ideas</h3>
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("draft")}
              data-testid="button-filter-draft"
            >
              Draft
            </Button>
            <Button
              variant={statusFilter === "public" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("public")}
              data-testid="button-filter-public"
            >
              Public
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={handleEditIdea}
              onShare={handleShareIdea}
              onDelete={handleDeleteIdea}
            />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                Your idea "<strong>Smart Home Garden System</strong>" received $500 funding from 3 investors
              </p>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                New comment on "<strong>Blockchain Carbon Credits</strong>" from Sarah Chen
              </p>
              <span className="text-xs text-muted-foreground">4h ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary-purple rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                Your profile gained 5 new followers
              </p>
              <span className="text-xs text-muted-foreground">1d ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
