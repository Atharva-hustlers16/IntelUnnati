"use client"

import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScanFace, Lock, FileCheck, ShieldCheck, Camera, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";

export default function FacialRecognitionPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not supported in this browser.");
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
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setCheckInSuccess(false);
    // Simulate API call for facial recognition
    setTimeout(() => {
      setIsCheckingIn(false);
      setCheckInSuccess(true);
      toast({
        title: "Check-in Successful",
        description: "Welcome! Your identity has been verified.",
      });
      setTimeout(() => setCheckInSuccess(false), 5000); // Reset after 5s
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Facial Recognition Check-in" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">Effortless & Secure Check-in</CardTitle>
              <CardDescription>Look at the camera to verify your identity and check-in instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {hasCameraPermission === null && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                     <Loader2 className="h-8 w-8 animate-spin" />
                     <p className="mt-2">Accessing camera...</p>
                   </div>
                )}
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <Camera className="h-10 w-10 text-destructive mb-4" />
                    <Alert variant="destructive" className="max-w-sm">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser to use this feature.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                 {checkInSuccess && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/80 text-white transition-opacity duration-300">
                    <CheckCircle className="h-16 w-16" />
                    <p className="mt-4 text-xl font-bold">Check-in Successful!</p>
                  </div>
                )}
              </div>
              <Button onClick={handleCheckIn} disabled={!hasCameraPermission || isCheckingIn || checkInSuccess} className="w-full" size="lg">
                {isCheckingIn ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ScanFace className="mr-2" />
                )}
                {isCheckingIn ? "Verifying..." : "Check-in Now"}
              </Button>
            </CardContent>
          </Card>
           <p className="text-xs text-muted-foreground text-center mt-4">
              <Lock size={12} className="inline mr-1" />
              Your privacy is protected. Facial data is processed on-device for verification and not stored.
            </p>
        </div>
      </main>
    </div>
  );
}

    