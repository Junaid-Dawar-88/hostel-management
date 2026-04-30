const { app, BrowserWindow, utilityProcess } = require("electron");
const path = require("path");
const http = require("http");

let mainWindow;
let serverProcess;

const PORT = 3000;

function getAppRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app")
    : path.join(__dirname, "..");
}

function startServer() {
  const appRoot = getAppRoot();
  const serverPath = path.join(appRoot, ".next", "standalone", "server.js");
  const dbPath = path.join(app.getPath("userData"), "hostel.db");
  const uploadsDir = path.join(app.getPath("userData"), "uploads");

  serverProcess = utilityProcess.fork(serverPath, [], {
    cwd: path.join(appRoot, ".next", "standalone"),
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
      DATABASE_URL: `file:${dbPath}`,
      UPLOADS_DIR: uploadsDir,
    },
  });

  serverProcess.on("exit", (code) => {
    if (code !== 0) console.error("Server exited with code", code);
  });
}

function waitForServer(timeout = 30000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeout;
    const check = () => {
      const req = http.get(`http://127.0.0.1:${PORT}`, () => resolve());
      req.on("error", () => {
        if (Date.now() > deadline) return reject(new Error("Server did not start in time"));
        setTimeout(check, 400);
      });
      req.end();
    };
    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Hostel Management",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  startServer();

  try {
    await waitForServer();
    createWindow();
  } catch (err) {
    console.error("Failed to start server:", err.message);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  app.quit();
});

app.on("activate", () => {
  if (!mainWindow) createWindow();
});
