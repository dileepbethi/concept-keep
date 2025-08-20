import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TrendingUp, Filter, Search, DollarSign, Target, Building2 } from "lucide-react";

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

function InvestDialog({ listing, wallet }: { listing: MarketListing; wallet?: UserWallet }) {
  const [shares, setShares] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const totalCost = shares * parseFloat(listing.pricePerShare);
  const canAfford = wallet ? parseFloat(wallet.credits) >= totalCost : false;
  const maxShares = Math.min(
    listing.availableShares,
    wallet ? Math.floor(parseFloat(wallet.credits) / parseFloat(listing.pricePerShare)) : 0
  );

  const investMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/market/transactions", {
        buyerId: "user-1",
        listingId: listing.id,
        type: "buy",
        shares,
        pricePerShare: listing.pricePerShare,
      });
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful!",
        description: `You've purchased ${shares} shares in ${listing.companyName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/market/transactions/user/user-1"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/user-1/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/market/listings"] });
      setIsOpen(false);
      setShares(1);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Investment Failed",
        description: error.message || "Unable to complete the transaction",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" data-testid={`button-invest-${listing.id}`}>
          Invest Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in {listing.companyName}</DialogTitle>
          <DialogDescription>
            Purchase equity shares at ${parseFloat(listing.pricePerShare).toFixed(2)} per share
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              max={maxShares}
              value={shares}
              onChange={(e) => setShares(Math.max(1, Math.min(maxShares, parseInt(e.target.value) || 1)))}
              data-testid="input-shares"
            />
            <p className="text-sm text-muted-foreground">
              Maximum: {maxShares.toLocaleString()} shares (${(maxShares * parseFloat(listing.pricePerShare)).toLocaleString()} total)
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span className="font-medium">${totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Available Credits:</span>
              <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                ${parseFloat(wallet?.credits || "0").toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => investMutation.mutate()}
            disabled={!canAfford || shares < 1 || shares > maxShares || investMutation.isPending}
            className="w-full"
            data-testid="button-confirm-investment"
          >
            {investMutation.isPending ? "Processing..." : `Invest $${totalCost.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ListingCard({ listing, wallet }: { listing: MarketListing; wallet?: UserWallet }) {
  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-listing-${listing.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{listing.companyName}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {listing.industry}
            </Badge>
            {listing.featured && (
              <Badge variant="default" className="ml-2">
                Featured
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${parseFloat(listing.pricePerShare).toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">per share</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {listing.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valuation:</span>
              <span className="font-medium">${(parseFloat(listing.totalValuation) / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Equity:</span>
              <span className="font-medium">{parseFloat(listing.equityPercentage).toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium">{listing.availableShares.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Shares:</span>
              <span className="font-medium">{listing.totalShares.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Investment Required:</span>
            <span className="font-bold text-lg">
              ${(listing.availableShares * parseFloat(listing.pricePerShare)).toLocaleString()}
            </span>
          </div>
        </div>

        <InvestDialog listing={listing} wallet={wallet} />
      </CardContent>
    </Card>
  );
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: listings = [] } = useQuery<MarketListing[]>({
    queryKey: ["/api/market/listings", { industry: industryFilter || undefined }],
  });

  const { data: wallet } = useQuery<UserWallet>({
    queryKey: ["/api/user/user-1/wallet"],
  });

  // Filter and sort listings
  const filteredListings = listings
    .filter(listing => 
      listing.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "valuation-high":
          return parseFloat(b.totalValuation) - parseFloat(a.totalValuation);
        case "valuation-low":
          return parseFloat(a.totalValuation) - parseFloat(b.totalValuation);
        case "price-high":
          return parseFloat(b.pricePerShare) - parseFloat(a.pricePerShare);
        case "price-low":
          return parseFloat(a.pricePerShare) - parseFloat(b.pricePerShare);
        default:
          return 0;
      }
    });

  const industries = Array.from(new Set(listings.map(listing => listing.industry)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and invest in innovative startup opportunities
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Companies</Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-companies"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger data-testid="select-industry">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="valuation-high">Highest Valuation</SelectItem>
                  <SelectItem value="valuation-low">Lowest Valuation</SelectItem>
                  <SelectItem value="price-high">Highest Share Price</SelectItem>
                  <SelectItem value="price-low">Lowest Share Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Available Credits</Label>
              <div className="flex items-center space-x-2 h-10 px-3 border rounded-md bg-muted">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  ${parseFloat(wallet?.credits || "0").toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              {searchTerm || industryFilter 
                ? "Try adjusting your search criteria"
                : "Be the first to list your startup on the marketplace!"
              }
            </p>
          </div>
        ) : (
          filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} wallet={wallet} />
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredListings.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredListings.length} of {listings.length} listings
        </div>
      )}
    </div>
  );
}