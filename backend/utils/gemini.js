const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const basicParser = require("./basic-parser");

async function extractResumeData(resumeText) {
  // --- Fallback writer helper ---
  const outputPath = path.join(
    __dirname,
    "../vcard-personal-portfolio-master/assets/data/resume-data.json"
  );

  function writeData(data) {
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  }

  // --- If no Gemini key, use basic parser immediately ---
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  No GEMINI_API_KEY found — using basic regex parser as fallback");
    return useFallbackParser(resumeText, writeData);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Models to try in order — cheapest/lowest first to conserve quota
  const MODELS_TO_TRY = [
    "gemini-2.0-flash-lite",   // cheapest, lowest quota usage
    "gemini-2.0-flash",        // standard free tier
    "gemini-1.5-flash-8b",     // smallest 1.5 variant
    "gemini-1.5-flash",        // standard 1.5
    "gemini-1.5-pro",          // highest quality, most quota
  ];

  const prompt = `
You are an expert resume parser AI. Carefully analyze the provided resume text and extract ALL information accurately.

CRITICAL RULES:
1. Extract ONLY real information from the resume text — do NOT invent or hallucinate data.
2. For any field NOT found in the resume, use "Not specified" (NOT "Updated Soon").
3. ALWAYS populate skills, education, experience, and services from the resume.
4. Extract ALL skills mentioned anywhere in the resume (skills section, projects, experience, etc.).
5. For services, infer 3-5 professional services based on the person's technical stack and experience.
6. For portfolio, extract every project mentioned in the resume — name, description, and URL if available.
7. For achievements, extract awards, certifications, honors, competitions, programs they participated in.
8. For socials, extract LinkedIn, GitHub, Twitter, Instagram URLs if present in the resume.
9. Skills percentages: estimate based on experience level — Senior=90, Experienced=75, Familiar=60, Basic=40.
10. Set contactInfo email link as "mailto:EMAIL" and phone link as "tel:PHONE".
11. Keep "image" as "my-avatar.png", avatar references as "./images/avatar-1.png" etc., logo references as "./images/logo-1-color.png" etc., project images as "./images/project-1.jpg" sequentially.
12. For blogPosts, create 2 relevant blog post titles based on the resume's domain/technology stack.
13. Return ONLY valid JSON — no markdown, no explanation, no code blocks.

Output this exact JSON structure, fully populated with extracted data:

{
  "basics": {
    "name": "EXTRACTED FULL NAME",
    "label": "EXTRACTED JOB TITLE OR PROFESSION",
    "image": "my-avatar.png",
    "email": "EXTRACTED EMAIL",
    "phone": "EXTRACTED PHONE",
    "birthday": "EXTRACTED BIRTHDAY OR Not specified",
    "location": "EXTRACTED CITY, STATE/COUNTRY",
    "about": ["EXTRACTED PROFESSIONAL SUMMARY OR BIO — 2-3 sentences describing who they are professionally"]
  },
  "contactInfo": [
    { "icon": "mail-outline", "title": "Email", "link": "mailto:EXTRACTED_EMAIL", "value": "EXTRACTED_EMAIL" },
    { "icon": "phone-portrait-outline", "title": "Phone", "link": "tel:EXTRACTED_PHONE", "value": "EXTRACTED_PHONE" },
    { "icon": "calendar-outline", "title": "Birthday", "value": "EXTRACTED_BIRTHDAY OR Not specified" },
    { "icon": "location-outline", "title": "Location", "value": "EXTRACTED_LOCATION" }
  ],
  "socials": [
    { "icon": "logo-linkedin", "url": "EXTRACTED_LINKEDIN_URL OR #" },
    { "icon": "logo-github", "url": "EXTRACTED_GITHUB_URL OR #" },
    { "icon": "logo-twitter", "url": "EXTRACTED_TWITTER_URL OR #" },
    { "icon": "logo-instagram", "url": "EXTRACTED_INSTAGRAM_URL OR #" }
  ],
  "services": [
    { "icon": "https://placehold.co/40x40/ffd700/1a1a1a?text=S1", "title": "INFERRED SERVICE 1 TITLE", "description": "INFERRED SERVICE 1 DESCRIPTION" },
    { "icon": "https://placehold.co/40x40/ffd700/1a1a1a?text=S2", "title": "INFERRED SERVICE 2 TITLE", "description": "INFERRED SERVICE 2 DESCRIPTION" },
    { "icon": "https://placehold.co/40x40/ffd700/1a1a1a?text=S3", "title": "INFERRED SERVICE 3 TITLE", "description": "INFERRED SERVICE 3 DESCRIPTION" },
    { "icon": "https://placehold.co/40x40/ffd700/1a1a1a?text=S4", "title": "INFERRED SERVICE 4 TITLE", "description": "INFERRED SERVICE 4 DESCRIPTION" }
  ],
  "testimonials": [
    { "name": "Colleague Name", "company": "Company Name", "quote": "A professional and reliable collaborator.", "avatar": "./images/avatar-2.png" },
    { "name": "Client Name", "company": "Organisation", "quote": "Delivered excellent results on every project.", "avatar": "./images/avatar-1.png" }
  ],
  "clients": [
    { "name": "Client Alpha", "logo": "./images/logo-1-color.png" },
    { "name": "Client Beta", "logo": "./images/logo-2-color.png" }
  ],
  "education": [
    {
      "title": "EXTRACTED DEGREE AND MAJOR",
      "dates": "EXTRACTED YEARS e.g. 2020 – 2024",
      "description": "EXTRACTED INSTITUTION NAME AND GPA/PERCENTAGE IF AVAILABLE"
    }
  ],
  "experience": [
    {
      "title": "EXTRACTED JOB TITLE AT COMPANY NAME",
      "dates": "EXTRACTED EMPLOYMENT DATES",
      "description": "EXTRACTED JOB RESPONSIBILITIES AND ACHIEVEMENTS"
    }
  ],
  "skills": [
    { "title": "EXTRACTED SKILL 1", "percentage": ESTIMATED_PROFICIENCY_0_TO_100 },
    { "title": "EXTRACTED SKILL 2", "percentage": ESTIMATED_PROFICIENCY_0_TO_100 }
  ],
  "achievements": [
    {
      "title": "EXTRACTED ACHIEVEMENT TITLE",
      "description": "EXTRACTED ACHIEVEMENT DESCRIPTION"
    }
  ],
  "portfolio": [
    {
      "name": "EXTRACTED PROJECT NAME",
      "image": "./images/project-1.jpg",
      "description": "EXTRACTED PROJECT DESCRIPTION",
      "url": "EXTRACTED PROJECT URL OR #"
    }
  ],
  "blogPosts": [
    {
      "title": "DOMAIN-RELEVANT BLOG TITLE 1",
      "date": "2025-01-15",
      "image": "./images/blog-1.jpg",
      "url": "#"
    },
    {
      "title": "DOMAIN-RELEVANT BLOG TITLE 2",
      "date": "2025-02-20",
      "image": "./images/blog-2.jpg",
      "url": "#"
    }
  ]
}

RESUME TEXT TO PARSE:
===
${resumeText}
===

Remember: Return ONLY the JSON object. No markdown. No explanation.
`;

  console.log("📤 Sending resume to Gemini AI for extraction...");

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`   🤖 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 }
      });

      const result = await model.generateContent(prompt);
      let raw = result.response.text();

      // Strip markdown code blocks if Gemini wraps in them
      raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error(`❌ JSON parse error from ${modelName}:`, e.message);
        continue; // Try next model
      }

      if (!data.basics || !data.basics.name) {
        console.warn(`⚠️ ${modelName} returned incomplete data — trying next model`);
        continue;
      }

      writeData(data);
      console.log(`✅ Gemini (${modelName}) extracted and wrote resume data`);
      console.log(`   Name: ${data.basics?.name}`);
      console.log(`   Email: ${data.basics?.email}`);
      console.log(`   Skills: ${data.skills?.length || 0} extracted`);
      console.log(`   Projects: ${data.portfolio?.length || 0} extracted`);

      return { success: true, data, file: outputPath, source: modelName };

    } catch (err) {
      const is429 = err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("Too Many Requests");
      const is404 = err.message?.includes("404") || err.message?.includes("not found");
      if (is429) {
        console.warn(`   ⚠️ ${modelName}: Quota exceeded — trying next model...`);
      } else if (is404) {
        console.warn(`   ⚠️ ${modelName}: Model not available — trying next model...`);
      } else {
        console.error(`   ❌ ${modelName} error:`, err.message.substring(0, 150));
      }
    }
  }

  // All models exhausted — fall back to regex parser
  console.warn("⚠️  All Gemini models quota exhausted — using basic regex parser...");
  return useFallbackParser(resumeText, writeData);
}

function useFallbackParser(resumeText, writeData) {
  try {
    const parsed = basicParser(resumeText);

    // Build the full resume-data.json structure from regex-parsed data
    const data = {
      basics: {
        name: parsed.name,
        label: parsed.experience[0]?.title !== "Not specified" ? parsed.experience[0].title : "Professional",
        image: "my-avatar.png",
        email: parsed.email,
        phone: parsed.phone,
        birthday: "Not specified",
        location: parsed.location,
        about: ["Experienced professional with expertise in multiple domains. Passionate about delivering quality work and continuous learning."]
      },
      contactInfo: [
        { icon: "mail-outline", title: "Email", link: `mailto:${parsed.email}`, value: parsed.email },
        { icon: "phone-portrait-outline", title: "Phone", link: `tel:${parsed.phone}`, value: parsed.phone },
        { icon: "calendar-outline", title: "Birthday", value: "Not specified" },
        { icon: "location-outline", title: "Location", value: parsed.location }
      ],
      socials: [
        { icon: "logo-linkedin", url: parsed.linkedin },
        { icon: "logo-github", url: parsed.github },
        { icon: "logo-twitter", url: "#" },
        { icon: "logo-instagram", url: "#" }
      ],
      services: [
        { icon: "https://placehold.co/40x40/ffd700/1a1a1a?text=S1", title: "Professional Services", description: "Delivering high-quality professional services tailored to client needs." },
        { icon: "https://placehold.co/40x40/ffd700/1a1a1a?text=S2", title: "Consulting", description: "Expert consulting and advisory services across multiple domains." },
        { icon: "https://placehold.co/40x40/ffd700/1a1a1a?text=S3", title: "Project Management", description: "End-to-end project management ensuring timely and quality delivery." },
        { icon: "https://placehold.co/40x40/ffd700/1a1a1a?text=S4", title: "Strategy & Planning", description: "Strategic planning and execution for business growth and success." }
      ],
      testimonials: [
        { name: "Colleague", company: "Organization", quote: "A dedicated and reliable professional.", avatar: "./images/avatar-2.png" },
        { name: "Client", company: "Company", quote: "Delivered excellent results consistently.", avatar: "./images/avatar-1.png" }
      ],
      clients: [
        { name: "Client Alpha", logo: "./images/logo-1-color.png" },
        { name: "Client Beta", logo: "./images/logo-2-color.png" }
      ],
      education: parsed.education,
      experience: parsed.experience,
      skills: parsed.skills.length > 0 ? parsed.skills : [{ title: "Communication", percentage: 80 }, { title: "Problem Solving", percentage: 75 }],
      achievements: [{ title: "Professional Achievement", description: "Achieved significant milestones throughout career." }],
      portfolio: parsed.portfolio,
      blogPosts: [
        { title: "Professional Insights and Industry Trends", date: "2025-01-15", image: "./images/blog-1.jpg", url: "#" },
        { title: "Tips for Career Growth and Development", date: "2025-02-20", image: "./images/blog-2.jpg", url: "#" }
      ]
    };

    writeData(data);

    console.log(`✅ Fallback parser wrote resume data`);
    console.log(`   Name: ${data.basics.name}`);
    console.log(`   Email: ${data.basics.email}`);
    console.log(`   Skills: ${data.skills.length} extracted`);

    return { success: true, data, file: "resume-data.json", source: "fallback" };
  } catch (err2) {
    console.error("❌ Fallback parser also failed:", err2.message);
    return { success: false, message: "Both Gemini and fallback parser failed", error: err2.message };
  }
}

module.exports = extractResumeData;
