"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Award, Clock, Coins } from "lucide-react";
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
import SummaryPieChart from "@/components/summary-pie-chart";

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
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Journal Streak
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak} days</div>
              <p className="text-xs text-muted-foreground">5 max streak</p>
              <div className="mt-3">
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Expert Sessions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button asChild variant={"ghost"} className="my-5" size={"sm"}>
                <a href="https://cal.com/tanav-poswal-lvtupv">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">1 last month</p>
              <div className="mt-3">
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Check Result
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMinutes}</div>
              <p className="text-xs text-muted-foreground">Good status</p>
              <div className="mt-3">
                <Progress value={54} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Coins</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Image src="/coin.png" alt="coins" width={50} height={50} />
                <p className="text-xl font-bold">54.6</p>
              </div>
              <div className="mt-3">
                <Progress value={54} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Progress Last Week</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <SummaryPieChart />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
