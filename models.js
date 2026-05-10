const MODELS = {
  1: {
    name: 'Gemma 4',
    description: 'A versatile model for general tasks.',
    capabilities: ['text generation', 'code generation', 'reasoning'],
    id: 'google/gemma-4-26b-a4b-it',
  },
  2: {
    name: 'Nemotron',
    description: 'A powerful model optimized for reasoning and code tasks.',
    capabilities: ['advanced reasoning', 'code generation', 'complex problem solving'],
    id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  },
  3: {
    name: 'Qwen Coder',
    description:
      'Qwen Coder is a model from inclusionAI optimized for coding tasks, offering fast execution and high efficiency at scale.',
    capabilities: [
      'code generation',
      'code understanding',
      'code completion',
      'multi-language support',
    ],
    id: 'qwen/qwen3-coder:free',
  },
  4: {
    name: 'Openrouter Free',
    description:
      'The simplest way to get free inference. openrouter/free is a router that selects free models at random from the models available on OpenRoute',
    capabilities: ['access to a variety of free models'],
    id: 'openrouter/free',
  },
  5: {
    name: 'OpenAI: gpt-oss-120b',
    description: 'A model optimized for general tasks.',
    capabilities: ['text generation', 'reasoning, agentic and general-purpose tasks'],
    id: 'openai/gpt-oss-120b',
  },

  6: {
    name: 'Laguna M.1',
    description:
      'Designed for agentic coding workflows, with strong reasoning and code generation capabilities.',
    capabilities: ['agentic coding', 'reasoning', 'code generation'],
    id: 'poolside/laguna-m.1:free',
  },
};

module.exports = { MODELS };
