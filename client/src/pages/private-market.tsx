import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target, Plus, BarChart3 } from "lucide-react";
import { Link } from "wouter";

interface MarketListing {
  id: string;
  userId: string;
  ideaId: string;
  companyName: string;
  description: string;
  totalValuation: string;
  equityPercentage: string;
  pricePerShare: string;
  totalShares: number;
  availableShares: number;
  industry: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserWallet {
  id: string;
  userId: string;
  credits: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string | null;
  listingId: string;
  type: string;
  shares: number;
  pricePerShare: string;
  totalAmount: string;
  status: string;
  createdAt: string;
}

function OverviewCards({ wallet, transactions }: { wallet?: UserWallet; transactions: Transaction[] }) {
  const totalPortfolioValue = transactions
    .filter(tx => tx.type === 'buy')
    .reduce((sum, tx) => sum + parseFloat(tx.totalAmount), 0);

  const totalTransactions = transactions.length;
  const totalShares = transactions
    .filter(tx => tx.type === 'buy')
    .reduce((sum, tx) => sum + tx.shares, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            ${parseFloat(wallet?.credits || "0").toLocaleString()}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Ready for investment
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            ${totalPortfolioValue.toLocaleString()}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +8.2% this month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {totalShares.toLocaleString()}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Across {new Set(transactions.map(tx => tx.listingId)).size} companies
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {totalTransactions}
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            This month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FeaturedListings({ listings }: { listings: MarketListing[] }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Featured Opportunities</CardTitle>
            <CardDescription>
              Curated startup equity offerings
            </CardDescription>
          </div>
          <Link href="/private-market/marketplace">
            <Button variant="outline" size="sm" data-testid="button-view-all-listings">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.slice(0, 6).map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow cursor-pointer" data-testid={`card-listing-${listing.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{listing.companyName}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {listing.industry}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${parseFloat(listing.pricePerShare).toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">per share</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {listing.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valuation:</span>
                    <span className="font-medium">${(parseFloat(listing.totalValuation) / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Equity:</span>
                    <span className="font-medium">{parseFloat(listing.equityPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">{listing.availableShares.toLocaleString()} shares</span>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm" data-testid={`button-invest-${listing.id}`}>
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest market transactions
            </CardDescription>
          </div>
          <Link href="/private-market/transactions">
            <Button variant="outline" size="sm" data-testid="button-view-all-transactions">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start investing to see your activity here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`transaction-${transaction.id}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${transaction.type === 'buy' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {transaction.type === 'buy' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.shares} shares
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${parseFloat(transaction.totalAmount).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    ${parseFloat(transaction.pricePerShare).toFixed(2)}/share
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Get started with the private market
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/private-market/create-listing">
            <Button className="w-full h-20 flex flex-col space-y-2" variant="outline" data-testid="button-create-listing">
              <Plus className="h-6 w-6" />
              <span>List Your Startup</span>
            </Button>
          </Link>
          <Link href="/private-market/marketplace">
            <Button className="w-full h-20 flex flex-col space-y-2" variant="outline" data-testid="button-browse-marketplace">
              <Target className="h-6 w-6" />
              <span>Browse Market</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="w-full h-20 flex flex-col space-y-2" variant="outline" data-testid="button-view-portfolio">
              <BarChart3 className="h-6 w-6" />
              <span>View Portfolio</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PrivateMarket() {
  const { data: wallet } = useQuery<UserWallet>({
    queryKey: ["/api/user/user-1/wallet"],
  });

  const { data: featuredListings = [] } = useQuery<MarketListing[]>({
    queryKey: ["/api/market/listings/featured"],
  });

  const { data: userTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/market/transactions/user/user-1"],
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Private Market</h1>
        <p className="text-muted-foreground">
          Invest in startup equity and manage your portfolio
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewCards wallet={wallet} transactions={userTransactions} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Featured Listings */}
      <FeaturedListings listings={featuredListings} />

      {/* Recent Transactions */}
      <RecentTransactions transactions={userTransactions} />
    </div>
  );
}