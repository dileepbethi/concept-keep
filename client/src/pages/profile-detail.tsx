import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useParams } from "wouter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { IdeaCard } from "@/components/idea-card"
import { IdeaAnalysisDrawer } from "@/components/idea-analysis-drawer"
import { User, Idea } from "@shared/schema"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  UserPlus, 
  UserCheck, 
  Mail, 
  Calendar,
  TrendingUp,
  Lightbulb,
  DollarSign,
  Users
} from "lucide-react"
import { Link } from "wouter"

interface UserStats {
  ideasCount: number
  followersCount: number
  investmentsCount: number
  totalFunding: number
}

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>()
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const { toast } = useToast()

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user", id],
    enabled: !!id,
  })

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/user", id, "stats"],
    enabled: !!id,
  })

  const { data: userIdeas = [] } = useQuery<Idea[]>({
    queryKey: ["/api/ideas/user", id],
    enabled: !!id,
  })

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user/current"],
  })

  const { data: connectionStatus } = useQuery<{ connected: boolean }>({
    queryKey: ["/api/user", currentUser?.id, "connected", id],
    enabled: !!currentUser && !!id && currentUser.id !== id,
  })

  const { data: connections = [] } = useQuery<User[]>({
    queryKey: ["/api/user", id, "connections"],
    enabled: !!id,
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
        description: `You are now connected to ${user?.name}.`,
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
        description: `You have disconnected from ${user?.name}.`,
      })
    },
  })

  const handleConnect = () => {
    if (!currentUser || !user) return
    
    const isConnected = connectionStatus?.connected || false
    if (isConnected) {
      disconnectMutation.mutate({ userId: currentUser.id, targetUserId: user.id })
    } else {
      connectMutation.mutate({ userId: currentUser.id, targetUserId: user.id })
    }
  }

  const handleAnalyzeIdea = (ideaId: string) => {
    const idea = userIdeas.find(i => i.id === ideaId)
    if (idea) {
      setSelectedIdea(idea)
      setAnalysisOpen(true)
    }
  }

  if (userLoading) {
    return <div className="p-6">Loading profile...</div>
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-muted-foreground">Profile not found</h1>
        <Link href="/profiles">
          <Button className="mt-4">Back to Profiles</Button>
        </Link>
      </div>
    )
  }

  const publicIdeas = userIdeas.filter(idea => idea.status === "public" || idea.status === "investment_open")
  const isOwnProfile = currentUser?.id === user.id
  const isConnected = connectionStatus?.connected || false

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Link href="/profiles">
          <Button variant="ghost" size="sm" data-testid="back-to-profiles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profiles
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profileImage || undefined} />
              <AvatarFallback className="text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold" data-testid="profile-name">
                {user.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-2">{user.title}</p>
              <p className="text-muted-foreground mb-4">{user.bio}</p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {!isOwnProfile && currentUser && (
                <Button
                  onClick={handleConnect}
                  className={isConnected ? "bg-green-100 text-green-700 hover:bg-green-200" : "gradient-primary"}
                  data-testid="connect-button"
                >
                  {isConnected ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Connected
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary" data-testid="ideas-stat">
              {userStats?.ideasCount || 0}
            </div>
            <div className="text-sm text-muted-foreground">Ideas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary" data-testid="connections-stat">
              {connections.length}
            </div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary" data-testid="funding-stat">
              ${Math.round(userStats?.totalFunding || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Funding</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary" data-testid="public-ideas-stat">
              {publicIdeas.length}
            </div>
            <div className="text-sm text-muted-foreground">Public Ideas</div>
          </CardContent>
        </Card>
      </div>

      {/* Connections Section */}
      {connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connections ({connections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {connections.slice(0, 12).map((connection) => (
                <Link key={connection.id} href={`/profile/${connection.id}`}>
                  <div className="text-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="mx-auto">
                      <AvatarImage src={connection.profileImage || undefined} />
                      <AvatarFallback>
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{connection.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{connection.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {connections.length > 12 && (
              <div className="text-center mt-4">
                <Button variant="outline" size="sm">
                  View All Connections
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ideas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isOwnProfile ? "My Ideas" : `${user.name}'s Ideas`} ({publicIdeas.length})
          </h2>
        </div>

        {publicIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onAnalyze={handleAnalyzeIdea}
                showActions={false}
                isPublic={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isOwnProfile ? "You haven't published any ideas yet." : `${user.name} hasn't published any ideas yet.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <IdeaAnalysisDrawer 
        idea={selectedIdea}
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
      />
    </div>
  )
}