"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/utils/uploadthing";

type TherapySession = {
  id: string;
  date: string;
  therapist: string;
  duration: string;
  notes: string;
  transactionId: string;
};

export default function RecordsPage() {
  const [sessions] = useState<TherapySession[]>([
    {
      id: "1",
      date: "2023-11-15",
      therapist: "Dr. Thompson",
      duration: "45 minutes",
      notes:
        "Initial assessment. Discussed anxiety triggers and potential coping mechanisms.",
      transactionId: "0x7f9a8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d",
    },
    {
      id: "2",
      date: "2023-11-22",
      therapist: "Dr. Thompson",
      duration: "50 minutes",
      notes:
        "Follow-up session. Explored childhood experiences and their impact on current anxiety patterns.",
      transactionId: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    },
    {
      id: "3",
      date: "2023-11-29",
      therapist: "Dr. Thompson",
      duration: "60 minutes",
      notes:
        "Discussed progress with mindfulness techniques. Introduced cognitive behavioral strategies for managing stress.",
      transactionId: "0x3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x",
    },
    {
      id: "4",
      date: "2023-12-06",
      therapist: "Dr. Thompson",
      duration: "45 minutes",
      notes:
        "Reviewed homework assignments. Client reported improved sleep and reduced anxiety symptoms.",
      transactionId: "0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g",
    },
  ]);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Secure Documents
            </h1>
            <p className="text-muted-foreground mt-1">
              Your therapy documents are securely stored on the blockchain
            </p>
          </div>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>

        <div>
          {sessions.map((session) => (
            <Card key={session.id} className="mb-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{session.therapist}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(session.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <Shield className="mr-1 h-3 w-3" />
                    Secured
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{session.notes}</p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <div className="flex gap-3">
                  <Button variant={"outline"} size={"sm"}>
                    Download
                  </Button>
                  <Button variant={"destructive"} size={"sm"}>
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
