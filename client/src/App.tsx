import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/dashboard";
import MyIdeas from "@/pages/my-ideas";
import Explorer from "@/pages/explorer";
import Investment from "@/pages/investment";
import PrivateMarket from "@/pages/private-market";
import Marketplace from "@/pages/marketplace";
import CreateListing from "@/pages/create-listing";
import Profile from "@/pages/profile";
import Profiles from "@/pages/profiles";
import ProfileDetail from "@/pages/profile-detail";
import CalculatorPage from "@/pages/calculator";
import NotFound from "@/pages/not-found";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function TopNavigation({ title }: { title: string }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search ideas..."
            className="w-80 pl-10 pr-4 py-2 bg-muted border-0 rounded-xl focus:ring-2 focus:ring-primary"
            data-testid="input-search"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}

function Router() {
  const routes = [
    { path: "/", component: Dashboard, title: "Dashboard" },
    { path: "/my-ideas", component: MyIdeas, title: "My Ideas" },
    { path: "/explorer", component: Explorer, title: "Public Explorer" },
    { path: "/investment", component: Investment, title: "Investment Dashboard" },
    { path: "/private-market", component: PrivateMarket, title: "Private Market" },
    { path: "/private-market/marketplace", component: Marketplace, title: "Marketplace" },
    { path: "/private-market/create-listing", component: CreateListing, title: "Create Listing" },
    { path: "/calculator", component: CalculatorPage, title: "Calculator" },
    { path: "/profiles", component: Profiles, title: "Network Profiles" },
    { path: "/profile/:id", component: ProfileDetail, title: "Profile Details" },
    { path: "/profile", component: Profile, title: "Profile & Settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          {routes.map(({ path, component: Component, title }) => (
            <Route key={path} path={path}>
              <TopNavigation title={title} />
              <main className="flex-1 overflow-auto">
                <Component />
              </main>
            </Route>
          ))}
          <Route>
            <TopNavigation title="404 - Not Found" />
            <main className="flex-1 overflow-auto">
              <NotFound />
            </main>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
