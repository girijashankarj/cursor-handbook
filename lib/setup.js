'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {
  CATEGORIES,
  SELECTABLE_KEYS,
  buildAllowedPaths,
  isPathAllowed,
} = require('./categories');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const CURSOR_DIR = '.cursor';
const SKIP_FILES = new Set(['.DS_Store', 'project.json']);

const EXTRA_FILES = ['SETUP-GUIDE.md', 'CLAUDE.md', 'AGENTS.md'];

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_FILES.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copySelective(src, dest, allowedPaths, basePath) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_FILES.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (isPathAllowed(relativePath + '/', allowedPaths)) {
        copyRecursive(srcPath, destPath);
      } else {
        copySelective(srcPath, destPath, allowedPaths, relativePath);
      }
    } else {
      if (isPathAllowed(relativePath, allowedPaths)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const _lineQueue = [];
let _lineWaiter = null;
let _rl = null;

function ensureReadline() {
  if (_rl) return;
  _rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY || false,
  });
  _rl.on('line', (line) => {
    if (_lineWaiter) {
      const resolve = _lineWaiter;
      _lineWaiter = null;
      resolve(line.trim());
    } else {
      _lineQueue.push(line.trim());
    }
  });
  _rl.on('close', () => {
    if (_lineWaiter) {
      const resolve = _lineWaiter;
      _lineWaiter = null;
      resolve('');
    }
  });
}

function closeReadline() {
  if (_rl) {
    _rl.close();
    _rl = null;
  }
}

function prompt(question) {
  ensureReadline();
  process.stdout.write(question);
  if (_lineQueue.length > 0) {
    return Promise.resolve(_lineQueue.shift());
  }
  return new Promise((resolve) => {
    _lineWaiter = resolve;
  });
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0) {
    fs.rmdirSync(dir);
  }
}

async function selectCategories() {
  console.log('  How would you like to set up?\n');
  console.log('  1) Copy all components');
  console.log('  2) Select by category (multi-select)\n');

  const modeAnswer = await prompt('  Choice (1/2): ');

  if (modeAnswer === '1') {
    return null; // null = copy everything
  }

  console.log('\n  Select categories to install (core is always included):\n');
  SELECTABLE_KEYS.forEach((key, i) => {
    const cat = CATEGORIES[key];
    console.log(`  ${i + 1}) ${cat.label.padEnd(24)} ${cat.description}`);
  });
  console.log('');

  const answer = await prompt('  Enter numbers, comma-separated (e.g. 1,2,5): ');

  const indices = answer
    .split(',')
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => i >= 0 && i < SELECTABLE_KEYS.length);

  if (indices.length === 0) {
    console.log('  No categories selected. Installing core only.\n');
    return [];
  }

  const selected = indices.map((i) => SELECTABLE_KEYS[i]);
  const labels = selected.map((k) => CATEGORIES[k].label);
  console.log(`\n  Selected: Core + ${labels.join(', ')}\n`);
  return selected;
}

async function init(targetDir, options = {}) {
  const { force = false, all = false } = options;
  const cursorSrc = path.join(PACKAGE_ROOT, CURSOR_DIR);
  const cursorDest = path.join(targetDir, CURSOR_DIR);

  console.log('\n  cursor-handbook setup');
  console.log('  ====================\n');

  if (!fs.existsSync(cursorSrc)) {
    throw new Error(
      'Package .cursor/ directory not found. The package may be corrupted.\n' +
      '  Try reinstalling: npm install -D cursor-handbook'
    );
  }

  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  // Determine copy mode
  let selectedCategories = all ? null : await selectCategories();
  const copyAll = selectedCategories === null;

  if (fs.existsSync(cursorDest)) {
    if (!force) {
      const answer = await prompt(
        `  .cursor/ already exists in ${targetDir}\n` +
        '  Back up and replace? (y/N): '
      );
      if (answer.toLowerCase() !== 'y') {
        console.log('\n  Aborted. Existing .cursor/ left unchanged.\n');
        return;
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.join(targetDir, `.cursor.backup.${timestamp}`);
    fs.renameSync(cursorDest, backupDir);
    console.log(`  Backed up existing .cursor/ to ${path.basename(backupDir)}`);
  }

  if (copyAll) {
    console.log('  Copying all .cursor/ components...');
    copyRecursive(cursorSrc, cursorDest);
  } else {
    const allowedPaths = buildAllowedPaths(selectedCategories);
    const catNames = selectedCategories.length > 0
      ? `core + ${selectedCategories.join(', ')}`
      : 'core';
    console.log(`  Copying ${catNames} components...`);
    copySelective(cursorSrc, cursorDest, allowedPaths, '');
    removeEmptyDirs(cursorDest);
  }

  for (const file of EXTRA_FILES) {
    const src = path.join(PACKAGE_ROOT, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`  Copied ${file}`);
    }
  }

  const templateSrc = path.join(cursorDest, 'config', 'project.json.template');
  const configDest = path.join(cursorDest, 'config', 'project.json');
  if (fs.existsSync(templateSrc) && !fs.existsSync(configDest)) {
    fs.copyFileSync(templateSrc, configDest);
    console.log('  Created .cursor/config/project.json from template');
  }

  const hooksDir = path.join(cursorDest, 'hooks');
  if (fs.existsSync(hooksDir)) {
    const hooks = fs.readdirSync(hooksDir).filter((f) => f.endsWith('.sh'));
    for (const hook of hooks) {
      try {
        fs.chmodSync(path.join(hooksDir, hook), 0o755);
      } catch (_) {
        // chmod may not work on Windows
      }
    }
    if (hooks.length > 0) {
      console.log(`  Made ${hooks.length} hook scripts executable`);
    }
  }

  // Count what was copied
  const counts = countFiles(cursorDest);

  console.log(`
  Setup complete!
  ===============

  Installed:
    Rules:     ${counts.rules}
    Agents:    ${counts.agents}
    Skills:    ${counts.skills}
    Commands:  ${counts.commands}
    Hooks:     ${counts.hooks}
    Templates: ${counts.templates}

  Next steps:

  1. Edit .cursor/config/project.json
     - Set your project name, tech stack, and paths
     - Replace all {{PLACEHOLDER}} values

  2. Open the project in Cursor IDE

  3. Use @cursor-setup-agent to further customize
     - It detects your tech stack and fine-tunes components
     - Keep what you need, remove what you don't

  4. Restart Cursor to load the new rules

  5. Verify with /type-check or /code-reviewer

  6. Remove the package (you no longer need it):
     npm uninstall cursor-handbook

  Documentation: SETUP-GUIDE.md (copied to your project root)
  Full docs:     https://github.com/girijashankarj/cursor-handbook
  `);

  closeReadline();
}

function countFiles(cursorDir) {
  const result = { rules: 0, agents: 0, skills: 0, commands: 0, hooks: 0, templates: 0 };
  const dirs = {
    rules: ['.mdc'],
    agents: ['.md'],
    skills: ['.md'],
    commands: ['.md'],
    hooks: ['.sh'],
    templates: ['.template'],
  };

  for (const [dir, exts] of Object.entries(dirs)) {
    const full = path.join(cursorDir, dir);
    if (fs.existsSync(full)) {
      result[dir] = countByExt(full, exts);
    }
  }
  return result;
}

function countByExt(dir, exts) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countByExt(path.join(dir, entry.name), exts);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      count++;
    }
  }
  return count;
}

module.exports = { init };
