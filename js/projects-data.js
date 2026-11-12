window.PROJECTS_CONFIG = {
    basePath: "../assets/projects/",  
    siteRoot: "../",                   
    githubOwners: ["rishi-blueteam"],  
    starAll: false,                         
    categories: [
      { id: "threat-analysis",    label: "Threat Analysis" },
        { id: "soc-home-lab",       label: "SOC Home Lab" },
        { id: "extra-projects",     label: "Extra Projects" },
        { id: "security-plus-labs", label: "Security+ Labs" }
    ],
    items: [
        /* ---- SOC Home Lab ---- */
        { id: "threat-analysis", category: "threat-analysis", featured: true,
          title: "High-Fidelity SOC Simulation & Threat Analysis", skills: ["Threat-Detection", "Log Analysis", "SIEM"],
          summary: "The primary motive of this project was to build a Telemetry Simulation Framework capable of programmatically injecting realistic background network noise interleaved with high-fidelity adversary indicators, rather than executing hazardous live exploits.",
          image: "https://github.com/rishi-blueteam/High-Fidelity-Televisory-Emulation-Behavioral-Analysis/blob/main/Attack-Simulation/DOS-Attack/image-9.png",
          github: "https://github.com/rishi-blueteam/High-Fidelity-Televisory-Emulation-Behavioral-Analysis/tree/main",
          readme: "https://github.com/rishi-blueteam/High-Fidelity-Televisory-Emulation-Behavioral-Analysis/blob/main/README.md" },

          { id: "windows-soc-kingphisher-man", category: "soc-home-lab", featured: true,
          title: "The KingPhisher-Man V 1.0", skills: ["Phishing Analysis", "Email Security", "Automation"],
          summary: "KingPhisher-Man is a phishing detection and email analysis project that simulates phishing email delivery, performs automated email security analysis, and supports SOC-style investigation and response workflows.",
          image: "https://github.com/rishi-blueteam/The-KingPhisher-Man/blob/main/Kingfisher-Man.png",
          github: "https://github.com/rishi-blueteam/The-KingPhisher-Man",
          readme: "https://github.com/rishi-blueteam/The-KingPhisher-Man/blob/main/README.md" },
        
        { id: "linux-lab", category: "soc-home-lab", featured: true,
          title: "SOC-Simulator-Linux", skills: ["Phishing Analysis", "Linux-Soc-Simulator"],
          summary: "Built a virtualized SOC home lab using Wazuh to monitor a Windows endpoint, investigate authentication failures, and detect unauthorized file modifications through centralized security monitoring.",
          image: "https://github.com/rishi-blueteam/SOC-Simulator-Linux/blob/main/Readme_Images/image-7.png",
          github: "https://github.com/rishi-blueteam/SOC-Simulator-Linux",
          readme: "https://github.com/rishi-blueteam/SOC-Simulator-Linux/blob/main/README.md" },

          { id: "wazuh-lab", category: "soc-home-lab", featured: false,
          title: "Wazuh Windows Endpoint Monitoring", skills: ["Wazuh", "Windows Events", "File Integrity Monitoring"],
          summary: "Built a virtualized SOC home lab using Wazuh to monitor a Windows endpoint, investigate authentication failures, and detect unauthorized file modifications through centralized security monitoring.",
          image: "https://github.com/rishi-blueteam/Windows-Endpoint-Monitoring-Wazuh-/blob/main/SOC-Home-Lab-Images/image-1.png",
          github: "https://github.com/rishi-blueteam/SOC_Home_Lab",
          readme: "https://github.com/rishi-blueteam/SOC_Home_Lab/blob/main/README.md" },



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
          summary: "Learning the Fundamentals of Cybersecurity.",
          image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%201_Fundamentals%20%2B%20Threat%20Actors%20%2B%20Security%20Controls/preview.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%201_Fundamentals%20%2B%20Threat%20Actors%20%2B%20Security%20Controls",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%201_Fundamentals%20%2B%20Threat%20Actors%20%2B%20Security%20Controls/Domain%201%20-%20CIA%20Traid%20Lab.md" },
          
        { id: "secplus-lab-2", category: "security-plus-labs",
          title: "Social Engineering & Phishing Analysis", skills: ["Phishing Analysis", "Social Engineering"],
          summary: "This can be directly linked to my project 'The KingPhisher-Man' which is a phishing detection and email analysis project that simulates phishing email delivery, performs automated email security analysis, and supports SOC-style investigation and response workflows.",
          image: "NA",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%202%3A%20Social%20Engineering%20%26%20Phishing%20Analysis",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%202%3A%20Social%20Engineering%20%26%20Phishing%20Analysis/README.md" },
          
          
        { id: "linkedin-banner-grabber", category: "extra-projects",
          title: "LinkedIn Banner Grabber", skills: ["HTML", "CSS"],
          summary: "This tool is designed to optimize my LinkedIn profile, ensuring a strong and professional first impression when colleagues or recruiters visit",
          image: "https://github.com/rishi-blueteam/Projects_Completed/blob/main/LinkedIn%20Banner%20Creator/linkedin_banner_generator.html",
          github: "https://github.com/rishi-blueteam/Projects_Completed/tree/main/LinkedIn%20Banner%20Creator",
          readme: "https://github.com/rishi-blueteam/Projects_Completed/blob/main/LinkedIn%20Banner%20Creator/README.md" },
          
        { id: "secplus-lab-3", category: "security-plus-labs",
          title: "Malware Analysis Fundamentals", skills: ["Malware Analysis", "Static Analysis", "SANDBOX","hybrid Analysis"],
          summary: "These are static analysis that are ran via sandbox and hybrid analysis to determine the behavior of the malware and how it can be mitigated.",
          image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Screenshots/Domain%203/image.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%203%3A%20Malware%20Analysis",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%203%3A%20Malware%20Analysis/Malware%20Analysis.md" },

        { id: "secplus-lab-5", category: "security-plus-labs", featured: false  ,
          title: "Security Architecture and Infrastructure", skills: ["Firewall", "UFW", "Linux"],
          summary: "The objective is to simulate two systems communicating over a shared NAT network and implement firewall rules to.",
          image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Screenshots/Domain%205/UFW%20logs%20on%20target%20machine%20noticed.png",
          github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%205%3A%20Security%20Architecture%20and%20Infrastructure",
          readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%205%3A%20Security%20Architecture%20and%20Infrastructure/Two-VM%20Network%20Segmentation%20%26%20Firewall%20Enforcement.md" },
        
          
          { id: "secplus-lab-4", category: "security-plus-labs",
            title: "Cryptography Fundamentals", skills: ["Cryptography", "SSL/TLS", "Hashing", "Encryption"],
            summary: "Understanding the website certificate analysis and hashing techniques.",
            image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Screenshots/Domain%204/SSL%20Testing.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%204%3A%20Cryptography",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%204%3A%20Cryptography/Domain%204_Cryptography%20and%20Site%20Analysis.md"},
            
          
          { id: "secplus-lab-7", category: "security-plus-labs",
            title: "Data Breaches Analysis", skills: ["Data Breach", "Digital Awareness"],
            summary: "Data leaks and breaches are a common occurrence in the digital world, and some main organization that have been breached are Facebook, LinkedIn, and Twitter, but if your data is leaked, have you been breached? Have you...",
            image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%207%3A%20Data%20Breach/pwnd.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%207%3A%20Data%20Breach",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%207%3A%20Data%20Breach/README.md" },
          
          { id: "secplus-lab-9", category: "security-plus-labs",
            title: "Local Password Security Auditor", skills: ["Password Security", "Digital Awareness", "Breach Analysis"],
            summary: "The objective is to evaluate password strength and identify passwords that are easily guessed, commonly used, or exposed in known breaches..",
            image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%209%3A%20Security%20Auditing/image.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%209%3A%20Security%20Auditing",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%209%3A%20Security%20Auditing/README.md" },

          { id: "secplus-lab-8", category: "security-plus-labs",
            title: "EASM: External Attack Surface Management", skills: ["Vulnerability Assessment", "Understanding Attacks", "Web Application Security"],
            summary: "Being upto date with vulnerabilites",
            image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%208%3A%20EASM/image.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%208%3A%20EASM",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%208%3A%20EASM/SOCRadar_EASM_Assessment.md" },
            
          { id: "secplus-lab-6", category: "security-plus-labs",
            title: "Vulnerability Management", skills: ["Vulnerability Scanning", "OpenVas", "Risk Assessment"],
            summary: "We are going to use OpenVas tools to see to gain an understanding and how things works.",
            image: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%206%3A%20Vulnerability%20Management/image-3.png",
            github: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/tree/main/Lab%20Writeup%20per%20Domain/Domain%206%3A%20Vulnerability%20Management",
            readme: "https://github.com/rishi-blueteam/Security_Plus_Certification-Labs/blob/main/Lab%20Writeup%20per%20Domain/Domain%206%3A%20Vulnerability%20Management/Vulnerability-Management.md" }
      ]
};
