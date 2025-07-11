"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send, PhoneOff, Mic, Video, User, FileText, Camera, CheckCircle } from "lucide-react"
import Image from "next/image"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { teleConsultationSupport, type TeleConsultationSupportOutput } from "@/ai/flows/tele-consultation-support"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const formSchema = z.object({
  medicalHistory: z.string().min(1, "Required"),
  vitals: z.string().min(1, "Required"),
  labResults: z.string().min(1, "Required"),
  imagingResults: z.string().min(1, "Required"),
  preferredLanguage: z.string().min(1, "Required"),
});

export default function TeleConsultationPage() {
  const [summary, setSummary] = useState<TeleConsultationSupportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Your browser does not support camera access.",
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalHistory: "Patient has a history of hypertension and type 2 diabetes.",
      vitals: "BP 140/90 mmHg, Temp 98.6°F, HR 78 bpm",
      labResults: "Fasting blood sugar: 150 mg/dL, HbA1c: 7.2%",
      imagingResults: "Chest X-ray: Clear",
      preferredLanguage: "English",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await teleConsultationSupport(values);
      setSummary(result);
      toast({
        title: "Summary Generated",
        description: "Patient summary is ready for the consultation.",
      });
    } catch (error) {
      console.error("Summary generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Tele-Consultation Portal" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Live Consultation</CardTitle>
              <CardDescription>Connect with a doctor for a remote consultation.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                 <Image src="https://placehold.co/600x400.png" data-ai-hint="doctor video call" layout="fill" objectFit="cover" alt="Doctor's video feed" />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded-lg text-sm font-semibold">Dr. Anjali Sharma</div>
                 <div className="absolute top-4 right-4 aspect-video w-1/4 rounded-lg overflow-hidden border-2 border-background bg-card-foreground">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === null && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                    {hasCameraPermission === false && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-2 text-center">
                        <Camera className="h-6 w-6 text-destructive mb-2" />
                        <p className="text-xs">Camera access denied</p>
                      </div>
                    )}
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12"><Mic className="h-6 w-6" /></Button>
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12"><Video className="h-6 w-6" /></Button>
                <Button variant="destructive" size="icon" className="rounded-full h-12 w-12"><PhoneOff className="h-6 w-6" /></Button>
              </div>
              <Separator />
               <div className="flex-1 space-y-4">
                  <h3 className="font-headline font-semibold flex items-center gap-2"><FileText size={20}/> AI-Generated Summary</h3>
                  {summary ? (
                    <div className="p-4 bg-muted/50 rounded-lg text-sm max-h-48 overflow-y-auto">
                        <p>{summary.summary}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
                        Generate patient summary to view it here.
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="font-headline">Generate Patient Summary</CardTitle>
                  <CardDescription>Fill this to generate a summary for the doctor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="medicalHistory" render={({ field }) => (
                    <FormItem><FormLabel>Medical History</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="vitals" render={({ field }) => (
                    <FormItem><FormLabel>Vitals</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="labResults" render={({ field }) => (
                    <FormItem><FormLabel>Lab Results</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="imagingResults" render={({ field }) => (
                    <FormItem><FormLabel>Imaging Results</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="preferredLanguage" render={({ field }) => (
                    <FormItem><FormLabel>Preferred Language</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (<Loader2 className="animate-spin" />) : (<Send className="mr-2" />)}
                    Generate & Send Summary
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  )
}
