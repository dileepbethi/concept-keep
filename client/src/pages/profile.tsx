import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User } from "@shared/schema"
import { apiRequest } from "@/lib/queryClient"
import { queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { Lightbulb, DollarSign, Users, Trophy, Sprout, Rocket, Star, Shield } from "lucide-react"

export default function Profile() {
  const { toast } = useToast()

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/user/current"],
  })

  const { data: userStats } = useQuery<{ ideasCount: number; followersCount: number; investmentsCount: number; totalFunding: number }>({
    queryKey: ["/api/user/user-1/stats"],
  })

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      return apiRequest("PUT", `/api/user/${currentUser?.id}`, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] })
      toast({ title: "Profile updated successfully!" })
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" })
    },
  })

  const handleSecurityToggle = (setting: keyof User, value: boolean) => {
    if (currentUser) {
      updateUserMutation.mutate({ [setting]: value })
    }
  }

  if (isLoading || !currentUser) {
    return <div className="p-6">Loading...</div>
  }

  const activityItems = [
    {
      icon: Lightbulb,
      color: "green",
      title: "Created new idea",
      description: '"AI-Powered Study Assistant" was added to your vault',
      time: "2 hours ago",
    },
    {
      icon: DollarSign,
      color: "blue",
      title: "Received investment",
      description: '"Smart Home Garden System" received $500 from 3 investors',
      time: "1 day ago",
    },
    {
      icon: Users,
      color: "purple",
      title: "New followers",
      description: "5 people started following your vault",
      time: "2 days ago",
    },
    {
      icon: Trophy,
      color: "orange",
      title: "Achievement unlocked",
      description: 'Earned "Eco Investor" badge for supporting green technology',
      time: "3 days ago",
    },
  ]

  const ownedIdeas = [
    {
      title: "Smart Home Garden System",
      createdAt: "March 15, 2024",
      verified: true,
    },
    {
      title: "Blockchain Carbon Credits",
      createdAt: "March 12, 2024",
      verified: true,
    },
  ]

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8">Profile & Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <img
                    src={currentUser.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                    alt="Profile picture"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                    data-testid="img-profile-avatar"
                  />
                  <h3 className="text-xl font-semibold mb-1" data-testid="text-profile-name">
                    {currentUser.name}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid="text-profile-title">
                    {currentUser.title}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                      <p className="text-2xl font-bold text-primary-blue" data-testid="stat-ideas-count">
                        {userStats?.ideasCount || 24}
                      </p>
                      <p className="text-xs text-muted-foreground">Ideas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success" data-testid="stat-followers-count">
                        {userStats?.followersCount || 156}
                      </p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-purple" data-testid="stat-investments-count">
                        {userStats?.investmentsCount || 8}
                      </p>
                      <p className="text-xs text-muted-foreground">Investments</p>
                    </div>
                  </div>

                  <Button className="w-full gradient-primary" data-testid="button-edit-profile">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vault Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Vault Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Private Vault</span>
                  <Switch
                    checked={currentUser.privateVault || false}
                    onCheckedChange={(checked) => handleSecurityToggle("privateVault", checked)}
                    data-testid="switch-private-vault"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Auth</span>
                  <Switch
                    checked={currentUser.twoFactorAuth || false}
                    onCheckedChange={(checked) => handleSecurityToggle("twoFactorAuth", checked)}
                    data-testid="switch-two-factor"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Switch
                    checked={currentUser.emailNotifications || false}
                    onCheckedChange={(checked) => handleSecurityToggle("emailNotifications", checked)}
                    data-testid="switch-notifications"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline & Idea Ownership */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activityItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`activity-${index}`}>
                    <div className={`w-10 h-10 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-full flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 text-${item.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Idea Ownership */}
            <Card>
              <CardHeader>
                <CardTitle>Idea Ownership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ownedIdeas.map((idea, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                    data-testid={`owned-idea-${index}`}
                  >
                    <div>
                      <p className="font-medium text-sm">{idea.title}</p>
                      <p className="text-xs text-muted-foreground">Created: {idea.createdAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {idea.verified && (
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                          Verified
                        </Badge>
                      )}
                      <Shield className="h-4 w-4 text-success" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
