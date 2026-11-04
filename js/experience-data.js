/* =========================================================
   EXPERIENCE DATA  (the ONE file you edit for the Experience page)

   Each role:
     id        unique (lowercase, numbers, hyphens). Use the SAME id as in your home page list so that
               "View More" on the home page opens this page on the right role (experience.html#<id>)
     type      "technical" or "management"
     company, logo, role
     start / end   "YYYY-MM"  (end: "present" for a current role)
     technical roles   -> problem: "text"                 (shown as "Problem Statement")
     management roles  -> aim: "text"                     (shown as "Project Aim")
     achievements: ["...", "..."]     optional. Leave it out to hide the section.
                                      (technical: right below the Problem Statement, management: above Responsibilities)
     responsibilities: ["...", ...]
     learnings: ["...", ...]          (shown as "Learnings and Takeaways")
     tools: ["..."]       skills / tools used   -> blue pills in the Skills card on the right
     concepts: ["..."]    concepts learned      -> green pills in the Skills card on the right
   Roles are sorted by date automatically (newest at the top).
   ========================================================= */
window.EXPERIENCE_CONFIG = {
    education: {
        logo: "../assets/logos/nmims.png",
        school: "Narsee Monjee Institute of Management Studies",
        course: "MBA.Tech",
        duration: "2020 \u2013 2025",
        desc: "Integrated 5-Year course (B.Tech in Computer Science Engineering and MBA in Finance)."
    },
    items: [
        { id: "arista-networks", type: "technical", company: "Arista Networks", logo: "../assets/logos/arista.png",
          role: "Wi-Fi R&D Intern", start: "2025-08", end: "2026-08",
          problem: "TODO: describe the problem you were solving in this role.",
          achievements: ["TODO: add an achievement, or delete this line to hide the Achievements section."],
          responsibilities: ["Contributed to a multi-OS WPA3 client prevention mechanism pipeline for WIPS.", "TODO: add more responsibilities."],
          learnings: ["TODO: what you learned and what you take away from this role."],
          tools: ["WIPS", "API", "Wireshark", "Python", "Automation", "WPA3"],
          concepts: ["Wi-Fi security", "Client prevention", "Multi-OS testing"] },

        { id: "prajna-self-care", type: "management", company: "Prajna Self Care Pvt. Ltd.", logo: "../assets/logos/prajna.png",
          role: "Product Management Intern", start: "2024-05", end: "2024-09",
          aim: "TODO: describe the aim of the project you worked on.",
          responsibilities: ["Proposed strategic changes on end-to-end product development.", "TODO: add more responsibilities."],
          learnings: ["TODO: what you learned and what you take away from this role."],
          tools: ["Google Sheets", "Google Docs", "Figma", "Canva"],
          concepts: ["Product lifecycle", "Strategy"] },

        { id: "techmihirnaik", type: "technical", company: "Techmihirnaik Pvt. Ltd.", logo: "../assets/logos/techmihirnaik.png",
          role: "Cybersecurity Intern", start: "2023-05", end: "2023-07",
          problem: "TODO: describe the problem you were solving in this role.",
          responsibilities: ["Performed web application security testing to identify a key vulnerability.", "TODO: add more responsibilities."],
          learnings: ["TODO: what you learned and what you take away from this role."],
          tools: ["Burpsuite", "NMap", "Gobuster", "Networking Ports"],
          concepts: ["Web application security", "Vulnerability discovery"] },

        { id: "company-4", type: "management", company: "Company 4 (placeholder)", logo: "../assets/logos/company4.png",
          role: "Position Name", start: "2022-01", end: "2022-04",
          aim: "TODO: describe the aim of the project you worked on.",
          responsibilities: ["TODO: add responsibilities."], learnings: ["TODO: add learnings."],
          tools: ["Tool 1", "Tool 2"], concepts: ["Concept 1"] },

        { id: "company-5", type: "management", company: "Company 5 (placeholder)", logo: "../assets/logos/company5.png",
          role: "Position Name", start: "2020-06", end: "2020-08",
          aim: "TODO: describe the aim of the project you worked on.",
          responsibilities: ["TODO: add responsibilities."], learnings: ["TODO: add learnings."],
          tools: ["Tool 1"], concepts: ["Concept 1"] }
    ]
};
