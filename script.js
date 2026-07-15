/* =========================================================
   JEYA SURYA B. — PORTFOLIO SCRIPT
   Vanilla JavaScript only — no frameworks, no dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. PAGE LOADER
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 900);
  });

  /* ---------------------------------------------------------
     2. FOOTER YEAR
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     3. NAVBAR: scroll style + mobile toggle + active link
  --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    toggleBackToTop();
    highlightActiveSection();
    revealOnScroll();
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });

  function highlightActiveSection() {
    let currentId = 'home';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkItems.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  /* ---------------------------------------------------------
     4. TYPING ANIMATION (Hero role)
  --------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Full-Stack Developer',
    'Web Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedTextEl.textContent = currentRole.substring(0, charIndex);

    let speed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }

  if (typedTextEl) typeLoop();

  /* ---------------------------------------------------------
     5. SCROLL REVEAL
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  function revealOnScroll() {
    const triggerPoint = window.innerHeight * 0.87;
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < triggerPoint) {
        el.classList.add('revealed');
      }
    });
  }
  revealOnScroll();

  /* ---------------------------------------------------------
     7. ANIMATED COUNTERS (About section)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);
      let current = 0;
      const increment = Math.max(target / 60, 1);

      const update = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };
      update();
    });
  }

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  /* ---------------------------------------------------------
     8. SKILL PROGRESS BARS
  --------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsStarted = false;

  const skillsSection = document.querySelector('.skills-grid');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsStarted) {
          skillsStarted = true;
          skillFills.forEach(fill => {
            fill.style.width = fill.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
  }

  /* ---------------------------------------------------------
     10. CERTIFICATE MODAL
  --------------------------------------------------------- */
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalDesc = document.getElementById('certModalDesc');
  const certModalClose = document.getElementById('certModalClose');
  const certModalBackdrop = document.getElementById('certModalBackdrop');
  const certButtons = document.querySelectorAll('.cert-view-btn');

  certButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cert-card');
      certModalImg.src = card.dataset.img;
      certModalImg.alt = card.dataset.title;
      certModalTitle.textContent = card.dataset.title;
      certModalDesc.textContent = card.dataset.desc;
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  certModalClose.addEventListener('click', closeCertModal);
  certModalBackdrop.addEventListener('click', closeCertModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertModal();
  });

  /* ---------------------------------------------------------
     11. RESUME EMBED FALLBACK
  --------------------------------------------------------- */
  const resumeEmbed = document.querySelector('.resume-embed');
  const resumeFallback = document.querySelector('.resume-fallback');
  if (resumeEmbed) {
    resumeEmbed.addEventListener('error', () => {
      resumeEmbed.style.display = 'none';
      if (resumeFallback) resumeFallback.style.display = 'flex';
    });
  }

/* ---------------------------------------------------------
   12. CONTACT FORM (EmailJS)
--------------------------------------------------------- */

if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: "j9FIaaxt65ivPr01m"
    });
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        formStatus.innerHTML = "⏳ Sending message...";

        if (typeof emailjs === "undefined") {
            formStatus.innerHTML = "❌ EmailJS library not loaded.";
            return;
        }

        emailjs.sendForm(
            "service_p61whs3",
            "template_ocvbj0f",
            this,
            "j9FIaaxt65ivPr01m"
        )

        .then(() => {

            formStatus.innerHTML =
                "✅ Message sent successfully! I'll get back to you soon.";

            contactForm.reset();

        })

        .catch((error) => {

            console.error("EmailJS Error:", error);

            formStatus.innerHTML =
                "❌ " + (error.text || error.message || JSON.stringify(error));

        });

    });

}

  /* ---------------------------------------------------------
     13. BACK TO TOP BUTTON
  --------------------------------------------------------- */
  

  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     14. MOUSE GLOW EFFECT (cursor follower)
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');

  document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }
  });

  /* ---------------------------------------------------------
     15. SMOOTH SCROLL FOR ANCHOR LINKS
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 100;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------------------------------------------------------
     16. FAQ ACCORDION
  --------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------------
     17. CHATBOT — offline, knowledge-base driven
  --------------------------------------------------------- */
  const knowledgeBase = {
    name: "My name is Jeya Surya B.",
    education: "I hold a B.E. in Computer Science and Engineering, graduating in 2026.",
    role: "I'm a Full-Stack Web Developer focused on building modern, responsive web applications.",
    skills: "My core skills include HTML5, CSS3, JavaScript, React, Python, Flask and MySQL, along with Git, GitHub, VS Code, Vercel and Netlify.",
    experience: "I'm a fresher — a 2026 graduate — but I've built several real-world full-stack projects and completed development internships.",
    projects: "My featured projects include Student Attendance Management System (Python, Flask, MySQL), SYRA AI (an AI-powered virtual assistant platform), Smart Expense Tracker (a personal finance management application), and Sethu Farm (a responsive agricultural business website with SEO optimization).",
    contact: "You can reach me at suryasivalai04@gmail.com or +91 6379558565.",
    email: "My email is suryasivalai04@gmail.com.",
    phone: "My phone number is +91 6379558565.",
    github: "You can find my code on GitHub at github.com/Jeyasurya-dev.",
    linkedin: "💼 Connect with me on LinkedIn: https://www.linkedin.com/in/jeya-surya-b-84a80337a/",
    resume: "You can view or download my resume in the Resume section of this site.",
    location: "I'm based in Alangulam, Tenkasi, Tamil Nadu, India.",
    objective: "My career objective is to build scalable, responsive and user-friendly applications while continuously learning new technologies.",
    greeting: "👋 Hello! Welcome to Jeya Surya B's portfolio. I'm your AI Portfolio Assistant. I can help you explore my projects, technical skills, education, experience, resume, certifications, and contact information. How can I assist you today?",
    fallback: "I'm not sure about that, but you can reach Surya directly at suryasivalai04@gmail.com for anything specific!"
  };

  const intentMap = [

{ keywords: ["who are you","who is jeya surya","who is surya","what is your name","what's your name","your name","name","introduce yourself","tell me about yourself","about you","yourself","who made this portfolio"], key: "name" },

{ keywords: ["education","degree","qualification","college","university","study","graduation","graduate","academic","be","b.e","computer science","cse","where did you study"], key: "education" },

{ keywords: ["role","job","profession","position","designation","occupation","developer","full stack","frontend","backend","what do you do","current role"], key: "role" },

{ keywords: ["skills","skill","technology","technologies","tech stack","stack","tools","framework","frameworks","languages","programming languages","html","css","javascript","react","python","flask","mysql","tailwind","git","github","vs code","what do you know","what can you do"], key: "skills" },

{ keywords: ["experience","work experience","professional experience","internship","internships","fresher","job experience","worked","companies"], key: "experience" },

{ keywords: ["projects","project","portfolio","works","applications","apps","attendance","student attendance","agrimind","zyra","chatbot","latest project","best project"], key: "projects" },

{ keywords: ["contact","contact details","contact info","reach","reach you","get in touch","connect","hire","hire you","message","contact me"], key: "contact" },

{ keywords: ["email","mail","gmail","email address","mail id","email id"], key: "email" },

{ keywords: ["phone","phone number","mobile","mobile number","number","call","contact number","whatsapp","whatsapp number"], key: "phone" },

{ keywords: ["github","git","repository","repositories","repo","source code","code","github profile"], key: "github" },

{ keywords: ["linkedin","linkedin profile","professional profile","linkedin account"], key: "linkedin" },

{ keywords: ["resume","cv","download resume","download cv","view resume","open resume","show resume"], key: "resume" },

{ keywords: ["location","where","where are you from","where do you live","based","address","city","country","state","native place"], key: "location" },

{ keywords: ["objective","career objective","goal","career","future","vision","aim","future plans"], key: "objective" },

{ keywords: ["hello","hi","hey","good morning","good afternoon","good evening","greetings"], key: "greeting" }

];

  function getBotReply(rawText) {
    const text = rawText.toLowerCase();
    for (const intent of intentMap) {
      if (intent.keywords.some(k => text.includes(k))) {
        return knowledgeBase[intent.key];
      }
    }
    return knowledgeBase.fallback;
  }

  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotBody = document.getElementById('chatbotBody');
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSuggestions = document.getElementById('chatbotSuggestions');

  function addMessage(text, sender, isResume = false, isContact = false) {

    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;

    if (isResume) {

        msg.innerHTML = `
            <p>${text}</p>

            <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">

                <a href="assets/resume.pdf" target="_blank" class="btn btn-primary btn-sm">
                    👁 View Resume
                </a>

                <a href="assets/resume.pdf" download class="btn btn-outline btn-sm">
                    ⬇ Download Resume
                </a>

            </div>
        `;

    }

    else if (isContact) {

        msg.innerHTML = `
            <p>${text}</p>

            <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">

                <a href="tel:+916379558565" class="btn btn-primary btn-sm">
                    📞 Call Me
                </a>

                <a href="mailto:suryasivalai04@gmail.com" class="btn btn-outline btn-sm">
                    📧 Email Me
                </a>

                <a href="https://www.linkedin.com/in/jeyasurya-b-84a80337a"
                   target="_blank"
                   class="btn btn-outline btn-sm">
                    💼 LinkedIn
                </a>

                <a href="https://github.com/Jeyasurya-dev"
                   target="_blank"
                   class="btn btn-outline btn-sm">
                    💻 GitHub
                </a>

                <a href="#home"
                   onclick="document.getElementById('home').scrollIntoView({behavior:'smooth'});return false;"
                   class="btn btn-outline btn-sm">
                    🌐 Portfolio
                </a>

            </div>
        `;

    }

    else {

        msg.textContent = text;

    }

    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

}
  function handleUserMessage(text) {

    if (!text.trim()) return;

    addMessage(text, "user");

    const lower = text.toLowerCase();

    if (
        lower.includes("resume") ||
        lower.includes("cv")
    ) {

        const resumeSection =
            document.getElementById("resume");

        if (resumeSection) {

            resumeSection.scrollIntoView({
                behavior: "smooth"
            });

        }

        setTimeout(() => {

            addMessage(
                "📄 Here is my resume. You can preview it online or download it using the buttons below.",
                "bot",
                true
            );

        }, 400);

        return;

    }

    if (
    lower.includes("contact") ||
    lower.includes("contact details") ||
    lower.includes("contact info") ||
    lower.includes("phone") ||
    lower.includes("mobile") ||
    lower.includes("call") ||
    lower.includes("email") ||
    lower.includes("mail") ||
    lower.includes("gmail") ||
    lower.includes("linkedin") ||
    lower.includes("github") ||
    lower.includes("portfolio") ||
    lower.includes("website") ||
    lower.includes("hire") ||
    lower.includes("reach")
) {

    setTimeout(() => {

        addMessage(
            "📬 You can contact me using any of the options below.",
            "bot",
            false,
            true
        );

    }, 400);

    return;

}

    setTimeout(() => {

        addMessage(
            getBotReply(text),
            "bot"
        );

    }, 350);

}

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
      const isOpen = chatbotWindow.classList.toggle('open');
      chatbotToggle.classList.toggle('open', isOpen);
      chatbotToggle.setAttribute('aria-label', isOpen ? 'Close chat assistant' : 'Open chat assistant');
    });
  }

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserMessage(chatbotInput.value);
      chatbotInput.value = '';
    });
  }

  if (chatbotSuggestions) {
    chatbotSuggestions.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => handleUserMessage(chip.textContent));
    });
  }

  /* ---------------------------------------------------------
     Initial calls
  --------------------------------------------------------- */
  highlightActiveSection();
  toggleBackToTop();
});
