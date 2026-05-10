const axios = require('axios');
const chalk = require('chalk');
const { MODELS } = require('./models');
const { saveSession } = require('./sessionStore');
const memory = require('./memory');
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let CURRENT_MODEL = MODELS[1];

function setModel(model) {
  CURRENT_MODEL = model;
}

function buildContext(userInput) {
  const context = [];
  context.push({
    role: 'system',
    content:
      "You are a helpful AI assistant. Answer clearly and accurately. If the user has provided a file, use the information in the file to help answer questions. Always refer to the file if it is relevant to the user's question. If the user asks about the file, provide information from it. If the user asks a question that can be answered using the file, use the file content to answer. If not, answer based on your general knowledge.",
  });

  const summary = memory.getSummary();

  if (summary) {
    context.push({
      role: 'system',
      content: `Previous conversation summary:\n${summary}`,
    });
  }
  const { currentFile, fileName } = memory.getFile();

  if (currentFile) {
    context.push({
      role: 'system',
      content: `Current file loaded: ${fileName}\n\n${currentFile}`,
    });
  }
  context.push(...memory.getRecentMessages());

  return context;
}
async function summariseHistory() {
  const messagesToSummarise = memory.getMessages();
  const existingSummary = memory.getSummary();
  console.log(
    'Summarising conversation history. Total messages:',
    messagesToSummarise.length,
  );

  const prompt = `Create a new, updated summary of the conversation. 
  Existing Summary: ${existingSummary}
  
  New Messages to incorporate:
  ${messagesToSummarise.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}
  
  Summarise in under 120 words. Focus on key points, facts, and user goals.`;

  try {
    const resp = await axios.post(
      API_URL,
      {
        model: CURRENT_MODEL.id,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const newSummary = resp.data.choices[0].message.content;
    memory.replaceWithSummary(newSummary);
  } catch (err) {
    console.log(chalk.red('\n Error during summarisation\n'));
  }
}

async function askLLM(userInput) {
  if (memory.shouldSummarise()) {
    await summariseHistory();
  }

  memory.addMessage('user', userInput);

  const messages = buildContext(userInput);
  try {
    const res = await axios.post(
      API_URL,
      {
        model: CURRENT_MODEL.id,
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const reply = res.data.choices[0].message.content;
    memory.addMessage('assistant', reply);
    saveSession(memory.getMessages(), CURRENT_MODEL.id, memory.getSummary());

    return reply;
  } catch (err) {
    console.log(chalk.red('\n API Error\n'));
    console.log(err.response?.data || err.message);
  }
}

module.exports = { askLLM, setModel };
