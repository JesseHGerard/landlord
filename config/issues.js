
// first item in array must be the preferred SINGULAR tense of the issue
// second item in array must be the preferred PLURAL tense of the issue

const issues = {
  pests: {
    roaches: ['roach', 'roaches', 'cockroach', 'cockroaches', 'roch', 'roches', 'roads', 'road'],
    mice: ['mouse', 'mice', 'mose', 'mous', 'mic']
  },
  infrastructure: {
    leaks: ['leak', 'leaks', 'leek', 'leeks', 'lek', 'leks', 'lake', 'lakes', 'leaking', 'leaky'],
    bulbs: ['bulb burned-out', 'bulbs burned-out', 'bulb', 'blubs', 'bolb', 'bolbs', 'light', 'light-bulb', 'lights']
  },
  people: {
    packages: ['stolen package', 'stolen packages','package', 'packages', 'stolen', 'stole', 'stoal', 'stolen-package', 'pack', 'delivery', 'deliveries', 'mail', 'male'],
    noise: ['noise complaint', 'noise complaints', 'noise', 'noises', 'noise-complaint', 'nose', 'loud']
  },
  search(word) {
    let result;
    for (category in this) {
      for (issue in this[category]) {
        for (keyword of this[category][issue]) {
          if (word === keyword) {
            result = {'issue': issue, 'category': category};
          };
        };
      };
    };
    return result;
  },
  grammarize(issue, qty) {
    if (qty > 1) {
      return
    }
  }
};


module.exports = issues;
