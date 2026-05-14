const axios = require('axios');
const chalk = require('chalk');
const { MODELS } = require('../models/models');
const { API_URL, CURRENT_MODEL, getCurrentModel } = require('../utils/llmConfig');
const { summariseHistory, buildContext } = require('./contextEngine');
const { saveSession } = require('../services/sessionStore');
const memory = require('../services/memory');
const error = require('../utils/errorHandler');
const ApiError = require('../errors/ApiError');

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
      },
    );

    if (!res.data?.choices?.length) {
      throw new ApiError('No response returned from LLM', {
        model: getCurrentModel().name,
      });
    }

    const reply = res.data.choices[0].message.content;
    memory.addMessage('assistant', reply);

    saveSession(memory.getMessages(), getCurrentModel().id, memory.getSummary());
    return reply;
  } catch (err) {
    console.error(err);
    console.error(err.stack);
  }
}

module.exports = { askLLM };
