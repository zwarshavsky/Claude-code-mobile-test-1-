#!/usr/bin/env node
// Claude Code Power Functions - Interactive CLI Learning Tool

const readline = require('readline');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const RED = '\x1b[31m';
const BG_BLUE = '\x1b[44m';
const BG_GREEN = '\x1b[42m';

const lessons = [
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/clear',
    desc: 'Clear conversation history but keep your session alive.',
    usage: 'Type /clear when context gets bloated and Claude starts hallucinating.',
    pro: 'Keeps memory usage low on long coding sessions.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/compact',
    desc: 'Compress conversation history into a summary to save context.',
    usage: '/compact  →  Claude summarizes the convo and continues from there.',
    pro: 'Use before tackling a new sub-task in a long session.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/cost',
    desc: 'See token usage & estimated cost for the current session.',
    usage: 'Just type /cost anytime.',
    pro: 'Great for keeping tabs on API spend during heavy refactors.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/doctor',
    desc: 'Run a health check on your Claude Code installation.',
    usage: '/doctor — checks API keys, MCP servers, config files.',
    pro: 'First thing to run when something feels broken.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/model',
    desc: 'Switch which Claude model powers your session.',
    usage: '/model claude-opus-4-6   or   /model claude-haiku-4-5',
    pro: 'Use Haiku for quick edits, Opus for complex architecture.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/review',
    desc: 'Ask Claude to review the current diff / recent changes.',
    usage: 'After making edits, type /review for instant code review.',
    pro: 'Pair with /commit for a clean review-then-commit workflow.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/commit',
    desc: 'Claude writes the git commit message and commits for you.',
    usage: 'Stage your files, then type /commit.',
    pro: 'Commit messages follow conventional commits style automatically.',
  },
  {
    category: '⚡ SLASH COMMANDS',
    tip: '/init',
    desc: 'Bootstrap a CLAUDE.md file with project context.',
    usage: '/init — Claude analyzes your repo and writes persistent instructions.',
    pro: 'CLAUDE.md is read every session — put coding standards there.',
  },
  {
    category: '🔧 FLAGS & MODES',
    tip: 'claude --print "prompt"',
    desc: 'Non-interactive mode — output result and exit. Great for scripts.',
    usage: 'claude --print "summarize README.md" > summary.txt',
    pro: 'Pipe Claude into shell scripts and CI pipelines.',
  },
  {
    category: '🔧 FLAGS & MODES',
    tip: 'claude --continue',
    desc: 'Resume the most recent conversation.',
    usage: 'claude --continue  →  picks up exactly where you left off.',
    pro: 'No need to re-explain context when switching terminals.',
  },
  {
    category: '🔧 FLAGS & MODES',
    tip: 'claude --resume <id>',
    desc: 'Resume a specific past conversation by session ID.',
    usage: 'Get IDs from /history, then: claude --resume abc123',
    pro: 'Juggle multiple feature branches with separate contexts.',
  },
  {
    category: '🔧 FLAGS & MODES',
    tip: 'claude --dangerously-skip-permissions',
    desc: 'Auto-approve ALL tool calls — no confirmation prompts.',
    usage: 'claude --dangerously-skip-permissions  (use in safe sandboxes only!)',
    pro: 'Ideal for automated CI pipelines or Docker containers.',
  },
  {
    category: '🔧 FLAGS & MODES',
    tip: 'claude --allowedTools',
    desc: 'Restrict which tools Claude can use in a session.',
    usage: 'claude --allowedTools "Read,Write,Bash(git*)"',
    pro: 'Scope permissions tightly for automated tasks.',
  },
  {
    category: '📁 CLAUDE.md MAGIC',
    tip: 'Project CLAUDE.md',
    desc: 'Persistent instructions Claude reads at the start of every session.',
    usage: 'Add coding standards, architecture notes, forbidden patterns.',
    pro: 'Put "never use var, always use const/let" and it sticks forever.',
  },
  {
    category: '📁 CLAUDE.md MAGIC',
    tip: 'Global ~/.claude/CLAUDE.md',
    desc: 'Instructions that apply across ALL your projects.',
    usage: 'Add your name, preferred stack, personal coding style.',
    pro: 'Claude knows your preferences without you repeating them.',
  },
  {
    category: '📁 CLAUDE.md MAGIC',
    tip: 'CLAUDE.md @imports',
    desc: 'Import other files into CLAUDE.md using @path/to/file syntax.',
    usage: 'Add @docs/api-spec.md to pull in specs automatically.',
    pro: 'Keep CLAUDE.md lean while referencing large docs.',
  },
  {
    category: '🔌 MCP SERVERS',
    tip: 'MCP = Model Context Protocol',
    desc: 'Plug external tools & data sources directly into Claude.',
    usage: 'claude mcp add <server-name> -- <command>',
    pro: 'Connect GitHub, Postgres, Slack, browser automation, and more.',
  },
  {
    category: '🔌 MCP SERVERS',
    tip: 'claude mcp list',
    desc: 'List all configured MCP servers.',
    usage: 'Run anytime to see what tools Claude has access to.',
    pro: 'Use scopes: local (project), user (global), project (.mcp.json).',
  },
  {
    category: '🎣 HOOKS',
    tip: 'Hooks: PreToolUse / PostToolUse',
    desc: 'Run shell commands before/after Claude uses any tool.',
    usage: 'In settings.json: hooks → PreToolUse → matcher + command',
    pro: 'Auto-run linter after every file edit. Auto-run tests after Bash.',
  },
  {
    category: '🎣 HOOKS',
    tip: 'Hook: Notification',
    desc: 'Trigger a shell command when Claude needs your attention.',
    usage: 'Use to send desktop notifications or play a sound.',
    pro: 'Never miss when a long task finishes while you grab coffee.',
  },
  {
    category: '🎣 HOOKS',
    tip: 'Hook: Stop',
    desc: 'Fires when Claude finishes responding.',
    usage: 'Log session stats, post to Slack, trigger CI — all automated.',
    pro: 'Chain Claude into larger automated workflows.',
  },
  {
    category: '🧠 POWER PATTERNS',
    tip: 'Visual Studio Code Extension',
    desc: 'Claude Code runs inside VS Code as a sidebar panel.',
    usage: 'Install "Claude Code" extension → Ctrl+Shift+P → Claude Code',
    pro: 'Click any error in the terminal and ask Claude to fix it inline.',
  },
  {
    category: '🧠 POWER PATTERNS',
    tip: 'Headless / Agent mode',
    desc: 'Run Claude as an autonomous agent from the command line.',
    usage: 'claude -p "fix all TypeScript errors" --output-format json',
    pro: 'Orchestrate multi-step workflows programmatically.',
  },
  {
    category: '🧠 POWER PATTERNS',
    tip: 'Multi-Claude with git worktrees',
    desc: 'Run multiple Claude instances on different branches simultaneously.',
    usage: 'git worktree add ../feature-b && cd ../feature-b && claude',
    pro: 'Parallelize independent features — 10x throughput.',
  },
  {
    category: '🧠 POWER PATTERNS',
    tip: '/fast mode',
    desc: 'Toggle faster output streaming (same model, faster delivery).',
    usage: 'Type /fast to toggle. Good for reading-heavy tasks.',
    pro: 'Feels snappier for long outputs like test results.',
  },
];

let current = 0;
let score = 0;
let mode = 'learn'; // 'learn' or 'quiz'
let quizAnswered = false;
let quizOptions = [];
let correctIdx = 0;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

function clear() { process.stdout.write('\x1Bc'); }

function bar(pct, width = 40) {
  const filled = Math.round(pct * width);
  return GREEN + '█'.repeat(filled) + DIM + '░'.repeat(width - filled) + RESET;
}

function renderLearn() {
  clear();
  const l = lessons[current];
  const pct = (current + 1) / lessons.length;

  console.log(`\n${BG_BLUE}${BOLD}  CLAUDE CODE POWER FUNCTIONS  ${RESET}  ${DIM}${current + 1}/${lessons.length}${RESET}`);
  console.log(bar(pct));
  console.log();
  console.log(`${YELLOW}${BOLD}${l.category}${RESET}`);
  console.log();
  console.log(`  ${CYAN}${BOLD}${l.tip}${RESET}`);
  console.log();
  console.log(`  ${l.desc}`);
  console.log();
  console.log(`  ${DIM}Usage:${RESET}  ${l.usage}`);
  console.log(`  ${DIM}Pro tip:${RESET} ${MAGENTA}${l.pro}${RESET}`);
  console.log();
  console.log(`${DIM}─────────────────────────────────────────────────${RESET}`);
  console.log(`  ${GREEN}→${RESET} Next  ${RED}←${RESET} Prev  ${YELLOW}q${RESET}${DIM}uit  ${RESET}${YELLOW}t${RESET}${DIM} toggle quiz mode${RESET}`);
}

function makeQuiz() {
  const l = lessons[current];
  const others = lessons.filter((_, i) => i !== current);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...shuffled, l].sort(() => Math.random() - 0.5);
  correctIdx = options.indexOf(l);
  quizOptions = options;
  quizAnswered = false;
}

function renderQuiz() {
  clear();
  const l = lessons[current];
  const pct = (current + 1) / lessons.length;

  console.log(`\n${BG_BLUE}${BOLD}  CLAUDE CODE QUIZ MODE  ${RESET}  Score: ${BOLD}${GREEN}${score}${RESET}/${current}  ${DIM}${current + 1}/${lessons.length}${RESET}`);
  console.log(bar(pct));
  console.log();
  console.log(`  ${BOLD}What does this do?${RESET}`);
  console.log();
  console.log(`  ${CYAN}${BOLD}  ${l.tip}  ${RESET}`);
  console.log();

  quizOptions.forEach((opt, i) => {
    const letter = ['A', 'B', 'C', 'D'][i];
    let prefix = `  ${BOLD}${letter}${RESET}) `;
    if (quizAnswered) {
      if (i === correctIdx) prefix = `  ${BG_GREEN}${BOLD} ${letter} ${RESET} `;
      else prefix = `  ${DIM}${letter})${RESET} `;
    }
    console.log(`${prefix}${quizAnswered && i !== correctIdx ? DIM : ''}${opt.desc}${RESET}`);
  });

  console.log();
  if (quizAnswered) {
    console.log(`  ${MAGENTA}Pro tip: ${l.pro}${RESET}`);
    console.log();
    console.log(`  ${GREEN}→${RESET} Next question  ${YELLOW}t${RESET}${DIM} back to learn mode${RESET}`);
  } else {
    console.log(`  ${DIM}Press A, B, C, or D to answer${RESET}`);
    console.log(`  ${YELLOW}t${RESET}${DIM} back to learn mode${RESET}`);
  }
}

function render() {
  if (mode === 'learn') renderLearn();
  else renderQuiz();
}

function handleKey(key) {
  if (key === 'q' || key === '\u0003') { // q or Ctrl+C
    clear();
    console.log(`\n  ${BOLD}Thanks for learning Claude Code!${RESET}`);
    if (mode === 'quiz') console.log(`  Final score: ${GREEN}${BOLD}${score}/${current}${RESET}\n`);
    console.log(`  ${DIM}Run again: node learn-claude.js${RESET}\n`);
    process.exit(0);
  }

  if (mode === 'learn') {
    if (key === '\u001b[C' || key === '\r' || key === ' ') { // right / enter / space
      current = Math.min(current + 1, lessons.length - 1);
    } else if (key === '\u001b[D') { // left
      current = Math.max(current - 1, 0);
    } else if (key === 't') {
      mode = 'quiz'; makeQuiz();
    }
  } else {
    if (quizAnswered) {
      if (key === '\u001b[C' || key === '\r' || key === ' ') {
        current = Math.min(current + 1, lessons.length - 1);
        makeQuiz();
      } else if (key === 't') { mode = 'learn'; }
    } else {
      const answerMap = { a: 0, b: 1, c: 2, d: 3 };
      if (key in answerMap) {
        quizAnswered = true;
        if (answerMap[key] === correctIdx) score++;
      } else if (key === 't') { mode = 'learn'; }
    }
  }
  render();
}

// Start
clear();
console.log(`
${BG_BLUE}${BOLD}  CLAUDE CODE POWER FUNCTIONS  ${RESET}

  ${CYAN}${BOLD}Interactive CLI Learning Tool${RESET}
  ${lessons.length} lessons covering slash commands, flags, hooks, MCP & more.

  ${GREEN}Controls:${RESET}
    ${BOLD}→ / Space / Enter${RESET}  Next card
    ${BOLD}←${RESET}                 Previous card
    ${BOLD}t${RESET}                 Toggle quiz mode
    ${BOLD}q${RESET}                 Quit

  ${DIM}Press any key to start...${RESET}
`);

process.stdin.once('keypress', (_, key) => {
  render();
  process.stdin.on('keypress', (_, key) => {
    if (key) handleKey(key.sequence || key.name || '');
  });
});
