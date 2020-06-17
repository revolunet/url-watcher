#!/usr/bin/env node

const { watch } = require("../src");

const usage = () => {
  console.log(`USAGE: npx url-watcher https://website/to/test`);
};

if (require.main === module) {
  if (process.argv.length !== 3) {
    usage();
    process.exit(1);
  }
  const url = process.argv[2];
  watch(url);
}
