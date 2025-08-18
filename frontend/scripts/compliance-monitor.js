#!/usr/bin/env node

/**
 * AuditMesh Compliance Monitor
 * Monitoreo continuo de compliance y seguridad
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function print(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function printHeader() {
  print('cyan', '🔍 AUDITMESH COMPLIANCE MONITOR');
  print('cyan', '================================');
  print('', '');
}

// Función para verificar archivos críticos
function checkCriticalFiles() {
  const criticalFiles = [
    'src/components/ConsentManager.tsx',
    'docs/PRIVACY_POLICY.md',
    'docs/SECURITY_POLICY.md',
    'vite.config.security.ts',
    'vite.config.prod.ts'
  ];
  
  let missingFiles = [];
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      print('green', `✅ ${file}`);
    } else {
      print('red', `❌ ${file} - CRÍTICO`);
      missingFiles.push(file);
    }
  });
  
  return missingFiles.length === 0;
}

// Función para verificar build de producción
function checkProductionBuild() {
  try {
    print('blue', '\n🏗️ Verificando build de producción...');
    
    // Limpiar build anterior
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    
    // Ejecutar build de producción
    execSync('npm run build:prod', { stdio: 'pipe' });
    print('green', '✅ Build de producción exitoso');
    
    // Verificar archivos generados
    const distFiles = fs.readdirSync('dist');
    if (distFiles.includes('index.html') && distFiles.includes('assets')) {
      print('green', '✅ Archivos de distribución generados correctamente');
      return true;
    } else {
      print('red', '❌ Archivos de distribución incompletos');
      return false;
    }
  } catch (error) {
    print('red', `❌ Error en build de producción: ${error.message}`);
    return false;
  }
}

// Función para verificar headers de seguridad
function checkSecurityHeaders() {
  try {
    print('blue', '\n🔒 Verificando headers de seguridad...');
    
    // Verificar configuración de seguridad
    const securityConfig = fs.readFileSync('vite.config.security.ts', 'utf8');
    const prodConfig = fs.readFileSync('vite.config.prod.ts', 'utf8');
    
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Content-Security-Policy'
    ];
    
    let securityScore = 0;
    
    requiredHeaders.forEach(header => {
      if (securityConfig.includes(header) || prodConfig.includes(header)) {
        print('green', `✅ ${header}`);
        securityScore++;
      } else {
        print('red', `❌ ${header} - FALTANTE`);
      }
    });
    
    print('blue', `\n📊 Puntuación de headers: ${securityScore}/${requiredHeaders.length}`);
    return securityScore >= 3; // Al menos 3 de 4 headers críticos
  } catch (error) {
    print('red', `❌ Error verificando headers: ${error.message}`);
    return false;
  }
}

// Función para verificar dependencias de seguridad
function checkSecurityDependencies() {
  try {
    print('blue', '\n🛡️ Verificando dependencias de seguridad...');
    
    const result = execSync('npm audit --audit-level=moderate --json', { encoding: 'utf8' });
    const audit = JSON.parse(result);
    
    if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
      print('red', `❌ ${Object.keys(audit.vulnerabilities).length} vulnerabilidades encontradas`);
      return false;
    } else {
      print('green', '✅ Sin vulnerabilidades de seguridad');
      return true;
    }
  } catch (error) {
    print('red', `❌ Error verificando dependencias: ${error.message}`);
    return false;
  }
}

// Función para verificar integración del ConsentManager
function checkConsentManagerIntegration() {
  try {
    print('blue', '\n🍪 Verificando integración del ConsentManager...');
    
    const appFile = fs.readFileSync('src/App.tsx', 'utf8');
    
    if (appFile.includes('ConsentManager') && appFile.includes('import.*ConsentManager')) {
      print('green', '✅ ConsentManager integrado en App.tsx');
      return true;
    } else {
      print('red', '❌ ConsentManager no integrado correctamente');
      return false;
    }
  } catch (error) {
    print('red', `❌ Error verificando ConsentManager: ${error.message}`);
    return false;
  }
}

// Función para generar reporte de monitoreo
function generateMonitoringReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    project: 'AuditMesh Frontend',
    monitoring: {
      criticalFiles: results.criticalFiles,
      productionBuild: results.productionBuild,
      securityHeaders: results.securityHeaders,
      securityDependencies: results.securityDependencies,
      consentManager: results.consentManager
    },
    score: 0,
    status: 'UNKNOWN',
    recommendations: []
  };
  
  // Calcular puntuación
  Object.values(results).forEach(result => {
    if (result) report.score++;
  });
  
  report.score = Math.round((report.score / Object.keys(results).length) * 100);
  
  // Determinar estado
  if (report.score >= 90) {
    report.status = 'EXCELLENT';
  } else if (report.score >= 75) {
    report.status = 'GOOD';
  } else if (report.score >= 60) {
    report.status = 'FAIR';
  } else {
    report.status = 'POOR';
  }
  
  // Generar recomendaciones
  if (!results.criticalFiles) {
    report.recommendations.push('Crear archivos críticos faltantes');
  }
  
  if (!results.productionBuild) {
    report.recommendations.push('Corregir errores en build de producción');
  }
  
  if (!results.securityHeaders) {
    report.recommendations.push('Implementar headers de seguridad faltantes');
  }
  
  if (!results.securityDependencies) {
    report.recommendations.push('Corregir vulnerabilidades de dependencias');
  }
  
  if (!results.consentManager) {
    report.recommendations.push('Integrar correctamente el ConsentManager');
  }
  
  return report;
}

// Función para imprimir reporte
function printReport(report) {
  print('cyan', '📊 REPORTE DE MONITOREO DE COMPLIANCE');
  print('cyan', '=====================================');
  print('', '');
  
  print('blue', `🏆 Puntuación General: ${report.score}%`);
  print('blue', `📈 Estado: ${report.status}`);
  print('', '');
  
  print('blue', '📋 Estado por Área:');
  print('', '');
  
  print(report.monitoring.criticalFiles ? 'green' : 'red', 
    `${report.monitoring.criticalFiles ? '✅' : '❌'} Archivos Críticos`);
  
  print(report.monitoring.productionBuild ? 'green' : 'red', 
    `${report.monitoring.productionBuild ? '✅' : '❌'} Build de Producción`);
  
  print(report.monitoring.securityHeaders ? 'green' : 'red', 
    `${report.monitoring.securityHeaders ? '✅' : '❌'} Headers de Seguridad`);
  
  print(report.monitoring.securityDependencies ? 'green' : 'red', 
    `${report.monitoring.securityDependencies ? '✅' : '❌'} Dependencias de Seguridad`);
  
  print(report.monitoring.consentManager ? 'green' : 'red', 
    `${report.monitoring.consentManager ? '✅' : '❌'} ConsentManager Integrado`);
  
  print('', '');
  
  if (report.recommendations.length > 0) {
    print('yellow', '🔧 RECOMENDACIONES:');
    report.recommendations.forEach((rec, index) => {
      print('yellow', `${index + 1}. ${rec}`);
    });
    print('', '');
  }
  
  // Guardar reporte
  const reportPath = 'compliance-monitoring-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  print('green', `📄 Reporte guardado en: ${reportPath}`);
}

// Función principal de monitoreo
function runMonitoring() {
  printHeader();
  
  print('blue', '🔍 Iniciando monitoreo de compliance...');
  print('', '');
  
  const results = {
    criticalFiles: checkCriticalFiles(),
    productionBuild: checkProductionBuild(),
    securityHeaders: checkSecurityHeaders(),
    securityDependencies: checkSecurityDependencies(),
    consentManager: checkConsentManagerIntegration()
  };
  
  const report = generateMonitoringReport(results);
  printReport(report);
  
  // Salir con código apropiado
  if (report.score < 60) {
    print('red', '\n❌ COMPLIANCE CRÍTICO - Se requieren acciones inmediatas');
    process.exit(1);
  } else if (report.score < 80) {
    print('yellow', '\n⚠️ COMPLIANCE PARCIAL - Se recomiendan mejoras');
    process.exit(0);
  } else {
    print('green', '\n✅ COMPLIANCE EXCELENTE - Listo para producción!');
    process.exit(0);
  }
}

// Ejecutar monitoreo
if (require.main === module) {
  runMonitoring();
}

module.exports = {
  runMonitoring,
  checkCriticalFiles,
  checkProductionBuild,
  checkSecurityHeaders,
  checkSecurityDependencies,
  checkConsentManagerIntegration
};
