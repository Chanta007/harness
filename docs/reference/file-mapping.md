# File-to-Terminal Mapping Reference

> **Quick lookup: Which terminal is responsible for which files**

## Terminal Responsibility Matrix

| File Pattern | Responsible Terminal | Agent Role | Priority |
|--------------|---------------------|------------|----------|
| `lib/ai/**` | T2 (Architecture Guardian) | Architecture Enforcer | Primary |
| `lib/auth/**` | T3 (Security Enforcer) | Security Validator | Primary |
| `lib/encryption.ts` | T3 (Security Enforcer) | Security Validator | Primary |
| `lib/rate-limit.ts` | T3 (Security Enforcer) | Security Validator | Primary |
| `prisma/**` | T4 (Data Guardian) | Data Specialist | Primary |
| `lib/prisma.ts` | T4 (Data Guardian) | Data Specialist | Primary |
| `lib/knowledge/**` | T4 (Data Guardian) | Data Specialist | Primary |
| `lib/analysis/**` | T4 (Data Guardian) | Data Specialist | Primary |
| `components/**` | T5 (UI Experience Agent) | Frontend Specialist | Primary |
| `app/(authenticated)/**` | T5 (UI Experience Agent) | Frontend Specialist | Primary |
| `app/(addin)/**` | T5 (UI Experience Agent) | Frontend Specialist | Primary |
| `__tests__/**` | T6 (Integration Validator) | QA Specialist | Primary |
| `vitest.config.ts` | T6 (Integration Validator) | QA Specialist | Primary |
| `playwright.config.ts` | T6 (Integration Validator) | QA Specialist | Primary |

## Shared File Coordination

### **Requires Master Coordinator (T1) Mediation**

| Shared File | Primary Owner | Secondary Stakeholders | Conflict Resolution |
|-------------|---------------|-------------------------|-------------------|
| `package.json` | T6 (Integration) | T2 (arch deps), T5 (UI deps) | Sequential merge validation |
| `prisma/schema.prisma` | T4 (Data Guardian) | T3 (auth models), T5 (UI relations) | Schema compatibility check |
| `CONSTRAINTS.md` | T1 (Coordinator) | All terminals | Cross-agent review required |
| `next.config.ts` | T5 (UI Experience) | T3 (security headers), T6 (build) | Configuration merge validation |
| `proxy.ts` | T3 (Security) | T5 (CORS for UI), T2 (API routing) | Security-first priority |

## API Route Ownership

### **Route-to-Terminal Mapping**

| Route Pattern | Primary Terminal | Validation Requirements |
|---------------|------------------|------------------------|
| `app/api/auth/**` | T3 (Security) | Auth gateway compliance |
| `app/api/conversations/**` | T4 (Data Guardian) | Data integrity, embedding |
| `app/api/coaching-recipes/**` | T2 (Architecture) | Factory patterns, plugins |
| `app/api/artifacts/**` | T2 (Architecture) | Registry patterns |
| `app/api/addin/**` | T5 (UI Experience) | Add-in security, UX |
| `app/api/search/**` | T4 (Data Guardian) | RAG pipeline, embeddings |
| `app/api/telemetry/**` | T6 (Integration) | Observability compliance |

## Cross-Domain File Changes

### **Multi-Terminal Coordination Required**

#### **LLM Factory Changes** (`lib/ai/llm-factory.ts`)
```yaml
Primary: T2 (Architecture Guardian)
  - Factory pattern compliance
  - Model registry updates
  - Provider abstraction

Secondary_Validation:
  T3 (Security): API key handling, rate limiting
  T4 (Data): Usage tracking, audit logs
  T5 (UI): Model selection UI updates
  T6 (Integration): Provider integration tests
```

#### **Schema Changes** (`prisma/schema.prisma`)
```yaml
Primary: T4 (Data Guardian)
  - Migration safety
  - Data integrity
  - Relationship validation

Secondary_Validation:
  T3 (Security): Auth model changes, encrypted fields
  T5 (UI): UI component data dependencies
  T6 (Integration): Migration tests, rollback procedures
```

#### **Auth Changes** (`lib/auth/auth-gateway.ts`)
```yaml
Primary: T3 (Security Enforcer)
  - Security pattern compliance
  - Permission validation
  - Audit logging

Secondary_Validation:
  T2 (Architecture): Gateway pattern adherence
  T4 (Data): User model integration
  T5 (UI): Auth UI component updates
  T6 (Integration): Auth flow E2E tests
```

## Workflow Assignment Logic

### **Task Routing by File Pattern**
```javascript
function routeTaskByFiles(changedFiles) {
  const routing = {
    primary: null,
    secondary: [],
    coordination: false
  }

  // Primary terminal assignment
  if (changedFiles.some(f => f.startsWith('lib/ai/'))) {
    routing.primary = 'T2-Architecture'
  } else if (changedFiles.some(f => f.startsWith('lib/auth/'))) {
    routing.primary = 'T3-Security'
  } else if (changedFiles.some(f => f.startsWith('prisma/'))) {
    routing.primary = 'T4-Data'
  } else if (changedFiles.some(f => f.startsWith('components/'))) {
    routing.primary = 'T5-UI'
  } else if (changedFiles.some(f => f.includes('test'))) {
    routing.primary = 'T6-Integration'
  }

  // Secondary terminal involvement
  if (changedFiles.includes('package.json')) {
    routing.secondary.push('T6-Integration')
    routing.coordination = true
  }

  if (changedFiles.includes('prisma/schema.prisma')) {
    routing.secondary.push('T3-Security', 'T5-UI')
    routing.coordination = true
  }

  return routing
}
```

### **Follow-Up Assignment Chains**
```yaml
LLM_Provider_Addition:
  T2: Add provider → factory registration
  T3: Validate API key security → rate limits
  T5: Update model selection UI → recipe integration
  T6: Add provider tests → E2E validation

Security_Vulnerability_Fix:
  T3: Patch vulnerability → security validation
  T6: Add regression tests → security test suite
  T4: Update audit logs → incident tracking
  T1: Final integration → deploy validation

UI_Component_Addition:
  T5: Create component → accessibility validation
  T2: Validate component architecture → patterns
  T6: Add component tests → visual regression
  T1: Integration validation → documentation update
```

## Conflict Resolution Priorities

### **Priority Order for Shared Files**
1. **Security (T3)** - Auth, encryption, security headers take precedence
2. **Data Integrity (T4)** - Schema changes, data safety prioritized
3. **Architecture (T2)** - Pattern compliance, system boundaries
4. **Integration (T6)** - Build system, test configuration
5. **UI (T5)** - Frontend concerns, user experience

### **Escalation Thresholds**
- **Immediate (P0)**: Security vulnerabilities, data loss risks
- **High (P1)**: Build failures, pattern violations, test failures
- **Medium (P2)**: Documentation inconsistencies, style violations
- **Low (P3)**: Performance optimizations, refactoring suggestions

## Usage Examples

### **Single Domain Change**
```bash
# Files changed: lib/ai/anthropic-provider.ts
# Auto-route to: T2 (Architecture Guardian)
/assign-terminal T2 --files lib/ai/anthropic-provider.ts --domain architecture
```

### **Cross-Domain Change**
```bash
# Files changed: lib/auth/auth-gateway.ts, prisma/schema.prisma
# Primary: T3 (Security) | Secondary: T4 (Data)
# Coordination required via T1 (Master)
/coordinate-change --primary T3 --secondary T4 --shared-files schema
```

### **Emergency Security Change**
```bash
# Files changed: lib/encryption.ts, lib/auth/auth-provider.ts
# Priority escalation: P0 security
# All terminals validate security implications
/emergency-security --priority P0 --validate-all-terminals
```

---

**Usage**: Use this mapping for quick terminal assignment and conflict detection. When in doubt, escalate to Terminal 1 (Master Coordinator) for orchestration decisions.