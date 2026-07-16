const fs = require("fs");
const path = require("path");

/**
 * Robust fallback resume parser using regex patterns
 * Handles common resume formats including modern icon-based layouts
 */
function basicParser(resumeText) {
  const lines = resumeText.split("\n").map(l => l.trim()).filter(Boolean);
  const fullText = resumeText;

  // ========================================
  // NAME — first meaningful line (2+ word capitalized)
  // Handles normal lines AND "SakshiSoniEmail:" glued formats
  // ========================================
  let name = "Not specified";
  for (const line of lines.slice(0, 10)) {
    // First: clean off any trailing non-name content like "Email:", "Mobile:", icons
    const cleaned = line.replace(/(?:Email|Mobile|Phone|LinkedIn|GitHub|Portfolio|Tel)[:\s].*/i, "").trim();
    // Match "First Last" or "First Middle Last" patterns
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$/.test(cleaned) && cleaned.length > 3 && cleaned.length < 50) {
      name = cleaned;
      break;
    }
  }
  // Last resort: look for "Name: X" anywhere
  if (name === "Not specified") {
    const nameKw = fullText.match(/(?:^|\n)Name[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,3})/);
    if (nameKw) name = nameKw[1].trim();
  }

  // ========================================
  // EMAIL — handle both standalone and inline "Email: x@y.z" formats
  // Also handle obfuscated: "# Email" (icon-based) - try to find in surrounding text
  const emailMatch = fullText.match(/\b[\w.+%-]+@[\w.-]+\.[a-zA-Z]{2,6}\b/);
  const email = emailMatch ? emailMatch[0] : "Not specified";

  // PHONE — handle: +91 8295475313, Mobile: +91..., 8708250109, (123) 456-7890
  const phonePatterns = [
    /(?:Mobile|Phone|Tel|Cell)[:\s]+([\+\d][\d\s\-().]{7,18})/i, // "Mobile: +91 ..."
    /\+\d{1,3}[\s\-]?\d{5,12}/,                                   // +91 8295475313
    /\b\d{10}\b/,                                                  // 8708250109
    /(?:\(?\d{3}\)?[\s\-.])\d{3}[\s\-.]\d{4}/                    // (123) 456-7890
  ];
  let phone = "Not specified";
  for (const pattern of phonePatterns) {
    const m = fullText.match(pattern);
    if (m) { phone = (m[1] || m[0]).trim(); break; }
  }

  // ========================================
  // LINKEDIN URL
  // ========================================
  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w\-]+)/i);
  const linkedin = linkedinMatch 
    ? `https://linkedin.com/in/${linkedinMatch[1]}`
    : (() => {
        // Some resumes just write "linkedin.com/in/username" without https
        const shortMatch = fullText.match(/linkedin\.com\/in\/([\w\-]+)/i);
        return shortMatch ? `https://linkedin.com/in/${shortMatch[1]}` : "#";
      })();

  // ========================================
  // GITHUB URL
  // ========================================
  const githubMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w\-]+)/i);
  const github = githubMatch
    ? `https://github.com/${githubMatch[1]}`
    : (() => {
        const shortMatch = fullText.match(/github\.com\/([\w\-]+)/i);
        return shortMatch ? `https://github.com/${shortMatch[1]}` : "#";
      })();

  // Also handle username-only format like "abhishek972986" next to github symbol
  // Common pattern: "§ abhishek972986|ï Linkedin" 
  // Try to extract GitHub username from § symbol context
  let githubFinal = github;
  if (github === "#") {
    const symbolPattern = fullText.match(/§\s*([\w\-]+)/);
    if (symbolPattern) githubFinal = `https://github.com/${symbolPattern[1]}`;
  }

  // ========================================
  // PORTFOLIO URL
  // ========================================
  const portfolioMatch = fullText.match(/(?:https?:\/\/)?[\w-]+\.(?:vercel\.app|netlify\.app|github\.io|com|dev|io)(\/[\w\-./]*)?/i);
  const portfolio = portfolioMatch ? portfolioMatch[0] : "#";

  // ========================================
  // LOCATION — city, state/country
  // ========================================
  let location = "Not specified";
  // Common location keywords in resumes
  const locationKw = fullText.match(/(?:Location|Based in|Address|City)[:\s]+([^\n|,]+(?:,\s*[^\n|]+)?)/i);
  if (locationKw) {
    location = locationKw[1].trim();
  } else {
    // Look for "City, State" or "City, Country" patterns (exclude skill lists)
    const cityState = fullText.match(/\b([A-Z][a-z]{2,20}),\s*([A-Z][a-z]{2,20}(?:\s[A-Z][a-z]+)?)\b/);
    if (cityState) {
      const candidate = cityState[0];
      // Reject if it looks like a date or tech name
      if (!/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|React|Node|Java|Type)/i.test(candidate)) {
        location = candidate;
      }
    }
  }

  // ========================================
  // PROFESSIONAL TITLE / LABEL
  // ========================================
  let label = "Professional";
  const titlePatterns = [
    /(?:title|position|role|designation|profession)[:\s]+([^\n]+)/i,
    // Look for known job title words early in the document
    /\b(Software Engineer|Full.Stack Developer|Frontend Developer|Backend Developer|Data Scientist|Product Manager|UI\/UX Designer|DevOps Engineer|Cloud Engineer|Web Developer|ML Engineer|Mobile Developer)\b/i
  ];
  for (const pattern of titlePatterns) {
    const m = fullText.match(pattern);
    if (m) { label = m[1].trim(); break; }
  }

  // ========================================
  // ABOUT / SUMMARY
  // ========================================
  let about = "Experienced professional with a strong background in their field. Committed to delivering quality work and continuous improvement.";
  const summarySection = fullText.match(/(?:summary|objective|profile|about me)[:\s\n]+([\s\S]{50,500}?)(?:\n\n|\nEducation|\nSkills|\nExperience)/i);
  if (summarySection) {
    about = summarySection[1].replace(/\n/g, " ").trim().substring(0, 400);
  }

  // ========================================
  // SKILLS — section extraction
  // ========================================
  let skills = [];
  const skillsSection = fullText.match(/(?:^|\n)Skills[\s\S]*?(?=\n(?:Experience|Education|Projects|Portfolio|Achievements|Certifications|$))/i);
  if (skillsSection) {
    const skillText = skillsSection[0];
    // Remove section headers like "Languages:", "Frameworks:", etc.
    const cleaned = skillText.replace(/(?:Languages|Frameworks|Tools|Cloud|Core Concepts|Technologies|DevOps)[:/\s]*/gi, " ");
    // Split on commas, pipes, bullets, newlines
    const skillItems = cleaned.split(/[,|•·\n\r]/)
      .map(s => s.replace(/[()]/g, "").trim())
      .filter(s => s.length > 1 && s.length < 35 && !/^(skills|and|the|with|for|using)$/i.test(s) && /\w/.test(s));
    
    const seen = new Set();
    skills = skillItems
      .filter(s => { if (seen.has(s.toLowerCase())) return false; seen.add(s.toLowerCase()); return true; })
      .slice(0, 14)
      .map((s, i) => ({ title: s, percentage: Math.max(60, 90 - i * 3) }));
  }

  // ========================================
  // EDUCATION
  // ========================================
  let education = [];
  const eduSection = fullText.match(/(?:^|\n)Education[\s\S]*?(?=\n(?:Skills|Experience|Projects|Portfolio|Achievements|$))/i);
  if (eduSection) {
    const eduText = eduSection[0];
    const eduLines = eduText.split("\n").map(l => l.trim()).filter(Boolean).slice(1); // skip "Education" header
    
    let i = 0;
    while (i < eduLines.length && education.length < 4) {
      const line = eduLines[i];
      // Line has year or contains degree keywords
      const hasYear = /\b(19|20)\d{2}\b/.test(line);
      const hasDegree = /(B\.?E|B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|MBA|Ph\.?D|Bachelor|Master|Diploma|Secondary|CGPA|GPA|%)/i.test(line);
      
      if (hasYear || hasDegree) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b.*/) ;
        const dates = yearMatch 
          ? yearMatch[0].match(/\b((?:19|20)\d{2}[\s\–\-–]*(Present|(?:19|20)\d{2})?)\b/)?.[0] || ""
          : "";
        
        education.push({
          title: line.replace(dates, "").replace(/\s+/g, " ").trim(),
          dates: dates || "Not specified",
          description: eduLines[i + 1] ? eduLines[i + 1].replace(/^[•\-]\s*/, "").trim() : ""
        });
      }
      i++;
    }
  }

  if (education.length === 0) {
    education = [{ title: "Not specified", dates: "Not specified", description: "" }];
  }

  // ========================================
  // EXPERIENCE
  // ========================================
  let experience = [];
  const expSection = fullText.match(/(?:^|\n)(?:Experience|Work Experience|Employment)[^\n]*\n([\s\S]*?)(?=\n(?:Projects|Portfolio|Education|Skills|Achievements|Certifications|$))/i);
  if (expSection) {
    const expText = expSection[1];
    const expLines = expText.split("\n").map(l => l.trim()).filter(Boolean);
    
    let i = 0;
    while (i < expLines.length && experience.length < 5) {
      const line = expLines[i];
      const hasDate = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2}|19\d{2}|Present)\b/i.test(line);
      
      if (hasDate && line.length < 100) {
        const titleLine = i > 0 ? expLines[i - 1] : line;
        const company = expLines[i + 1] && !expLines[i + 1].startsWith("•") ? expLines[i + 1] : "";
        
        // Gather bullet descriptions
        let desc = [];
        let j = i + (company ? 2 : 1);
        while (j < expLines.length && expLines[j].startsWith("•") && desc.length < 2) {
          desc.push(expLines[j].replace(/^•\s*/, "").trim());
          j++;
        }
        
        experience.push({
          title: `${titleLine}${company ? " at " + company : ""}`,
          dates: line.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})[\w\s\–\-–,]*\b/i)?.[0]?.trim() || line,
          description: desc.length > 0 ? desc.join(" ") : "Details not available."
        });
        i = j;
        continue;
      }
      i++;
    }
  }

  if (experience.length === 0) {
    experience = [{ title: "Not specified", dates: "Not specified", description: "Details not available." }];
  }

  // ========================================
  // PROJECTS / PORTFOLIO
  // ========================================
  let portfolioProjects = [];
  const projSection = fullText.match(/(?:^|\n)Projects[\s\S]*?(?=\n(?:Experience|Education|Skills|Achievements|Certifications|$))/i);
  if (projSection) {
    const projText = projSection[0];
    const projLines = projText.split("\n").map(l => l.trim()).filter(Boolean).slice(1);
    
    let i = 0;
    while (i < projLines.length && portfolioProjects.length < 6) {
      const line = projLines[i];
      // Project name lines: don't start with •, not too long, not a URL only
      if (!line.startsWith("•") && !line.startsWith("Tech") && line.length > 3 && line.length < 100) {
        // Extract project name (remove GitHub/Live/link artifacts)
        const projName = line.replace(/\(.*?\)/g, "").replace(/\b(Live|GitHub|Link|Demo|URL)\b/gi, "").trim();
        
        // Gather bullet descriptions
        let desc = [];
        let j = i + 1;
        while (j < projLines.length && (projLines[j].startsWith("•") || projLines[j].startsWith("Tech")) && desc.length < 2) {
          const descLine = projLines[j].replace(/^[•]\s*/, "").replace(/^Tech[:\s]*/i, "").trim();
          if (!projLines[j].startsWith("Tech")) desc.push(descLine);
          j++;
        }
        
        // Extract URL if present in the project line
        const urlMatch = line.match(/https?:\/\/[\w\-./]+/);
        
        if (projName.length > 2) {
          portfolioProjects.push({
            name: projName,
            image: `./images/project-${portfolioProjects.length + 1}.jpg`,
            description: desc.length > 0 ? desc[0] : "A modern project built with cutting-edge technologies.",
            url: urlMatch ? urlMatch[0] : "#"
          });
        }
        i = j;
        continue;
      }
      i++;
    }
  }

  // ========================================
  // ACHIEVEMENTS & CERTIFICATIONS
  // ========================================
  let achievements = [];
  const achSection = fullText.match(/(?:^|\n)(?:Achievements|Certifications|Awards|Honors)[^\n]*\n([\s\S]*?)(?=\n(?:Projects|Experience|Education|Skills|$))/i);
  if (achSection) {
    const achLines = achSection[1].split("\n").map(l => l.trim().replace(/^[•\-]\s*/, "")).filter(l => l.length > 5);
    achievements = achLines.slice(0, 4).map(l => ({
      title: l.substring(0, 60),
      description: l
    }));
  }

  if (achievements.length === 0) {
    achievements = [{ title: "Professional Achievement", description: "Achieved significant milestones throughout career journey." }];
  }

  return {
    name, email, phone, location, label, about,
    linkedin, github: githubFinal, portfolio,
    skills, education, experience,
    portfolio: portfolioProjects,
    achievements
  };
}

module.exports = basicParser;
