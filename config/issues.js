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
    for (catagory in this) {
      console.log(`catagory: ${catagory}`);
      for (issue in this[catagory]) {
        console.log(` issue: ${issue}`);
        for (keyword of this[catagory][issue]) {
          console.log(`   keyword: ${keyword}`);
          if (word === keyword) {
            result = [issue, catagory];
          };
        };
      };
    };
    return result;
  }
};

module.exports = issues;
