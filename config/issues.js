
// first item in array must be the preferred SINGULAR tense of the issue
// second item in array must be the preferred PLURAL tense of the issue

const issues = {
  'Pests': {
    Roaches: ['roach', 'roaches', 'cockroach', 'cockroaches', 'roch', 'roches', 'roads', 'road'],
    Mice: ['mouse', 'mice', 'mose', 'mous', 'mic']
  },
  'Infrastructure': {
    Leak: ['leak', 'leaks', 'leek', 'leeks', 'lek', 'leks', 'lake', 'lakes', 'leaking', 'leaky'],
    'Light Bulb': ['bulb burned-out', 'bulbs burned-out', 'bulb', 'blubs', 'bolb', 'bolbs', 'light', 'light-bulb', 'lights']
  },
  'People': {
    'Stolen Mail': ['stolen package', 'stolen packages','package', 'packages', 'stolen', 'stole', 'stoal', 'stolen-package', 'pack', 'delivery', 'deliveries', 'mail', 'male'],
    Noise: ['noise complaint', 'noise complaints', 'noise', 'noises', 'noise-complaint', 'nose', 'loud']
  },
  search(word) {
    let result;
    for (category in this) {
      for (issue in this[category]) {
        for (keyword of this[category][issue]) {
          if (word === keyword) {
            result = {category: issue, class: category};
          };
        };
      };
    };
    return result;
  }
};


module.exports = issues;
