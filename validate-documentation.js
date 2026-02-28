#!/usr/bin/env node

/**
 * Documentation Validation Test
 * Validates completeness and quality of project documentation
 */

const fs = require('fs').promises;
const path = require('path');

async function readFileIfExists(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    return null;
  }
}

async function validateDocumentation() {
  console.log('📚 Validating Documentation Completeness...\n');

  const docRequirements = {
    'README.md': {
      required: true,
      sections: ['Installation', 'Usage', 'API', 'Examples'],
      score: 0,
      found: false,
      issues: []
    },
    'HARNESS.md': {
      required: true,
      sections: ['Methodology', 'Agents', 'Validation', 'Compliance'],
      score: 0,
      found: false,
      issues: []
    },
    'SECURITY.md': {
      required: true,
      sections: ['Authentication', 'API Keys', 'Production', 'Development'],
      score: 0,
      found: false,
      issues: []
    },
    'DEPLOYMENT.md': {
      required: true,
      sections: ['Installation', 'Configuration', 'Deploy', 'Environment'],
      score: 0,
      found: false,
      issues: []
    },
    'API Documentation': {
      required: true,
      endpoints: ['/api/methodology', '/api/agents', '/api/validate', '/health'],
      score: 0,
      found: false,
      issues: []
    }
  };

  let totalScore = 0;
  let maxScore = 0;

  // Check each documentation file
  for (const [docName, requirements] of Object.entries(docRequirements)) {
    if (docName === 'API Documentation') continue; // Handle separately

    console.log(`📄 Checking ${docName}...`);

    const content = await readFileIfExists(path.join(process.cwd(), docName));

    if (content) {
      requirements.found = true;
      console.log(`   ✅ File exists`);

      // Check for required sections
      let sectionsFound = 0;
      for (const section of requirements.sections) {
        if (content.toLowerCase().includes(section.toLowerCase())) {
          sectionsFound++;
        } else {
          requirements.issues.push(`Missing section: ${section}`);
        }
      }

      requirements.score = Math.round((sectionsFound / requirements.sections.length) * 100);
      console.log(`   📊 Section coverage: ${sectionsFound}/${requirements.sections.length} (${requirements.score}%)`);

      if (requirements.issues.length > 0) {
        console.log(`   ⚠️  Issues: ${requirements.issues.join(', ')}`);
      }
    } else {
      requirements.found = false;
      requirements.issues.push('File not found');
      console.log(`   ❌ File missing`);
    }

    totalScore += requirements.score;
    maxScore += 100;
  }

  // Check API documentation by examining server.js
  console.log(`\n📄 Checking API Documentation...`);

  const serverContent = await readFileIfExists(path.join(process.cwd(), 'mcp-server', 'server.js'));

  if (serverContent) {
    docRequirements['API Documentation'].found = true;
    console.log(`   ✅ Server implementation exists`);

    let endpointsDocumented = 0;
    for (const endpoint of docRequirements['API Documentation'].endpoints) {
      if (serverContent.includes(endpoint)) {
        endpointsDocumented++;
      } else {
        docRequirements['API Documentation'].issues.push(`Endpoint not found: ${endpoint}`);
      }
    }

    docRequirements['API Documentation'].score = Math.round((endpointsDocumented / docRequirements['API Documentation'].endpoints.length) * 100);
    console.log(`   📊 Endpoint coverage: ${endpointsDocumented}/${docRequirements['API Documentation'].endpoints.length} (${docRequirements['API Documentation'].score}%)`);

    if (docRequirements['API Documentation'].issues.length > 0) {
      console.log(`   ⚠️  Issues: ${docRequirements['API Documentation'].issues.join(', ')}`);
    }
  } else {
    docRequirements['API Documentation'].found = false;
    docRequirements['API Documentation'].issues.push('Server implementation not found');
    console.log(`   ❌ Server implementation missing`);
  }

  totalScore += docRequirements['API Documentation'].score;
  maxScore += 100;

  // Calculate overall documentation score
  const overallScore = Math.round((totalScore / maxScore) * 100);

  console.log('\n📊 Documentation Quality Report:');
  console.log('═'.repeat(50));

  for (const [docName, requirements] of Object.entries(docRequirements)) {
    const status = requirements.found ? '✅' : '❌';
    const scoreStr = requirements.found ? `${requirements.score}%` : 'N/A';
    console.log(`${status} ${docName.padEnd(20)} Score: ${scoreStr}`);

    if (requirements.issues.length > 0) {
      requirements.issues.forEach(issue => {
        console.log(`    ⚠️  ${issue}`);
      });
    }
  }

  console.log('═'.repeat(50));
  console.log(`📈 Overall Documentation Score: ${overallScore}%`);

  // HARNESS Engineering v3 Documentation Requirements
  console.log('\n📋 HARNESS.md Documentation Compliance:');

  const harnessCompliance = {
    methodology: docRequirements['HARNESS.md'].found && docRequirements['HARNESS.md'].score >= 80,
    security: docRequirements['SECURITY.md'].found && docRequirements['SECURITY.md'].score >= 80,
    deployment: docRequirements['DEPLOYMENT.md'].found && docRequirements['DEPLOYMENT.md'].score >= 80,
    api: docRequirements['API Documentation'].found && docRequirements['API Documentation'].score >= 80,
    overall: overallScore >= 85
  };

  console.log(`   Methodology Documentation (≥80%): ${harnessCompliance.methodology ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Security Documentation (≥80%): ${harnessCompliance.security ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Deployment Documentation (≥80%): ${harnessCompliance.deployment ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   API Documentation (≥80%): ${harnessCompliance.api ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Overall Score (≥85%): ${harnessCompliance.overall ? '✅ PASS' : '❌ FAIL'}`);

  const docCompliant = Object.values(harnessCompliance).every(v => v);
  console.log(`\n🎯 Overall Documentation Compliance: ${docCompliant ? '✅ COMPLIANT' : '⚠️ NEEDS IMPROVEMENT'}`);

  // Recommendations
  if (!docCompliant) {
    console.log('\n💡 Recommendations:');

    if (!harnessCompliance.methodology) {
      console.log('   • Enhance HARNESS.md with missing methodology sections');
    }
    if (!harnessCompliance.security) {
      console.log('   • Improve SECURITY.md documentation completeness');
    }
    if (!harnessCompliance.deployment) {
      console.log('   • Add missing deployment configuration details');
    }
    if (!harnessCompliance.api) {
      console.log('   • Create comprehensive API documentation with examples');
    }
    if (!harnessCompliance.overall) {
      console.log('   • Improve overall documentation coverage to meet 85% threshold');
    }
  }

  return {
    overallScore,
    docCompliant,
    docRequirements,
    harnessCompliance
  };
}

// Run documentation validation
validateDocumentation()
  .then(result => {
    console.log('\n📚 Documentation validation complete!');
    process.exit(result.docCompliant ? 0 : 1);
  })
  .catch(error => {
    console.error('Documentation validation failed:', error);
    process.exit(1);
  });