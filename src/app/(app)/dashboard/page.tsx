import { AppHeader } from "@/components/app-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard, Stethoscope, Video, Share2, ScanFace, BookUser, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    href: "/diagnosis",
    title: "AI Diagnosis Assistant",
    description: "Get a preliminary AI-driven diagnosis based on your symptoms and vitals.",
    icon: Stethoscope,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    href: "/tele-consultation",
    title: "Tele-Consultation",
    description: "Connect with doctors remotely for a consultation, with real-time data sharing.",
    icon: Video,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    href: "/federated-learning",
    title: "Federated Learning",
    description: "Contribute to improving diagnostic models while ensuring data privacy.",
    icon: Share2,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    href: "/facial-recognition",
    title: "Facial Recognition Check-in",
    description: "Streamline your check-in process with secure face ID recognition.",
    icon: ScanFace,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    href: "/abdm-integration",
    title: "ABDM Integration",
    description: "Seamlessly connect with the Ayushman Bharat Digital Mission ecosystem.",
    icon: BookUser,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
];


export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-headline font-semibold">Welcome to Swasthya Sahayak</h2>
          <p className="text-muted-foreground">Your personal health kiosk. Select a service to get started.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title} className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-full ${feature.bgColor} dark:${feature.bgColor}/20`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="pt-4 font-headline">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
