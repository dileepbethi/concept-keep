import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, Sprout, Rocket, Star } from "lucide-react"
import { Investment, Idea } from "@shared/schema"

export default function InvestmentDashboard() {
  const { data: userInvestments = [], isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments/user/user-1"],
  })

  const { data: publicIdeas = [], isLoading: ideasLoading } = useQuery<Idea[]>({
    queryKey: ["/api/ideas/public"],
  })

  if (investmentsLoading || ideasLoading) {
    return <div className="p-6">Loading...</div>
  }

  // Top performing ideas (mock data for demo)
  const topPerformers = publicIdeas
    .sort((a, b) => parseFloat(b.funding || "0") - parseFloat(a.funding || "0"))
    .slice(0, 3)

  const badges = [
    { name: "Early Adopter", description: "First 10 investors", icon: Award, color: "yellow" },
    { name: "Eco Investor", description: "Green tech focus", icon: Sprout, color: "green" },
    { name: "Tech Pioneer", description: "AI/ML investments", icon: Rocket, color: "blue" },
    { name: "Top Contributor", description: "$1000+ invested", icon: Star, color: "purple" },
  ]

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-8">Investment Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Investment Performance Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-primary-blue mx-auto mb-4" />
                  <p className="text-muted-foreground">Funding Chart Visualization</p>
                  <p className="text-sm text-muted-foreground">Chart.js integration needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Ideas */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((idea) => (
              <div key={idea.id} className="flex items-center justify-between" data-testid={`top-performer-${idea.id}`}>
                <div>
                  <p className="font-medium text-sm">{idea.title}</p>
                  <p className="text-xs text-muted-foreground">{idea.investorCount} investors</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">${idea.funding}</p>
                  <p className="text-xs text-success">+12.5%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Investment Portfolio & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Investments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userInvestments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No investments yet.</p>
            ) : (
              userInvestments.map((investment) => (
                <div key={investment.id} className="border rounded-xl p-4" data-testid={`investment-${investment.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Investment #{investment.id.slice(-6)}</h4>
                    <span className="text-sm font-semibold text-success">${investment.amount}</span>
                  </div>
                  <Progress value={75} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>ROI: +{investment.roi}%</span>
                    <span>Active</span>
                  </div>
                </div>
              ))
            )}
            
            {/* Mock investments for demo */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Smart Home Garden System</h4>
                <span className="text-sm font-semibold text-success">$500</span>
              </div>
              <Progress value={75} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>ROI: +15%</span>
                <span>$2,400 raised</span>
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Blockchain Carbon Credits</h4>
                <span className="text-sm font-semibold text-success">$300</span>
              </div>
              <Progress value={60} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>ROI: +8%</span>
                <span>$8,200 raised</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investor Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-gradient-to-br from-${badge.color}-50 to-${badge.color}-100 dark:from-${badge.color}-900/20 dark:to-${badge.color}-900/30 rounded-xl`}
                  data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <badge.icon className={`h-8 w-8 text-${badge.color}-600 mx-auto mb-2`} />
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
