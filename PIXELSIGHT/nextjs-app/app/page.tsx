'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  History, 
  Settings, 
  ChevronLeft,
  Sparkles,
  BarChart3,
  Image as ImageIcon,
  Zap,
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  ChevronDown,
  LogOut,
  CreditCard,
  Camera,
  Eye,
  Loader2,
  Copy,
  Download,
  Share2,
  Save,
  Trash2,
  RefreshCw,
  Star,
  Heart,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Activity,
  Users,
  Target,
  Palette,
  Brain
} from 'lucide-react'
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// Types
interface AnalysisResult {
  id: string
  imageUrl: string
  analysis: string
  analysisType: string
  confidence: number
  processingTime: number
  timestamp: Date
  metadata: {
    imageSize: number
    dimensions: { width: number; height: number }
    format: string
  }
  tags: string[]
}

interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

// Add this to the top of your page.tsx component
// At the top of your PixelSightApp component, add this state
// Reusable Components
function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  icon, 
  onClick, 
  disabled, 
  className 
}: {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
    destructive: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  )
}

function Card({ className, hover, glass, children, onClick }: {
  className?: string
  hover?: boolean
  glass?: boolean
  children?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } : undefined}
      className={cn(
        "rounded-xl border transition-all duration-200",
        glass ? "glass" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm",
        hover && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

function CardHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>
}

function CardContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("p-6", className)}>{children}</div>
}

// Main Application Component
export default function PixelSightApp() {
  // State Management
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis' | 'reports' | 'history' | 'settings'>('dashboard')
  const [isDark, setIsDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<'upload' | 'analyze' | 'results'>('upload')
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('general')
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [analysisStats, setAnalysisStats] = useState({ confidence: 0, processingTime: 0 })
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([])

  // Theme Management
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Toast System
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, type, message }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => removeToast(id), 4000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Navigation
  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Analyze', id: 'analysis', icon: Upload },
    { name: 'Reports', id: 'reports', icon: FileText },
    { name: 'History', id: 'history', icon: History },
    { name: 'Settings', id: 'settings', icon: Settings },
  ]

  // Image Upload Handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        addToast('error', 'Invalid file format')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        addToast('error', 'File too large')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysisStep('analyze')
        addToast('success', 'Image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Analysis Handler
  const analyzeImage = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    const startTime = Date.now()

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockAnalysis = `This image shows a detailed business framework diagram with ESG components. The visualization displays six color-coded segments representing different business objectives including Data Processing, Evaluation Framework, ESG Classification, Regulatory Compliance, and Narrative Generation. The design uses a professional color palette with vibrant blues, greens, oranges, and reds to distinguish different sections. The composition is well-balanced with clear typography and excellent visual hierarchy, making it suitable for corporate presentations and strategic planning documents.`
      
      const processingTime = Date.now() - startTime
      
      setAnalysis(mockAnalysis)
      setAnalysisStats({
        confidence: Math.floor(Math.random() * 15) + 85,
        processingTime: processingTime
      })
      setAnalysisStep('results')
      
      // Add to recent analyses
      const newAnalysis: AnalysisResult = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: selectedImage,
        analysis: mockAnalysis,
        analysisType: selectedAnalysisType,
        confidence: Math.floor(Math.random() * 15) + 85,
        processingTime: processingTime,
        timestamp: new Date(),
        metadata: {
          imageSize: 256000,
          dimensions: { width: 800, height: 600 },
          format: 'JPEG'
        },
        tags: ['business', 'framework', 'ESG', 'corporate']
      }
      
      setRecentAnalyses(prev => [newAnalysis, ...prev.slice(0, 4)])
      addToast('success', 'Image analyzed successfully!')
    } catch (error) {
      addToast('error', 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Analysis Options
  const analysisOptions = [
    { id: 'general', name: 'General Analysis', icon: Eye, color: 'from-blue-500 to-indigo-500' },
    { id: 'artistic', name: 'Artistic Analysis', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'technical', name: 'Technical Analysis', icon: Camera, color: 'from-green-500 to-emerald-500' },
    { id: 'emotional', name: 'Emotional Impact', icon: Brain, color: 'from-orange-500 to-red-500' },
    { id: 'creative', name: 'Creative Insights', icon: Sparkles, color: 'from-teal-500 to-cyan-500' },
    { id: 'fast', name: 'Quick Scan', icon: Zap, color: 'from-yellow-500 to-orange-500' }
  ]

  // Reset Analysis
  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysis(null)
    setAnalysisStep('upload')
    setAnalysisStats({ confidence: 0, processingTime: 0 })
  }

  // Copy to Clipboard
  const copyToClipboard = async () => {
    if (analysis) {
      try {
        await navigator.clipboard.writeText(analysis)
        addToast('success', 'Copied to clipboard!')
      } catch (err) {
        addToast('error', 'Failed to copy')
      }
    }
  }

  // Download Result
  const downloadResult = () => {
    if (!analysis) return
    
    const timestamp = new Date().toISOString().split('T')[0]
    const content = `PixelSight Analysis - ${timestamp}\n\nConfidence: ${analysisStats.confidence}%\nProcessing Time: ${analysisStats.processingTime}ms\n\nAnalysis:\n${analysis}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pixelsight-analysis-${timestamp}.txt`
    link.click()
    URL.revokeObjectURL(url)
    addToast('success', 'Analysis downloaded!')
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed ? (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">PixelSight</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">AI Analysis Platform</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Usage Stats */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Usage</span>
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">247 / 1000</span>
                    <span className="text-gray-600 dark:text-gray-400">24.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "24.7%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <motion.div
                key={item.name}
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative group cursor-pointer",
                  isActive 
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                )}
                onClick={() => setCurrentView(item.id as any)}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"
                  />
                )}
                
                <Icon className={cn("w-5 h-5", sidebarCollapsed ? "mx-auto" : "mr-3")} />
                
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </motion.div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AnimatePresence>
            {!sidebarCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">v2.0.1 • Pro Plan</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">© 2025 PixelSight</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-2 h-2 bg-green-400 rounded-full mx-auto"
                title="System Online"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search analyses, reports..."
                  className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </div>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={() => setIsDark(!isDark)} className="p-2">
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* User Profile */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {/* Dashboard View */}
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-6 space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, John! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your AI analyses today.
                  </p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  <Button
                    variant="primary"
                    icon={<ImageIcon className="w-4 h-4" />}
                    onClick={() => setCurrentView('analysis')}
                    className="shadow-lg"
                  >
                    New Analysis
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<Activity className="w-4 h-4" />}
                    onClick={() => setCurrentView('reports')}
                  >
                    View Reports
                  </Button>
                  <Button
                    variant="ghost"
                    icon={<Target className="w-4 h-4" />}
                  >
                    Analytics
                  </Button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Analyses', value: '2,543', icon: ImageIcon, change: '+12%', color: 'blue' },
                    { title: 'Avg. Confidence', value: '94.7%', icon: Target, change: '+2.1%', color: 'green' },
                    { title: 'Processing Speed', value: '2.3s', icon: Zap, change: '-12%', color: 'yellow' },
                    { title: 'Satisfaction', value: '4.8/5', icon: Star, change: '+0.2', color: 'purple' }
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <Card key={index} hover className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {stat.value}
                            </p>
                            <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {stat.change} from last month
                            </p>
                          </div>
                          <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </motion.div>

                {/* Recent Analyses */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Analyses
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {recentAnalyses.length > 0 ? (
                        <div className="space-y-4">
                          {recentAnalyses.map((analysis) => (
                            <div key={analysis.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <img
                                src={analysis.imageUrl}
                                alt="Analysis thumbnail"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {analysis.analysisType} Analysis
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {analysis.confidence}% confidence • {analysis.processingTime}ms
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {analysis.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No analyses yet</p>
                          <Button
                            variant="primary"
                            className="mt-4"
                            onClick={() => setCurrentView('analysis')}
                          >
                            Start Your First Analysis
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Analysis View */}
            {currentView === 'analysis' && (
              <motion.div
                key="analysis"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-6 space-y-6"
              >
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      AI Image Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload an image and get detailed AI-powered insights
                    </p>
                  </div>
                  
                  {analysis && (
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="secondary"
                        icon={<Save className="w-4 h-4" />}
                      >
                        Save Analysis
                      </Button>
                      <Button
                        variant="ghost"
                        icon={<Share2 className="w-4 h-4" />}
                      >
                        Share
                      </Button>
                      <Button
                        variant="ghost"
                        icon={<Download className="w-4 h-4" />}
                        onClick={downloadResult}
                      >
                        Export
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Progress Steps */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center space-x-4">
                    {[
                      { id: 'upload', label: 'Upload Image', icon: Upload },
                      { id: 'analyze', label: 'Analyze', icon: Sparkles },
                      { id: 'results', label: 'Results', icon: Download }
                    ].map((step, index) => {
                      const Icon = step.icon
                      const isActive = analysisStep === step.id
                      const isCompleted = ['upload', 'analyze'].includes(step.id) && analysisStep === 'results'
                      
                      return (
                        <div key={step.id} className="flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                            isActive 
                              ? 'border-blue-500 bg-blue-500 text-white' 
                              : isCompleted
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`ml-2 text-sm font-medium ${
                            isActive 
                              ? 'text-blue-700 dark:text-blue-400' 
                              : isCompleted
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {step.label}
                          </span>
                          {index < 2 && (
                            <div className={`w-12 h-0.5 mx-4 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Content Based on Step */}
                <AnimatePresence mode="wait">
                  {analysisStep === 'upload' && (
                    <motion.div
                      key="upload-step"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <Card>
                        <CardHeader>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Upload Image
                          </h2>
                        </CardHeader>
                        <CardContent>
                          <label
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            htmlFor="image-upload"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-gray-500 dark:text-gray-400" />
                              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, WebP (max 10MB)</p>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              className="hidden"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {analysisStep === 'analyze' && selectedImage && (
                    <motion.div
                      key="analyze-step"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      <Card>
                        <CardHeader>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Selected Image
                          </h2>
                        </CardHeader>
                        <CardContent>
                          <img
                            src={selectedImage}
                            alt="Selected for analysis"
                            className="w-full h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                          />
                          <div className="mt-4 flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              onClick={resetAnalysis}
                            >
                              Change Image
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Analysis Options
                          </h2>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Choose Analysis Type
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {analysisOptions.map((option) => {
                                const Icon = option.icon
                                const isSelected = selectedAnalysisType === option.id
                                
                                return (
                                  <motion.button
                                    key={option.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedAnalysisType(option.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                      isSelected
                                        ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-lg`
                                        : isDark
                                        ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex flex-col items-center space-y-2">
                                      <Icon className="w-6 h-6" />
                                      <span className="text-sm font-medium text-center">{option.name}</span>
                                    </div>
                                  </motion.button>
                                )
                              })}
                            </div>

                            <Button
                              variant="primary"
                              onClick={analyzeImage}
                              disabled={isAnalyzing}
                              loading={isAnalyzing}
                              className="w-full mt-6"
                              icon={!isAnalyzing ? <Eye className="w-5 h-5" /> : undefined}
                            >
                              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {analysisStep === 'results' && analysis && (
                    <motion.div
                      key="results-step"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          onClick={resetAnalysis}
                        >
                          Start New Analysis
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                          <Card>
                            <CardHeader>
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Analyzed Image
                              </h2>
                            </CardHeader>
                            <CardContent>
                              <img
                                src={selectedImage!}
                                alt="Analyzed"
                                className="w-full h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                              />
                            </CardContent>
                          </Card>
                        </div>

                        <div className="lg:col-span-2">
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  Analysis Results
                                </h2>
                                <Button
                                  variant="ghost"
                                  onClick={resetAnalysis}
                                  icon={<RefreshCw className="w-4 h-4" />}
                                />
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                      Confidence
                                    </span>
                                    <Heart className={`w-4 h-4 ${analysisStats.confidence > 85 ? 'text-green-500' : 'text-yellow-500'}`} />
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analysisStats.confidence}%
                                  </div>
                                </div>
                                
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                      Processing Time
                                    </span>
                                    <Zap className="w-4 h-4 text-blue-500" />
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analysisStats.processingTime}ms
                                  </div>
                                </div>
                              </div>

                              {/* Analysis Content */}
                              <div className={`p-6 rounded-xl border-2 ${isDark 
                                ? 'bg-gray-900/50 border-gray-600' 
                                : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'
                              }`}>
                                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {analysis}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                  variant="primary"
                                  onClick={copyToClipboard}
                                  icon={<Copy className="w-5 h-5" />}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                  Copy Result
                                </Button>
                                
                                <Button
                                  variant="secondary"
                                  onClick={downloadResult}
                                  icon={<Download className="w-5 h-5" />}
                                >
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Reports View */}
            {currentView === 'reports' && (
              <motion.div
                key="reports"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-6 space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Reports & Analytics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Comprehensive insights and performance metrics
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Reports Coming Soon
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Advanced analytics and reporting features are under development.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* History View */}
            {currentView === 'history' && (
              <motion.div
                key="history"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-6 space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Analysis History
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review your past image analyses and results
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No History Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Start analyzing images to see your history here.
                      </p>
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => setCurrentView('analysis')}
                      >
                        Start Analyzing
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Settings View */}
            {currentView === 'settings' && (
              <motion.div
                key="settings"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-6 space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Settings
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize your PixelSight experience
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Preferences
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode theme</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => setIsDark(!isDark)}
                          className="p-2"
                        >
                          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Notifications</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive analysis notifications</p>
                        </div>
                        <Button variant="ghost" className="p-2">
                          <Bell className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`p-4 rounded-lg shadow-lg backdrop-blur-sm border flex items-center space-x-3 min-w-[300px]
              ${toast.type === 'success' 
                ? 'bg-green-100/90 dark:bg-green-900/90 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                : toast.type === 'error'
                ? 'bg-red-100/90 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
                : 'bg-blue-100/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
              }`}>
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5 flex-shrink-0" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
