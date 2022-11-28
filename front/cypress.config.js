const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 't39wu7',
  e2e: {
    baseUrl: 'http://localhost:3001',
    env: {
      ADMIN_PASSWORD: '123456',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
