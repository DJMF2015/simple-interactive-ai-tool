const axios = require('axios');
const chalk = require('chalk');
const { MODELS } = require('./models');

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let CURRENT_MODEL = MODELS[1];

function setModel(model) {
  CURRENT_MODEL = model;
}

async function askLLM(input) {
  try {
    const res = await axios.post(
      API_URL,
      {
        model: CURRENT_MODEL.id,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Answer clearly and accurately.',
          },
          {
            role: 'user',
            content: input,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.log(chalk.red('\n API Error\n'));
    console.log(err.response?.data || err.message);
  }
}

module.exports = { askLLM, setModel };
