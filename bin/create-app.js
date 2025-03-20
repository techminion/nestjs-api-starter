#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ Please provide a project name: `npx nestjs-api-starter my-app`');
  process.exit(1);
}

const repoUrl = 'https://github.com/techminion/nestjs-api-starter.git'; // Change to your repo
const projectPath = path.join(process.cwd(), projectName);

console.log(`🚀 Creating NestJS API project: ${projectName}`);

try {
  execSync(`git clone --depth 1 ${repoUrl} ${projectPath}`, { stdio: 'inherit' });
  process.chdir(projectPath);

  // Remove .git to avoid issues
  execSync('rm -rf .git', { stdio: 'inherit' });

  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('✅ Project setup complete!');
  console.log(`👉 Next Steps:\n  cd ${projectName} \n  npm run start:dev`);
} catch (error) {
  console.error('❌ Error setting up the project:', error);
  process.exit(1);
}
