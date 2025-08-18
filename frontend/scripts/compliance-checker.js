#!/usr/bin/env node

/**
 * AuditMesh Compliance Checker
 * Verifica el cumplimiento de GDPR/LOPD, ISO 27001 y otras regulaciones
 */

const fs = require('fs');
const path = require('path');

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

// Función para imprimir con colores
function print(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

// Función para imprimir header
function printHeader() {
  print('cyan', '🔍 AUDITMESH COMPLIANCE CHECKER');
  print('cyan', '================================');
  print('', '');
}

// Función para verificar archivos de compliance
function checkComplianceFiles() {
  print('blue', '📋 Verificando archivos de compliance...');
  
  const requiredFiles = [
    'docs/PRIVACY_POLICY.md',
    'docs/SECURITY_POLICY.md',
    'vite.config.security.ts'
  ];
  
  let missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      print('green', `✅ ${file}`);
    } else {
      print('red', `❌ ${file} - FALTANTE`);
      missingFiles.push(file);
    }
  });
  
  return missingFiles.length === 0;
}

// Función para verificar headers de seguridad
function checkSecurityHeaders() {
  print('blue', '\n🔒 Verificando headers de seguridad...');
  
  try {
    const configPath = 'vite.config.security.ts';
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      
      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Content-Security-Policy'
      ];
      
      let allHeadersPresent = true;
      
      requiredHeaders.forEach(header => {
        if (content.includes(header)) {
          print('green', `✅ ${header}`);
        } else {
          print('red', `❌ ${header} - FALTANTE`);
          allHeadersPresent = false;
        }
      });
      
      return allHeadersPresent;
    } else {
      print('red', '❌ Configuración de seguridad no encontrada');
      return false;
    }
  } catch (error) {
    print('red', `❌ Error verificando headers: ${error.message}`);
    return false;
  }
}

// Función para verificar dependencias de seguridad
function checkSecurityDependencies() {
  print('blue', '\n🛡️ Verificando dependencias de seguridad...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Verificar dependencias de seguridad recomendadas
    const securityDeps = [
      'helmet',
      'cors',
      'express-rate-limit',
      'express-validator'
    ];
    
    let securityScore = 0;
    
    securityDeps.forEach(dep => {
      if (dependencies[dep]) {
        print('green', `✅ ${dep}`);
        securityScore++;
      } else {
        print('yellow', `⚠️ ${dep} - Recomendado`);
      }
    });
    
    print('blue', `\n📊 Puntuación de seguridad: ${securityScore}/${securityDeps.length}`);
    return securityScore >= 2; // Al menos 2 dependencias de seguridad
  } catch (error) {
    print('red', `❌ Error verificando dependencias: ${error.message}`);
    return false;
  }
}

// Función para verificar estructura de directorios
function checkDirectoryStructure() {
  print('blue', '\n📁 Verificando estructura de directorios...');
  
  const requiredDirs = [
    'docs',
    'src/components',
    'src/lib',
    'src/types',
    'scripts'
  ];
  
  let allDirsPresent = true;
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      print('green', `✅ ${dir}/`);
    } else {
      print('red', `❌ ${dir}/ - FALTANTE`);
      allDirsPresent = false;
    }
  });
  
  return allDirsPresent;
}

// Función para verificar configuración de TypeScript
function checkTypeScriptConfig() {
  print('blue', '\n⚙️ Verificando configuración de TypeScript...');
  
  try {
    const tsConfigPath = 'tsconfig.app.json';
    if (fs.existsSync(tsConfigPath)) {
      const config = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      
      let configScore = 0;
      
      // Verificar configuraciones de seguridad
      if (config.compilerOptions?.strict) {
        print('green', '✅ Modo estricto habilitado');
        configScore++;
      } else {
        print('yellow', '⚠️ Modo estricto recomendado');
      }
      
      if (config.compilerOptions?.noUnusedLocals) {
        print('green', '✅ Detección de variables no utilizadas');
        configScore++;
      } else {
        print('yellow', '⚠️ Detección de variables no utilizadas recomendada');
      }
      
      if (config.compilerOptions?.noUnusedParameters) {
        print('green', '✅ Detección de parámetros no utilizados');
        configScore++;
      } else {
        print('yellow', '⚠️ Detección de parámetros no utilizados recomendada');
      }
      
      print('blue', `\n📊 Puntuación de configuración: ${configScore}/3`);
      return configScore >= 2;
    } else {
      print('red', '❌ Configuración de TypeScript no encontrada');
      return false;
    }
  } catch (error) {
    print('red', `❌ Error verificando configuración TypeScript: ${error.message}`);
    return false;
  }
}

// Función para generar reporte de compliance
function generateComplianceReport(results) {
  print('blue', '\n📊 GENERANDO REPORTE DE COMPLIANCE...');
  print('', '');
  
  const report = {
    timestamp: new Date().toISOString(),
    project: 'AuditMesh Frontend',
    compliance: {
      gdpr_lopd: results.complianceFiles && results.securityHeaders,
      iso_27001: results.complianceFiles && results.directoryStructure,
      security: results.securityHeaders && results.securityDependencies,
      typescript: results.typescriptConfig
    },
    score: 0,
    recommendations: []
  };
  
  // Calcular puntuación
  Object.values(results).forEach(result => {
    if (result) report.score++;
  });
  
  report.score = Math.round((report.score / Object.keys(results).length) * 100);
  
  // Generar recomendaciones
  if (!results.complianceFiles) {
    report.recommendations.push('Crear archivos de política de privacidad y seguridad');
  }
  
  if (!results.securityHeaders) {
    report.recommendations.push('Implementar headers de seguridad en la configuración de Vite');
  }
  
  if (!results.securityDependencies) {
    report.recommendations.push('Agregar dependencias de seguridad recomendadas');
  }
  
  if (!results.directoryStructure) {
    report.recommendations.push('Crear estructura de directorios requerida');
  }
  
  if (!results.typescriptConfig) {
    report.recommendations.push('Mejorar configuración de TypeScript para seguridad');
  }
  
  // Imprimir resultados
  print('cyan', '📋 RESULTADOS DEL COMPLIANCE CHECKER');
  print('cyan', '====================================');
  print('', '');
  
  print('blue', `🏆 Puntuación General: ${report.score}%`);
  print('', '');
  
  print('blue', '📊 Estado por Área:');
  print('', '');
  
  print(results.complianceFiles ? 'green' : 'red', 
    `${results.complianceFiles ? '✅' : '❌'} Archivos de Compliance`);
  
  print(results.securityHeaders ? 'green' : 'red', 
    `${results.securityHeaders ? '✅' : '❌'} Headers de Seguridad`);
  
  print(results.securityDependencies ? 'green' : 'red', 
    `${results.securityDependencies ? '✅' : '❌'} Dependencias de Seguridad`);
  
  print(results.directoryStructure ? 'green' : 'red', 
    `${results.directoryStructure ? '✅' : '❌'} Estructura de Directorios`);
  
  print(results.typescriptConfig ? 'green' : 'red', 
    `${results.typescriptConfig ? '✅' : '❌'} Configuración TypeScript`);
  
  print('', '');
  
  if (report.recommendations.length > 0) {
    print('yellow', '🔧 RECOMENDACIONES:');
    report.recommendations.forEach((rec, index) => {
      print('yellow', `${index + 1}. ${rec}`);
    });
    print('', '');
  }
  
  // Guardar reporte en archivo
  const reportPath = 'compliance-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  print('green', `📄 Reporte guardado en: ${reportPath}`);
  
  return report;
}

// Función principal
function main() {
  printHeader();
  
  const results = {
    complianceFiles: checkComplianceFiles(),
    securityHeaders: checkSecurityHeaders(),
    securityDependencies: checkSecurityDependencies(),
    directoryStructure: checkDirectoryStructure(),
    typescriptConfig: checkTypeScriptConfig()
  };
  
  const report = generateComplianceReport(results);
  
  // Salir con código de error si hay problemas críticos
  if (report.score < 60) {
    print('red', '\n❌ COMPLIANCE INSUFICIENTE - Se requieren acciones inmediatas');
    process.exit(1);
  } else if (report.score < 80) {
    print('yellow', '\n⚠️ COMPLIANCE PARCIAL - Se recomiendan mejoras');
    process.exit(0);
  } else {
    print('green', '\n✅ COMPLIANCE ADECUADO - Buen trabajo!');
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  checkComplianceFiles,
  checkSecurityHeaders,
  checkSecurityDependencies,
  checkDirectoryStructure,
  checkTypeScriptConfig,
  generateComplianceReport
};
