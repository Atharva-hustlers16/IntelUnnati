import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScanFace, Lock, FileCheck, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function FacialRecognitionPage() {
  const steps = [
    {
      icon: ScanFace,
      title: "One-Time Registration",
      description: "Link your face to your Ayushman Bharat Health Account (ABHA) with your explicit consent. This is a one-time process.",
    },
    {
      icon: FileCheck,
      title: "Instant Check-in",
      description: "For future visits, simply look at the kiosk's camera to check-in for appointments, retrieve records, and more.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your facial data is converted into a secure digital signature and is not stored as a photo. Your privacy is our priority.",
    },
    {
      icon: ShieldCheck,
      title: "Consent is Key",
      description: "No action is taken without your approval. You will always be prompted to authorize any data access or transaction.",
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Facial Recognition Check-in" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Card>
          <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
                 <Image src="https://placehold.co/400x200.png" data-ai-hint="face scan" alt="Facial Recognition" width={300} height={150} className="rounded-lg" />
             </div>
            <CardTitle className="font-headline text-2xl">Effortless & Secure Check-in</CardTitle>
            <CardDescription>Experience a faster, touchless registration process with our advanced facial recognition technology.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-muted-foreground mb-8">
                Inspired by the convenience of Digi Yatri at airports, Swasthya Sahayak brings you a seamless way to interact with healthcare services. Your face becomes your key, simplifying every step of your journey at our kiosks.
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                {steps.map((step) => (
                   <div key={step.title} className="flex items-start gap-4">
                     <div className="bg-primary/10 text-primary p-3 rounded-full">
                       <step.icon className="w-8 h-8"/>
                     </div>
                     <div>
                       <h3 className="font-headline font-semibold">{step.title}</h3>
                       <p className="text-sm text-muted-foreground">{step.description}</p>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
