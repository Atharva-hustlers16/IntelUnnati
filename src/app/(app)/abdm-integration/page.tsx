import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function AbdmIntegrationPage() {
  const benefits = [
    "Seamless creation and linking of Ayushman Bharat Health Account (ABHA).",
    "Secure access and sharing of health records with patient consent.",
    "Interoperability with all ABDM-compliant healthcare providers.",
    "Access to a unified digital health ecosystem across India.",
    "Streamlined registration and appointment booking at hospitals.",
    "Eligibility for government health schemes and insurance.",
  ];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="ABDM Integration" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
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
              The Ayushman Bharat Digital Mission (ABDM) aims to develop the backbone necessary to support the integrated digital health infrastructure of the country. It will bridge the existing gap amongst different stakeholders of the Healthcare ecosystem through digital highways. Swasthya Sahayak's integration ensures that your health information is managed securely, efficiently, and with your consent.
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
      </main>
    </div>
  );
}
