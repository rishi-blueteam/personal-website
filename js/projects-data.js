/* =========================================================
   PROJECTS CATALOGUE  (the ONE file you edit to add a project)

   README FILES COME FROM GITHUB (nothing to store on this site); preview images are local files:
     readme: "https://github.com/rishi-blueteam/<repo>/blob/<branch>/<folder>/README.md"
   Copy the link from GitHub (open the .md file in the repo and copy the address bar).
   The page fetches the Markdown from GitHub and shows it formatted. Images written inside
   that README with relative paths (images/shot.png, ./screenshots/a.png, assets/b.png) are
   loaded from the same GitHub folder automatically.
   Requirements: the repository must be PUBLIC and the owner must be listed in githubOwners.

   The old way still works: a path inside basePath, e.g. readme: "soc-home-lab/my-lab/README.md"
   (file stored in assets/projects/ on this site, needs a local server or hosting).

   Item fields
     id        unique: lowercase letters, numbers, hyphens
     category  one of the ids in "categories"
     title, summary (brief description shown when the card is opened), skills[] (keep to 3-4)
     image     preview image for the card + slideshow: a LOCAL file inside basePath, rule used here:
               <category>/<id>/images/preview.png  (put your screenshot there). Optional.
     github    link of the repository / folder (GitHub icon). Optional for GitHub READMEs:
               if left out, the icon points to the README's own GitHub page
     readme    GitHub link (blob or raw) to the README .md, or a path inside basePath
     featured  true = appears in the slideshow at the top (and gets the star)
   ========================================================= */
window.PROJECTS_CONFIG = {
    basePath: "../assets/projects/",     // for READMEs/images stored on this site; relative to the HTML page
    siteRoot: "../",                     // local README image paths starting with "assets/" resolve from here
    githubOwners: ["rishi-blueteam"],    // only GitHub links from these accounts are accepted
    starAll: false,                      // true = show the star on every card, not only featured ones
    categories: [
        { id: "soc-home-lab",       label: "SOC Home Lab" },
        { id: "extra-projects",     label: "Extra Projects" },
        { id: "security-plus-labs", label: "Security+ Labs" }
    ],
    items: [
        /* ---- SOC Home Lab ---- */
        { id: "windows-soc-kingphisher-man", category: "soc-home-lab", featured: true,
          title: "The KingPhisher-Man V 1.0", skills: ["Phishing Analysis", "Email Security"],
          summary: "KingPhisher-Man is a phishing detection and email analysis project that simulates phishing email delivery, performs automated email security analysis, and supports SOC-style investigation and response workflows.",
          image: "soc-home-lab/Github/Windows_soc_lab/Kingfisher-Man.png",
          github: "https://github.com/rishi-blueteam/The-KingPhisher-Man",
          readme: "https://github.com/rishi-blueteam/The-KingPhisher-Man/blob/main/README.md" },            // TODO: use the real folder/file link
        
        { id: "wazuh-lab", category: "soc-home-lab", featured: true,
          title: "Windows Endpoint Monitoring", skills: ["Wazuh", "Windows Events", "File Integrity Monitoring"],
          summary: "Built a virtualized SOC home lab using Wazuh to monitor a Windows endpoint, investigate authentication failures, and detect unauthorized file modifications through centralized security monitoring.",
          image: "soc-home-lab/Github/Linux-Home-Lab/Readme_Images/Win_Auth_FIM_Logs.png",
          github: "https://github.com/rishi-blueteam/SOC_Home_Lab",
          readme: "https://github.com/rishi-blueteam/SOC_Home_Lab/blob/main/README.md" },             // create this README first

        /* ---- Extra Projects (repo: Projects_Completed, one card per project folder) ---- */
        { id: "campus-walkthrough", category: "extra-projects", featured: false,
          title: "Campus Immersive Walkthrough", skills: ["UI Design", "Figma"],
          summary: "Just like how we use Google Maps and use Street View to see the buildings in an unfamiliar area, similarly, an immersive campus walkthrough lets you see different parts of the campus....",
          image: "Extra_Projects/CIM.png",
          github: "https://github.com/rishi-blueteam/Projects_Completed/tree/main/Campus%20Immersive%20Street%20View",
          readme: "https://github.com/rishi-blueteam/Projects_Completed/blob/main/Campus%20Immersive%20Street%20View/Information%20and%20Link.md" },
          
        /* ---- Security+ Labs (repo: Security_Plus_Certification-Labs, one card per lab folder) ---- */
        { id: "secplus-lab-1", category: "security-plus-labs",
          title: "Cybersecurity Fundamentals", skills: ["Fundamentals", "Threat Actors", "Security Controls"],
          summary: "TODO: one or two sentences about this lab.",
          image: "SecurityPlus_Labs/Fundamentals/preview.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%201_Fundamentals%20%2B%20Threat%20Actors%20%2B%20Security%20Controls",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%201_Fundamentals%20%2B%20Threat%20Actors%20%2B%20Security%20Controls/Domain%201%20-%20CIA%20Traid%20Lab.md" },
          
        { id: "secplus-lab-2", category: "security-plus-labs",
          title: "Social Engineering & Phishing Analysis", skills: ["Phishing Analysis", "Social Engineering"],
          summary: "This can be directly linked to my project 'The KingPhisher-Man' which is a phishing detection and email analysis project that simulates phishing email delivery, performs automated email security analysis, and supports SOC-style investigation and response workflows.",
          image: "security-plus-labs/secplus-lab-2/images/preview.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%202%3A%20Social%20Engineering%20%26%20Phishing%20Analysis",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%202%3A%20Social%20Engineering%20%26%20Phishing%20Analysis/README.md" },
          
          
        { id: "linkedin-banner-grabber", category: "extra-projects",
          title: "LinkedIn Banner Grabber", skills: ["HTML", "CSS"],
          summary: "This tool is designed to optimize my LinkedIn profile, ensuring a strong and professional first impression when colleagues or recruiters visit",
          image: "extra-projects/extra-project-2/images/preview.png",
          github: "https://github.com/rishi-blueteam/Projects_Completed/tree/main/LinkedIn%20Banner%20Creator",
          readme: "https://github.com/rishi-blueteam/Projects_Completed/blob/main/LinkedIn%20Banner%20Creator/README.md" },
          
        { id: "secplus-lab-3", category: "security-plus-labs",
          title: "Malware Analysis Fundamentals", skills: ["Malware Analysis", "Static Analysis", "SANDBOX","hybrid Analysis"],
          summary: "These are static analysis that are ran via sandbox and hybrid analysis to determine the behavior of the malware and how it can be mitigated.",
          image: "SecurityPlus_Labs/Malware_Analysis/image.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%203%3A%20Malware%20Analysis",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%203%3A%20Malware%20Analysis/Malware%20Analysis.md" },

        { id: "secplus-lab-5", category: "security-plus-labs", featured: true,
          title: "Security Architecture and Infrastructure", skills: ["Firewall", "UFW", "Linux"],
          summary: "The objective is to simulate two systems communicating over a shared NAT network and implement firewall rules to.",
          image: "SecurityPlus_Labs/Security_Architecture_Firewall/preview.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%205%3A%20Security%20Architecture%20and%20Infrastructure",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%205%3A%20Security%20Architecture%20and%20Infrastructure/Two-VM%20Network%20Segmentation%20%26%20Firewall%20Enforcement.md" },
        
          
          { id: "secplus-lab-4", category: "security-plus-labs",
            title: "Cryptography Fundamentals", skills: ["Cryptography", "SSL/TLS", "Hashing", "Encryption"],
            summary: "Understanding the website certificate analysis and hashing techniques.",
            image: "SecurityPlus_Labs/Cryptography/preview.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%204%3A%20Cryptography",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%204%3A%20Cryptography/Domain%204_Cryptography%20and%20Site%20Analysis.md"},
            
          { id: "secplus-lab-6", category: "security-plus-labs",
            title: "Vulnerability Management", skills: ["Vulnerability Scanning", "OpenVas", "Risk Assessment"],
            summary: "We are going to use OpenVas tools to see to gain an understanding and how things works.",
            image: "SecurityPlus_Labs/Vulnerability-Management-Analysis/image-3.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%206%3A%20Vulnerability%20Management",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%206%3A%20Vulnerability%20Management/Vulnerability-Management.md" }
      ]
};
