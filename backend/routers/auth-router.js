const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth-controllers");
const upload = require("../controllers/resume-uploads");

const fs = require("fs");
const path = require("path");

router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.post("/google-login", authcontroller.googleLogin);
router.post("/upgrade", authcontroller.upgrade);

const resumeDataPath = path.join(__dirname, "../vcard-personal-portfolio-master/assets/data/resume-data.json");

// Retrieve parsed resume data
router.get("/resume-data", (req, res) => {
  try {
    if (fs.existsSync(resumeDataPath)) {
      const rawData = fs.readFileSync(resumeDataPath, "utf8");
      return res.status(200).json(JSON.parse(rawData));
    } else {
      return res.status(404).json({ message: "No parsed resume data found. Please upload a resume first." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error reading resume data", error: error.message });
  }
});

// Update parsed resume data
router.post("/resume-data", (req, res) => {
  try {
    const updatedData = req.body;
    if (!updatedData) {
      return res.status(400).json({ message: "Invalid data payload" });
    }
    
    // Ensure parent directories exist
    if (!fs.existsSync(path.dirname(resumeDataPath))) {
      fs.mkdirSync(path.dirname(resumeDataPath), { recursive: true });
    }
    
    fs.writeFileSync(resumeDataPath, JSON.stringify(updatedData, null, 2), "utf8");
    return res.status(200).json({ message: "Resume data updated successfully! 💾", data: updatedData });
  } catch (error) {
    return res.status(500).json({ message: "Error saving resume data", error: error.message });
  }
});

router.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    file: req.file.filename,
  });
});

module.exports = router;
