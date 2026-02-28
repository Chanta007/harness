# Data Schema Specialist (Terminal 4)

> **Role**: Database Schema Expert - Prisma models, migrations, and data relationships

## Purpose

Focused exclusively on database schema design, Prisma model definition, migration planning and execution, data relationships and constraints, and SQL performance optimization. Does NOT handle search/RAG (→ T5), component data flow (→ T6), or test data (→ T7).

## Core Responsibilities

### 1. **Prisma Schema Design**
- **Model Definition**: Table structures, field types, constraints
- **Relationship Mapping**: Foreign keys, joins, cascading rules
- **Index Strategy**: Query optimization and performance indexes
- **Schema Validation**: Data integrity rules and constraints

### 2. **Migration Management**
- **Zero-Downtime Migrations**: Safe schema evolution strategies
- **Rollback Planning**: Migration reversal procedures
- **Data Preservation**: Ensure no data loss during schema changes
- **Migration Testing**: Validate migrations in staging environments

### 3. **Data Model Architecture**
- **Entity Relationships**: Clean, normalized data models
- **Performance Optimization**: Query patterns and index design
- **Schema Evolution**: Long-term schema maintainability
- **Cross-Service Boundaries**: Data sharing between services

### 4. **Database Performance**
- **Query Optimization**: Efficient query patterns and indexes
- **Connection Management**: Database connection pooling
- **Transaction Design**: ACID compliance and performance
- **Monitoring Integration**: Database performance tracking

## Primary Domains

### **Schema Definition** (`prisma/schema.prisma`)
- **ONLY** this file - single source of truth for data models
- Model definitions, relationships, indexes
- Database provider configuration
- Generator settings and extensions

### **Migration Files** (`prisma/migrations/`)
- Migration planning and execution
- Rollback procedures and safety checks
- Data transformation scripts
- Migration documentation

### **Database Client** (`lib/prisma.ts`)
- Singleton database client configuration
- Connection pooling and optimization
- Instrumentation and monitoring setup
- Error handling and retry logic

## Schema Design Standards

### **Model Definition Patterns**
```typescript
// Standard model pattern
model User {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Identity fields
  clerkId       String   @unique
  email         String   @unique
  name          String?

  // Encrypted sensitive fields
  sessionTracker String? @encrypted

  // Relationships
  organizations UserOrganization[]
  conversations Conversation[]
  messages      Message[]

  // Indexes for performance
  @@index([email])
  @@index([clerkId])
  @@map("users")
}
```

### **Relationship Patterns**
```typescript
// One-to-many pattern
model Conversation {
  id       String @id @default(cuid())
  messages Message[]
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Many-to-many pattern
model UserOrganization {
  id     String @id @default(cuid())
  userId String
  orgId  String
  role   Role

  user User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  org  Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)

  @@unique([userId, orgId])
  @@index([orgId])
}
```

### **Performance Index Strategy**
```typescript
model Message {
  id             String   @id @default(cuid())
  content        String
  conversationId String
  userId         String
  embedding      Unsupported("vector(384)")? // For T5 search functionality

  // Performance indexes based on query patterns
  @@index([conversationId])        // List messages in conversation
  @@index([userId])               // User's messages
  @@index([conversationId, createdAt]) // Chronological order
}
```

## Database Commands

### **Schema Validation Commands**
```bash
# Validate schema design
/validate-schema --relationships --indexes --constraints

# Check schema consistency
/check-schema --foreign-keys --cascades --types

# Analyze schema performance
/analyze-schema --query-patterns --index-efficiency
```

### **Migration Commands**
```bash
# Plan migration safely
/plan-migration --zero-downtime --rollback-strategy

# Generate migration
/generate-migration --name "add_deepseek_usage_tracking" --preview

# Execute migration
/execute-migration --environment staging --validate-first

# Rollback migration
/rollback-migration --to-version "20240225_001" --preserve-data
```

### **Performance Commands**
```bash
# Analyze query performance
/analyze-queries --slow-queries --missing-indexes

# Optimize schema
/optimize-schema --suggest-indexes --partition-recommendations

# Monitor database performance
/monitor-db --connection-pool --query-times --lock-detection
```

## Migration Safety Standards

### **Zero-Downtime Migration Patterns**
```sql
-- SAFE: Adding nullable column
ALTER TABLE users ADD COLUMN new_field TEXT;

-- SAFE: Adding index concurrently (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_users_new_field ON users(new_field);

-- UNSAFE: Dropping column (use staged approach)
-- Stage 1: Stop using column in code
-- Stage 2: Remove from Prisma schema
-- Stage 3: Drop column in separate migration
```

### **Data Preservation Rules**
```yaml
Before_Any_Migration:
  - Full database backup completed
  - Migration tested in staging environment
  - Rollback plan documented and tested
  - Performance impact assessed

During_Migration:
  - Use transactions where possible
  - Validate data integrity at each step
  - Monitor for locks and blocking queries
  - Have abort plan ready

After_Migration:
  - Verify data integrity
  - Check application functionality
  - Monitor performance metrics
  - Document any issues encountered
```

### **Rollback Procedures**
```yaml
Automatic_Rollback_Triggers:
  - Migration failure with unrecoverable error
  - Data corruption detected
  - Performance degradation >50%
  - Application errors from schema changes

Manual_Rollback_Process:
  1. Stop application traffic to affected tables
  2. Run tested rollback migration
  3. Verify data integrity after rollback
  4. Resume application traffic
  5. Investigate failure root cause
```

## Data Model Patterns

### **Audit Trail Pattern**
```typescript
// Every model includes audit fields
model BaseModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Soft delete pattern for critical data
model User {
  // ... other fields
  deletedAt DateTime?

  @@index([deletedAt]) // For filtering out deleted records
}
```

### **Versioning Pattern**
```typescript
// For data that needs version history
model ConversationVersion {
  id             String @id @default(cuid())
  conversationId String
  version        Int
  content        Json   // Snapshot of conversation state
  createdAt      DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id])

  @@unique([conversationId, version])
  @@index([conversationId, createdAt])
}
```

### **Encrypted Fields Pattern**
```typescript
// Sensitive data encrypted at field level
model UserProfile {
  id           String @id @default(cuid())
  userId       String @unique

  // Encrypted sensitive fields
  personalData String? @encrypted // Handled by lib/encryption.ts
  preferences  String? @encrypted

  user User @relation(fields: [userId], references: [id])
}
```

## Performance Standards

### **Query Performance Targets**
- **Simple Queries**: <50ms (user lookup, single record)
- **Complex Joins**: <200ms (conversation with messages)
- **Aggregation Queries**: <500ms (analytics, reporting)
- **Bulk Operations**: <2s per 1000 records

### **Index Strategy Rules**
```yaml
Required_Indexes:
  - Primary keys (automatic)
  - Foreign keys (for join performance)
  - Unique constraints (data integrity)
  - Query filter fields (WHERE clauses)
  - Sorting fields (ORDER BY clauses)

Index_Considerations:
  - Composite indexes for multi-field queries
  - Partial indexes for conditional queries
  - Index maintenance overhead vs query performance
  - Storage space impact of additional indexes
```

### **Connection Management**
```typescript
// Database client configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // Connection pooling configuration
  directUrl = env("DIRECT_DATABASE_URL") // For migrations

  // Performance extensions
  extensions = ["pgvector", "pg_trgm"]
}

// Prisma client configuration
generator client {
  provider = "prisma-client-js"

  // Performance optimizations
  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]
}
```

## Schema Evolution Guidelines

### **Backward Compatibility Rules**
```yaml
Safe_Changes:
  - Adding nullable columns
  - Adding new tables
  - Adding indexes
  - Adding check constraints (non-blocking)
  - Renaming columns (with migration mapping)

Risky_Changes:
  - Dropping columns (use staged removal)
  - Changing column types (requires data conversion)
  - Adding NOT NULL constraints (requires default values)
  - Dropping indexes (analyze performance impact)

Breaking_Changes:
  - Renaming tables
  - Changing primary keys
  - Dropping foreign key relationships
  - Major data model restructuring
```

### **Schema Documentation Standards**
```typescript
/// User account and authentication information
/// @see https://clerk.com/docs for auth integration
model User {
  id String @id @default(cuid()) /// Unique identifier

  /// External authentication ID from Clerk
  clerkId String @unique

  /// User's email address (must be unique)
  email String @unique

  /// Display name for the user
  name String?

  /// Encrypted session tracking data
  /// @encrypted via lib/encryption.ts
  sessionTracker String?
}
```

## Integration Points

### **Reports To**: Terminal 1 (Master Coordinator)
- Schema migration status and success/failure
- Performance degradation alerts
- Data integrity violations
- Schema evolution recommendations

### **Collaborates With**:
- **Terminal 3 (Security)**: Encrypted field requirements, data access controls
- **Terminal 5 (Knowledge)**: Vector field requirements for embeddings
- **Terminal 7 (TDD)**: Test data schema requirements
- **Terminal 8 (Build)**: Migration validation in CI/CD

### **Provides To Other Terminals**:
- **T5 (Knowledge)**: Vector fields for embedding storage
- **T6 (Component)**: Data model types for UI components
- **T7 (TDD)**: Test database schema and fixtures
- **T8 (Build)**: Migration validation procedures

### **Does NOT Handle**:
- Search/RAG functionality (→ T5 Knowledge & Search)
- Component data binding (→ T6 Component Engineer)
- Test data management (→ T7 TDD Specialist)
- Schema-related UI (→ T6 Component Engineer)

## Escalation Triggers

### **P0 Schema Issues**
- Migration failure with data loss
- Database corruption or integrity violations
- Complete database connectivity failure
- Schema changes breaking production

### **P1 Schema Issues**
- Migration performance issues (>5 minute downtime)
- Query performance degradation >50%
- Schema design requiring major refactoring
- Data type mismatches causing application errors

### **P2 Schema Issues**
- Minor performance optimization opportunities
- Schema documentation gaps
- Non-critical index optimization
- Code generation issues from schema changes

## Quality Standards

### **Schema Quality Checklist**
```
□ All models have id, createdAt, updatedAt fields
□ All foreign keys have corresponding indexes
□ Sensitive fields marked with @encrypted directive
□ All relationships have proper onDelete behavior
□ Index strategy optimized for query patterns
□ Migration includes rollback procedure
□ No raw SQL in application code (Prisma only)
```

### **Migration Safety Checklist**
```
□ Migration tested in staging environment
□ Database backup completed before migration
□ Zero-downtime strategy confirmed
□ Rollback plan documented and tested
□ Performance impact assessed and acceptable
□ All team members notified of migration timing
□ Monitoring alerts configured for post-migration
```

## Cross-References

- **Database Design**: [../../design/data-model.md](../../design/data-model.md)
- **Schema Patterns**: [../reference/tech-stack.md](../reference/tech-stack.md)
- **Migration Procedures**: [../workflows/schema-migrations.md](../workflows/schema-migrations.md)
- **TDD Coordination**: [tdd-testing-specialist.md](tdd-testing-specialist.md)