"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Palette, Globe } from "lucide-react";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Modern Stack Test</h1>
          <p className="text-muted-foreground text-lg">
            Testing React 19, Next.js 15, Tailwind CSS 4, and shadcn/ui
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge>React 19</Badge>
            <Badge>Next.js 15</Badge>
            <Badge>Tailwind CSS 4</Badge>
            <Badge>shadcn/ui</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                React 19
              </CardTitle>
              <CardDescription>
                Latest React with improved performance and new features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Server Components, Actions, and enhanced concurrent features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Next.js 15
              </CardTitle>
              <CardDescription>
                App Router with Turbopack and modern optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enhanced performance, better DX, and production-ready features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tailwind CSS 4
              </CardTitle>
              <CardDescription>
                Modern utility-first CSS framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                CSS-in-JS engine with improved performance and new features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                shadcn/ui
              </CardTitle>
              <CardDescription>
                Beautiful, accessible component library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built on Radix UI with customizable, copy-paste components.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Everything is Working!
          </Button>
        </div>
      </div>
    </div>
  );
}
