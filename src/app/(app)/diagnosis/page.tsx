"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Sparkles, HeartPulse } from "lucide-react"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { aiDiagnosisAssistant, type AIDiagnosisAssistantOutput } from "@/ai/flows/ai-diagnosis-assistant"

const formSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
  vitals: z.string().min(5, { message: "Please provide your vitals (e.g., temp, BP)." }),
  medicalHistory: z.string().optional(),
})

export default function DiagnosisPage() {
  const [result, setResult] = useState<AIDiagnosisAssistantOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
      vitals: "",
      medicalHistory: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const diagnosisResult = await aiDiagnosisAssistant(values)
      setResult(diagnosisResult)
    } catch (error) {
      console.error("Diagnosis error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get diagnosis. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="AI Diagnosis Assistant" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="font-headline">Patient Information</CardTitle>
                  <CardDescription>Enter the patient's details to get a preliminary diagnosis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., fever, cough, and headache for 3 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vitals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vitals</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Temp: 101°F, BP: 120/80 mmHg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., history of asthma, no known allergies" {...field} />
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
                      <Sparkles className="mr-2" />
                    )}
                    Get Diagnosis
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Diagnosis Result</CardTitle>
              <CardDescription>The AI-generated preliminary diagnosis will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              {isLoading && (
                <div className="text-center text-muted-foreground">
                  <HeartPulse className="mx-auto h-12 w-12 animate-pulse text-primary" />
                  <p className="mt-4">Analyzing data...</p>
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground">
                  <p>Awaiting patient information to generate diagnosis.</p>
                </div>
              )}
              {result && (
                <div className="space-y-6 w-full">
                  <div>
                    <h3 className="font-semibold font-headline">Preliminary Diagnosis</h3>
                    <p className="text-sm text-muted-foreground">{result.preliminaryDiagnosis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold font-headline">Suggested Treatment Plan</h3>
                    <p className="text-sm text-muted-foreground">{result.suggestedTreatmentPlan}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold font-headline mb-2">Confidence Level</h3>
                    <div className="flex items-center gap-4">
                      <Progress value={result.confidenceLevel * 100} className="w-[80%]" />
                      <span className="font-mono text-sm font-semibold">{(result.confidenceLevel * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Disclaimer: This is an AI-generated suggestion and not a substitute for professional medical advice. Always consult a qualified doctor.</p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
