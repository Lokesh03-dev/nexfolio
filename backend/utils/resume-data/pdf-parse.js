const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const extractResumeData = require("../gemini");

const uploadsDir = path.join(__dirname, "./uploads");

function getLatestFile(folderPath) {
  const files = fs
    .readdirSync(folderPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === ".pdf" || ext === ".docx" || ext === ".doc";
    })
    .map(file => {
      const filePath = path.join(folderPath, file);
      return { filePath, mtime: fs.statSync(filePath).mtime.getTime() };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return files.length ? files[0].filePath : null;
}

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === ".pdf") {
    console.log("📄 Parsing PDF:", path.basename(filePath));
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } 
  
  if (ext === ".docx" || ext === ".doc") {
    console.log("📝 Parsing DOCX:", path.basename(filePath));
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  
  throw new Error(`Unsupported file format: ${ext}`);
}

const dataparsed = async () => {
  try {
    const latestFilePath = getLatestFile(uploadsDir);
    if (!latestFilePath) {
      console.warn("⚠️ No resume file found in uploads directory");
      return { success: false, message: "No resume file found. Please upload a PDF or DOCX." };
    }

    console.log("🔍 Found resume file:", latestFilePath);

    // Extract text from the file
    const resumeText = await extractTextFromFile(latestFilePath);

    if (!resumeText || resumeText.trim().length < 50) {
      return { success: false, message: "Could not extract enough text from the resume file." };
    }

    console.log(`📊 Extracted ${resumeText.length} characters from resume`);

    // Send to Gemini AI for intelligent extraction
    const result = await extractResumeData(resumeText);

    return result;
  } catch (error) {
    console.error("❌ Resume parse error:", error.message);
    return { success: false, message: "Parse failed", error: error.message };
  }
};

module.exports = dataparsed;
