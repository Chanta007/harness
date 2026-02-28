#!/usr/bin/env node

/**
 * Harness Engineering v3 - WebSocket Coordination Server
 * Real-time multi-stream development coordination
 * Deployed on Digital Ocean App Platform
 */

const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.WS_PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Connection state management
const connections = new Map(); // connectionId -> WebSocket
const streams = new Map();     // streamId -> StreamState
const agents = new Map();      // agentId -> AgentState
const sessions = new Map();    // sessionId -> SessionState

class StreamCoordinator {
  constructor() {
    this.conflictDetector = new ConflictDetector();
    this.progressTracker = new ProgressTracker();
  }

  /**
   * Register new development stream
   */
  registerStream(streamId, config) {
    const stream = {
      id: streamId,
      task: config.task,
      branch: config.branch,
      status: 'initializing',
      progress: 0,
      agents: config.agents || [],
      files: [],
      conflicts: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    streams.set(streamId, stream);
    this.broadcastStreamUpdate(streamId, 'registered');

    console.log(`Stream registered: ${streamId} (${config.task})`);
    return stream;
  }

  /**
   * Update stream progress
   */
  updateStreamProgress(streamId, progress, phase) {
    const stream = streams.get(streamId);
    if (!stream) return;

    stream.progress = progress;
    stream.currentPhase = phase;
    stream.lastActivity = new Date();

    if (progress === 100) {
      stream.status = 'completed';
    }

    this.broadcastStreamUpdate(streamId, 'progress');
  }

  /**
   * Detect conflicts between streams
   */
  detectConflicts(streamId, files) {
    const stream = streams.get(streamId);
    if (!stream) return [];

    const conflicts = [];

    for (const [otherStreamId, otherStream] of streams.entries()) {
      if (otherStreamId === streamId || otherStream.status === 'completed') continue;

      // Check file conflicts
      const overlappingFiles = files.filter(file =>
        otherStream.files.includes(file)
      );

      if (overlappingFiles.length > 0) {
        conflicts.push({
          type: 'file_conflict',
          withStream: otherStreamId,
          files: overlappingFiles,
          severity: 'medium'
        });
      }
    }

    stream.conflicts = conflicts;
    if (conflicts.length > 0) {
      this.broadcastConflict(streamId, conflicts);
    }

    return conflicts;
  }

  /**
   * Broadcast stream update to all connected clients
   */
  broadcastStreamUpdate(streamId, updateType) {
    const stream = streams.get(streamId);
    if (!stream) return;

    const message = {
      type: 'stream_update',
      updateType,
      streamId,
      stream: {
        ...stream,
        timestamp: new Date().toISOString()
      }
    };

    this.broadcast(message);
  }

  /**
   * Broadcast conflict notification
   */
  broadcastConflict(streamId, conflicts) {
    const message = {
      type: 'conflict_detected',
      streamId,
      conflicts,
      timestamp: new Date().toISOString()
    };

    this.broadcast(message);
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message) {
    const messageStr = JSON.stringify(message);

    for (const [connectionId, ws] of connections.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(messageStr);
        } catch (error) {
          console.error(`Failed to send message to ${connectionId}:`, error.message);
          connections.delete(connectionId);
        }
      }
    }
  }

  /**
   * Get dashboard data for all streams
   */
  getDashboard() {
    const streamList = Array.from(streams.values()).map(stream => ({
      id: stream.id,
      task: stream.task,
      branch: stream.branch,
      status: stream.status,
      progress: stream.progress,
      currentPhase: stream.currentPhase,
      agents: stream.agents,
      conflicts: stream.conflicts.length,
      duration: Date.now() - stream.createdAt.getTime()
    }));

    return {
      streams: streamList,
      totalStreams: streams.size,
      activeStreams: streamList.filter(s => s.status !== 'completed').length,
      completedStreams: streamList.filter(s => s.status === 'completed').length,
      totalConflicts: streamList.reduce((sum, s) => sum + s.conflicts, 0),
      connectedClients: connections.size,
      uptime: process.uptime()
    };
  }
}

class ConflictDetector {
  /**
   * Analyze potential conflicts between streams
   */
  analyzeConflicts(streamA, streamB) {
    const conflicts = [];

    // File-level conflicts
    const fileOverlap = streamA.files.filter(file =>
      streamB.files.includes(file)
    );

    if (fileOverlap.length > 0) {
      conflicts.push({
        type: 'file_overlap',
        files: fileOverlap,
        severity: this.assessFileSeverity(fileOverlap)
      });
    }

    // Branch conflicts
    if (streamA.branch === streamB.branch) {
      conflicts.push({
        type: 'branch_conflict',
        branch: streamA.branch,
        severity: 'high'
      });
    }

    return conflicts;
  }

  assessFileSeverity(files) {
    // High severity for core files
    const coreFiles = ['package.json', 'tsconfig.json', 'webpack.config.js'];
    if (files.some(file => coreFiles.includes(file))) return 'high';

    // Medium severity for shared modules
    if (files.some(file => file.includes('/shared/') || file.includes('/common/'))) return 'medium';

    return 'low';
  }
}

class ProgressTracker {
  /**
   * Track progress across multiple phases
   */
  calculateOverallProgress(phases) {
    if (!phases || phases.length === 0) return 0;

    const totalWeight = phases.reduce((sum, phase) => sum + (phase.weight || 1), 0);
    const completedWeight = phases.reduce((sum, phase) => {
      return sum + ((phase.progress / 100) * (phase.weight || 1));
    }, 0);

    return Math.round((completedWeight / totalWeight) * 100);
  }
}

// Initialize coordinator
const coordinator = new StreamCoordinator();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  connections.set(connectionId, ws);

  console.log(`WebSocket connected: ${connectionId} (${connections.size} total)`);

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connection_established',
    connectionId,
    timestamp: new Date().toISOString()
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(connectionId, message, ws);
    } catch (error) {
      console.error(`Invalid message from ${connectionId}:`, error.message);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format'
      }));
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    connections.delete(connectionId);
    console.log(`WebSocket disconnected: ${connectionId} (${connections.size} remaining)`);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for ${connectionId}:`, error.message);
    connections.delete(connectionId);
  });
});

/**
 * Handle incoming WebSocket messages
 */
function handleMessage(connectionId, message, ws) {
  try {
    switch (message.type) {
      case 'register_stream':
        const stream = coordinator.registerStream(message.streamId, message.config);
        ws.send(JSON.stringify({
          type: 'stream_registered',
          streamId: message.streamId,
          stream
        }));
        break;

      case 'update_progress':
        coordinator.updateStreamProgress(message.streamId, message.progress, message.phase);
        break;

      case 'report_files':
        const conflicts = coordinator.detectConflicts(message.streamId, message.files);
        ws.send(JSON.stringify({
          type: 'conflict_analysis',
          streamId: message.streamId,
          conflicts
        }));
        break;

      case 'get_dashboard':
        const dashboard = coordinator.getDashboard();
        ws.send(JSON.stringify({
          type: 'dashboard_data',
          dashboard
        }));
        break;

      case 'interactive_command':
        handleInteractiveCommand(message, ws);
        break;

      default:
        ws.send(JSON.stringify({
          type: 'error',
          error: `Unknown message type: ${message.type}`
        }));
    }
  } catch (error) {
    console.error(`Error handling message from ${connectionId}:`, error.message);
    ws.send(JSON.stringify({
      type: 'error',
      error: error.message
    }));
  }
}

/**
 * Handle interactive commands (modify, pause, status, etc.)
 */
function handleInteractiveCommand(message, ws) {
  const { command, streamId, data } = message;

  switch (command) {
    case 'pause':
      ws.send(JSON.stringify({
        type: 'command_result',
        command: 'pause',
        streamId,
        result: 'Stream paused'
      }));
      coordinator.broadcastStreamUpdate(streamId, 'paused');
      break;

    case 'resume':
      ws.send(JSON.stringify({
        type: 'command_result',
        command: 'resume',
        streamId,
        result: 'Stream resumed'
      }));
      coordinator.broadcastStreamUpdate(streamId, 'resumed');
      break;

    case 'modify':
      ws.send(JSON.stringify({
        type: 'command_result',
        command: 'modify',
        streamId,
        result: `Modification applied: ${data.description}`
      }));
      break;

    case 'status':
      const stream = streams.get(streamId);
      ws.send(JSON.stringify({
        type: 'command_result',
        command: 'status',
        streamId,
        result: stream ? {
          status: stream.status,
          progress: stream.progress,
          phase: stream.currentPhase,
          conflicts: stream.conflicts.length
        } : 'Stream not found'
      }));
      break;

    default:
      ws.send(JSON.stringify({
        type: 'error',
        error: `Unknown command: ${command}`
      }));
  }
}

// HTTP endpoints for health checks and API access
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'harness-websocket-server',
    version: '3.0.0',
    connections: connections.size,
    streams: streams.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/dashboard', (req, res) => {
  const dashboard = coordinator.getDashboard();
  res.json(dashboard);
});

app.post('/api/stream/register', (req, res) => {
  try {
    const { streamId, config } = req.body;
    const stream = coordinator.registerStream(streamId, config);
    res.json({ success: true, stream });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cleanup on shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, closing WebSocket server gracefully...');

  // Close all connections
  for (const [connectionId, ws] of connections.entries()) {
    ws.close(1000, 'Server shutdown');
  }

  // Close server
  server.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Harness WebSocket Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
});

module.exports = server;