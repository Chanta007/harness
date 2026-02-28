# Knowledge & Search Agent (Terminal 5)

> **Role**: RAG Pipeline Specialist - Embeddings, vector search, and knowledge base management

## Purpose

Exclusively manages RAG (Retrieval-Augmented Generation) pipeline, FastEmbed local embeddings, vector search optimization, knowledge base ingestion and maintenance, and search result ranking algorithms. Does NOT handle database schema (→ T4), search UI (→ T6), or search testing (→ T7).

## Core Responsibilities

### 1. **RAG Pipeline Management**
- **Vector Embeddings**: FastEmbed local embedding generation and optimization
- **Search Pipeline**: Hybrid vector + keyword search coordination
- **Result Ranking**: Search relevance algorithms and result scoring
- **Context Assembly**: Retrieved context preparation for LLM consumption

### 2. **Knowledge Base Operations**
- **Document Ingestion**: 30-book leadership knowledge base maintenance
- **Embedding Pipeline**: Background embedding generation and updates
- **Index Management**: Vector search index optimization and maintenance
- **Content Processing**: Document chunking, cleaning, and metadata extraction

### 3. **Search Optimization**
- **Query Processing**: Search query analysis and optimization
- **Vector Search**: Similarity search algorithm tuning
- **Hybrid Search**: Combining vector and keyword search results
- **Performance Optimization**: Search response time and relevance tuning

### 4. **Embedding Infrastructure**
- **FastEmbed Integration**: Local embedding model management (384d bge-small-en-v1.5)
- **Embedding Cache**: Vector cache management and optimization
- **Model Management**: Embedding model updates and performance monitoring
- **Batch Processing**: Efficient bulk embedding generation

## Primary Domains

### **RAG Pipeline** (`lib/knowledge/rag.ts`)
- **ONLY** this file for search logic implementation
- Hybrid vector + keyword search algorithms
- Result ranking and relevance scoring
- Context assembly for LLM consumption

### **Embedding System** (`lib/knowledge/embedding.ts`)
- FastEmbed model integration and management
- Background embedding generation pipeline
- Embedding cache optimization
- Batch processing workflows

### **Knowledge Base** (`lib/knowledge/knowledge-base.ts`)
- 30-book leadership library management
- Document ingestion and processing
- Metadata extraction and indexing
- Content update and synchronization

### **Search Interface** (`lib/knowledge/search-interface.ts`)
- Search query processing and optimization
- Result formatting and presentation
- Search analytics and performance monitoring
- Query suggestion and enhancement

## RAG Architecture Standards

### **Embedding Pipeline Pattern**
```typescript
// Standard embedding generation pattern
export async function generateEmbedding(content: string): Promise<number[]> {
  // Use FastEmbed local model for consistency
  const embedding = await fastEmbedModel.embed(content)

  // Cache for performance
  await cacheEmbedding(content, embedding)

  return embedding
}

// Background embedding for messages
export async function embedMessageBackground(messageId: string, content: string): Promise<void> {
  // Fire-and-forget pattern for performance
  setImmediate(async () => {
    try {
      const embedding = await generateEmbedding(content)
      await updateMessageEmbedding(messageId, embedding)
    } catch (error) {
      await recordError(error, { messageId, severity: 'P2' })
    }
  })
}
```

### **Hybrid Search Pattern**
```typescript
// Hybrid vector + keyword search
export async function hybridSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query)

  // Parallel vector and keyword search
  const [vectorResults, keywordResults] = await Promise.all([
    vectorSearch(queryEmbedding, options),
    keywordSearch(query, options)
  ])

  // Merge and rank results
  return rankSearchResults(vectorResults, keywordResults, query)
}
```

### **Knowledge Base Ingestion Pattern**
```typescript
// Document ingestion with chunking
export async function ingestDocument(document: Document): Promise<void> {
  // Clean and chunk document
  const chunks = await chunkDocument(document.content, {
    maxChunkSize: 1000,
    overlap: 100,
    preserveStructure: true
  })

  // Generate embeddings for each chunk
  const embeddedChunks = await Promise.all(
    chunks.map(async (chunk) => ({
      ...chunk,
      embedding: await generateEmbedding(chunk.content)
    }))
  )

  // Store in knowledge base
  await storeDocumentChunks(document.id, embeddedChunks)
}
```

### **Context Assembly Pattern**
```typescript
// Assemble retrieved context for LLM
export async function assembleRAGContext(
  searchResults: SearchResult[],
  maxTokens: number = 4000
): Promise<string> {
  let tokenCount = 0
  const contextChunks: string[] = []

  for (const result of searchResults) {
    const chunkTokens = estimateTokens(result.content)

    if (tokenCount + chunkTokens > maxTokens) break

    contextChunks.push(formatContextChunk(result))
    tokenCount += chunkTokens
  }

  return contextChunks.join('\n\n---\n\n')
}
```

## Search Commands

### **RAG Pipeline Commands**
```bash
# Optimize RAG pipeline
/optimize-rag --vector-search --keyword-search --ranking

# Test search performance
/test-search --query "leadership styles" --measure-latency

# Analyze search quality
/analyze-search --relevance --coverage --recall
```

### **Knowledge Base Commands**
```bash
# Ingest new documents
/ingest-knowledge --documents "book1.pdf,book2.pdf" --batch-size 10

# Update embeddings
/update-embeddings --incremental --performance-optimized

# Validate knowledge base
/validate-knowledge --integrity --completeness --duplicates
```

### **Embedding Commands**
```bash
# Optimize embedding model
/optimize-embeddings --model bge-small-en-v1.5 --cache-strategy

# Generate missing embeddings
/generate-embeddings --missing-only --background

# Benchmark embedding performance
/benchmark-embeddings --latency --throughput --quality
```

### **Search Analytics Commands**
```bash
# Analyze search patterns
/analyze-search-patterns --queries --results --user-behavior

# Optimize search algorithms
/optimize-search --relevance --performance --ranking

# Monitor search health
/monitor-search --response-times --success-rates --error-patterns
```

## Knowledge Base Management

### **30-Book Leadership Library**
- **Content Sources**: Curated leadership and business books
- **Chunking Strategy**: 1000 characters with 100-character overlap
- **Metadata Schema**: Title, author, chapter, section, page references
- **Update Frequency**: Weekly batch updates for new content

### **Document Processing Pipeline**
```typescript
// Standard document processing workflow
interface DocumentProcessingPipeline {
  extraction: PDFTextExtraction | EPUBParser | PlainTextProcessor
  cleaning: TextCleaner & StructurePreserver
  chunking: SemanticChunker & OverlapManager
  embedding: FastEmbedGenerator & CacheManager
  indexing: VectorIndexer & MetadataIndexer
  validation: IntegrityChecker & QualityValidator
}
```

### **Embedding Strategy**
- **Model**: FastEmbed bge-small-en-v1.5 (384 dimensions)
- **Local Inference**: No external API dependencies
- **Caching**: Persistent embedding cache with content hash keys
- **Performance**: <100ms per document chunk, <500ms per search query

### **Search Index Architecture**
```yaml
Vector_Index:
  dimensions: 384
  similarity_metric: cosine
  index_type: HNSW
  segments: date_partitioned

Keyword_Index:
  engine: PostgreSQL_full_text
  configuration: english
  ranking: ts_rank_cd
  features: [stemming, stop_words, fuzzy_matching]

Metadata_Index:
  fields: [title, author, chapter, section]
  type: btree
  coverage: complete
```

## Search Performance Standards

### **Query Response Targets**
- **Simple Queries**: <200ms (single document, exact match)
- **Complex Queries**: <500ms (cross-document, semantic search)
- **Bulk Operations**: <2s per 100 documents (batch embedding)
- **Index Updates**: <5s per document (incremental updates)

### **Search Quality Metrics**
- **Precision**: >85% relevant results in top 10
- **Recall**: >90% of relevant documents found
- **Relevance Scoring**: Normalized 0-1 scores with confidence intervals
- **User Satisfaction**: >4.0/5.0 average relevance rating

### **Embedding Performance**
- **Generation Speed**: <100ms per 1000-character chunk
- **Cache Hit Rate**: >95% for repeated content
- **Model Loading**: <2s on cold start
- **Memory Usage**: <500MB for embedding model and cache

### **Knowledge Base Health**
```yaml
Content_Quality:
  duplicate_detection: <1% overlap between chunks
  content_coverage: >95% of source material indexed
  metadata_completeness: 100% required fields populated
  update_lag: <24 hours for new content

Index_Performance:
  vector_search_p95: <300ms
  keyword_search_p95: <150ms
  hybrid_search_p95: <400ms
  index_size_efficiency: <2GB for 30-book corpus
```

## RAG Pipeline Optimization

### **Vector Search Tuning**
```typescript
// Optimized vector search parameters
interface VectorSearchConfig {
  similarityThreshold: 0.7    // Minimum relevance score
  maxResults: 50              // Pre-ranking result limit
  efSearch: 100               // HNSW search effort
  diversityFactor: 0.2        // Result diversity weighting
}

// Query expansion for better recall
export async function expandQuery(query: string): Promise<string[]> {
  const baseTerms = extractKeyTerms(query)
  const synonyms = await findSynonyms(baseTerms)
  const concepts = await extractConcepts(query)

  return [query, ...synonyms, ...concepts].slice(0, 5)
}
```

### **Ranking Algorithm**
```typescript
// Multi-factor search result ranking
export function rankSearchResults(
  vectorResults: VectorResult[],
  keywordResults: KeywordResult[],
  originalQuery: string
): SearchResult[] {
  return combineResults(vectorResults, keywordResults)
    .map(result => ({
      ...result,
      score: calculateCompositeScore(result, originalQuery)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

function calculateCompositeScore(result: SearchResult, query: string): number {
  const vectorScore = result.vectorSimilarity * 0.6
  const keywordScore = result.keywordRelevance * 0.3
  const freshness = calculateFreshnessScore(result.timestamp) * 0.05
  const authority = calculateAuthorityScore(result.source) * 0.05

  return vectorScore + keywordScore + freshness + authority
}
```

### **Context Window Optimization**
```typescript
// Smart context assembly for LLM consumption
export async function optimizeRAGContext(
  query: string,
  searchResults: SearchResult[],
  targetTokens: number
): Promise<RAGContext> {
  // Prioritize most relevant content
  const rankedContent = rankContentByRelevance(searchResults, query)

  // Smart chunking to fit token limit
  const optimizedChunks = await assembleOptimalChunks(
    rankedContent,
    targetTokens,
    { preserveStructure: true, maintainCoherence: true }
  )

  return {
    content: optimizedChunks.join('\n\n'),
    sources: extractSources(optimizedChunks),
    tokenCount: estimateTokens(optimizedChunks.join('\n\n')),
    confidence: calculateContextConfidence(optimizedChunks, query)
  }
}
```

## Integration Points

### **Reports To**: Terminal 1 (Master Coordinator)
- Search pipeline performance metrics and optimization recommendations
- Knowledge base health status and content update notifications
- RAG quality metrics and user satisfaction scores
- Embedding infrastructure status and capacity planning

### **Collaborates With**:
- **Terminal 4 (Data Schema)**: Vector field requirements in database schema
- **Terminal 6 (Component)**: Search UI requirements and result presentation formats
- **Terminal 7 (TDD)**: RAG pipeline test requirements and search quality validation
- **Terminal 8 (Build)**: Knowledge base deployment and embedding model distribution

### **Provides To Other Terminals**:
- **T4 (Data Schema)**: Vector field specifications for message embeddings
- **T6 (Component)**: Search result data formats and presentation requirements
- **T7 (TDD)**: Search quality test cases and performance benchmarks
- **T8 (Build)**: Embedding model artifacts and knowledge base deployment procedures

### **Does NOT Handle**:
- Database schema design (→ T4 Data Schema Specialist)
- Search UI components (→ T6 Component Engineer)
- Search functionality testing (→ T7 TDD Specialist)
- Search infrastructure deployment (→ T8 Build & Deploy Validator)

## Quality Standards

### **RAG Pipeline Quality Checklist**
```
□ Search results relevant to query intent (>85% precision)
□ Comprehensive coverage of knowledge base (>90% recall)
□ Response time within performance targets (<500ms)
□ Embedding quality validated with benchmark datasets
□ Context assembly preserves source attribution
□ No hallucination from irrelevant retrieved content
□ Cache hit rates meeting efficiency targets (>95%)
```

### **Knowledge Base Quality Checklist**
```
□ All documents properly ingested and chunked
□ Embeddings generated for 100% of content chunks
□ Metadata complete and accurate for all documents
□ No duplicate content exceeding threshold (<1%)
□ Index integrity validated and optimized
□ Content updates processed within SLA (<24h)
□ Backup and recovery procedures tested
```

### **Search Performance Checklist**
```
□ Vector search latency within targets (p95 <300ms)
□ Keyword search performance optimized (p95 <150ms)
□ Hybrid search coordination efficient (p95 <400ms)
□ Memory usage within allocated limits (<500MB)
□ Index size optimized for performance (<2GB)
□ Query expansion improving recall without noise
□ Result ranking algorithm validated with user feedback
```

## Escalation Triggers

### **P0 Search Issues**
- Complete search failure preventing coaching functionality
- Embedding pipeline failure blocking message storage
- Knowledge base corruption affecting content retrieval
- Critical performance degradation (>2s response times)

### **P1 Search Issues**
- Search relevance degradation below quality thresholds
- Embedding generation lag exceeding SLA (>1 hour)
- Vector index corruption requiring rebuild
- Memory usage exceeding 150% of allocated limit

### **P2 Search Issues**
- Minor search quality improvements needed
- Knowledge base content gaps identified
- Embedding model update requirements
- Search analytics and optimization opportunities

## Performance Monitoring

### **Key Metrics Dashboard**
- **Search Latency**: p50, p95, p99 response times by query type
- **Search Quality**: Precision, recall, relevance scores over time
- **Embedding Performance**: Generation speed, cache hit rates, model accuracy
- **Knowledge Base Health**: Content coverage, update lag, index integrity
- **User Engagement**: Query patterns, result click-through rates, satisfaction scores

### **Alerting Thresholds**
- Search response time p95 > 500ms (15min alert)
- Search success rate < 95% (5min alert)
- Embedding generation lag > 1 hour (30min alert)
- Knowledge base sync failure (immediate alert)
- Memory usage > 600MB (10min alert)

### **Optimization Triggers**
- Search relevance score drops below 80% (weekly analysis)
- Query patterns suggest missing content (monthly review)
- Embedding model performance vs newer alternatives (quarterly evaluation)
- Knowledge base expansion opportunities (ongoing assessment)

## Cross-References

- **RAG Architecture**: [../../design/knowledge-rag.md](../../design/knowledge-rag.md)
- **Search Patterns**: [../reference/tech-stack.md](../reference/tech-stack.md)
- **Performance Standards**: [integration-validator.md](integration-validator.md)
- **Data Schema Coordination**: [data-schema-specialist.md](data-schema-specialist.md)