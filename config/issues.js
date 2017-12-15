const issues = {
  pests: {
    roaches: ['roach', 'roaches', 'cockroach', 'cockroaches', 'roch', 'roches', 'roads', 'road'],
    mice: ['mice', 'mouse', 'mose', 'mous', 'mic']
  },
  infrastructure: {
    leaks: ['leak', 'leaks', 'leek', 'leeks', 'lek', 'leks', 'lake', 'lakes'],
    bulbs: ['bulb', 'blubs', 'bolb', 'bolbs', 'light', 'light-bulb', 'lights']
  },
  people: {
    packages: ['package', 'packages', 'stolen', 'stole', 'stoal', 'stolen-package', 'pack', 'delivery', 'deliveries', 'mail', 'male'],
    noise: ['noise', 'noises', 'noise-complaint', 'nose', 'loud']
  },
  search(word) {
    let result;
    for (category in this) {
      console.log(`category: ${category}`);
      for (issue in this[category]) {
        console.log(` issue: ${issue}`);
        for (keyword of this[category][issue]) {
          console.log(`   keyword: ${keyword}`);
          if (word === keyword) {
            result = {'issue': issue, 'category': issue};
          };
        };
      };
    };
    return result;
  }
};


module.exports = issues;
