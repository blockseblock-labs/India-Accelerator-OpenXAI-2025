"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Shield, Users } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/animated-gradient";
import { Particles } from "@/components/magicui/particles";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Footer } from "@/components/footer";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function Page() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <section className="flex flex-col items-center justify-center px-4 py-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center w-full justify-center">
            <AnimatedGradient />
          </div>
          <h1
            className={
              "text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-background/20 px-4 py-2 " +
              serif.className
            }>
            Decentralized Mental Health Support
          </h1>
          <p className="mt-6 text-xl text-muted-foreground bg-background/20 px-4 py-2">
            MindChain leverages blockchain technology to provide secure,
            anonymous, and accessible mental health support for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Button size="lg" asChild>
              <Link href="/chat">
                Start Anonymous Chat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Anonymous Therapy</h3>
              <p className="text-muted-foreground">
                Connect with licensed therapists anonymously through our secure
                chat platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Blockchain Security</h3>
              <p className="text-muted-foreground">
                Your therapy records are securely stored on the blockchain,
                giving you full control over your data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                Join peer support groups and connect with others on similar
                mental health journeys.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Future Scope Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Future Scope ✨</h2>
          <p className="text-xl text-muted-foreground mb-10">
            We're constantly evolving to provide better mental health support
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg border bg-card">
            <h3 className="text-2xl font-medium mb-4">🧠 RAG Integration</h3>
            <p className="text-muted-foreground mb-6">
              Our upcoming AI features will provide personalized support, mood
              analysis, and therapy recommendations based on user data from our
              doctors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of others who have found support through MindChain
          </p>
        </div>
      </section>

      <Footer />

      <Particles
        className="absolute inset-0 z-0 top-0 left-0 right-0 bottom-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
