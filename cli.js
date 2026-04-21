require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const mammoth = require('mammoth');
const readline = require('readline');
const chalk = require('chalk');

// ---------------- CONFIG ----------------
const MODEL = 'google/gemma-4-26b-a4b-it';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ---------------- SAFETY CHECK ----------------
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('❌ Missing OPENROUTER_API_KEY in .env file');
}

// ---------------- CHAT MEMORY ----------------
const messages = [
  {
    role: 'system',
    content:
      'You are a helpful assistant for analysing files and answering questions based on their content. Provide clear, concise, and informative responses.',
  },
];

// ---------------- FORMAT RESPONSE ----------------
function formatResponse(text) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) return '';

      // Code blocks (simple inline detection)
      if (trimmed.startsWith('```') || trimmed.endsWith('```')) {
        return chalk.cyan(line);
      }

      // Headings (markdown-style)
      if (trimmed.startsWith('#')) {
        return chalk.yellow.bold(line.replace(/^#+\s*/, ''));
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return chalk.white('  • ' + trimmed.slice(2));
      }

      // Warnings / errors inside response
      if (
        trimmed.toLowerCase().includes('error') ||
        trimmed.toLowerCase().includes('warning')
      ) {
        return chalk.red(line);
      }

      // Inline code snippets
      if (line.includes('`')) {
        return chalk.yellow(line);
      }

      // Default text
      return chalk.white(line);
    })
    .join('\n');
}

// ---------------- FILE LOADER ----------------
async function loadFile(path) {
  const ext = path.split('.').pop().toLowerCase();

  try {
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path });
      return result.value;
    }

    return fs.readFileSync(path, 'utf-8');
  } catch (err) {
    console.log(chalk.red('❌ Failed to read file:'), err.message);
    return null;
  }
}

// ---------------- LLM CALL ----------------
async function askLLM(input) {
  messages.push({ role: 'user', content: input });

  try {
    const res = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost',
          'X-Title': 'file-cli',
        },
      },
    );

    const reply = res.data.choices[0].message.content;
    messages.push({ role: 'assistant', content: reply });

    return reply;
  } catch (err) {
    console.log(chalk.red('❌ API Error:'), err.response?.data || err.message);
    return null;
  }
}

// ---------------- CLI SETUP ----------------
const args = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ---------------- MAIN ----------------
async function run() {
  let fileContent = null;
  let prompt = null;

  // 📄 FILE MODE
  if (args.length > 0 && fs.existsSync(args[0])) {
    fileContent = await loadFile(args[0]);
    prompt = args.slice(1).join(' ') || 'Analyse this file';

    if (!fileContent) {
      console.log(chalk.red('❌ Could not load file.'));
      process.exit(1);
    }

    const combinedPrompt = `
FILE CONTENT:
------------------------
${fileContent}
------------------------

TASK:
${prompt}
`;

    console.log(chalk.magenta('\n📄 Analysing file...\n'));

    const response = await askLLM(combinedPrompt);

    if (response) {
      console.log(chalk.green('\n🧠 AI response:\n'));
      console.log(formatResponse(response));
    }

    process.exit(0);
  }

  // 💬 INTERACTIVE MODE
  console.log(chalk.cyan('\n🤖 Gemini CLI (OpenRouter)\n'));
  console.log(chalk.gray("Type 'exit' to quit\n"));

  rl.setPrompt(chalk.blue('> '));
  rl.prompt();

  rl.on('line', async (input) => {
    const text = input.trim();

    if (text.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    console.log(chalk.blue(`\n> ${text}`));
    console.log(chalk.yellow('\nthinking...\n'));

    const response = await askLLM(text);

    if (response) {
      console.log(chalk.green('\n🧠 response:\n'));
      console.log(formatResponse(response) + '\n');
    }

    rl.prompt();
  });
}

run();
