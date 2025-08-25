"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Award, Clock } from "lucide-react";
import { format, subDays } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export default function DashboardPage() {
  const [streak] = useState(7);
  const [completedSessions] = useState(12);
  const [totalMinutes] = useState(540);
  const [nextSession] = useState(subDays(new Date(), -2));

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and mental health journey
            </p>
          </div>
          <Button asChild>
            <a href="https://cal.com/tanav-poswal-lvtupv">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session (cal.com)
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak} days</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
              <div className="mt-3">
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Sessions Completed
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSessions}</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
              <div className="mt-3">
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Minutes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMinutes}</div>
              <p className="text-xs text-muted-foreground">
                +90 from last month
              </p>
              <div className="mt-3">
                <Progress value={54} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Next Session
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {format(nextSession, "MMM d")}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(nextSession, "EEEE, h:mm a")}
              </p>
              <div className="mt-3 flex gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  Dr. Thompson
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  45 min
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Coins</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Image src="/coin.png" alt="coins" width={100} height={100} />
              <p className="text-lg font-bold">0.065</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Send</Button>
            </CardFooter>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>NFT</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <img
                src="https://placehold.co/400x600/png"
                width={100}
                height={100}
              />
              <img
                src="https://placehold.co/400x600/png"
                width={100}
                height={100}
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline">Send</Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
