import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    browser: 'electron',
    electron: {
      show: false, // Run in headless mode
    },
    env: {
      EGL_LOG_LEVEL: 'error'
    },
    // Add this section
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--log-level=3');
          launchOptions.args.push('--silent');
          launchOptions.args.push('--disable-gpu');
        }
        return launchOptions;
      });
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    }
  },
  e2e: {
    env: {
      EGL_LOG_LEVEL: 'error'
    }
  }
});