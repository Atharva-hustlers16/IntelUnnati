"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { CheckCircle, Loader2, Server } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  abhaId: z.string().regex(/^\d{2}-\d{4}-\d{4}-\d{4}$/, {
    message: "Please enter a valid ABHA ID in the format 12-3456-7890-1234.",
  }),
});

export default function AbdmIntegrationPage() {
  const [isLinked, setIsLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const benefits = [
    "Seamless creation and linking of Ayushman Bharat Health Account (ABHA).",
    "Secure access and sharing of health records with patient consent.",
    "Interoperability with all ABDM-compliant healthcare providers.",
    "Access to a unified digital health ecosystem across India.",
    "Streamlined registration and appointment booking at hospitals.",
    "Eligibility for government health schemes and insurance.",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      abhaId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call to link ABHA ID
    setTimeout(() => {
      setIsLoading(false);
      setIsLinked(true);
      toast({
        title: "Success",
        description: `ABHA ID ${values.abhaId} has been successfully linked.`,
      });
    }, 1500);
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="ABDM Integration" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Image src="https://placehold.co/200x100.png" data-ai-hint="India health" alt="ABDM Logo" width={150} height={75} className="rounded-lg" />
                <div>
                  <CardTitle className="font-headline text-2xl">Connected with Ayushman Bharat Digital Mission</CardTitle>
                  <p className="text-muted-foreground mt-1">Swasthya Sahayak is fully integrated with India's digital health ecosystem.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base">
                The Ayushman Bharat Digital Mission (ABDM) aims to develop the backbone necessary to support the integrated digital health infrastructure of the country. It will bridge the existing gap amongst different stakeholders of the Healthcare ecosystem through digital highways.
              </p>
              <div>
                <h3 className="font-headline text-xl font-semibold mb-4">Key Benefits for Patients</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Link Your ABHA ID</CardTitle>
              <CardDescription>
                {isLinked 
                  ? "Your account is successfully linked to the ABDM network."
                  : "Link your Ayushman Bharat Health Account (ABHA) to get started."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLinked ? (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold">ABHA ID Linked!</h3>
                  <p className="text-muted-foreground">You can now securely access and manage your health records.</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="abhaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ABHA ID</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 12-3456-7890-1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Linking...
                        </>
                      ) : (
                        <>
                          <Server className="mr-2 h-4 w-4" />
                          Link Now
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
