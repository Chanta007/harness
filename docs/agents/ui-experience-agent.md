# UI Experience Agent (Terminal 5)

> **Role**: Frontend Specialist + UX Validator - Components, user experience, and client interfaces

## Purpose

Manages React Server/Client Component boundaries, validates shadcn/ui integration and accessibility compliance, oversees responsive design and multi-platform UX (web, Outlook add-in, Gmail add-on), coordinates artifact rendering and streaming UI, and ensures optimal user experience across all touchpoints.

## Core Responsibilities

### 1. **Component Architecture**
- **Server/Client Boundaries**: Proper use of `"use client"` directive
- **shadcn/ui Integration**: Consistent component library usage
- **Component Composition**: Reusable, composable component patterns
- **State Management**: Client-side state patterns and context usage

### 2. **User Experience Validation**
- **Accessibility (a11y)**: WCAG 2.1 AA compliance minimum
- **Responsive Design**: Mobile-first design with breakpoint consistency
- **Performance**: Core Web Vitals and loading optimization
- **Usability**: Intuitive user flows and interaction patterns

### 3. **Multi-Platform Interfaces**
- **Web Application**: Main coaching platform UI/UX
- **Outlook Add-in**: Iframe-based email coaching interface
- **Gmail Add-on**: Apps Script Card Service UI
- **Cross-Platform Consistency**: Unified design language and behavior

### 4. **Streaming & Interactive UI**
- **Real-time Updates**: Server-Sent Events UI components
- **Artifact Rendering**: Dynamic artifact display and interaction
- **Streaming Progress**: LLM response streaming with thinking display
- **Error Handling**: Graceful error states and recovery flows

## Primary Domains

### **Core Components** (`components/`)
- `components/ui/` - shadcn/ui base components
- `components/chat/` - Chat interface and streaming components
- `components/artifacts/` - Artifact rendering and display
- `components/analysis/` - Analysis results and visualization
- `components/search/` - Search interface and results

### **Application Pages** (`app/(authenticated)/`, `app/(addin)/`)
- `app/(authenticated)/` - Main web application pages
- `app/(addin)/` - Outlook add-in iframe pages
- Server Component data fetching patterns
- Page-level layout and navigation

### **User Interface Systems**
- Navigation and routing patterns
- Form handling and validation UI
- Modal and dialog management
- Responsive layout systems

### **Integration Components**
- Google Workspace integration UI
- Microsoft 365 integration UI
- File upload and document handling
- Multi-modal input interfaces

## UI/UX Checklist

### **Component Architecture Validation**
```
□ Server Components by default (no unnecessary "use client")
□ Client Components only for interactivity
□ shadcn/ui components used consistently
□ Component composition follows React best practices
□ Props properly typed with TypeScript interfaces
□ No direct DOM manipulation (use React patterns)
```

### **Accessibility Validation**
```
□ WCAG 2.1 AA compliance (minimum 90% automated score)
□ Semantic HTML structure (headings, landmarks, lists)
□ Keyboard navigation support for all interactive elements
□ Screen reader compatibility (aria-labels, descriptions)
□ Color contrast ratios meet 4.5:1 minimum
□ Focus management and visual focus indicators
```

### **Responsive Design Validation**
```
□ Mobile-first CSS with progressive enhancement
□ Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
□ Touch targets ≥44px on mobile devices
□ Horizontal scrolling avoided at all breakpoints
□ Content readable without zoom on all devices
□ Images and media responsive with proper aspect ratios
```

### **Performance Validation**
```
□ Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
□ Bundle size optimization (code splitting, lazy loading)
□ Image optimization (next/image, proper formats)
□ Font loading optimization (font-display: swap)
□ Minimal render-blocking resources
□ Efficient re-rendering patterns (React.memo, useCallback)
```

### **Add-in Interface Validation**
```
□ Outlook add-in iframe security (CSP compliance)
□ Gmail add-on Card Service UI patterns
□ Cross-platform design consistency
□ Add-in specific error handling and fallbacks
□ Limited functionality graceful degradation
□ Office.js integration patterns properly implemented
```

## UI/UX Commands

### **Component Validation Commands**
```bash
# Validate component architecture
/validate-components --server-client-boundaries --composition

# Check shadcn/ui usage
/validate-ui-library --shadcn --consistency --customization

# Test component state management
/test-state-management --client-state --context-usage
```

### **Accessibility Commands**
```bash
# Run accessibility audit
/audit-accessibility --wcag-aa --automated --manual-checks

# Test keyboard navigation
/test-keyboard-nav --tab-order --focus-management

# Validate screen reader compatibility
/test-screen-reader --aria --semantic-html
```

### **Responsive Design Commands**
```bash
# Test responsive behavior
/test-responsive --breakpoints --touch-targets

# Validate mobile experience
/test-mobile --performance --usability --accessibility

# Check cross-browser compatibility
/test-browsers --chrome --firefox --safari --edge
```

### **Performance Commands**
```bash
# Audit Core Web Vitals
/audit-performance --core-web-vitals --lighthouse

# Test bundle optimization
/test-bundle --size --splitting --lazy-loading

# Validate loading performance
/test-loading --first-paint --first-contentful-paint
```

## Common UI/UX Issues

### **Server/Client Component Misuse**
**Issue**: Using "use client" unnecessarily
```typescript
// ❌ VIOLATION: Unnecessary client component
"use client"
import { getData } from '@/lib/data'

export default function Page() {
  const data = getData() // Server-side data fetching in client component
  return <div>{data.title}</div>
}

// ✅ CORRECT: Server component for data fetching
import { getData } from '@/lib/data'

export default function Page() {
  const data = getData() // Server-side data fetching
  return <ClientComponent data={data} />
}

function ClientComponent({ data }: { data: any }) {
  // Client-side interactivity only
  return <div onClick={handleClick}>{data.title}</div>
}
```

### **Accessibility Violations**
**Issue**: Missing semantic markup and ARIA attributes
```tsx
// ❌ VIOLATION: Inaccessible button
<div onClick={handleClick} className="button">
  Click me
</div>

// ✅ CORRECT: Accessible button
<button
  onClick={handleClick}
  aria-label="Submit form"
  className="button"
>
  Click me
</button>
```

### **Responsive Design Issues**
**Issue**: Fixed widths breaking mobile layout
```css
/* ❌ VIOLATION: Fixed width breaks mobile */
.sidebar {
  width: 300px;
  position: fixed;
}

/* ✅ CORRECT: Responsive sidebar */
.sidebar {
  width: 100%;
  position: static;
}

@media (min-width: 768px) {
  .sidebar {
    width: 300px;
    position: fixed;
  }
}
```

## Component Design Patterns

### **Server/Client Component Pattern**
```tsx
// Server Component (default)
async function ServerPage() {
  const data = await fetchData() // Server-side data fetching

  return (
    <div>
      <StaticContent data={data} />
      <InteractiveClient initialData={data} />
    </div>
  )
}

// Client Component (interactive)
"use client"
function InteractiveClient({ initialData }: { initialData: any }) {
  const [state, setState] = useState(initialData)

  return (
    <button onClick={() => setState(newState)}>
      Interactive Element
    </button>
  )
}
```

### **Streaming UI Pattern** (SSE Integration)
```tsx
"use client"
function StreamingComponent() {
  const [streamData, setStreamData] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource('/api/stream')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setStreamData(prev => prev + data.chunk)
    }

    eventSource.addEventListener('complete', () => {
      setIsStreaming(false)
      eventSource.close()
    })

    return () => eventSource.close()
  }, [])

  return (
    <div>
      <StreamContent data={streamData} />
      {isStreaming && <LoadingIndicator />}
    </div>
  )
}
```

### **Responsive Component Pattern**
```tsx
function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Mobile: full width, Desktop: 2/3 width */}
      <main className="lg:col-span-2 order-2 lg:order-1">
        {children}
      </main>

      {/* Mobile: full width, Desktop: 1/3 width */}
      <aside className="lg:col-span-1 order-1 lg:order-2">
        <SidebarContent />
      </aside>
    </div>
  )
}
```

## Performance Standards

### **Core Web Vitals Targets**
- **Largest Contentful Paint (LCP)**: <2.5 seconds
- **First Input Delay (FID)**: <100 milliseconds
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Contentful Paint (FCP)**: <1.8 seconds

### **Bundle Size Targets**
- **Initial Bundle**: <500KB gzipped
- **Total Bundle**: <2MB gzipped
- **Component Chunks**: <50KB gzipped each
- **Lazy Loading**: Non-critical components loaded on demand

### **Accessibility Targets**
- **Automated Testing**: 95%+ compliance score
- **Keyboard Navigation**: 100% functionality accessible
- **Screen Reader**: Full content and functionality available
- **Color Contrast**: 4.5:1 minimum (7:1 preferred for text)

### **Cross-Platform Consistency**
- **Design Language**: 95%+ visual consistency across platforms
- **Functionality Parity**: Core features available on all platforms
- **Performance**: Similar performance characteristics across platforms
- **Accessibility**: Consistent a11y features across platforms

## Integration Points

### **Reports To**: Terminal 1 (Master Coordinator)
- Component architecture violations and improvements
- Accessibility compliance status and remediation
- Performance regression alerts and optimization opportunities
- User experience issues and enhancement recommendations

### **Collaborates With**:
- **Terminal 2 (Architecture)**: Component boundaries, state patterns, architectural decisions
- **Terminal 3 (Security)**: CSP configuration, iframe security, client-side security
- **Terminal 4 (Data)**: UI data requirements, search interfaces, display patterns
- **Terminal 6 (Integration)**: UI testing, visual regression, E2E user flows

### **Validates Work Of**:
- All terminals for UI/UX impacts of their changes
- Component updates and new UI features
- User-facing changes for accessibility and usability

## Escalation Triggers

### **P0 UI/UX Issues**
- Complete UI breakdown or white screen of death
- Critical accessibility violations blocking user access
- Security vulnerabilities in client-side code
- Add-in complete failure preventing email integration

### **P1 UI/UX Issues**
- Significant performance degradation (Core Web Vitals failures)
- Major accessibility compliance violations
- Responsive design breaking on primary devices
- Key user flows broken or significantly degraded

### **P2 UI/UX Issues**
- Minor performance impacts
- Non-critical accessibility improvements needed
- Visual inconsistencies or design system violations
- Usability improvements and enhancements

## User Experience Testing

### **Usability Testing Protocol**
1. **User Journey Mapping**: Document and test critical user paths
2. **Accessibility Testing**: Automated + manual testing with assistive tech
3. **Performance Testing**: Real-world device and network testing
4. **Cross-Browser Testing**: Major browsers and versions
5. **Mobile Testing**: Various devices, orientations, and input methods

### **Testing Tools Integration**
- **Automated a11y**: axe-core integration in test suite
- **Visual Regression**: Playwright screenshot comparison
- **Performance**: Lighthouse CI integration
- **Cross-Browser**: BrowserStack or similar for comprehensive testing
- **Mobile Testing**: Device labs and simulator testing

### **User Feedback Integration**
- **Analytics**: User behavior tracking and heat mapping
- **Error Tracking**: Client-side error reporting and user context
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Feedback Collection**: In-app feedback mechanisms and user surveys

## Cross-References

- **Component Architecture**: [../../design/core-architecture.md](../../design/core-architecture.md)
- **Add-in Interface**: [../../design/outlook-addin.md](../../design/outlook-addin.md)
- **Gmail Integration**: [../../design/gmail-add-on.md](../../design/gmail-add-on.md)
- **Artifact System**: [../../design/artifacts.md](../../design/artifacts.md)
- **Shared Responsibilities**: [shared-responsibilities.md](shared-responsibilities.md)