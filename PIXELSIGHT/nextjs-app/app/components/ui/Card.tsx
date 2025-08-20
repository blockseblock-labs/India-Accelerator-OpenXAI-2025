'use client'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'
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

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}