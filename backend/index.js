require('dotenv').config()
const express = require('express')
const chokidar = require('chokidar')
const parse = require('./utils/resume-data/pdf-parse')
const router = require('./routers/auth-router')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const mongoose = require("mongoose");

const cookieParser = require('cookie-parser')

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for: ' + origin));
  },
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

// Health check for Render
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', router)
app.use('/portfolio', express.static(path.join(__dirname, './vcard-personal-portfolio-master')))

const __dirnameback = path.resolve()
app.use(express.static(path.join(__dirnameback, 'front/dist')))

const uploadsDir = path.join(__dirname, './utils/resume-data/uploads')
const portfolioFolder = path.join(__dirname, './vcard-personal-portfolio-master')

// Create an initial, resolved promise. This is our async lock.
let processingPromise = Promise.resolve();
let lastParseResult = null;

const watcher = chokidar.watch(uploadsDir, {
  persistent: true,
  ignoreInitial: true,
  depth: 0
})

watcher.on('add', async (filePath) => {
  if (filePath.toLowerCase().endsWith('.pdf')) {
    // A new PDF has been added. Create a new promise for the processing task.
    processingPromise = (async () => {
      try {
        console.log("Starting PDF processing triggered by new file...");
        // Call your AI parsing function
        const result = await parse(); 
        console.log("PDF processing complete. Result ready.");
        // Store the result if needed
        return result; 
      } catch (err) {
        console.error("Error parsing PDF:", err);
        return null; // Return null on error
      }
    })();
  }
})

// Helper: wait function for any additional delays if needed
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/download-portfolio', async (req, res) => {
  try {
    console.log("Download request received. Waiting for processing to finish...");
    // Await the promise to ensure any pending file processing is complete.
    await processingPromise;
    await wait(500)
    console.log("Processing done. Starting file download.");

    // It is good practice to create a dynamic zip file name to prevent conflicts
    const zipPath = path.join(__dirname, `portfolio_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes for the zip file.`);
      res.download(zipPath, 'portfolio.zip', err => {
        if (err) {
          console.error("Error sending portfolio:", err);
          // Don't send status if headers are already sent
          if (!res.headersSent) {
            return res.status(500).json({
              success: false,
              message: 'Error sending portfolio',
              error: err.message,
            });
          }
        }
        // Cleanup the temporary zip file
        fs.unlink(zipPath, (unlinkErr) => {
          if (unlinkErr) console.error("Error cleaning up zip file:", unlinkErr);
        });
      });
    });

    archive.on('error', err => {
      console.error("Error creating ZIP:", err);
      // Don't send status if headers are already sent
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Error creating ZIP',
          error: err.message,
        });
      }
    });

    archive.pipe(output);
    archive.directory(portfolioFolder, false);
    archive.finalize();

  } catch (err) {
    console.error("Unexpected error in download route:", err);
    // Don't send status if headers are already sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Unexpected error',
        error: err.message,
      });
    }
  }
});

const PORT = process.env.PORT || 3000
console.log("Render PORT:", PORT)

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://abhishekdabasok:123qweasd@cluster0.xx3zhzb.mongodb.net/zumify?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI).then(()=>{
  console.log("connected to DB")
}).catch((err)=>console.log(err.message))

app.listen(PORT,()=>{
  console.log(`Listening on port ${PORT}`);
})