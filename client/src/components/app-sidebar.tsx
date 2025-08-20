import { Home, Lightbulb, Globe, TrendingUp, User, Users, Plus, Building2 } from "lucide-react"
import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "./theme-provider"
import { Sun, Moon } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "My Ideas", href: "/my-ideas", icon: Lightbulb },
  { name: "Public Explorer", href: "/explorer", icon: Globe },
  { name: "Investment", href: "/investment", icon: TrendingUp },
  { name: "Private Market", href: "/private-market", icon: Building2 },
  { name: "Network", href: "/profiles", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
]

export function AppSidebar() {
  const [location] = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Idea Vault</h1>
            <p className="text-xs text-muted-foreground">Innovation Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle & Create Button */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 mr-2" />
          ) : (
            <Sun className="h-4 w-4 mr-2" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
        
        <Link href="/my-ideas">
          <Button className="w-full gradient-primary" data-testid="button-new-idea">
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64"
            alt="User profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium" data-testid="text-username">Alex Johnson</p>
            <p className="text-xs text-muted-foreground">Innovator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
