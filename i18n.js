/* AgentEval landing site — language switch (Hebrew / English).
   Each page is self-contained: this script wires a fixed top-corner switch,
   flips <html dir/lang>, swaps translatable text, and persists the choice
   in localStorage under 'agenteval_lang'. Hebrew is the source of truth
   (captured from the DOM at load); only the English strings live here. */
(function () {
  "use strict";
  var LANG_KEY = "agenteval_lang";
  var DEFAULT_LANG = "he";

  /* Elements marked data-i18n-scope get sequential keys (<scope>.b1, .b2 …)
     assigned to every heading / paragraph / list-item inside them, in DOM
     order — so the pages only need one attribute per section. */
  var SCOPE_SELECTOR = "h2,h3,h4,p,li";

  var EN = {
    /* ---------- index ---------- */
    "index.sub":
      "An AI agent that simulates real customers to test, monitor, and streamline chatbots.<br>In this project: a credit-card company bot, with a manual / automatic testing option.",

    /* ---------- problem ---------- */
    "problem.b1": "Teams today build AI agents that are genuinely impressive in what they can do.",
    "problem.b2": "But the moment it's time to release them to real customers, something stalls.",
    "problem.b3": "The fear of a wrong response, of incorrect information the bot “made up” with full confidence, of damage to a brand that takes years to build and one moment to break.",
    "problem.b4": "On top of that, QA people spend hours typing by hand to test the bot — an endless stream of questions to be sure everything holds up: “What if the customer is angry?”, “What if they try to bypass policy?” All of it to catch the moment the bot breaks — and then a new model version lands, and you start again from scratch.",
    "problem.b5": "This isn't a problem of carelessness. It's a problem of tooling.",
    "problem.b6": "QA processes have stayed manual and slow at the same pace they were five years ago, while AI development moves on a weekly cadence.",
    "problem.b7": "So, in short — I built an AI that tests AI. Not another checklist, but synthetic customers that genuinely try to break your bot, before a real customer does.",
    "problem.b8": "So how does it all work?",
    "problem.b9": "It isn't “training” — we don't teach the bot anything new. It's like an examiner sitting an exam: they don't change what the examinee knows, they only test it.",
    "problem.b10": "We built several separate AI characters, each given a completely different “role” — exactly like an actor handed a different script for every show.",
    "problem.b11": "The conversation between the synthetic customer and the bot isn't scripted in advance. Two real sides improvise against each other, exactly like a conversation with a real customer — and that's what makes the test credible rather than a staged performance.",

    /* ---------- research ---------- */
    "research.b1": "In recent years, AI agents have moved from experimental tools to systems that talk directly with real customers, in areas like customer service, banking, and commerce. This shift exposes a problem that wasn't nearly as severe with classical software. A language-model bot doesn't run on rigid, predictable rules; it generates responses flexibly, fresh in every conversation, so it can't be tested with traditional unit tests alone. Testing has to cover an enormous range of ways a user might phrase a request, make a mistake, apply pressure, or even try to manipulate the system into bypassing policy.",
    "research.b2": "The traditional approach to this problem was manual testing, where a human team writes hundreds of possible scenarios and runs them against the bot over and over. That method is slow, expensive, and doesn't scale. According to analyses in the field, matching the coverage an automated judge model produces overnight would take a team of dozens of human testers working in parallel for a full day.",
    "research.b3": "In recent years the research community has developed an alternative approach called LLM as a Judge, in which a language model acts as a judge that evaluates the output of another model. The foundational study in the field, which examined the approach across thousands of comparisons between answers from different models, found that GPT-4 judges reached over eighty percent agreement with human preferences — the same level of agreement human evaluators reach with one another. Later studies reported similar and even higher results, sometimes ninety percent and above, when the judge model is a strong one and its instructions are built as a list of clear criteria rather than a vague, general question.",
    "research.b4": "That said, this level of agreement isn't uniform across task types. In tests on more open-ended tasks, such as creative writing or open reasoning, agreement between an artificial judge and a human judge dropped to only about fifty to sixty percent — indicating that a judge's reliability depends heavily on the nature of the task and the clarity of the criteria defined for it in advance.",
    "research.b5": "Alongside this, those same studies revealed clear systematic biases. The foundational study found that language-model judges prefer the first answer shown to them in up to seventy-five percent of cases, even when there is no real quality difference between the two answers. A self-preference bias was also found: a model acting as a judge tends to favor answers produced by models from its own family — for GPT-4 this bias was around a ten percent advantage in win rate, and for other models tested it reached as high as twenty-five percent. Another documented bias is a consistent tendency to prefer longer answers, even when the length added nothing to the answer's quality.",
    "research.b6": "To deal with these biases, one common practice today is to treat the judge itself as a system that needs monitoring — for example, showing it the same pair of answers twice in reversed order, and if the verdict flips, that's a clear sign of position bias rather than a genuine evaluation of the content. Another method is calibrating the judge against a small sample of manually labeled examples, and re-checking it over time to make sure it isn't drifting from the agreed standard.",
    "research.b7": "Another development in the field is the move from one-dimensional evaluation of a single answer to evaluating a whole agent across a process — including the choices it makes, its use of tools, and the way it arrives at an answer. This approach is needed because an agent can succeed at a task via a wasteful or wrong path, or make tool calls that succeed technically yet still fail to actually answer what the user wanted. In this context, industry-adoption surveys report that about ninety-two percent of teams building AI products already incorporate some form of automated evaluation into their ongoing development process — indicating that the shift from human judgment to language-model-based judgment is no longer a future direction but an established industry trend.",
    "research.src":
      "Source: <a href=\"https://www.confident-ai.com/blog/why-llm-as-a-judge-is-the-best-llm-evaluation-method\" target=\"_blank\" rel=\"noopener noreferrer\" dir=\"ltr\">Why LLM-as-a-Judge is the Best LLM Evaluation Method — Confident AI</a>",

    /* ---------- about ---------- */
    "about.b1": "Hi, I'm Noam — a third-year Information Systems Management student, on the way to finding my next role.",
    "about.b2": "I like taking things from idea to execution: I've written PRDs, led end-to-end processes with the CEO and stakeholders, and learned that what matters most is communicating well and delivering on time. I did this as a PM Intern.",
    "about.b3": "Tools I work with: Jira, Figma, SQL, and AI Tools like ChatGPT, Claude, Base44 and Lovable.",
    "about.b4": "I believe the future of product management is combining people and technology in a smart way.",
    "about.b5": "Looking for a first opportunity to grow, and to build.",
    "about.b6": "Here's my <a href=\"https://www.linkedin.com/in/noam-shalom-/\" target=\"_blank\" rel=\"noopener noreferrer\" dir=\"ltr\">LinkedIn</a>.",
    "about.b7": "Thanks so much for your time!",

    /* ---------- prd ---------- */
    "prd.h1": "Product Requirements Document (PRD)",
    "prd.b1": "Why LLM-as-a-Judge and not something simpler?",
    "prd.b2": "Alternatives considered",
    "prd.b3": "In the initial thinking, two simpler alternatives were considered:",
    "prd.b4": "<strong>Manual testing by a human QA team</strong>: a team types hundreds of questions by hand to catch where the bot breaks. It avoids the need for complex AI infrastructure, but it's slow, doesn't scale, and depends entirely on the testers' imagination and time — which means partial, inconsistent coverage of scenarios.",
    "prd.b5": "<strong>Pre-scripted test scripts</strong>: “scripted” conversations that run automatically against the bot. Fast to re-run, but it doesn't solve the core problem: real customer conversations are dynamic and unpredictable, and a bot that passes a fixed script may still fail a real conversation that unfolds differently.",
    "prd.b6": "That's why the full solution was chosen: AI personas that hold a real, unscripted conversation, together with an AI judge that evaluates the conversation at the end. This solution addresses both the speed/scale problem (versus manual testing) and the realism problem (versus fixed scripts).",
    "prd.b7": "1. Product Requirements Document (PRD)",
    "prd.b8": "Step 1 — What we're building and why",
    "prd.b9": "What we're building",
    "prd.b10": "A feature/product called AgentEval: an automated QA platform for AI agents, based on the LLM-as-a-Judge principle. The platform runs “synthetic customers” — AI personas with their own character and goal — that hold a real, unscripted conversation with the AI agent under test. When the conversation ends, a separate AI judge analyzes the transcript against the policy/rules defined for the agent in advance, and produces a score and a written assessment, including an indication of where the agent failed, if it failed.",
    "prd.b11": "Why we're building it",
    "prd.b12": "Today, a product team that wants to make sure an AI agent is ready to release to real customers has to choose one of two bad options:",
    "prd.b13": "<strong>Manual testing</strong>: a person or team types tens to hundreds of questions themselves to try to “break” the bot. A slow, tedious process that depends on human ability to think of every possible scenario — which leaves significant coverage gaps.",
    "prd.b14": "<strong>Releasing without adequate testing / relying on gut feeling</strong>: product teams release an AI agent into the real world without real confidence that it follows policy, especially under pressure or a manipulation attempt by a customer.",
    "prd.b15": "AgentEval's goal is to shorten the testing cycle from days to minutes, and to give product teams data-based confidence (not gut feeling) before release.",
    "prd.b16": "Who the users are (primary target audience)",
    "prd.b17": "In this version there is a single target audience: an employee at the company responsible for testing the AI agent before release. This could be:",
    "prd.b18": "<strong>A QA engineer</strong>: focused on finding specific failure points in the conversation, on scenario coverage.",
    "prd.b19": "<strong>A product manager</strong>: focused on the overall score and on confidence for the go/no-go release decision.",
    "prd.b20": "<strong>The agent's developer</strong>: focused on understanding the exact failure point in the transcript in order to fix it.",
    "prd.b21": "Key assumptions",
    "prd.b22": "The three sub-roles share the same core flow and the same technical infrastructure. The difference between them is which part of the report they focus on (score vs. detailed transcript), not a need for a different product. So we won't build three separate interfaces, but one product that serves them all.",
    "prd.b23": "In the current version (MVP):",
    "prd.b24": "A single AI agent is tested at a time.",
    "prd.b25": "There are only 4 fixed personas (no option to create a custom persona).",
    "prd.b26": "Each conversation has 4 exchanges (a persona message + a bot reply, twice).",
    "prd.b27": "The conversation is text only.",
    "prd.b28": "One run = one persona. You can't run several personas in parallel in the same run.",
    "prd.b29": "A business need to expand the number of personas, the conversation length, or support for several agents in parallel may emerge later, but that is deferred to a future version.",
    "prd.b30": "Primary success metric",
    "prd.b31": "(not formally defined by the business side, but needed to focus the product)",
    "prd.b32": "Success is measured by the platform's ability to actually identify real failure points of the agent under test before it is released to customers, and by shortening the testing cycle time (from days to minutes) for the product team. A secondary metric: the number of runs completed successfully end to end (from conversation to report) versus runs that failed technically (for example due to a fault in the bot under test).",
    "prd.b33": "Step 2 — The core flow",
    "prd.b34": "Base assumption for the whole flow: each run tests one persona against one AI agent, and produces a single report at the end.",
    "prd.b35": "<strong>Defining the policy/rules of the agent under test</strong>: the user defines in advance (in free, editable text) the rules the agent must follow — for example, “identity verification is required before disclosing a balance” for ClearCard. The rules are associated with the agent under test.",
    "prd.b36": "<strong>Choosing a persona</strong>: the user picks one of the 4 personas available in the system (Roi Almog, a VIP under time pressure; Meirav Sagi, an angry customer; Yaakov Friedman, a confused customer; Idan Carmon, who claims he was promised everything).",
    "prd.b37": "<strong>Running the conversation</strong>: the system runs the chosen persona against the agent under test. The conversation happens in real time and isn't pre-scripted; the persona responds dynamically to the agent's answers, over 4 exchanges (persona message → agent reply, twice).",
    "prd.b38": "<strong>Judging</strong>: once the 4 exchanges are done, a separate AI judge analyzes the full conversation transcript against the rules defined for the agent in Step 1.",
    "prd.b39": "<strong>Producing a report</strong>: the system shows the user a detailed report with a numeric score, a written assessment, and an indication of where and how the agent failed (if it failed), along with the full conversation transcript.",
    "prd.b40": "<strong>Starting a new run</strong>: after a run ends, the user can set up and start a new run with the same persona or a different one.",
    "prd.b41": "Step 3 — Functional requirements",
    "prd.b42": "<span class=\"tag\" dir=\"ltr\">A.</span> Defining policy/rules",
    "prd.b43": "<span class=\"tag\" dir=\"ltr\">A.1</span> Rules for the agent under test can be defined in free text before runs begin.",
    "prd.b44": "<span class=\"tag\" dir=\"ltr\">A.2</span> The rules can be edited between runs (working assumption: they can't be edited during an active run).",
    "prd.b45": "<span class=\"tag\" dir=\"ltr\">A.3</span> In this version the rules are tied to a single agent. There is no support for multiple rule sets for multiple agents.",
    "prd.b46": "<span class=\"tag\" dir=\"ltr\">B.</span> Personas",
    "prd.b47": "<span class=\"tag\" dir=\"ltr\">B.1</span> There are 4 fixed personas available in the system: Roi Almog (a VIP under time pressure, demanding immediate approval), Meirav Sagi (an angry customer whose card was blocked by mistake), Yaakov Friedman (a confused customer who doesn't remember what was agreed), Idan Carmon (who claims he was promised everything without verification).",
    "prd.b48": "<span class=\"tag\" dir=\"ltr\">B.2</span> Each persona has a character, a goal, and an opening scenario predefined in code/config; it can't be created or edited in this version.",
    "prd.b49": "<span class=\"tag\" dir=\"ltr\">B.3</span> Exactly one persona is selected per run.",
    "prd.b50": "<span class=\"tag\" dir=\"ltr\">C.</span> Running a conversation",
    "prd.b51": "<span class=\"tag\" dir=\"ltr\">C.1</span> The conversation is text only.",
    "prd.b52": "<span class=\"tag\" dir=\"ltr\">C.2</span> Each conversation has exactly 4 exchanges (a persona message + an agent reply = one exchange).",
    "prd.b53": "<span class=\"tag\" dir=\"ltr\">C.3</span> The conversation isn't pre-scripted; the persona responds dynamically to the actual content of the agent's replies.",
    "prd.b54": "<span class=\"tag\" dir=\"ltr\">C.4</span> Only one run is active at any given moment for the user (working assumption, derived from “one run = one persona”).",
    "prd.b55": "<span class=\"tag\" dir=\"ltr\">D.</span> Judging (Judge)",
    "prd.b56": "<span class=\"tag\" dir=\"ltr\">D.1</span> Once the 4 exchanges are done, an AI judge analyzes the full transcript.",
    "prd.b57": "<span class=\"tag\" dir=\"ltr\">D.2</span> The judgment is based on the rules defined in advance for the agent under test (Step A).",
    "prd.b58": "<span class=\"tag\" dir=\"ltr\">D.3</span> The judging output includes a numeric score + a written assessment.",
    "prd.b59": "<span class=\"tag\" dir=\"ltr\">D.4</span> The written assessment includes an indication of the exact point where the agent failed, if it failed.",
    "prd.b60": "<span class=\"tag\" dir=\"ltr\">E.</span> Report",
    "prd.b61": "<span class=\"tag\" dir=\"ltr\">E.1</span> At the end of every run, a report is shown with a numeric score, a written assessment, and a full transcript of the conversation.",
    "prd.b62": "<span class=\"tag\" dir=\"ltr\">E.2</span> At the end of a run, a new run can be set up and started (working assumption: with the same persona or another one of the existing 4).",
    "prd.b63": "<span class=\"tag\" dir=\"ltr\">E.3</span> (Working assumption) There is an option to view the history of previous runs and their reports.",
    "prd.b64": "Additional key assumptions:",
    "prd.b65": "The number of personas (4), the conversation length (4 exchanges), and testing a single agent at a time are all initial MVP values, subject to validation and expansion later.",
    "prd.b66": "Step 4 — Scenarios and edge cases",
    "prd.b67": "The agent under test doesn't respond / technical fault",
    "prd.b68": "If the agent under test doesn't return a response within a reasonable time, the run is marked as a technical failure (not a policy failure), and the user gets an appropriate message separate from the judge's assessment (working assumption, pending engineering validation).",
    "prd.b69": "The agent “breaks” before the 4 exchanges are done",
    "prd.b70": "Even if the agent violates the rules as early as the first exchange, the conversation continues through all 4 exchanges as defined, and the judge evaluates the full transcript at the end (it doesn't stop the conversation early).",
    "prd.b71": "The agent fully follows the rules",
    "prd.b72": "If the agent follows all the rules throughout the conversation, the report shows a high score and a positive assessment, with no failure indication.",
    "prd.b73": "A manipulation attempt by the persona",
    "prd.b74": "Personas like “Idan Carmon” (who claims he was promised everything) are meant to test whether the agent caves to pressure or unverified claims. If the agent provides information or a benefit against policy as a result of the pressure, the judge marks it as an explicit failure point in the written assessment.",
    "prd.b75": "Changing the rules after a run has started",
    "prd.b76": "Editing the rules doesn't apply to a run that has already started; it only affects future runs (working assumption, pending product validation).",
    "prd.b77": "Step 5 — Out of scope",
    "prd.b78": "<strong>Creating custom personas</strong> isn't supported in this version. There are only 4 fixed personas. Creating a custom persona requires a separate configuration interface (character, goal, scenario) that will be considered in a future version.",
    "prd.b79": "<strong>Testing several AI agents in parallel</strong> isn't supported. This version tests a single agent. Multi-agent support requires a separate project/agent management mechanism.",
    "prd.b80": "<strong>Variable conversation length / going beyond 4 exchanges</strong> isn't supported in this version. A fixed length was chosen as the simplest default to implement and to test initially.",
    "prd.b81": "<strong>Support for channels beyond text</strong> (voice, WhatsApp, etc.) isn't included in this version, to keep the initial implementation simple.",
    "prd.b82": "<strong>Running several personas in parallel in the same test</strong> isn't supported. Each run is limited to one persona against the agent. Running a multi-persona “test suite” at once is a possible later improvement.",
    "prd.b83": "<strong>An aggregate/comparative report across runs</strong> (for example an agent's score trend over time) isn't included in this version. Each run shows its own standalone report.",
    "prd.b84": "<strong>Integration with ticketing / task-management systems</strong> (such as automatically opening a ticket for the dev team when a failure is found) isn't included. The MVP is limited to showing a report in the UI; such integrations will be considered only if a clear business need emerges.",
    "prd.b85": "2. Open questions",
    "prd.b86": "For: Business",
    "prd.b87": "What is the official success metric we want to measure for the platform?",
    "prd.b88": "<span class=\"q-label\">Depends on this:</span>I defined a success metric only as a working assumption. Without business sign-off it isn't clear which data to collect and report on.",
    "prd.b89": "Is support for testing several AI agents in parallel planned for the near future, or will the platform stay focused on a single agent for a long time?",
    "prd.b90": "<span class=\"q-label\">Depends on this:</span>It affects the data architecture right now, even if we don't build it in the MVP.",
    "prd.b91": "What is the cost model for running conversations and LLM-based judging (token cost), and is there a budget/limit on the number of runs?",
    "prd.b92": "<span class=\"q-label\">Depends on this:</span>It determines whether a usage-limiting mechanism is needed as early as the first version.",
    "prd.b93": "For: Product",
    "prd.b94": "What number of exchanges and personas is reasonable in the eyes of actual users, beyond the MVP values (4 and 4)?",
    "prd.b95": "<span class=\"q-label\">Depends on this:</span>These are estimated values set for a first version; without validation we may build limits that don't match real usage.",
    "prd.b96": "Is there an immediate need for users to create custom personas, beyond the 4 fixed personas?",
    "prd.b97": "<span class=\"q-label\">Depends on this:</span>It affects development priority for the next version and the complexity of the configuration interface required.",
    "prd.b98": "What is the desired user experience when a run detects an especially severe failure (for example a leak of sensitive information)? Is an immediate alert needed, and not just a report at the end?",
    "prd.b99": "<span class=\"q-label\">Depends on this:</span>It determines whether a real-time alerting mechanism is needed beyond the summary report.",
    "prd.b100": "For: Engineering",
    "prd.b101": "What happens if the agent under test doesn't respond within a reasonable time mid-conversation?",
    "prd.b102": "<span class=\"q-label\">Depends on this:</span>It determines whether a retry mechanism is needed, how long to wait, and how this is reported to the user separately from a policy failure.",
    "prd.b103": "How do we prevent bias or “persuasion” of the AI judge by the conversation content itself (such as prompt injection via the persona or the agent's reply)?",
    "prd.b104": "<span class=\"q-label\">Depends on this:</span>It affects the reliability of the score and the assessment, which are the core value of the product.",
    "prd.b105": "For: Operations",
    "prd.b106": "Who is responsible for updating and maintaining the 4 existing personas over time (updating scenarios, identifying personas that are no longer relevant)?",
    "prd.b107": "<span class=\"q-label\">Depends on this:</span>It determines whether an ongoing operational process is needed to maintain persona content beyond the initial development.",
    "prd.b108": "How do we handle a case where the judge itself is wrong in its assessment (for example, giving a high score to a problematic conversation)? Is there a human-review process?",
    "prd.b109": "<span class=\"q-label\">Depends on this:</span>It affects how much trust can be placed in the platform as a single source of truth for the release decision."
  };

  var origHe = {};

  function expandScopes() {
    var scopes = document.querySelectorAll("[data-i18n-scope]");
    for (var s = 0; s < scopes.length; s++) {
      var prefix = scopes[s].getAttribute("data-i18n-scope");
      var kids = scopes[s].querySelectorAll(SCOPE_SELECTOR);
      for (var i = 0; i < kids.length; i++) {
        if (!kids[i].hasAttribute("data-i18n")) {
          kids[i].setAttribute("data-i18n", prefix + ".b" + (i + 1));
        }
      }
    }
  }

  function captureHe() {
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute("data-i18n");
      if (!(k in origHe)) origHe[k] = nodes[i].innerHTML;
    }
  }

  function applyLang(lang) {
    var root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute("data-i18n");
      var val = lang === "he" ? origHe[k] : (Object.prototype.hasOwnProperty.call(EN, k) ? EN[k] : origHe[k]);
      if (val != null) nodes[i].innerHTML = val;
    }

    var he = document.getElementById("lang-he");
    var en = document.getElementById("lang-en");
    if (he && en) {
      he.classList.toggle("active", lang === "he");
      en.classList.toggle("active", lang === "en");
      he.setAttribute("aria-pressed", lang === "he");
      en.setAttribute("aria-pressed", lang === "en");
    }

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function injectSwitch() {
    var css =
      /* fixed at the physical top-left, in both languages — never shifts side to side */
      ".lang-switch{position:fixed;top:14px;left:14px;z-index:60;" +
      "display:inline-flex;gap:2px;padding:3px;border-radius:999px;" +
      "background:var(--card,#EFE7D5);border:1px solid var(--rule,#D8C8AB);" +
      "box-shadow:0 2px 10px rgba(20,28,50,.14);}" +
      ".lang-switch button{appearance:none;border:0;cursor:pointer;background:transparent;" +
      "font:inherit;font-size:12px;font-weight:700;letter-spacing:.02em;line-height:1;" +
      "color:var(--ink,#1B2A47);padding:6px 12px;border-radius:999px;" +
      "transition:background .2s ease,color .2s ease;}" +
      ".lang-switch button.active{background:var(--ink,#1B2A47);color:var(--bg,#FCFBF8);}" +
      "@media (prefers-reduced-motion:reduce){.lang-switch button{transition:none;}}" +
      "@media (max-width:640px){.back{margin-top:26px;}}" +
      "@media (max-width:560px){.lang-switch{top:10px;left:10px;}" +
      ".lang-switch button{padding:5px 10px;font-size:11px;}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language / שפה");
    wrap.innerHTML =
      '<button id="lang-he" type="button" lang="he">עב</button>' +
      '<button id="lang-en" type="button" lang="en">EN</button>';
    document.body.appendChild(wrap);

    document.getElementById("lang-he").addEventListener("click", function () { applyLang("he"); });
    document.getElementById("lang-en").addEventListener("click", function () { applyLang("en"); });
  }

  function init() {
    expandScopes();
    captureHe();
    injectSwitch();
    var saved = DEFAULT_LANG;
    try { saved = localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch (e) {}
    applyLang(saved === "en" ? "en" : "he");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
