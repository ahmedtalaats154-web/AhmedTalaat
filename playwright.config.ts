import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: "*.spec.ts", fullyParallel: false, workers: 1,
  timeout: 45000, expect: { timeout: 10000 }, reporter: "list",
  use: { baseURL: "http://127.0.0.1:3107", trace: "retain-on-failure", screenshot:"only-on-failure" },
  projects: [
    { name:"desktop",use:{...devices["Desktop Chrome"],viewport:{width:1440,height:1000},channel:"chrome"} },
    { name:"tablet",use:{...devices["Desktop Chrome"],viewport:{width:820,height:1180},channel:"chrome"} },
    { name:"mobile",use:{...devices["Desktop Chrome"],viewport:{width:390,height:844},isMobile:true,hasTouch:true,channel:"chrome"} },
  ],
  webServer:{command:"node tests/start-test-server.mjs",url:"http://127.0.0.1:3107/eu-visual",reuseExistingServer:false,timeout:120000},
});

