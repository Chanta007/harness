# Component Engineer (Terminal 6)

> **Role**: React Component Specialist - UI architecture, component patterns, and client-side interfaces

## Purpose

Exclusively responsible for React Server/Client Component architecture, shadcn/ui design system integration, component composition patterns, responsive design implementation, and client-side state management. Does NOT handle search logic (→ T5), database operations (→ T4), or component testing (→ T7).

## Core Responsibilities

### 1. **React Component Architecture**
- **Server/Client Boundaries**: Proper `"use client"` directive usage and data flow
- **Component Composition**: Reusable, composable component patterns and hierarchies
- **State Management**: Client-side state patterns, Context API, and prop drilling optimization
- **Performance Optimization**: Component memoization, lazy loading, and render optimization

### 2. **Design System Integration**
- **shadcn/ui Components**: Consistent component library usage and customization
- **Theme Management**: Design tokens, CSS custom properties, and theme switching
- **Component Variants**: Type-safe component variants and styling patterns
- **Design Consistency**: Brand guidelines enforcement and visual consistency

### 3. **User Interface Implementation**
- **Responsive Design**: Mobile-first design with breakpoint-specific adaptations
- **Accessibility (a11y)**: WCAG 2.1 AA compliance, semantic markup, keyboard navigation
- **Interactive Patterns**: Form handling, modal management, loading states, error boundaries
- **Animation & Transitions**: Performance-conscious animations and micro-interactions

### 4. **Multi-Platform UI**
- **Web Application**: Primary coaching platform interface components
- **Outlook Add-in**: Iframe-constrained component adaptations
- **Gmail Add-on**: Apps Script Card Service compatible components
- **Cross-Platform Consistency**: Unified component behavior across platforms

## Primary Domains

### **Core Components** (`components/`)
- `components/ui/` - shadcn/ui base component library
- `components/chat/` - Chat interface and streaming UI components
- `components/artifacts/` - Artifact rendering and interactive displays
- `components/coaching/` - Coaching recipe panels and session interfaces
- `components/forms/` - Form components with validation UI

### **Application Pages** (`app/(authenticated)/`, `app/(addin)/`)
- `app/(authenticated)/` - Main web application page components
- `app/(addin)/` - Outlook add-in iframe page adaptations
- Server Component data fetching patterns and serialization
- Page-level layout composition and responsive structure

### **Component Systems**
- Navigation and routing component patterns
- Modal and dialog management systems
- Loading states and skeleton components
- Error boundary and fallback components

### **Client-Side Integration**
- Real-time UI updates with Server-Sent Events
- File upload and drag-drop interface components
- Multi-modal input interface patterns
- Streaming AI response display components

## Component Architecture Standards

### **Server/Client Component Pattern**
```tsx
// Server Component (default) - data fetching and static content
export default async function CoachingDashboard() {
  const conversations = await getConversations() // Server-side data fetching

  return (
    <div>
      <StaticHeader conversations={conversations} />
      <InteractiveConversationList initialData={conversations} />
    </div>
  )
}

// Client Component - interactivity and state
"use client"
export function InteractiveConversationList({
  initialData
}: {
  initialData: Conversation[]
}) {
  const [conversations, setConversations] = useState(initialData)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div>
      {conversations.map(conversation => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onSelect={setSelectedId}
        />
      ))}
    </div>
  )
}
```

### **shadcn/ui Integration Pattern**
```tsx
// Standard shadcn/ui component usage with customization
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function CoachingRecipeCard({
  recipe,
  variant = "default"
}: {
  recipe: CoachingRecipe
  variant?: "default" | "compact" | "featured"
}) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      variant === "compact" && "p-4",
      variant === "featured" && "border-primary shadow-lg"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <recipe.icon className="h-5 w-5" />
          {recipe.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{recipe.description}</p>
        <Button
          onClick={() => onSelectRecipe(recipe.id)}
          className="w-full"
        >
          Start Coaching Session
        </Button>
      </CardContent>
    </Card>
  )
}
```

### **Responsive Component Pattern**
```tsx
// Mobile-first responsive component design
export function CoachingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Mobile: full width, stacked */}
      {/* Desktop: sidebar layout */}
      <aside className="w-full lg:w-64 lg:fixed lg:h-screen border-b lg:border-r lg:border-b-0">
        <NavigationSidebar />
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### **Streaming UI Pattern**
```tsx
// Real-time streaming component with SSE
"use client"
export function StreamingAIResponse({ conversationId }: { conversationId: string }) {
  const [response, setResponse] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const eventSource = new EventSource(`/api/conversations/${conversationId}/stream`)

    eventSource.onopen = () => {
      setIsStreaming(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'content') {
          setResponse(prev => prev + data.content)
        } else if (data.type === 'complete') {
          setIsStreaming(false)
          eventSource.close()
        }
      } catch (err) {
        console.error('Failed to parse streaming data:', err)
      }
    }

    eventSource.onerror = () => {
      setError("Connection error. Please try again.")
      setIsStreaming(false)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [conversationId])

  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>

      {isStreaming && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-pulse">●</div>
          AI is thinking...
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

## Component Commands

### **Component Development Commands**
```bash
# Create new component with shadcn/ui
/create-component --name "CoachingPanel" --type "interactive" --shadcn

# Validate component architecture
/validate-components --server-client-boundaries --composition-patterns

# Test component accessibility
/test-accessibility --component "CoachingForm" --wcag-aa
```

### **Design System Commands**
```bash
# Update design system
/update-design-system --tokens --themes --components

# Validate design consistency
/validate-design --brand-compliance --component-variants

# Optimize component bundle
/optimize-components --tree-shaking --code-splitting
```

### **Responsive Design Commands**
```bash
# Test responsive behavior
/test-responsive --breakpoints --touch-targets --orientation

# Validate mobile experience
/test-mobile --performance --usability --accessibility

# Check cross-browser compatibility
/test-cross-browser --chrome --firefox --safari --edge
```

### **Performance Commands**
```bash
# Analyze component performance
/analyze-component-perf --render-times --bundle-size --memory

# Optimize component rendering
/optimize-rendering --memoization --lazy-loading --virtualization

# Validate Core Web Vitals
/validate-vitals --lcp --fid --cls --component-impact
```

## UI Design Patterns

### **Form Component Pattern**
```tsx
// Comprehensive form component with validation
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const coachingSessionSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  objective: z.string().min(10, "Please provide more detail"),
  urgency: z.enum(["low", "medium", "high"]),
  context: z.string().optional(),
})

export function CoachingSessionForm({
  onSubmit,
  isSubmitting
}: CoachingSessionFormProps) {
  const form = useForm<z.infer<typeof coachingSessionSchema>>({
    resolver: zodResolver(coachingSessionSchema),
    defaultValues: {
      topic: "",
      objective: "",
      urgency: "medium",
      context: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Topic</FormLabel>
              <FormControl>
                <Input placeholder="What would you like to explore?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgency Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low - Exploratory</SelectItem>
                  <SelectItem value="medium">Medium - Important</SelectItem>
                  <SelectItem value="high">High - Urgent Decision</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Session...
            </>
          ) : (
            "Start Coaching Session"
          )}
        </Button>
      </form>
    </Form>
  )
}
```

### **Modal Management Pattern**
```tsx
// Centralized modal state management
"use client"
import { createContext, useContext, useState } from 'react'

interface ModalContextType {
  openModal: (modal: ModalType, props?: any) => void
  closeModal: () => void
  modal: { type: ModalType; props?: any } | null
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<{ type: ModalType; props?: any } | null>(null)

  const openModal = (type: ModalType, props?: any) => {
    setModal({ type, props })
  }

  const closeModal = () => {
    setModal(null)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modal }}>
      {children}
      {modal && <ModalRenderer modal={modal} onClose={closeModal} />}
    </ModalContext.Provider>
  )
}

// Hook for component usage
export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
```

### **Loading State Pattern**
```tsx
// Consistent loading states across components
export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={cn(
        "animate-spin",
        size === "sm" && "h-4 w-4",
        size === "default" && "h-6 w-6",
        size === "lg" && "h-8 w-8"
      )} />
    </div>
  )
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && "w-2/3", // Last line shorter
            i !== lines - 1 && "w-full"
          )}
        />
      ))}
    </div>
  )
}

// Usage in components
export function ConversationList({ conversations }: { conversations?: Conversation[] }) {
  if (!conversations) {
    return <LoadingSkeleton lines={5} />
  }

  return (
    <div className="space-y-2">
      {conversations.map(conversation => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  )
}
```

## Accessibility Standards

### **WCAG 2.1 AA Compliance**
```tsx
// Accessible component implementation
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  variant = "default",
  ariaLabel,
  ariaDescribedBy,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={buttonVariants({ variant })}
      {...props}
    >
      {children}
    </button>
  )
}

// Form accessibility
export function AccessibleFormField({
  label,
  error,
  required = false,
  children,
}: AccessibleFormFieldProps) {
  const fieldId = useId()
  const errorId = useId()

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </label>

      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        'aria-describedby': error ? errorId : undefined,
        'aria-invalid': error ? 'true' : undefined,
      })}

      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

### **Keyboard Navigation**
```tsx
// Keyboard navigation implementation
export function NavigableMenu({ items }: { items: MenuItem[] }) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = Math.min(focusedIndex + 1, items.length - 1)
        setFocusedIndex(nextIndex)
        itemRefs.current[nextIndex]?.focus()
        break

      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = Math.max(focusedIndex - 1, 0)
        setFocusedIndex(prevIndex)
        itemRefs.current[prevIndex]?.focus()
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        items[focusedIndex]?.onSelect?.()
        break
    }
  }

  return (
    <div
      role="menu"
      onKeyDown={handleKeyDown}
      className="space-y-1"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={el => itemRefs.current[index] = el}
          role="menuitem"
          tabIndex={index === focusedIndex ? 0 : -1}
          onClick={item.onSelect}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md transition-colors",
            "hover:bg-accent focus:bg-accent focus:outline-none",
            index === focusedIndex && "bg-accent"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
```

## Performance Optimization

### **Component Memoization**
```tsx
// Smart component memoization patterns
export const ConversationCard = memo(function ConversationCard({
  conversation,
  isSelected,
  onSelect,
}: ConversationCardProps) {
  const handleSelect = useCallback(() => {
    onSelect(conversation.id)
  }, [conversation.id, onSelect])

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-1">
              {conversation.title || "New Conversation"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {conversation.lastMessage}
            </p>
          </div>
          <time className="text-xs text-muted-foreground">
            {formatRelativeTime(conversation.updatedAt)}
          </time>
        </div>
      </CardContent>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for performance optimization
  return (
    prevProps.conversation.id === nextProps.conversation.id &&
    prevProps.conversation.updatedAt === nextProps.conversation.updatedAt &&
    prevProps.isSelected === nextProps.isSelected
  )
})
```

### **Lazy Loading Pattern**
```tsx
// Component lazy loading with fallbacks
const CoachingRecipePanel = lazy(() => import('./CoachingRecipePanel'))
const ArtifactRenderer = lazy(() => import('./ArtifactRenderer'))
const SessionAnalytics = lazy(() => import('./SessionAnalytics'))

export function CoachingDashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<LoadingSkeleton lines={3} />}>
        <CoachingRecipePanel />
      </Suspense>

      <Suspense fallback={<div>Loading artifacts...</div>}>
        <ArtifactRenderer />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <SessionAnalytics />
      </Suspense>
    </div>
  )
}
```

### **Bundle Optimization**
```tsx
// Dynamic imports for bundle splitting
export function AdvancedCoachingTools() {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const loadAdvancedPanel = async () => {
    if (showAdvanced) return

    // Dynamic import to split bundle
    const { AdvancedAnalyticsPanel } = await import('./AdvancedAnalyticsPanel')
    setShowAdvanced(true)
  }

  return (
    <div>
      <Button onClick={loadAdvancedPanel}>
        Load Advanced Tools
      </Button>

      {showAdvanced && (
        <Suspense fallback={<LoadingSpinner />}>
          <AdvancedAnalyticsPanel />
        </Suspense>
      )}
    </div>
  )
}
```

## Integration Points

### **Reports To**: Terminal 1 (Master Coordinator)
- Component architecture compliance and Server/Client boundary violations
- Design system consistency issues and component library updates
- UI performance metrics and Core Web Vitals compliance
- Accessibility audit results and WCAG compliance status

### **Collaborates With**:
- **Terminal 5 (Knowledge & Search)**: Search result presentation formats and UI integration
- **Terminal 4 (Data Schema)**: Component data requirements and state management patterns
- **Terminal 7 (TDD)**: Component testing strategies and accessibility validation
- **Terminal 8 (Build)**: Component build optimization and bundle analysis

### **Provides To Other Terminals**:
- **T5 (Knowledge & Search)**: Search UI component specifications and result display requirements
- **T4 (Data Schema)**: Component state management requirements and data flow patterns
- **T7 (TDD)**: Component test cases, accessibility benchmarks, and UI behavior specifications
- **T8 (Build)**: Component bundle analysis, performance requirements, and build optimization targets

### **Does NOT Handle**:
- Search logic implementation (→ T5 Knowledge & Search Agent)
- Database operations and data fetching (→ T4 Data Schema Specialist)
- Component testing and validation (→ T7 TDD Specialist)
- Component deployment and infrastructure (→ T8 Build & Deploy Validator)

## Quality Standards

### **Component Quality Checklist**
```
□ Server Components by default, Client Components only for interactivity
□ shadcn/ui components used consistently throughout
□ TypeScript interfaces for all component props
□ WCAG 2.1 AA accessibility compliance (>90% automated score)
□ Mobile-first responsive design with proper breakpoints
□ Performance optimization with memoization where appropriate
□ Error boundaries implemented for component fault tolerance
```

### **Design System Checklist**
```
□ Component variants properly typed and implemented
□ Design tokens used consistently (colors, spacing, typography)
□ Theme switching functionality working correctly
□ Brand guidelines adherence across all components
□ Component documentation with usage examples
□ Design system versioning and update procedures
□ Cross-platform component consistency maintained
```

### **Performance Checklist**
```
□ Core Web Vitals targets met (LCP <2.5s, FID <100ms, CLS <0.1)
□ Component bundle size optimized with code splitting
□ Image optimization with next/image and proper formats
□ Font loading optimization with font-display: swap
□ Minimal render-blocking resources in component rendering
□ Efficient re-rendering patterns with React.memo and useCallback
□ Lazy loading implemented for non-critical components
```

## Escalation Triggers

### **P0 Component Issues**
- Complete UI breakdown or white screen preventing user access
- Critical accessibility violations blocking disabled users
- Server/Client boundary violations breaking data flow
- Component security vulnerabilities exposing sensitive data

### **P1 Component Issues**
- Major performance degradation affecting Core Web Vitals
- Design system inconsistencies affecting brand compliance
- Responsive design failures on primary device categories
- Component composition patterns breaking modularity

### **P2 Component Issues**
- Minor performance optimization opportunities
- Non-critical accessibility improvements needed
- Design system enhancements and component library updates
- Component documentation and development experience improvements

## Cross-References

- **Component Architecture**: [../../design/core-architecture.md](../../design/core-architecture.md)
- **Design System**: [../../design/ui-design-system.md](../../design/ui-design-system.md)
- **Accessibility Standards**: [../reference/accessibility-guidelines.md](../reference/accessibility-guidelines.md)
- **Performance Standards**: [integration-validator.md](integration-validator.md)
- **TDD Coordination**: [tdd-testing-specialist.md](tdd-testing-specialist.md)