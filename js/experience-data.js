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
        { id: "arista-networks", type: "technical", company: "Arista Networks", logo: "../assets/logos/company1.png",
          role: "Wi-Fi R&D Intern", start: "2025-10", end: "2026-09",
          problem: "WPA3 is the Wi-Fi protocol used to protect clients associated with the network from attackers. However, there are no existing solutions to prevent WPA3 clients from associating/deassociating to/from a unauthorized AP. The aim of this project was to develop a multi-OS WPA3 client prevention mechanism pipeline for WIPS.",
          achievements: ["Pre-Registered Patents for the multi-OS WPA3 client prevention mechanism pipeline for WIPS."],
          responsibilities: ["Created a multi-OS WPA3 client prevention mechanism pipeline for WIPS to prevent authorized clients being associated with unauthorized APs.", "Benchmark-tested Multi-Link Operation (MLO) behavior and security feature compliance across commercial-off-the-shelf (COTS) devices."],
          learnings: ["This gave exposure to Wi-Fi security protocols, learnt automation techniques, and improoved my problem-solving skills specially in Product Security."],
          tools: ["Product-Security", "WIPS", "API", "Wireshark", "Wi-Fi Packet Analysis","Python", "Automation", "WPA3"],
          concepts: ["Wi-Fi security", "IDS/IPS", "Client testing"] },

        { id: "prajna-self-care", type: "management", company: "Prajna Self Care Pvt. Ltd.", logo: "../assets/logos/company2.png",
          role: "Product Management Intern", start: "2024-05", end: "2024-09",
          aim: "To enhance the product development process and improve overall product quality at a startup organization.",
          responsibilities: ["Proposed strategic changes on end-to-end product development.", "Conducted product research and gathered user feedback, to work cross-functionally for product enhancement.", "Assisted in product requirement documentation, designed marketing materials, and pricing models withproper budget planning"],
          learnings: ["As a management intern, I gained valuable insights into product management, including market research, user feedback analysis, and cross-functional collaboration. I also learned about the importance of strategic planning and effective communication in driving product success."],
          tools: ["Google Sheets", "Google Docs", "Figma", "Canva", "Product Management"],
          concepts: ["Product lifecycle Management", "Strategy", "Budget Planning"] },

        { id: "techmihirnaik", type: "technical", company: "Techmihirnaik Pvt. Ltd.", logo: "../assets/logos/company3.png",
          role: "Cybersecurity Intern", start: "2023-05", end: "2023-07",
          achievements: ["My biggest achievement that made me proud was to identify a critical SQL injection vulnerability in the login workflow of a web application, which could have potentially exposed sensitive user data."],
          problem: "Worked on a web application security testing project to identify vulnerabilities and enhance the security posture of the application.",
          responsibilities: ["Performed network reconnaissance using Nmap to identify hosts, enumerate open ports, and discover exposed services for attack-surface assessment.", "Assessed web application security using Burp Suite, identifying SQL injection vulnerabilities in a login workflow."],
          learnings: ["As I intially took my best learning step forward in the field of cybersecurity. I gained a foundational level of both theoritical and real world practical implementation and understanding to identify and suggest appropriate mitigation techniques against them."],
          tools: ["Burpsuite", "NMap", "Gobuster", "Networking Ports"],
          concepts: ["Web-Application security", "SQL Injection"] },

        { id: "campustocorporate", type: "management", company: "Campus to Corporate", logo: "../assets/logos/company4.png",
          role: "HR Executive", start: "2021-05", end: "2021-07",
          achievements: ["Employee of the Month in the first month of joining the organization."],
          aim: "To filter, select and pass on potential candidates further up ahead to the next stage of recruitement agency that acts as a baseline proxy for organizations.",
          responsibilities: ["Involved in the strategic process of executing HR initiatives.", "Screened and shortlisted candidates for various job roles, ensuring a high-quality talent pool for the organization."],
          tools: ["CV Filtering", "Communication"], concepts: ["HR Management", "Communication"] },

        { id: "mycaptain", type: "management", company: "MyCaptain", logo: "../assets/logos/company5.png",
          role: "Business Development Associate", start: "2020-11", end: "2020-12",
          aim: "To promote business development and sales.",
          responsibilities: ["Built sales and client relationship by, contributing to improve B2C interactions and higher client satisfaction."], learnings: ["As a first step out there gaining remotely, I learned how to communicate effectively with clients and understand their needs, and improved my telecommunication skills to build better relationships, to improove my personal and professional growth."],
          tools: ["Tele-Communication", "Sales"], concepts: ["Sales"] }
    ]
};
