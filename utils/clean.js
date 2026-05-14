const chalk = require('chalk');

function formatResponse(text) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();

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

      if (
        trimmed.toLowerCase().includes('error') ||
        trimmed.toLowerCase().includes('warning') ||
        trimmed.toLowerCase().includes('important')
      ) {
        return chalk.red(line);
      }

      // Inline code snippets
      if (line.includes('`')) {
        return chalk.yellow(line);
      }

      return chalk.white(line);
    })
    .join('\n');
}

module.exports = { formatResponse };
