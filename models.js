const MODELS = {
  1: {
    name: 'Gemma',
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
    name: 'Ling 2.6',
    description:
      'Ling-2.6-1T is an instant (instruct) model from inclusionAI and the company’s trillion-parameter flagship, designed for real-world agents that require fast execution and high efficiency at scale. It uses a “fast...","context_length":262144,"architectur',
    capabilities: [
      'fast execution',
      'high efficiency at scale',
      'suitable for real-world agents',
    ],
    id: 'inclusionai/ling-2.6-1t:free',
  },
  4: {
    name: 'Openrouter Free',
    description:
      'The simplest way to get free inference. openrouter/free is a router that selects free models at random from the models available on OpenRoute',
    capabilities: ['access to a variety of free models'],
    id: 'openrouter/free',
  },
};

module.exports = { MODELS };
