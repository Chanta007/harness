# Build & Deploy Validator (Terminal 8)

> **Role**: Build & Deployment Specialist - CI/CD, production builds, and deployment validation

## Purpose

Exclusively responsible for TypeScript compilation validation, Next.js production build processes, CI/CD pipeline management, deployment validation, and system integration verification. Does NOT handle unit testing (→ T7), component testing (→ T7), or database operations (→ T4).

## Core Responsibilities

### 1. **Build System Validation**
- **TypeScript Compilation**: Zero compilation errors with strict type checking
- **Production Builds**: Next.js build optimization and bundle validation
- **Dependency Management**: Package security audits and compatibility verification
- **Asset Optimization**: Bundle analysis, tree shaking, and code splitting validation

### 2. **CI/CD Pipeline Management**
- **Build Pipeline**: Automated build processes and quality gates
- **Deployment Pipeline**: Staging and production deployment validation
- **Environment Management**: Configuration validation across environments
- **Pipeline Optimization**: Build time optimization and resource efficiency

### 3. **Deployment Validation**
- **Health Checks**: Post-deployment system health verification
- **Performance Validation**: Production performance benchmark compliance
- **Integration Testing**: Cross-service integration verification
- **Rollback Procedures**: Deployment failure recovery and rollback automation

### 4. **System Integration**
- **Infrastructure Validation**: Database connectivity and external service health
- **Configuration Verification**: Environment variable and secret management
- **Monitoring Setup**: Observability and alerting system configuration
- **Security Scanning**: Deployment security validation and compliance

## Primary Domains

### **Build Configuration** (`package.json`, `next.config.ts`, `tsconfig.json`)
- Build scripts and dependency management optimization
- Next.js build configuration and performance tuning
- TypeScript compilation settings and strict mode enforcement
- Build artifact generation and verification

### **CI/CD Infrastructure** (`.github/workflows/`, `Dockerfile`)
- GitHub Actions workflow configuration and optimization
- Docker build processes and multi-stage optimization
- Environment-specific deployment strategies
- Automated testing integration and quality gates

### **Deployment Systems**
- Production deployment validation and monitoring
- Staging environment management and testing
- Database migration coordination during deployments
- External service integration verification

### **Monitoring & Observability**
- Build performance metrics and optimization tracking
- Deployment success/failure monitoring and alerting
- System health monitoring and dashboard configuration
- Performance regression detection and alerting

## Build & Deployment Commands

### **Build Validation Commands**
```bash
# Validate complete build process
/validate-build --typescript --production --optimization --security

# Check build performance
/analyze-build-perf --bundle-size --build-time --resource-usage

# Validate dependencies
/audit-dependencies --security --compatibility --updates --licenses
```

### **TypeScript Commands**
```bash
# Validate TypeScript compilation
/validate-typescript --strict --no-emit --incremental

# Check type coverage
/analyze-types --coverage --strict-compliance --unused-types

# Optimize TypeScript build
/optimize-typescript --build-cache --incremental-builds
```

### **Deployment Commands**
```bash
# Validate deployment readiness
/validate-deployment --health-checks --migrations --config

# Deploy to staging
/deploy-staging --build --migrate --validate --smoke-test

# Deploy to production
/deploy-production --blue-green --health-check --rollback-ready
```

### **CI/CD Commands**
```bash
# Validate CI/CD pipeline
/validate-pipeline --workflows --environments --secrets

# Optimize build pipeline
/optimize-pipeline --parallel-jobs --caching --resource-allocation

# Monitor pipeline health
/monitor-pipeline --success-rates --build-times --failure-analysis
```

## Build System Architecture

### **TypeScript Compilation Pattern**
```json
// Strict TypeScript configuration for production builds
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "noPropertyAccessFromIndexSignature": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

### **Next.js Build Optimization**
```typescript
// Production-optimized Next.js configuration
const nextConfig: NextConfig = {
  // Build optimization
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Bundle optimization
  experimental: {
    optimizePackageImports: ['@/lib', 'lucide-react'],
    bundlePagesRouterDependencies: true,
  },

  // Performance optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Build validation
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['src', 'app', 'components', 'lib'],
  },

  // Output optimization
  output: 'standalone',
  compress: true,
}
```

### **CI/CD Pipeline Pattern**
```yaml
# GitHub Actions workflow for build and deployment
name: Build and Deploy
on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --frozen-lockfile

      - name: TypeScript compilation check
        run: npx tsc --noEmit

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage --passWithNoTests

      - name: Build production
        run: npm run build
        env:
          NODE_ENV: production

      - name: Validate build artifacts
        run: |
          ls -la .next/
          test -f .next/BUILD_ID
          test -d .next/static

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run security audit
        run: npm audit --audit-level moderate

      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD

  deploy-staging:
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          # Deployment logic here
          echo "Deploying to staging environment"

      - name: Run smoke tests
        run: |
          # Basic functionality verification
          curl -f $STAGING_URL/api/health

  deploy-production:
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          # Blue-green deployment logic
          echo "Deploying to production environment"

      - name: Validate deployment
        run: |
          # Comprehensive health checks
          npm run validate:production
```

### **Docker Build Pattern**
```dockerfile
# Multi-stage Docker build for production optimization
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
COPY . .
RUN npm ci
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
```

## Build Quality Standards

### **TypeScript Build Requirements**
- **Zero Compilation Errors**: Strict mode with no `any` types in production
- **Type Coverage**: >95% type coverage across codebase
- **Build Performance**: <2 minutes for incremental builds, <5 minutes for clean builds
- **Bundle Optimization**: <500KB initial bundle, <2MB total bundle size

### **Production Build Standards**
```bash
# Required build validation steps
npm run type-check     # TypeScript compilation
npm run lint          # ESLint compliance
npm test             # Unit test suite
npm run build        # Production build
npm run analyze      # Bundle analysis
```

### **Dependency Management Standards**
- **Security**: Zero high/critical vulnerability packages
- **Licensing**: All dependencies license-compatible with project
- **Updates**: Monthly dependency update cycle with security patches immediate
- **Size**: Dependencies contributing to bundle size tracked and optimized

## Deployment Validation Framework

### **Pre-Deployment Checks**
```typescript
// Automated deployment readiness validation
interface DeploymentChecklist {
  buildSuccess: boolean
  testsPass: boolean
  securityScanClean: boolean
  configValid: boolean
  migrationsReady: boolean
  rollbackPlan: boolean
}

export async function validateDeploymentReadiness(): Promise<DeploymentChecklist> {
  return {
    buildSuccess: await validateBuildArtifacts(),
    testsPass: await validateTestSuite(),
    securityScanClean: await validateSecurityScan(),
    configValid: await validateEnvironmentConfig(),
    migrationsReady: await validateDatabaseMigrations(),
    rollbackPlan: await validateRollbackProcedure(),
  }
}
```

### **Health Check Pattern**
```typescript
// Post-deployment health validation
export async function validateDeploymentHealth(): Promise<HealthStatus> {
  const checks = await Promise.allSettled([
    checkDatabaseConnectivity(),
    checkExternalServiceHealth(),
    checkApplicationEndpoints(),
    checkPerformanceMetrics(),
    checkErrorRates(),
  ])

  return {
    status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'degraded',
    checks: checks.map((check, index) => ({
      name: HEALTH_CHECK_NAMES[index],
      status: check.status,
      details: check.status === 'fulfilled' ? check.value : check.reason,
      timestamp: new Date().toISOString(),
    })),
  }
}
```

### **Rollback Automation**
```typescript
// Automated rollback on deployment failure
export async function executeRollback(deploymentId: string): Promise<RollbackResult> {
  try {
    // Stop health check monitoring
    await stopHealthMonitoring(deploymentId)

    // Revert to previous deployment
    await revertToLastKnownGood()

    // Validate rollback success
    const healthCheck = await validateDeploymentHealth()

    if (healthCheck.status === 'healthy') {
      await notifyRollbackSuccess(deploymentId)
      return { status: 'success', deploymentId }
    } else {
      await escalateRollbackFailure(deploymentId)
      return { status: 'failed', deploymentId }
    }
  } catch (error) {
    await escalateRollbackFailure(deploymentId, error)
    return { status: 'error', deploymentId, error }
  }
}
```

## CI/CD Pipeline Optimization

### **Build Optimization Strategies**
```yaml
# Optimized pipeline with caching and parallelization
build_optimization:
  caching:
    node_modules: npm_cache_key
    next_cache: build_cache_key
    typescript: tsc_cache_key

  parallelization:
    type_check: "npx tsc --noEmit"
    lint_check: "npm run lint"
    test_suite: "npm test"
    security_scan: "npm audit"

  incremental_builds:
    enabled: true
    cache_strategy: "aggressive"
    invalidation: "content_hash"

performance_targets:
  total_pipeline: "< 8 minutes"
  build_stage: "< 3 minutes"
  test_stage: "< 2 minutes"
  deployment: "< 3 minutes"
```

### **Environment Management**
```typescript
// Environment-specific configuration validation
interface EnvironmentConfig {
  name: 'development' | 'staging' | 'production'
  database: DatabaseConfig
  externalServices: ServiceConfig[]
  secrets: SecretConfig[]
  monitoring: MonitoringConfig
}

export function validateEnvironmentConfig(env: EnvironmentConfig): ValidationResult {
  const validations = [
    validateDatabaseConfig(env.database),
    validateExternalServices(env.externalServices),
    validateSecrets(env.secrets),
    validateMonitoringSetup(env.monitoring),
  ]

  return {
    valid: validations.every(v => v.valid),
    errors: validations.flatMap(v => v.errors),
    warnings: validations.flatMap(v => v.warnings),
  }
}
```

### **Monitoring Integration**
```typescript
// Build and deployment monitoring setup
export class BuildMonitor {
  async trackBuildMetrics(buildId: string, metrics: BuildMetrics): Promise<void> {
    await Promise.all([
      this.recordBuildTime(buildId, metrics.duration),
      this.recordBundleSize(buildId, metrics.bundleSize),
      this.recordDependencyCount(buildId, metrics.dependencies),
      this.recordTypeScriptErrors(buildId, metrics.typeErrors),
    ])
  }

  async trackDeploymentHealth(deploymentId: string): Promise<void> {
    const interval = setInterval(async () => {
      const health = await validateDeploymentHealth()

      if (health.status === 'degraded') {
        await this.alertDeploymentIssue(deploymentId, health)
      }

      await this.recordHealthMetrics(deploymentId, health)
    }, 30000) // Check every 30 seconds

    // Stop monitoring after 10 minutes if healthy
    setTimeout(() => clearInterval(interval), 600000)
  }
}
```

## Integration Points

### **Reports To**: Terminal 1 (Master Coordinator)
- Build success/failure status with detailed error analysis
- Deployment health monitoring and performance metrics
- CI/CD pipeline optimization recommendations and bottleneck identification
- Security scan results and compliance status reporting

### **Collaborates With**:
- **Terminal 7 (TDD)**: Integration with test execution and coverage requirements
- **Terminal 4 (Data Schema)**: Database migration coordination during deployments
- **Terminal 3 (Security)**: Security scanning integration and vulnerability management
- **Terminal 6 (Component)**: Component bundle analysis and performance optimization

### **Validates Work Of**:
- All terminals for build impact and integration requirements
- Cross-terminal changes for deployment readiness and compatibility
- System-wide configuration changes for environment consistency

### **Does NOT Handle**:
- Unit test implementation (→ T7 TDD Specialist)
- Component-specific testing (→ T7 TDD Specialist)
- Database schema design (→ T4 Data Schema Specialist)
- Security policy implementation (→ T3 Security Guardian)

## Performance Standards

### **Build Performance Targets**
- **TypeScript Compilation**: <30 seconds for incremental, <2 minutes for clean
- **Production Build**: <3 minutes for Next.js build with optimization
- **Docker Build**: <5 minutes for multi-stage production image
- **Bundle Analysis**: <10 seconds for size and dependency analysis

### **Deployment Performance Targets**
- **Staging Deployment**: <2 minutes from build completion
- **Production Deployment**: <3 minutes with health check validation
- **Health Check Validation**: <30 seconds for comprehensive checks
- **Rollback Execution**: <1 minute for automated rollback procedures

### **CI/CD Performance Standards**
```yaml
pipeline_performance:
  total_duration: "< 8 minutes"
  parallel_job_efficiency: "> 80%"
  cache_hit_rate: "> 90%"
  build_success_rate: "> 95%"

deployment_reliability:
  deployment_success_rate: "> 99%"
  rollback_success_rate: "100%"
  downtime_per_deployment: "< 30 seconds"
  health_check_accuracy: "> 98%"
```

## Quality Assurance Standards

### **Build Quality Checklist**
```
□ TypeScript compilation successful with zero errors
□ ESLint compliance with no violations
□ Production build completes without failures
□ Bundle size within configured limits (<500KB initial)
□ All dependencies security-audited and clean
□ Docker build successful with optimized layers
□ Build artifacts properly structured and accessible
```

### **Deployment Quality Checklist**
```
□ Environment configuration validated and complete
□ Database migrations executed successfully
□ External service connectivity verified
□ Health checks passing across all endpoints
□ Performance metrics within acceptable ranges
□ Error monitoring configured and functioning
□ Rollback procedures tested and ready
```

### **CI/CD Quality Checklist**
```
□ Pipeline workflows validated and optimized
□ Environment-specific configurations correct
□ Secret management secure and auditable
□ Build caching efficient and reliable
□ Parallel execution optimized for performance
□ Failure notifications and escalation configured
□ Pipeline metrics monitoring and alerting active
```

## Escalation Triggers

### **P0 Build/Deploy Issues**
- Complete build system failure preventing all deployments
- Production deployment failure with rollback unsuccessful
- Critical security vulnerabilities in deployment pipeline
- Data loss or corruption during deployment process

### **P1 Build/Deploy Issues**
- Build performance degradation >50% from baseline
- Deployment success rate below 95% threshold
- Security scan failures blocking deployments
- CI/CD pipeline instability affecting development velocity

### **P2 Build/Deploy Issues**
- Minor build optimization opportunities identified
- Dependency updates requiring compatibility validation
- Pipeline configuration improvements needed
- Monitoring and alerting enhancements required

## Cross-References

- **Build Configuration**: [../../design/build-system.md](../../design/build-system.md)
- **Deployment Strategy**: [../../design/deployment.md](../../design/deployment.md)
- **CI/CD Patterns**: [../reference/ci-cd-patterns.md](../reference/ci-cd-patterns.md)
- **TDD Integration**: [tdd-testing-specialist.md](tdd-testing-specialist.md)
- **Security Coordination**: [security-guardian.md](security-guardian.md)