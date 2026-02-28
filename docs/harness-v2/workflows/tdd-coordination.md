# TDD Coordination Protocols

> **Cross-Terminal TDD Workflow Management**: Red-Green-Refactor coordination across the 8-terminal system

## Overview

This document defines the coordination protocols for Test-Driven Development (TDD) across the Harness Engineering v3 8-terminal system. Terminal 7 (TDD Specialist) leads the red-green-refactor cycles while other terminals provide domain-specific implementation.

## TDD Cycle Architecture

### **3-Phase Coordination Pattern**
```
RED Phase (2-5 min)
  Terminal 7: Write failing test for requirement
  ↓ Signal to Terminal 1

GREEN Phase (5-15 min)
  Terminal 1: Route implementation to appropriate domain terminal
  Domain Terminal: Write minimal code to pass test
  Terminal 7: Validate test passes, block over-engineering

REFACTOR Phase (5-10 min)
  Terminal 7 + Domain Terminal: Collaborate on code cleanup
  Terminal 7: Ensure tests remain green throughout
  → Prepare for next RED cycle
```

### **Cross-Terminal Communication Flows**
```yaml
T7_to_T1_Signals:
  - test_written: "Failing test ready for implementation"
  - test_validated: "Implementation makes test pass"
  - refactor_ready: "Code quality improvement needed"
  - cycle_complete: "Ready for next requirement"

T1_to_Domain_Routing:
  - architecture_tests: → T2 (Architecture Enforcer)
  - security_tests: → T3 (Security Guardian)
  - data_schema_tests: → T4 (Data Schema Specialist)
  - search_rag_tests: → T5 (Knowledge & Search Agent)
  - component_tests: → T6 (Component Engineer)
  - build_deploy_tests: → T8 (Build & Deploy Validator)

Domain_to_T7_Feedback:
  - implementation_complete: "Minimal code written"
  - blocked_by_dependency: "Need other terminal coordination"
  - test_unclear: "Need test clarification"
  - ready_for_refactor: "Implementation works, ready to improve"
```

## TDD Workflow Protocols

### **Protocol 1: Single Feature TDD Cycle**

**Participants**: T7 (TDD), T1 (Coordinator), 1 Domain Terminal

**Workflow**:
1. **Requirement Input** → T7 receives feature requirement
2. **RED Phase** → T7 writes failing test (2-5 min)
3. **Implementation Routing** → T1 routes to appropriate domain terminal
4. **GREEN Phase** → Domain terminal implements minimal code (5-15 min)
5. **Validation** → T7 confirms test passes
6. **REFACTOR Phase** → T7 + Domain terminal collaborate (5-10 min)
7. **Cycle Complete** → Ready for next requirement

**Example: Add LLM Provider**
```
T7: Write failing test for DeepSeek LLM connection
T1: Route to T2 (Architecture - factory patterns)
T2: Add minimal DeepSeek provider to factory
T7: Validate test passes (GREEN)
T2 + T7: Refactor for clean factory pattern
```

### **Protocol 2: Cross-Domain TDD Cycle**

**Participants**: T7 (TDD), T1 (Coordinator), 2+ Domain Terminals

**Workflow**:
1. **Requirement Analysis** → T7 identifies multi-domain requirement
2. **Test Strategy** → T7 writes integration test
3. **Domain Decomposition** → T1 routes sub-tasks to multiple terminals
4. **Coordinated Implementation** → Domain terminals work in sequence
5. **Integration Validation** → T7 validates full integration test
6. **Collaborative Refactor** → All terminals coordinate cleanup

**Example: Add Authentication UI**
```
T7: Write E2E test for authentication flow
T1: Route auth logic to T3, UI components to T6
T3: Implement AuthGateway integration
T6: Create login form component
T7: Validate complete flow (GREEN)
T3 + T6 + T7: Refactor for consistency
```

### **Protocol 3: Parallel TDD Workflows**

**Participants**: Multiple T7-led cycles running simultaneously

**Coordination Strategy**:
- **Branch Isolation**: Each TDD cycle on separate feature branch
- **Dependency Detection**: T1 coordinates when features intersect
- **Conflict Resolution**: Automated merge conflict resolution
- **Resource Management**: Terminal availability coordination

**Example: Parallel Development**
```
Workflow A: T7a → T2 (new LLM provider)
Workflow B: T7b → T6 (new UI component)
Workflow C: T7c → T5 (search optimization)
T1 coordinates resource allocation and conflict prevention
```

## Terminal-Specific TDD Integration

### **Terminal 2: Architecture Enforcer**
**TDD Integration**:
- Receives tests for factory patterns, dependency injection, plugin registry
- Implements minimal code to satisfy architectural tests
- Collaborates with T7 on factory pattern refactoring
- Ensures dependency layer compliance during refactor

**Test Types**:
```typescript
// Factory pattern tests
it('should create LLM connection via factory', async () => {
  const connection = await createLLMConnection('org1', 'deepseek-v3')
  expect(connection.provider).toBe('deepseek')
})

// Dependency layer tests
it('should enforce downward dependency flow', () => {
  expect(() => coreLayer.import(servicesLayer)).toThrow()
})
```

### **Terminal 3: Security Guardian**
**TDD Integration**:
- Receives tests for authentication, encryption, rate limiting
- Implements minimal security features to pass tests
- Collaborates with T7 on security hardening during refactor
- Ensures security compliance throughout TDD cycles

**Test Types**:
```typescript
// Authentication tests
it('should reject invalid API keys', async () => {
  const response = await request(app)
    .post('/api/chat')
    .set('Authorization', 'Bearer invalid-key')
  expect(response.status).toBe(401)
})

// Encryption tests
it('should encrypt sensitive session data', () => {
  const encrypted = encryptSessionData(sensitiveData)
  expect(encrypted).not.toContain(sensitiveData.token)
})
```

### **Terminal 4: Data Schema Specialist**
**TDD Integration**:
- Receives tests for Prisma models, migrations, database performance
- Implements minimal schema changes to satisfy tests
- Collaborates with T7 on migration safety during refactor
- Ensures data integrity throughout schema evolution

**Test Types**:
```typescript
// Schema relationship tests
it('should cascade delete conversation messages', async () => {
  await prisma.conversation.delete({ where: { id: conversationId } })
  const messages = await prisma.message.findMany({ where: { conversationId } })
  expect(messages).toHaveLength(0)
})

// Migration tests
it('should complete migration without data loss', async () => {
  const beforeCount = await prisma.user.count()
  await runMigration('20240301_add_user_preferences')
  const afterCount = await prisma.user.count()
  expect(afterCount).toBe(beforeCount)
})
```

### **Terminal 5: Knowledge & Search Agent**
**TDD Integration**:
- Receives tests for RAG pipeline, embeddings, search quality
- Implements minimal search features to pass tests
- Collaborates with T7 on search optimization during refactor
- Ensures search relevance and performance standards

**Test Types**:
```typescript
// RAG pipeline tests
it('should retrieve relevant context for query', async () => {
  const results = await searchKnowledgeBase('leadership styles')
  expect(results[0].relevance).toBeGreaterThan(0.8)
})

// Embedding tests
it('should generate consistent embeddings', async () => {
  const embedding1 = await generateEmbedding('test content')
  const embedding2 = await generateEmbedding('test content')
  expect(embedding1).toEqual(embedding2)
})
```

### **Terminal 6: Component Engineer**
**TDD Integration**:
- Receives tests for React components, accessibility, responsive design
- Implements minimal UI components to pass tests
- Collaborates with T7 on component optimization during refactor
- Ensures accessibility and design system compliance

**Test Types**:
```tsx
// Component behavior tests
it('should enable send button when message entered', () => {
  render(<MessageInput />)
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
  expect(screen.getByRole('button', { name: /send/i })).toBeEnabled()
})

// Accessibility tests
it('should meet WCAG 2.1 AA standards', async () => {
  const { container } = render(<CoachingPanel />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### **Terminal 8: Build & Deploy Validator**
**TDD Integration**:
- Receives tests for build processes, deployment validation, CI/CD
- Implements minimal build configurations to pass tests
- Collaborates with T7 on build optimization during refactor
- Ensures deployment reliability and performance

**Test Types**:
```typescript
// Build validation tests
it('should compile TypeScript without errors', async () => {
  const result = await runTypeScriptCompilation()
  expect(result.errors).toHaveLength(0)
})

// Deployment tests
it('should complete health checks after deployment', async () => {
  await deployToStaging()
  const health = await runHealthChecks()
  expect(health.status).toBe('healthy')
})
```

## TDD Quality Gates

### **RED Phase Quality Checks**
```
□ Test fails for the right reason (not syntax error)
□ Test name clearly describes expected behavior
□ Test is minimal and focused on single behavior
□ Test includes both positive and negative cases
□ Test failure message is informative
```

### **GREEN Phase Quality Checks**
```
□ Implementation makes test pass
□ Implementation is minimal (no gold-plating)
□ No existing tests broken by new implementation
□ Code compiles and runs without errors
□ Implementation follows domain terminal's patterns
```

### **REFACTOR Phase Quality Checks**
```
□ All tests remain green throughout refactoring
□ Code readability and maintainability improved
□ Design patterns and conventions followed
□ No code duplication introduced
□ Performance not degraded by refactoring
```

## Conflict Resolution Protocols

### **Test Conflicts**
**Scenario**: Multiple terminals modify same code area
**Resolution**:
1. T7 detects test conflicts during validation
2. T1 coordinates domain terminal discussion
3. Terminals agree on interface contracts
4. T7 updates tests to reflect consensus
5. Implementation proceeds with agreed interface

### **Implementation Conflicts**
**Scenario**: Domain terminals have competing approaches
**Resolution**:
1. Domain terminals present their approaches to T1
2. T7 evaluates approaches against test requirements
3. T1 makes architectural decision based on patterns
4. Losing approach is refactored to winning pattern
5. T7 validates tests still pass with chosen approach

### **Resource Conflicts**
**Scenario**: Multiple TDD cycles need same terminal
**Resolution**:
1. T1 maintains terminal allocation queue
2. Higher priority cycles get terminal precedence
3. Blocked cycles wait or use alternative terminals
4. T1 suggests parallel implementation when possible
5. Conflicts resolved through branch isolation

## Performance Standards

### **TDD Cycle Performance Targets**
- **RED Phase**: 2-5 minutes to write failing test
- **GREEN Phase**: 5-15 minutes for minimal implementation
- **REFACTOR Phase**: 5-10 minutes for collaborative improvement
- **Total Cycle**: <20 minutes for complete red-green-refactor

### **Cross-Terminal Communication**
- **Signal Latency**: <30 seconds between terminal handoffs
- **Context Transfer**: Complete context in <2 minutes
- **Conflict Resolution**: <5 minutes for standard conflicts
- **Parallel Coordination**: Up to 4 simultaneous TDD cycles

### **Quality Metrics**
- **Test Coverage**: >90% for critical business logic
- **Test Success Rate**: >95% green tests maintained
- **Refactor Safety**: 0% test breakage during refactoring
- **Implementation Quality**: <2 refactor iterations per cycle

## Escalation Procedures

### **P0 TDD Issues**
- Tests broken by implementation changes → Immediate T1 coordination
- TDD cycle blocked by terminal unavailability → Resource reallocation
- Critical functionality without test coverage → Emergency test writing
- Refactoring breaks multiple tests → Rollback and analysis

### **P1 TDD Issues**
- TDD cycles exceeding target times → Process optimization
- Test coverage falling below standards → Coverage improvement sprint
- Cross-terminal coordination breaking down → Protocol review
- Test reliability issues (flaky tests) → Test stabilization effort

### **P2 TDD Issues**
- Test organization improvements needed → Documentation update
- Minor performance optimizations → Process refinement
- Training needed for TDD methodology → Knowledge transfer session
- Documentation gaps in testing practices → Content creation

## Best Practices

### **Test Writing (Terminal 7)**
1. **Start Small**: Write the smallest test that fails meaningfully
2. **Be Specific**: Test one behavior at a time with clear assertions
3. **Use Clear Names**: Test names should read like specifications
4. **Test Behavior**: Focus on what the code should do, not how
5. **Include Edge Cases**: Test boundaries and error conditions

### **Implementation Coordination (All Domains)**
1. **Stay Minimal**: Implement only what makes the test pass
2. **Resist Gold-Plating**: Save improvements for refactor phase
3. **Communicate Intent**: Be clear about what the test is verifying
4. **Fast Feedback**: Keep green phase under 15 minutes
5. **Prepare for Refactor**: Write implementation ready for improvement

### **Refactoring Collaboration**
1. **Small Steps**: Make incremental improvements with frequent test runs
2. **Keep Green**: Run tests after each refactoring step
3. **Improve Design**: Focus on readability, maintainability, performance
4. **Follow Patterns**: Ensure code follows Harness Engineering standards
5. **Prepare Next**: Set up for the next red-green-refactor cycle

## Cross-References

- **TDD Specialist Documentation**: [../agents/tdd-testing-specialist.md](../agents/tdd-testing-specialist.md)
- **Master Coordinator Protocols**: [../orchestration/master-coordinator.md](../orchestration/master-coordinator.md)
- **Testing Strategy**: [../../design/testing.md](../../design/testing.md)
- **Quality Standards**: [../agents/integration-validator.md](../agents/integration-validator.md)