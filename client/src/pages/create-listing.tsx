import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Building2, DollarSign, Percent, Target, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

interface Idea {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  status: string;
}

const createListingSchema = z.object({
  ideaId: z.string().min(1, "Please select an idea"),
  companyName: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  totalValuation: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 1000000000;
  }, "Valuation must be a positive number up to $1B"),
  equityPercentage: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 100;
  }, "Equity percentage must be between 0 and 100"),
  pricePerShare: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 10000;
  }, "Price per share must be a positive number up to $10,000"),
  totalShares: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0 && num <= 10000000;
  }, "Total shares must be a positive integer up to 10 million"),
  industry: z.string().min(1, "Please select an industry"),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

const industries = [
  "Technology",
  "Healthcare",
  "FinTech",
  "Environment",
  "Education",
  "E-commerce",
  "Social Impact",
  "Entertainment",
  "Food & Beverage",
  "Real Estate",
  "Transportation",
  "Manufacturing",
];

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: userIdeas = [] } = useQuery<Idea[]>({
    queryKey: ["/api/ideas/user/user-1"],
  });

  const form = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      ideaId: "",
      companyName: "",
      description: "",
      totalValuation: "",
      equityPercentage: "",
      pricePerShare: "",
      totalShares: "",
      industry: "",
    },
  });

  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      return apiRequest("POST", "/api/market/listings", {
        userId: "user-1",
        ideaId: data.ideaId,
        companyName: data.companyName,
        description: data.description,
        totalValuation: data.totalValuation,
        equityPercentage: data.equityPercentage,
        pricePerShare: data.pricePerShare,
        totalShares: parseInt(data.totalShares),
        industry: data.industry,
      });
    },
    onSuccess: () => {
      toast({
        title: "Listing Created Successfully!",
        description: "Your startup equity is now available on the marketplace",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/market/listings"] });
      setLocation("/private-market");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to Create Listing",
        description: error.message || "Please try again",
      });
    },
  });

  const onSubmit = (data: CreateListingForm) => {
    createListingMutation.mutate(data);
  };

  // Calculate derived values
  const watchedValues = form.watch();
  const totalValuation = parseFloat(watchedValues.totalValuation) || 0;
  const equityPercentage = parseFloat(watchedValues.equityPercentage) || 0;
  const totalShares = parseInt(watchedValues.totalShares) || 0;
  const pricePerShare = parseFloat(watchedValues.pricePerShare) || 0;

  const equityValue = (totalValuation * equityPercentage) / 100;
  const totalRaiseAmount = totalShares * pricePerShare;
  const impliedValuation = totalShares > 0 ? (totalRaiseAmount * 100) / equityPercentage : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <Link href="/private-market">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Private Market
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">List Your Startup</h1>
        <p className="text-muted-foreground">
          Create an equity listing to raise capital from the community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Listing Details
              </CardTitle>
              <CardDescription>
                Provide comprehensive information about your startup and equity offering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Idea Selection */}
                  <FormField
                    control={form.control}
                    name="ideaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Your Idea</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-idea">
                              <SelectValue placeholder="Choose an idea from your vault" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userIdeas.map((idea) => (
                              <SelectItem key={idea.id} value={idea.id}>
                                {idea.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the idea you want to create a marketplace listing for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., TechStartup Inc." {...field} data-testid="input-company-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-industry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your startup, its mission, and what makes it unique..."
                            className="min-h-[100px]"
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a compelling description that will attract investors (10-500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Financial Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalValuation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Company Valuation ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 5000000"
                              {...field}
                              data-testid="input-valuation"
                            />
                          </FormControl>
                          <FormDescription>
                            Your company's total estimated value
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equityPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equity Percentage (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="e.g., 10.5"
                              {...field}
                              data-testid="input-equity"
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage of equity to offer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalShares"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Shares</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 1000"
                              {...field}
                              data-testid="input-total-shares"
                            />
                          </FormControl>
                          <FormDescription>
                            Number of shares to create
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricePerShare"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Share ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="e.g., 250.00"
                              {...field}
                              data-testid="input-price-per-share"
                            />
                          </FormControl>
                          <FormDescription>
                            Price for each individual share
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createListingMutation.isPending}
                    className="w-full"
                    data-testid="button-create-listing"
                  >
                    {createListingMutation.isPending ? "Creating Listing..." : "Create Listing"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Company Valuation:</span>
                  <span className="font-medium">${totalValuation.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Equity Value:</span>
                  <span className="font-medium">${equityValue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Raise Amount:</span>
                  <span className="font-medium text-green-600">${totalRaiseAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price per Share:</span>
                  <span className="font-medium">${pricePerShare.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Shares:</span>
                  <span className="font-medium">{totalShares.toLocaleString()}</span>
                </div>
              </div>
              
              {impliedValuation > 0 && Math.abs(impliedValuation - totalValuation) > totalValuation * 0.01 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Notice:</strong> Your implied valuation (${impliedValuation.toLocaleString()}) differs from stated valuation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Ensure your idea is well-developed and has clear value proposition</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Set realistic valuations based on market research</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Provide transparent and accurate financial projections</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Respond promptly to investor inquiries</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}