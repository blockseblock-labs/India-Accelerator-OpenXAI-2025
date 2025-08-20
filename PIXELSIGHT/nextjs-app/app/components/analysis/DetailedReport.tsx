'use client'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from './../../lib/utils'

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean
  glass?: boolean
}

export function Card({ className, hover, glass, children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }
          : undefined
      }
      className={cn(
        "rounded-xl border transition-all duration-200",
        glass
          ? "glass"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm",
        hover && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

export default function DetailedReport() {
  return (
    <div>
      <h1>Detailed Report</h1>
    </div>
  )
}
export function CardSubtitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
}
export function CardAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 border-t border-gray-200 dark:border-gray-700", className)} {...props} />
}
export function CardIcon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-gray-500 dark:text-gray-400", className)} {...props} />
}
export function CardButton({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
        className
      )}
      {...props}
    />
  )
}
export function CardLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 transition-colors",
        className
      )}
      {...props}
    />
  )
}
export function CardImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("rounded-lg", className)} {...props} />
}
