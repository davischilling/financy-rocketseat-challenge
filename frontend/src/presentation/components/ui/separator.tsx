import * as React from 'react'
import * as Separator from '@radix-ui/react-separator'
import { cn } from '@/presentation/utils/utils'

type SeparatorProps = React.ComponentPropsWithoutRef<typeof Separator.Root> & {
  text?: string
}

const SeparatorRoot = React.forwardRef<
  React.ElementRef<typeof Separator.Root>,
  React.ComponentPropsWithoutRef<typeof Separator.Root> & SeparatorProps
>(({ className, orientation = 'horizontal', text, ...props }, ref) => {
  if (text && orientation === 'horizontal') {
    return (
      <div className='flex items-center w-full flex-row gap-2'>
        <Separator.Root
          ref={ref}
          className={cn(
            'flex-1 bg-muted data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px',
            className
          )}
          orientation={orientation}
          {...props}
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">{text}</span>
        <Separator.Root
          className={cn(
            'flex-1 bg-muted data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px',
            className
          )}
          orientation={orientation}
          {...props}
        />
      </div>
    )
  }

  return (
    <Separator.Root
      ref={ref}
      className={cn(
        'bg-muted data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px',
        className
      )}
      orientation={orientation}
      {...props}
    />
  )
})
SeparatorRoot.displayName = Separator.Root.displayName

export { SeparatorRoot as Separator }