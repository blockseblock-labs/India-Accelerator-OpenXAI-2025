"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Users, UserPlus, UserMinus, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

type Group = {
  id: string
  name: string
  description: string
  members: number
  category: string
  joined: boolean
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Anxiety Support",
      description: "A safe space to discuss anxiety and share coping strategies.",
      members: 128,
      category: "Anxiety",
      joined: false,
    },
    {
      id: "2",
      name: "Depression Recovery",
      description: "Support group for those dealing with depression and working toward recovery.",
      members: 95,
      category: "Depression",
      joined: true,
    },
    {
      id: "3",
      name: "Mindfulness Practice",
      description: "Daily mindfulness exercises and discussions about meditation techniques.",
      members: 76,
      category: "Mindfulness",
      joined: false,
    },
    {
      id: "4",
      name: "Stress Management",
      description: "Strategies and support for managing stress in daily life.",
      members: 112,
      category: "Stress",
      joined: false,
    },
    {
      id: "5",
      name: "Sleep Improvement",
      description: "Discussions and tips for better sleep habits and overcoming insomnia.",
      members: 64,
      category: "Sleep",
      joined: true,
    },
  ])
  const { toast } = useToast()

  const toggleJoin = (id: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === id) {
          const newJoinedState = !group.joined

          toast({
            description: newJoinedState
              ? `You've joined the ${group.name} group`
              : `You've left the ${group.name} group`,
          })

          return {
            ...group,
            joined: newJoinedState,
            members: newJoinedState ? group.members + 1 : group.members - 1,
          }
        }
        return group
      }),
    )
  }

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Support</h1>
            <p className="text-muted-foreground mt-1">Connect with others on similar mental health journeys</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{group.name}</CardTitle>
                    <Badge>{group.category}</Badge>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex -space-x-2 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                      <Avatar key={i} className="border-2 border-background w-8 h-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>U{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-xs">
                      +{group.members - 4}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {group.members} members
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Chat
                    </Button>
                    <Button
                      variant={group.joined ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleJoin(group.id)}
                    >
                      {group.joined ? (
                        <>
                          <UserMinus className="mr-1 h-4 w-4" />
                          Leave
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-1 h-4 w-4" />
                          Join
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

