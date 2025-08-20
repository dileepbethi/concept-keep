import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  Users, 
  Target, 
  Shield, 
  Zap, 
  BookOpen, 
  Award,
  Share,
  Save,
  BarChart3,
  PieChart
} from "lucide-react"
import { Idea } from "@shared/schema"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

interface IdeaAnalysisProps {
  idea: Idea
}

// Mock AI analysis data generator
const generateAnalysis = (idea: Idea) => {
  const analyses: Record<string, any> = {
    "idea-1": {
      problemDefinition: {
        summary: "Urban dwellers face significant challenges in maintaining healthy gardens due to time constraints, lack of expertise, and inconsistent care routines.",
        marketGap: "Current solutions are either too expensive, overly complex, or don't integrate seamlessly with busy urban lifestyles.",
        painPoints: [
          "73% of urban dwellers want to grow their own food but lack gardening knowledge",
          "Average person checks on plants only 2-3 times per week",
          "60% of home gardens fail due to over/under-watering",
          "Limited space and poor lighting in urban environments"
        ]
      },
      solutionUniqueness: {
        coreValue: "Fully autonomous IoT system that learns plant behaviors and adapts care routines automatically.",
        differentiators: [
          "Machine learning algorithms that adapt to specific plant species and environmental conditions",
          "Integration with smart home ecosystems (Alexa, Google Home)",
          "Community marketplace for sharing growing tips and plant exchanges",
          "Predictive analytics for harvest timing and yield optimization"
        ],
        competitiveAdvantage: "Only solution combining AI-driven plant care with social community features."
      },
      marketSize: {
        tam: "$47.8B Global Smart Agriculture Market",
        sam: "$8.2B Urban Farming & Home Gardening Segment", 
        som: "$180M Addressable IoT Garden Solutions Market",
        growthRate: "23.1% CAGR through 2028",
        keyTrends: [
          "Increasing urbanization driving demand for compact growing solutions",
          "Growing health consciousness and desire for organic produce",
          "Rising adoption of IoT devices in households"
        ]
      },
      competitors: [
        { name: "Click & Grow", marketShare: 15, strength: "Brand Recognition", weakness: "Limited AI features" },
        { name: "AeroGarden", marketShare: 25, strength: "Retail Distribution", weakness: "No Mobile Integration" },
        { name: "Farmbot", marketShare: 8, strength: "Open Source", weakness: "Complex Setup" },
        { name: "Tower Garden", marketShare: 12, strength: "Commercial Focus", weakness: "High Price Point" }
      ],
      revenueModels: [
        { model: "Hardware Sales", potential: "High", timeline: "Immediate", description: "Primary IoT device and sensor sales" },
        { model: "Subscription Service", potential: "Very High", timeline: "6 months", description: "Monthly premium features and analytics" },
        { model: "Marketplace Commission", potential: "Medium", timeline: "12 months", description: "Commission on plant/seed sales through platform" },
        { model: "Data Licensing", potential: "High", timeline: "18 months", description: "Agricultural insights to research institutions" }
      ],
      risks: [
        { risk: "Hardware Reliability", impact: "High", mitigation: "Extensive testing and 2-year warranty program" },
        { risk: "Market Saturation", impact: "Medium", mitigation: "Focus on premium AI features and community building" },
        { risk: "Seasonal Demand", impact: "Medium", mitigation: "Indoor growing focus and year-round marketing" },
        { risk: "Technology Adoption", impact: "Low", mitigation: "Simple setup process and comprehensive onboarding" }
      ],
      growthPotential: {
        shortTerm: "Capture 2% market share in premium IoT gardening segment within 18 months",
        mediumTerm: "Expand to commercial urban farming partnerships and international markets",
        longTerm: "Platform becomes the leading ecosystem for urban agriculture with 1M+ active users",
        scalabilityScore: 85
      },
      investorSummary: {
        keyMetrics: {
          projectedRevenue: "$2.4M Year 1, $12M Year 3",
          grossMargin: "68%",
          customerAcquisitionCost: "$47",
          lifetimeValue: "$340",
          timeToBreakeven: "14 months"
        },
        fundingNeeds: "$850K Seed Round",
        useOfFunds: "45% Product Development, 30% Marketing, 15% Hiring, 10% Operations"
      }
    }
  }

  // Default analysis for other ideas
  const defaultAnalysis = {
    problemDefinition: {
      summary: "This innovative solution addresses a significant market gap with clear value proposition.",
      marketGap: "Current market solutions lack comprehensive approach to solving core user problems.",
      painPoints: [
        "Users struggle with existing solutions that are fragmented",
        "High cost of current alternatives limits market adoption", 
        "Poor user experience in current market offerings",
        "Lack of integration with modern technology stacks"
      ]
    },
    solutionUniqueness: {
      coreValue: "Revolutionary approach combining cutting-edge technology with user-centric design.",
      differentiators: [
        "Proprietary technology stack with competitive moats",
        "Superior user experience through intuitive design",
        "Strong network effects and community features",
        "Data-driven insights and personalization capabilities"
      ],
      competitiveAdvantage: "First-mover advantage in emerging market segment with strong execution."
    },
    marketSize: {
      tam: "$25.4B Total Addressable Market",
      sam: "$4.1B Serviceable Addressable Market",
      som: "$120M Serviceable Obtainable Market", 
      growthRate: "18.5% CAGR through 2028",
      keyTrends: [
        "Digital transformation driving adoption",
        "Increasing consumer demand for innovative solutions",
        "Regulatory changes creating new opportunities"
      ]
    },
    competitors: [
      { name: "Competitor A", marketShare: 20, strength: "Market Leader", weakness: "Legacy Technology" },
      { name: "Competitor B", marketShare: 15, strength: "Strong Funding", weakness: "Poor UX" },
      { name: "Competitor C", marketShare: 10, strength: "Low Cost", weakness: "Limited Features" }
    ],
    revenueModels: [
      { model: "Subscription", potential: "High", timeline: "Immediate", description: "Recurring monthly subscription revenue" },
      { model: "Transaction Fees", potential: "Medium", timeline: "6 months", description: "Commission on platform transactions" },
      { model: "Premium Features", potential: "High", timeline: "12 months", description: "Advanced feature upsells" }
    ],
    risks: [
      { risk: "Market Competition", impact: "Medium", mitigation: "Strong product differentiation and customer loyalty" },
      { risk: "Technology Risk", impact: "Low", mitigation: "Proven technology stack and experienced team" },
      { risk: "Regulatory Changes", impact: "Medium", mitigation: "Proactive compliance and legal framework" }
    ],
    growthPotential: {
      shortTerm: "Establish market presence and build customer base",
      mediumTerm: "Scale operations and expand to new markets",
      longTerm: "Become industry leader with dominant market position",
      scalabilityScore: 78
    },
    investorSummary: {
      keyMetrics: {
        projectedRevenue: "$1.2M Year 1, $8.5M Year 3",
        grossMargin: "72%",
        customerAcquisitionCost: "$38",
        lifetimeValue: "$285",
        timeToBreakeven: "16 months"
      },
      fundingNeeds: "$650K Seed Round",
      useOfFunds: "40% Product Development, 35% Marketing, 15% Hiring, 10% Operations"
    }
  }

  return analyses[idea.id] || defaultAnalysis
}

// Mock market growth data
const marketGrowthData = [
  { year: '2023', market: 2.8, competition: 2.1 },
  { year: '2024', market: 3.4, competition: 2.3 },
  { year: '2025', market: 4.2, competition: 2.6 },
  { year: '2026', market: 5.1, competition: 2.8 },
  { year: '2027', market: 6.3, competition: 3.0 },
  { year: '2028', market: 7.8, competition: 3.2 }
]

// Scorecard data
const generateScorecard = (idea: Idea) => {
  const scorecards: Record<string, any> = {
    "idea-1": [
      { metric: 'Value', score: 92, fullMark: 100 },
      { metric: 'Execution', score: 78, fullMark: 100 },
      { metric: 'Scalability', score: 85, fullMark: 100 },
      { metric: 'Risk', score: 68, fullMark: 100 }
    ]
  }
  
  return scorecards[idea.id] || [
    { metric: 'Value', score: 82, fullMark: 100 },
    { metric: 'Execution', score: 74, fullMark: 100 },
    { metric: 'Scalability', score: 78, fullMark: 100 },
    { metric: 'Risk', score: 71, fullMark: 100 }
  ]
}

export function IdeaAnalysis({ idea }: IdeaAnalysisProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const analysis = generateAnalysis(idea)
  const scorecard = generateScorecard(idea)

  const overallScore = Math.round(scorecard.reduce((acc: number, curr: any) => acc + curr.score, 0) / scorecard.length)

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "market", label: "Market Analysis", icon: TrendingUp },
    { id: "competition", label: "Competition", icon: Users },
    { id: "revenue", label: "Revenue Model", icon: Target },
    { id: "risks", label: "Risk Assessment", icon: Shield }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Scorecard */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2" data-testid="analysis-title">{idea.title}</h2>
          <p className="text-muted-foreground mb-4">{idea.description}</p>
          <div className="flex items-center space-x-4">
            <Badge className="status-badge status-investment">AI Analysis Complete</Badge>
            <span className="text-sm text-muted-foreground">Generated just now</span>
          </div>
        </div>
        <Card className="w-48">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-sm">Idea Score</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-blue mb-2" data-testid="overall-score">
                {overallScore}/100
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {scorecard.map((item: any) => (
                  <div key={item.metric} className="text-center">
                    <div className="font-medium">{item.score}</div>
                    <div className="text-muted-foreground">{item.metric}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button className="gradient-primary" data-testid="button-save-analysis">
          <Save className="h-4 w-4 mr-2" />
          Save to Profile
        </Button>
        <Button variant="outline" data-testid="button-share-investors">
          <Share className="h-4 w-4 mr-2" />
          Share to Investors
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem Definition */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Definition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{analysis.problemDefinition.summary}</p>
                <div>
                  <h4 className="font-medium mb-2">Market Gap</h4>
                  <p className="text-sm text-muted-foreground">{analysis.problemDefinition.marketGap}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Pain Points</h4>
                  <ul className="space-y-1">
                    {analysis.problemDefinition.painPoints.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Solution & Uniqueness */}
            <Card>
              <CardHeader>
                <CardTitle>Solution & Uniqueness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Core Value Proposition</h4>
                  <p className="text-sm text-muted-foreground">{analysis.solutionUniqueness.coreValue}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Differentiators</h4>
                  <ul className="space-y-1">
                    {analysis.solutionUniqueness.differentiators.map((diff: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <Zap className="h-3 w-3 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        {diff}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <h4 className="font-medium text-primary mb-1">Competitive Advantage</h4>
                  <p className="text-sm">{analysis.solutionUniqueness.competitiveAdvantage}</p>
                </div>
              </CardContent>
            </Card>

            {/* Growth Potential */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Growth Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Short Term (0-18 months)</h4>
                    <p className="text-sm text-muted-foreground">{analysis.growthPotential.shortTerm}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Medium Term (18-36 months)</h4>
                    <p className="text-sm text-muted-foreground">{analysis.growthPotential.mediumTerm}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Long Term (3+ years)</h4>
                    <p className="text-sm text-muted-foreground">{analysis.growthPotential.longTerm}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Scalability Score</span>
                    <span className="text-sm font-bold">{analysis.growthPotential.scalabilityScore}/100</span>
                  </div>
                  <Progress value={analysis.growthPotential.scalabilityScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "market" && (
          <div className="space-y-6">
            {/* Market Size */}
            <Card>
              <CardHeader>
                <CardTitle>Market Size Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-primary-blue mb-1">{analysis.marketSize.tam}</div>
                    <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-primary-purple mb-1">{analysis.marketSize.sam}</div>
                    <div className="text-sm text-muted-foreground">Serviceable Addressable Market</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-success mb-1">{analysis.marketSize.som}</div>
                    <div className="text-sm text-muted-foreground">Serviceable Obtainable Market</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Growth Rate: {analysis.marketSize.growthRate}</h4>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Key Market Trends</h4>
                    <ul className="space-y-1">
                      {analysis.marketSize.keyTrends.map((trend: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <TrendingUp className="h-3 w-3 text-success mt-0.5 mr-2 flex-shrink-0" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Market Growth Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="market" stroke="hsl(var(--primary-blue))" strokeWidth={3} name="Market Size ($B)" />
                      <Line type="monotone" dataKey="competition" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Competition ($B)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "competition" && (
          <div className="space-y-6">
            {/* Competitor Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.competitors.map((competitor: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{competitor.name}</h4>
                        <Badge variant="secondary">{competitor.marketShare}% Market Share</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Strength:</span>
                          <span className="ml-2 text-success">{competitor.strength}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weakness:</span>
                          <span className="ml-2 text-destructive">{competitor.weakness}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitive Scorecard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Competitive Position Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={scorecard}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={45} domain={[0, 100]} />
                      <Radar name="Your Idea" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "revenue" && (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.revenueModels.map((model: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{model.model}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={model.potential === "Very High" ? "default" : model.potential === "High" ? "secondary" : "outline"}>
                          {model.potential} Potential
                        </Badge>
                        <Badge variant="outline">{model.timeline}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "risks" && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.risks.map((risk: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{risk.risk}</h4>
                      <Badge variant={risk.impact === "High" ? "destructive" : risk.impact === "Medium" ? "secondary" : "outline"}>
                        {risk.impact} Impact
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Mitigation: </span>
                      <span className="text-sm">{risk.mitigation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Investor Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Investor-Friendly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Key Financial Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projected Revenue:</span>
                  <span className="font-medium">{analysis.investorSummary.keyMetrics.projectedRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Margin:</span>
                  <span className="font-medium">{analysis.investorSummary.keyMetrics.grossMargin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Acquisition Cost:</span>
                  <span className="font-medium">{analysis.investorSummary.keyMetrics.customerAcquisitionCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lifetime Value:</span>
                  <span className="font-medium">{analysis.investorSummary.keyMetrics.lifetimeValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time to Breakeven:</span>
                  <span className="font-medium">{analysis.investorSummary.keyMetrics.timeToBreakeven}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Funding Requirements</h4>
              <div className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                  <div className="text-xl font-bold text-primary mb-1">{analysis.investorSummary.fundingNeeds}</div>
                  <div className="text-sm text-muted-foreground">Seed Round</div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-sm">Use of Funds</h5>
                  <p className="text-sm text-muted-foreground">{analysis.investorSummary.useOfFunds}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}