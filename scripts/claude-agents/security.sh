#!/bin/bash
# Security Agent - Authentication, encryption, compliance
echo "🛡️ Starting Security Agent"
echo "Auto-loading security documentation..."
claude --session security-agent << 'CLAUDE_EOF'
/load docs/agents/security.md
/load docs/CONSTRAINTS.md
echo "Security agent ready for:"
echo "- Authentication debugging"
echo "- Security audits"
echo "- Compliance checking"
echo "- Vulnerability assessment"
CLAUDE_EOF
