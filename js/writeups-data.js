/* =========================================================
   WRITEUPS CATALOGUE  (the ONE file you edit to add a writeup)

   ADD A WRITEUP:
   1. Create  assets/writeups/<category>/<slug>/report.md   (images go in  .../<slug>/images/)
   2. Add one object to "items" below (copy an existing one)
   3. Done. The card, filters, search and viewer pick it up automatically.

   Item fields
     id         unique, lowercase letters/numbers/hyphens (also used for the link  blogs.html#<id>)
     category   one of the ids in "categories"
     title, platform, summary, tags[]
     date       "YYYY-MM-DD" (or "YYYY-MM"); optional
     thumbnail  optional image, path relative to basePath
     views      number shown next to the eye icon (see viewsProvider for live counts)
     path       technical writeup: Markdown file, relative to basePath   -> opens in the viewer
     url        article: https link (e.g. LinkedIn)                      -> opens in a new tab
     toc        optional: true / false to force / hide the table of contents (default: automatic)
   An item has EITHER "path" OR "url", never both.
   ========================================================= */

window.WRITEUPS_CONFIG = {
    basePath: "../assets/writeups/",     // where reports live, relative to html/blogs.html
    siteRoot: "../",                     // markdown image paths starting with "assets/" are resolved from here
    githubOwners: ["rishi-blueteam"],    // only GitHub links from these accounts are accepted
    
    categories: [
        { id: "challenges",    label: "Challenges" },
        { id: "ctf",           label: "CTFs" },
        { id: "soc-simulator", label: "SOC Simulator" },
        { id: "articles",      label: "Articles" }
    ],
    viewsProvider: null,

    items: [
        {
            id: "pico-secure-internal-challenges", category: "challenges",
            title: "PicoSecure Internal Team Training",
            platform: "TryHackMe", date: "2026-10",
            summary: "PicoSecure has decided to conduct a threat simulation and detection engineering engagement to bolster its malware detection capabilities. I was assigned to work with...  ",
            tags: ["File Analysis", "Pyramid of Pain", "Sigma Rule Creation", "DNS Filtering"],
            thumbnail: "challenges/Summit/thumbnail.png",
            readme: "https://github.com/rishi-blueteam/CTF-THM-Rooms-Writeup/blob/main/Challenges/Summit/Room-Summit.md",            // TODO: use the real folder/file link
            views: 12
        },
        {
            id: "snort-live-attack", category: "challenges",
            title: "J&Y Enterprise Tech Recipie Attack",
            platform: "TryHackMe", date: "2026-10",
            summary: "J&Y's latest recipe, \"Shot4J\", attracted great attention at the global coffee festival. J&Y officials promised that the product will hit the stores in the coming months, but received multiple attacks on their servers...",
            tags: ["Snort", "Rule Configuration", "Rule Testing", "MITRE ATT&CK"],
            thumbnail: "challenges/Snort-Challenges-Room/thumbnail.png",
            readme: "https://github.com/rishi-blueteam/CTF-THM-Rooms-Writeup/blob/main/Challenges/Snort%20The%20Second%20Challenge/Snort-Challenge-Live-Attacks.md", views: 86
        },
        {
            id: "snort-fundamental-challenge-room", category: "challenges",
            title: "Snort Challenges Room",
            platform: "TryHackMe", date: "2026-10",
            summary: "Finding a brute-force pattern in authentication logs using Bash and Splunk.",
            tags: ["Snort", "Rule Configuration", "Networking Ports", "Rule Testing"],
            thumbnail: "challenges/Snort-Challenge-Basics-Room/thumbnail.png",
            readme: "https://github.com/rishi-blueteam/CTF-THM-Rooms-Writeup/blob/main/Challenges/Snort%20The%20Second%20Challenge/Snort-Challenge-Live-Attacks.md", views: 54
        },
        {
            id: "when-trust-becomes-attackers-weapon", category: "articles",
            title: "When Trust Becomes an Attacker's Weapon",
            platform: "LinkedIn", date: "2026-03",
            summary: "Imagine being interviewed for an tele marketing organization, and once you are onboarded, start to work with the team, you realize that the organization is using your skills not to sell but scam people...",
            tags: ["SOC", "Career", "Blue Team"],
            thumbnail: "articles/wtbat.png",
            url: "https://www.linkedin.com/pulse/inside-business-modern-scams-when-trust-becomes-target-rishab-shorey-itzzf/", views: 240
        },
        {
            id: "operation-epic-fury-challenge", category: "articles",
            title: "Operation Epic Fury",
            platform: "LinkedIn", date: "2026-03",
            summary: "In today's world, wars don't usually start with a single command for tanks to cross borders or missiles hitting targets. When we talk about today's conflicts, like the one between Iran (the one-man army) and the US and Israel, one thing is clear: modern warfare starts in cyberspace...",
            tags: ["MITRE ATT&CK", "Detection"],
            thumbnail: "articles/Operation_Epic_Fury.png",
            url: "https://www.linkedin.com/pulse/operation-epic-fury-modern-warfare-begins-cyberspace-rishab-shorey-h0irf/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BmJD3ANBvRByI8IEY8Y6dFw%3D%3D", views: 312
        },
        {
            id: "dragos-ctf-challenge-2026", category: "ctf",
            title: "Dragos CTF Challenge 2026",
            platform: "Dragos", date: "2026-03",
            summary: "🚩 Not every CTF is about capturing every flag. Sometimes, the biggest win is discovering how much more there is to learn.",
            tags: ["MITRE ATT&CK", "Wireshark", "Registry Analysis", "Mimikatz"],
            thumbnail: "articles/Dragos_CTF_2026.png",
            readme: "https://github.com/rishi-blueteam/CTF-THM-Rooms-Writeup/blob/main/CTF%20Challenges/Dragos/CTF_Challaenge.md", views: 312
        },
        {
            id: "sysmon-fundamentals", category: "challenges",
            title: "ugh! BILL THAT'S THE WRONG USB!!",
            platform: "TryHackMe", date: "2026-10",
            summary: "Bill as an honest and hardworking individual, finds himself in a predicament when he accidentally connects the wrong USB device to his computer...",
            tags: ["Sysmon", "Windows Event Analysis"],
            thumbnail: "challenges/Sysmon-Challenge-Basic-Detection/thumbnail.png",
            readme: "https://github.com/rishi-blueteam/CTF-THM-Rooms-Writeup/blob/main/Challenges/Sysmon-Challenge-Basic-Detection/Practical-Investigation.md", views: 312
        }
    ]
};
