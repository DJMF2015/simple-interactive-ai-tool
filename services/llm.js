const axios = require('axios');
const chalk = require('chalk');
const { MODELS } = require('../models/models');
const { API_URL, CURRENT_MODEL, getCurrentModel } = require('../utils/llmConfig');
const { summariseHistory, buildContext } = require('./contextEngine');
const { saveSession } = require('../services/sessionStore');
const memory = require('../services/memory');
const ApiError = require('../errors/ApiError');
const error = require('../utils/errorHandler');

async function askLLM(userInput) {
  if (memory.shouldSummarise()) {
    await summariseHistory();
  }

  memory.addMessage('user', userInput);

  const messages = buildContext(userInput);
  console.log(chalk.blue('\n💬 Sending to LLM with context:\n'));
  try {
    const res = await axios.post(
      API_URL,
      {
        model: getCurrentModel().id,
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );

    if (!res.data?.choices?.[0].message?.content) {
      throw new ApiError('Invalid response structure from LLM', {
        model: getCurrentModel().name,
        hasChoices: !!res.data?.choices,
      });
    }

    const reply = res.data.choices[0].message.content;
    memory.addMessage('assistant', reply);

    saveSession(memory.getMessages(), getCurrentModel().id, memory.getSummary());
    return reply;
  } catch (err) {
    const appError = error.handleError(err, 'LLM Request');
    throw appError;
  }
}

module.exports = { askLLM };
