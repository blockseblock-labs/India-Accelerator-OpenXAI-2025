"use client"

import { Camera, Brain, Hash, Sparkles } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const tools = [
  { 
    title: "Caption Generator", 
    path: "/", 
    icon: Camera,
    description: "AI-powered Instagram captions"
  },
  { 
    title: "Mood Analyzer", 
    path: "/mood", 
    icon: Brain,
    description: "Sentiment analysis & emotions"
  },
  { 
    title: "Hashtag Generator", 
    path: "/hashtag", 
    icon: Hash,
    description: "Trending tags for maximum reach"
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const collapsed = state === "collapsed"

  const isActive = (path: string) => pathname === path
  const isExpanded = tools.some((tool) => isActive(tool.path))

  const getNavClass = (path: string) => {
    const active = isActive(path)
    return `transition-all duration-200 ${
      active 
        ? "bg-primary/20 text-primary border-l-2 border-l-primary font-semibold" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-card-foreground"
    }`
  }

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} glass-card border-r border-border/50`}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end hover:bg-muted/50" />

      <SidebarContent className="p-2">
        {/* Header */}
        {!collapsed && (
          <div className="p-4 text-center space-y-2 border-b border-border/50 mb-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold glow-text">SocialAI Pro</h2>
            </div>
            <p className="text-xs text-muted-foreground">AI-Powered Social Tools</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {collapsed ? "" : "AI Tools"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.title}>
                  <SidebarMenuButton 
                    asChild
                    className={getNavClass(tool.path)}
                  >
                    <button
                      onClick={() => router.push(tool.path)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left"
                    >
                      <tool.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{tool.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {tool.description}
                          </div>
                        </div>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-auto p-4 text-center border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Perfect for all social platforms! ✨
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
