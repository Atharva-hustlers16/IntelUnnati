"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Upload, BrainCircuit } from "lucide-react"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { federatedLearningModel, type FederatedLearningModelOutput } from "@/ai/flows/federated-learning-model"

const formSchema = z.object({
  kioskId: z.string().min(1, { message: "Kiosk ID is required." }),
  modelName: z.string().min(1, { message: "Model name is required." }),
  trainingData: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Training data must be a valid JSON string." }),
})

export default function FederatedLearningPage() {
  const [result, setResult] = useState<FederatedLearningModelOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kioskId: "Kiosk-101-DEL",
      modelName: "Cardio-Risk-Predictor-v2",
      trainingData: JSON.stringify([
        { age: 55, gender: "male", bp: "140/90", cholesterol: 220, outcome: 1 },
        { age: 62, gender: "female", bp: "130/85", cholesterol: 205, outcome: 0 },
      ], null, 2),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const learningResult = await federatedLearningModel(values)
      setResult(learningResult)
      toast({
        title: "Model Update Successful",
        description: "The federated model has been updated with new data.",
      })
    } catch (error) {
      console.error("Federated Learning error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Federated Learning Module" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="font-headline">Contribute to Model Training</CardTitle>
                  <CardDescription>Securely submit anonymized data to improve the global diagnostic model.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="kioskId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kiosk ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Unique identifier for the kiosk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Name of the model to be trained" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trainingData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Data (JSON format)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter training data as a JSON string" {...field} rows={8}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Upload className="mr-2" />
                    )}
                    Submit Data
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Model Update Results</CardTitle>
              <CardDescription>The results of the federated learning update will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              {isLoading && (
                <div className="text-center text-muted-foreground">
                  <BrainCircuit className="mx-auto h-12 w-12 animate-pulse text-primary" />
                  <p className="mt-4">Processing data and updating model...</p>
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground">
                  <p>Awaiting data submission.</p>
                </div>
              )}
              {result && (
                <div className="space-y-4 w-full text-sm">
                   <div>
                    <h3 className="font-semibold font-headline">Model Update</h3>
                     <pre className="mt-1 w-full rounded-md bg-muted p-3 text-muted-foreground overflow-auto max-h-48">
                      <code>{result.modelUpdate}</code>
                    </pre>
                  </div>
                   <div>
                    <h3 className="font-semibold font-headline">Metrics</h3>
                     <pre className="mt-1 w-full rounded-md bg-muted p-3 text-muted-foreground overflow-auto max-h-48">
                      <code>{result.metrics}</code>
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">This process enhances the AI's accuracy without exposing sensitive patient data, thanks to federated learning principles.</p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
