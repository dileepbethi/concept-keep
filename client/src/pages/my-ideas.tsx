import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { insertIdeaSchema, Idea } from "@shared/schema"
import { apiRequest } from "@/lib/queryClient"
import { queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { IdeaCard } from "@/components/idea-card"
import { z } from "zod"

const ideaFormSchema = insertIdeaSchema.extend({
  tags: z.string(),
})

type IdeaFormData = z.infer<typeof ideaFormSchema>

export default function MyIdeas() {
  const [showEditor, setShowEditor] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const { toast } = useToast()

  const { data: userIdeas = [], isLoading } = useQuery<Idea[]>({
    queryKey: ["/api/ideas/user/user-1"],
  })

  const createIdeaMutation = useMutation({
    mutationFn: async (data: Omit<IdeaFormData, "tags"> & { tags: string[] }) => {
      return apiRequest("POST", "/api/ideas", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/user/user-1"] })
      queryClient.invalidateQueries({ queryKey: ["/api/user/user-1/stats"] })
      setShowEditor(false)
      setEditingIdea(null)
      toast({ title: "Idea created successfully!" })
    },
    onError: () => {
      toast({ title: "Failed to create idea", variant: "destructive" })
    },
  })

  const updateIdeaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Idea> }) => {
      return apiRequest("PUT", `/api/ideas/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/user/user-1"] })
      setShowEditor(false)
      setEditingIdea(null)
      toast({ title: "Idea updated successfully!" })
    },
    onError: () => {
      toast({ title: "Failed to update idea", variant: "destructive" })
    },
  })

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/ideas/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/user/user-1"] })
      queryClient.invalidateQueries({ queryKey: ["/api/user/user-1/stats"] })
      toast({ title: "Idea deleted successfully!" })
    },
    onError: () => {
      toast({ title: "Failed to delete idea", variant: "destructive" })
    },
  })

  const form = useForm<IdeaFormData>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Technology",
      problemStatement: "",
      solution: "",
      targetAudience: "",
      tags: "",
      status: "draft",
    },
  })

  const onSubmit = (data: IdeaFormData) => {
    const tagsArray = data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    const ideaData = {
      ...data,
      tags: tagsArray,
    }

    if (editingIdea) {
      updateIdeaMutation.mutate({ id: editingIdea.id, data: ideaData })
    } else {
      createIdeaMutation.mutate(ideaData)
    }
  }

  const handleEditIdea = (id: string) => {
    const idea = userIdeas.find(i => i.id === id)
    if (idea) {
      setEditingIdea(idea)
      form.reset({
        title: idea.title,
        description: idea.description,
        category: idea.category,
        problemStatement: idea.problemStatement || "",
        solution: idea.solution || "",
        targetAudience: idea.targetAudience || "",
        tags: idea.tags?.join(", ") || "",
        status: idea.status,
      })
      setShowEditor(true)
    }
  }

  const handleDeleteIdea = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      deleteIdeaMutation.mutate(id)
    }
  }

  const handleNewIdea = () => {
    setEditingIdea(null)
    form.reset()
    setShowEditor(true)
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (showEditor) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{editingIdea ? "Edit Idea" : "Create New Idea"}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your idea title..." {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Technology">Technology</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Environment">Environment</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                            placeholder="Brief description of your idea..."
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="problemStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Statement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the problem your idea solves..."
                            rows={4}
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-problem"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="solution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solution</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain your solution in detail..."
                            rows={6}
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-solution"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Who is this idea for? (e.g., students, professionals, elderly...)"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-audience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add tags separated by commas (e.g., AI, healthcare, mobile app...)"
                            {...field}
                            data-testid="input-tags"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <Checkbox 
                                checked={field.value === "draft"}
                                onCheckedChange={(checked) => checked && field.onChange("draft")}
                                data-testid="checkbox-draft"
                              />
                              <span className="ml-2 text-sm">Save as draft</span>
                            </label>
                            <label className="flex items-center">
                              <Checkbox 
                                checked={field.value === "public"}
                                onCheckedChange={(checked) => checked && field.onChange("public")}
                                data-testid="checkbox-public"
                              />
                              <span className="ml-2 text-sm">Make public</span>
                            </label>
                            <label className="flex items-center">
                              <Checkbox 
                                checked={field.value === "investment_open"}
                                onCheckedChange={(checked) => checked && field.onChange("investment_open")}
                                data-testid="checkbox-investment"
                              />
                              <span className="ml-2 text-sm">Open for investment</span>
                            </label>
                          </div>
                        )}
                      />
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowEditor(false)}
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="gradient-primary"
                          disabled={createIdeaMutation.isPending || updateIdeaMutation.isPending}
                          data-testid="button-save"
                        >
                          {editingIdea ? "Update Idea" : "Save Idea"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Ideas</h2>
        <Button onClick={handleNewIdea} className="gradient-primary" data-testid="button-create-idea">
          Create New Idea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onEdit={handleEditIdea}
            onDelete={handleDeleteIdea}
          />
        ))}
      </div>
    </div>
  )
}
