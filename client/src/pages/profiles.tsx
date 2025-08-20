import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { User, Idea } from "@shared/schema"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { Link } from "wouter"
import { Users, Search, UserPlus, UserCheck, TrendingUp, Lightbulb } from "lucide-react"

interface UserStats {
  ideasCount: number
  followersCount: number
  investmentsCount: number
  totalFunding: number
}

interface UserWithStats extends User {
  stats?: UserStats
  topIdea?: Idea
  avgScore?: number
}

export default function Profiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [compareUsers, setCompareUsers] = useState<string[]>([])
  const { toast } = useToast()

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  })

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user/current"],
  })

  const connectMutation = useMutation({
    mutationFn: async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
      const response = await fetch(`/api/user/${userId}/connect/${targetUserId}`, {
        method: "POST",
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] })
      toast({
        title: "Connected!",
        description: "You are now connected to this user.",
      })
    },
  })

  const disconnectMutation = useMutation({
    mutationFn: async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
      const response = await fetch(`/api/user/${userId}/connect/${targetUserId}`, {
        method: "DELETE",
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] })
      toast({
        title: "Disconnected",
        description: "You have disconnected from this user.",
      })
    },
  })

  // Get user stats and ideas for each user
  const usersWithData = useQuery<UserWithStats[]>({
    queryKey: ["/api/users/with-stats"],
    queryFn: async () => {
      const usersWithStats = await Promise.all(
        users.map(async (user: User) => {
          try {
            const [statsResponse, ideasResponse, connectionResponse] = await Promise.all([
              fetch(`/api/user/${user.id}/stats`).then(r => r.json()),
              fetch(`/api/ideas/user/${user.id}`).then(r => r.json()),
              currentUser ? fetch(`/api/user/${currentUser.id}/connected/${user.id}`).then(r => r.json()) : Promise.resolve({ connected: false })
            ])

            const ideas: Idea[] = ideasResponse || []
            const publicIdeas = ideas.filter((idea: Idea) => idea.status === "public" || idea.status === "investment_open")
            const topIdea = publicIdeas.sort((a: Idea, b: Idea) => (b.likes + b.comments) - (a.likes + a.comments))[0]

            // Calculate average score from AI analysis (mock calculation)
            const avgScore = publicIdeas.length > 0 
              ? Math.round(publicIdeas.reduce((sum: number, idea: Idea) => {
                  // Mock score calculation based on likes, comments, and funding
                  const engagementScore = Math.min(100, (idea.likes * 2 + idea.comments * 3) / 2)
                  const fundingScore = Math.min(100, parseFloat(idea.funding) / 100)
                  return sum + (engagementScore + fundingScore) / 2
                }, 0) / publicIdeas.length)
              : 0

            return {
              ...user,
              stats: statsResponse as UserStats,
              topIdea,
              avgScore,
              isConnected: connectionResponse?.connected || false
            } as UserWithStats
          } catch (error) {
            return {
              ...user,
              stats: { ideasCount: 0, followersCount: 0, investmentsCount: 0, totalFunding: 0 },
              avgScore: 0,
              isConnected: false
            } as UserWithStats
          }
        })
      )
      return usersWithStats
    },
    enabled: users.length > 0,
  })

  const filteredUsers = (usersWithData.data || []).filter((user: UserWithStats) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleConnect = (targetUserId: string, isConnected: boolean) => {
    if (!currentUser) return
    
    if (isConnected) {
      disconnectMutation.mutate({ userId: currentUser.id, targetUserId })
    } else {
      connectMutation.mutate({ userId: currentUser.id, targetUserId })
    }
  }

  const toggleCompare = (userId: string) => {
    setCompareUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else if (prev.length < 3) {
        return [...prev, userId]
      } else {
        toast({
          title: "Maximum reached",
          description: "You can only compare up to 3 profiles at once.",
          variant: "destructive"
        })
        return prev
      }
    })
  }

  const compareSelectedUsers = usersWithData.data?.filter(user => compareUsers.includes(user.id)) || []

  if (isLoading || usersWithData.isLoading) {
    return <div className="p-6">Loading profiles...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center" data-testid="profiles-title">
            <Users className="h-8 w-8 mr-3 text-primary" />
            Network Profiles
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect with innovators and explore their ideas
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{filteredUsers.length}</div>
          <div className="text-sm text-muted-foreground">Active Innovators</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles by name, title, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="search-profiles"
          />
        </div>
        {compareUsers.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              const compareSection = document.getElementById("compare-section")
              compareSection?.scrollIntoView({ behavior: "smooth" })
            }}
            data-testid="view-comparison"
          >
            Compare Selected ({compareUsers.length})
          </Button>
        )}
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user: UserWithStats) => (
          <Card key={user.id} className="card-hover relative" data-testid={`profile-card-${user.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profileImage || undefined} />
                    <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg" data-testid={`profile-name-${user.id}`}>
                      {user.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{user.title}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCompare(user.id)}
                  className={compareUsers.includes(user.id) ? "bg-primary/10 text-primary" : ""}
                  data-testid={`compare-toggle-${user.id}`}
                >
                  {compareUsers.includes(user.id) ? "✓" : "+"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary" data-testid={`ideas-count-${user.id}`}>
                    {user.stats?.ideasCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Ideas</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary" data-testid={`avg-score-${user.id}`}>
                    {user.avgScore || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary" data-testid={`funding-${user.id}`}>
                    ${Math.round(user.stats?.totalFunding || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Funding</div>
                </div>
              </div>

              {/* Top Idea */}
              {user.topIdea && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Top Idea</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-1" data-testid={`top-idea-${user.id}`}>
                    {user.topIdea.title}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <span>❤️ {user.topIdea.likes}</span>
                    <span>💬 {user.topIdea.comments}</span>
                    <span>💰 ${user.topIdea.funding}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link href={`/profile/${user.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" data-testid={`view-profile-${user.id}`}>
                    View Profile
                  </Button>
                </Link>
                {currentUser && user.id !== currentUser.id && (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(user.id, (user as any).isConnected)}
                    className={`${(user as any).isConnected ? "bg-green-100 text-green-700 hover:bg-green-200" : "gradient-primary"}`}
                    data-testid={`connect-button-${user.id}`}
                  >
                    {(user as any).isConnected ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compare Profiles Section */}
      {compareSelectedUsers.length > 1 && (
        <div id="compare-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile Comparison</h2>
            <Button
              variant="ghost"
              onClick={() => setCompareUsers([])}
              data-testid="clear-comparison"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compareSelectedUsers.map((user: UserWithStats) => (
              <Card key={`compare-${user.id}`} className="border-primary/50">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.profileImage || undefined} />
                      <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ideas:</span>
                        <span className="ml-2 font-semibold">{user.stats?.ideasCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Score:</span>
                        <span className="ml-2 font-semibold">{user.avgScore || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Funding:</span>
                        <span className="ml-2 font-semibold">${Math.round(user.stats?.totalFunding || 0)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Connections:</span>
                        <span className="ml-2 font-semibold">{user.stats?.followersCount || 0}</span>
                      </div>
                    </div>
                    {user.topIdea && (
                      <div>
                        <span className="text-xs text-muted-foreground">Top Idea:</span>
                        <p className="text-sm font-medium line-clamp-2 mt-1">{user.topIdea.title}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No profiles found matching your search.</p>
        </div>
      )}
    </div>
  )
}