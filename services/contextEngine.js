const memory = require('./memory');
const chalk = require('chalk');
const axios = require('axios');
const { MODELS } = require('../models/models');
const { API_URL, CURRENT_MODEL } = require('../utils/llmConfig');
const validate_error = require('../utils/errorHandler');
const ApiError = require('../errors/ApiError');

/**
 *
 * @param   userInput
 *  @return  context array to send to LLM, built from system instructions, conversation summary, loaded file (if relevant), and recent messages.x
 *
 * The context construction follows these steps:
 * 1. Start with a system instruction that defines the assistant's role and how it should use the provided information.
 * 2. If a conversation summary exists, include it as a system message to give the LLM an overview of the previous interactions.
 * 3. If a file is currently loaded, include its content as a system message to provide relevant information that may assist in answering user questions.
 * 4. Append recent messages from the conversation history to maintain context and continuity in the dialogue.
 *
 * This structured approach ensures that the LLM has access to both the high-level summary of the conversation and the specific details from recent interactions, enabling it to generate accurate and contextually relevant responses.
 */

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

/**
 * Summarises conversation history by sending to LLM.
 * On error, logs warning but allows application to continue with existing summary.
 *
 * @throws Does not throw - errors are handled internally with user feedback
 * @returns {Promise<void>}
 */
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
  
  Summarise in under 220 words. Focus on key points, facts, and user goals.`;

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

    validate_error.validateResponse(
      resp,
      'data.choices.0.message.content',
      'Summarisation',
    );
    memory.replaceWithSummary(newSummary);
  } catch (err) {
    if (err instanceof ApiError) {
      console.log(chalk.yellow('\n⚠️  Warning: Could not update summary'));
      console.log(chalk.yellow(`Reason: ${err.message}`));
    }
  }
}
module.exports = { buildContext, summariseHistory };
