const { MODELS } = require('../models/models');

/**
 * LLM Configuration and State Management
 * This module manages the current LLM model selection and API configuration.
 * It provides functions to get and set the current model, as well as the API endpoint.
 * The CURRENT_MODEL variable holds the currently selected model, which can be updated via setModel().
 * The getCurrentModel() function allows other modules to access the current model configuration.
 */
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let CURRENT_MODEL = MODELS[1];

function getCurrentModel() {
  return CURRENT_MODEL;
}

function setModel(model) {
  CURRENT_MODEL = model;
}

module.exports = { API_URL, CURRENT_MODEL, setModel, getCurrentModel };
