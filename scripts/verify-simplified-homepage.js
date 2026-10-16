/**
 * Automated Verification Script: Simplified Spooktacular Trick Homepage
 * Verifies:
 * 1. Minimal, focused Homepage (WelcomeScreen.jsx)
 * 2. Complete decoupling of module selection from the homepage
 * 3. Separate Module Selection Screen (ModuleSelectScreen.jsx) with visible Home navigation
 * 4. Route preservation & clean App.jsx state transitions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`   ✓ ${message}`);
}

console.log('================================================================');
console.log('  SIMPLIFIED SPOOKTACULAR TRICK HOMEPAGE VERIFICATION SUITE     ');
console.log('================================================================\n');

// 1. Inspect WelcomeScreen.jsx
console.log('1. Checking Homepage Content & Layout (WelcomeScreen.jsx)...');
const welcomeScreenPath = path.join(rootDir, 'src', 'components', 'WelcomeScreen.jsx');
assert(fs.existsSync(welcomeScreenPath), 'WelcomeScreen.jsx exists');
const welcomeContent = fs.readFileSync(welcomeScreenPath, 'utf8');

// Required elements
assert(welcomeContent.includes('Spooktacular Trick'), 'Homepage displays app name "Spooktacular Trick"');
assert(
  welcomeContent.includes('A little spooky. A lot of mathematical fun!'),
  'Homepage displays required short tagline: "A little spooky. A lot of mathematical fun!"'
);
assert(
  welcomeContent.includes('Discover clever subtraction tricks, solve playful challenges, and become a maths master!'),
  'Homepage displays required introduction: "Discover clever subtraction tricks, solve playful challenges, and become a maths master!"'
);
assert(welcomeContent.includes('Start Playing'), 'Homepage displays single primary button "Start Playing"');
assert(welcomeContent.includes('onStart'), 'Primary button calls onStart handler');

// Decorative elements (friendly ghost, pumpkin, stars)
assert(
  welcomeContent.includes('ghostBodyGrad') && welcomeContent.includes('pumpkinGrad'),
  'Homepage includes subtle Halloween illustration (friendly ghost & pumpkin)'
);
assert(welcomeContent.includes('Star 1') || welcomeContent.includes('fde047'), 'Homepage includes subtle stars');

// Clutter removal verification
assert(!welcomeContent.includes('Adventure One'), 'Homepage does NOT contain "Adventure One" card');
assert(!welcomeContent.includes('Adventure Two'), 'Homepage does NOT contain "Adventure Two" card');
assert(!welcomeContent.includes('Adventure Three'), 'Homepage does NOT contain "Adventure Three" card');
assert(!welcomeContent.includes('Trick-or-Think'), 'Homepage does NOT contain Trick-or-Think module card');
assert(!welcomeContent.includes("Math O' Lantern"), 'Homepage does NOT contain Math O\' Lantern module card');
assert(!welcomeContent.includes('Polotastic'), 'Homepage does NOT contain Polotastic module card');
assert(!welcomeContent.includes('Child-Friendly Teacher Voice'), 'Homepage does NOT contain feature highlights bar');
assert(!welcomeContent.includes('Read Story Comic'), 'Homepage does NOT contain duplicate Story Comic CTA');
assert(!welcomeContent.includes('Teacher Voice 🔊'), 'Homepage does NOT contain duplicate Teacher Voice button');

console.log('\n2. Checking Separate Module Selection Screen (ModuleSelectScreen.jsx)...');
const moduleSelectPath = path.join(rootDir, 'src', 'components', 'ModuleSelectScreen.jsx');
assert(fs.existsSync(moduleSelectPath), 'ModuleSelectScreen.jsx exists');
const moduleSelectContent = fs.readFileSync(moduleSelectPath, 'utf8');

// Modules present
assert(moduleSelectContent.includes('Trick-or-Think'), 'Module 1: Trick-or-Think is present');
assert(moduleSelectContent.includes("Math O' Lantern"), 'Module 2: Math O\' Lantern is present');
assert(moduleSelectContent.includes('Polotastic'), 'Module 3: Polotastic is present');

// Clear descriptions and open buttons
assert(moduleSelectContent.includes('Enter Trick-or-Think'), 'Includes clear way to open Trick-or-Think');
assert(moduleSelectContent.includes("Enter Math O' Lantern"), 'Includes clear way to open Math O\' Lantern');
assert(moduleSelectContent.includes('Enter Polotastic'), 'Includes clear way to open Polotastic');

// Back navigation / Home button
assert(
  moduleSelectContent.includes('← Home') || moduleSelectContent.includes('module-select-home-btn'),
  'Includes visible, prominent Home button'
);
assert(moduleSelectContent.includes('onBackToWelcome'), 'Home button triggers onBackToWelcome');

console.log('\n3. Checking Application Routing & Decoupling (App.jsx)...');
const appPath = path.join(rootDir, 'src', 'App.jsx');
assert(fs.existsSync(appPath), 'App.jsx exists');
const appContent = fs.readFileSync(appPath, 'utf8');

// Transitions
assert(
  appContent.includes("currentScreen === 'welcome'") && appContent.includes("setCurrentScreen('module_select')"),
  'WelcomeScreen onStart transitions to module_select'
);
assert(
  appContent.includes("currentScreen === 'module_select'") &&
    appContent.includes("onBackToWelcome={() => setCurrentScreen('welcome')}"),
  'ModuleSelectScreen onBackToWelcome transitions back to welcome'
);

// Preserved module screens
assert(appContent.includes("currentScreen === 'trick_or_think_select'"), 'Preserves trick_or_think_select route');
assert(appContent.includes("currentScreen === 'game'"), 'Preserves game route');
assert(appContent.includes("currentScreen === 'notebook'"), 'Preserves notebook route');
assert(appContent.includes("currentScreen === 'math_o_lantern'"), 'Preserves math_o_lantern route');
assert(appContent.includes("currentScreen === 'polotastic'"), 'Preserves polotastic route');

// Footer check
assert(
  appContent.includes("currentScreen !== 'welcome'"),
  'Footer does not list individual modules on the welcome homepage'
);

console.log('\n4. Checking Header.jsx Minimal Navigation...');
const headerPath = path.join(rootDir, 'src', 'components', 'Header.jsx');
assert(fs.existsSync(headerPath), 'Header.jsx exists');
const headerContent = fs.readFileSync(headerPath, 'utf8');

assert(
  headerContent.includes("activeMode !== 'welcome' && onOpenStory"),
  'Story Comic button is hidden on homepage to prevent distraction'
);
assert(
  headerContent.includes("activeMode !== 'welcome' && ("),
  'Share button is hidden on homepage to keep focus on Start Playing'
);
assert(
  headerContent.includes(": 'Home'}"),
  'Header back button clearly points to "Home" when on module_select'
);

console.log('\n================================================================');
console.log('🎉 ALL HOMEPAGE SIMPLIFICATION & NAVIGATION CHECKS PASSED! 🎉');
console.log('================================================================\n');
