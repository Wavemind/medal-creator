const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 't39wu7',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
