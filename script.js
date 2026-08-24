let currentMode = "teach";


const questions = {
    "atomic radius": [
        "Why does atomic radius decrease across a period?",
        "Why does atomic radius increase down a group?",
        "What is the effect of effective nuclear charge on atomic radius?"
    ],

    "chemical bonding": [
        "What is an ionic bond?",
        "Why do atoms form chemical bonds?",
        "What is the difference between ionic and covalent bonding?"
    ],

    "photosynthesis": [
        "Where does photosynthesis occur?",
        "What is the role of chlorophyll?",
        "What are the products of photosynthesis?"
    ],

    "newton laws": [
        "What does Newton's first law state?",
        "What is the relationship between force and acceleration?",
        "Give an example of Newton's third law."
    ]
};



const modeData = {

    teach: {
        title: "What do you want to learn?",
        description: "Enter a topic and COSMOS will help you understand it.",
        placeholder: "Example: Why does atomic radius decrease across a period?",
        example: "\"Explain photosynthesis simply\""
    },

    test: {
        title: "What do you want to be tested on?",
        description: "Choose a topic and challenge your understanding.",
        placeholder: "Example: Test me on atomic radius",
        example: "\"Test me on Newton's laws\""
    },

    mistake: {
        title: "Show me your answer",
        description: "COSMOS looks for the misconception behind your mistake.",
        placeholder: "Example: Atomic radius increases across a period because new shells are added.",
        example: "\"Find the mistake in my answer\""
    }
};



/* =========================
   QUICK CONCEPTS
========================= */

/*
    Custom concepts are stored here.

    Each concept has:
    - title
    - description
    - prompt
    - icon
*/

let customConcepts = JSON.parse(
    localStorage.getItem("cosmosQuickConcepts")
) || [];



/*
    This function is used by the original Quick Concept cards.

    It sends the selected prompt directly
    into the COSMOS workspace.
*/

function quickStart(mode, prompt) {

    selectModeWithoutEvent(mode);

    const input = document.getElementById("userInput");

    input.value = prompt;

    input.focus();

    document.querySelector(".workspace").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}



/*
    Select a mode without requiring
    an actual button click event.

    This is useful for Quick Concepts.
*/

function selectModeWithoutEvent(mode) {

    currentMode = mode;

    document.querySelectorAll(".mode").forEach(button => {
        button.classList.remove("active");
    });

    const modes = document.querySelectorAll(".mode");

    if (mode === "teach" && modes[0]) {
        modes[0].classList.add("active");
    }

    if (mode === "test" && modes[1]) {
        modes[1].classList.add("active");
    }

    if (mode === "mistake" && modes[2]) {
        modes[2].classList.add("active");
    }

    document.getElementById("inputTitle").textContent =
        modeData[mode].title;

    document.getElementById("inputDescription").textContent =
        modeData[mode].description;

    document.getElementById("userInput").placeholder =
        modeData[mode].placeholder;

    document.getElementById("exampleText").textContent =
        modeData[mode].example;
}



/*
    Add a brand-new Quick Concept.
*/

function addQuickConcept() {

    const title = prompt("Enter the concept name:");

    if (!title || !title.trim()) {
        return;
    }

    const description = prompt(
        "Enter a short description for the card:"
    );

    if (!description || !description.trim()) {
        return;
    }

    const promptText = prompt(
        "What should COSMOS ask/teach when this card is clicked?"
    );

    if (!promptText || !promptText.trim()) {
        return;
    }

    const icon = prompt(
        "Choose an emoji for the card:",
        "📚"
    ) || "📚";


    const newConcept = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        prompt: promptText.trim(),
        icon: icon.trim()
    };


    customConcepts.push(newConcept);


    localStorage.setItem(
        "cosmosQuickConcepts",
        JSON.stringify(customConcepts)
    );


    renderCustomConcepts();
}



/*
    Display all custom Quick Concepts.
*/

function renderCustomConcepts() {

    const grid = document.getElementById("topicGrid");

    if (!grid) {
        return;
    }


    /*
        Remove only previously generated
        custom cards.

        The original six cards are untouched.
    */

    document
        .querySelectorAll(".custom-topic-card")
        .forEach(card => card.remove());


    customConcepts.forEach(concept => {

        const wrapper = document.createElement("div");

        wrapper.className = "custom-topic-wrapper";


        const button = document.createElement("button");

        button.type = "button";

        button.className = "topic-card custom-topic-card";


        button.innerHTML = `
            <span class="topic-icon">
                ${escapeHTML(concept.icon)}
            </span>

            <strong>
                ${escapeHTML(concept.title)}
            </strong>

            <small>
                ${escapeHTML(concept.description)}
            </small>
        `;


        button.onclick = function () {

            quickStart(
                "teach",
                concept.prompt
            );

        };


        /*
            Delete button for custom concepts.
        */

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "delete-concept-button";

        deleteButton.textContent = "×";

        deleteButton.title = "Delete concept";


        deleteButton.onclick = function (event) {

            event.stopPropagation();

            deleteQuickConcept(concept.id);

        };


        wrapper.appendChild(button);

        wrapper.appendChild(deleteButton);

        grid.appendChild(wrapper);

    });
}



/*
    Delete a custom Quick Concept.
*/

function deleteQuickConcept(id) {

    const confirmed = confirm(
        "Delete this Quick Concept?"
    );

    if (!confirmed) {
        return;
    }


    customConcepts = customConcepts.filter(
        concept => concept.id !== id
    );


    localStorage.setItem(
        "cosmosQuickConcepts",
        JSON.stringify(customConcepts)
    );


    renderCustomConcepts();
}



/*
    Load saved Quick Concepts
    when the page starts.
*/

document.addEventListener("DOMContentLoaded", function () {

    renderCustomConcepts();

});



/* =========================
   MODE SELECTOR
========================= */

function selectMode(mode) {

    currentMode = mode;

    document.querySelectorAll(".mode").forEach(button => {
        button.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

    document.getElementById("inputTitle").textContent =
        modeData[mode].title;

    document.getElementById("inputDescription").textContent =
        modeData[mode].description;

    document.getElementById("userInput").placeholder =
        modeData[mode].placeholder;

    document.getElementById("exampleText").textContent =
        modeData[mode].example;
}



/* =========================
   ASK COSMOS
========================= */

function askAI() {

    const input = document.getElementById("userInput").value.trim();

    const response = document.getElementById("response");


    if (!input) {

        alert("Enter something first! 😭");

        return;

    }


    response.innerHTML = `
        <div class="ai-response">
            <h3>✦ COSMOS is thinking...</h3>
            <p>Analyzing your response...</p>
        </div>
    `;


    setTimeout(() => {

        if (currentMode === "mistake") {

            showMistakeAnalysis(input);

        }

        else if (currentMode === "test") {

            showTest(input);

        }

        else {

            showExplanation(input);

        }

    }, 800);
}



/* =========================
   TEACH ME
========================= */

function showExplanation(input) {

    let answer = "";

    const lower = input.toLowerCase();


    if (lower.includes("atomic radius")) {

        answer = `
            <h3>🧠 Understanding Atomic Radius</h3>

            <p>
                <span class="highlight">Atomic radius</span> is a measure
                of the size of an atom.
            </p>

            <br>

            <p>
                Across a period, atomic radius generally
                <span class="highlight">decreases</span>.
            </p>

            <br>

            <p>
                The main reason is that nuclear charge increases
                while electrons are added to the same principal shell.
                The stronger attraction pulls the electrons closer
                to the nucleus.
            </p>

            <br>

            <div class="concept-box">
                💡 <strong>Remember:</strong><br>
                Across a period → nuclear charge ↑ → attraction ↑
                → atomic radius ↓
            </div>

            <br>

            <p>
                🎯 <span class="highlight">Exam tip:</span>
                Don't memorize only the trend. Remember the reason
                behind the trend.
            </p>
        `;

    }


    else if (lower.includes("photosynthesis")) {

        answer = `
            <h3>🌱 Photosynthesis — Simplified</h3>

            <p>
                Photosynthesis is the process by which green plants
                make food using <span class="highlight">light energy</span>.
            </p>

            <br>

            <p>
                Plants use carbon dioxide and water to produce
                glucose and oxygen.
            </p>

            <br>

            <div class="concept-box">
                ☀️ Light energy + CO₂ + H₂O
                → Glucose + O₂
            </div>

            <br>

            <p>
                💡 Think of chlorophyll as the system that captures
                the light energy needed for the process.
            </p>
        `;

    }


    else {

        answer = `
            <h3>🧠 Let's break it down</h3>

            <p>
                You asked about:
                <span class="highlight">${escapeHTML(input)}</span>
            </p>

            <br>

            <p>
                Start by identifying the main concept involved.
                Then ask yourself:
            </p>

            <br>

            <div class="concept-box">
                ❓ What is changing?<br>
                ❓ What causes that change?<br>
                ❓ What evidence supports it?
            </div>

            <br>

            <p>
                🎯 COSMOS encourages understanding the reasoning
                behind an answer instead of simply memorizing it.
            </p>
        `;

    }


    displayAnswer(answer);
}



/* =========================
   FIND MY MISTAKE
========================= */

function showMistakeAnalysis(input) {

    const lower = input.toLowerCase();

    let answer = "";


    if (
        lower.includes("atomic radius") &&
        (
            lower.includes("new shell") ||
            lower.includes("more shells") ||
            lower.includes("shells are added")
        )
    ) {

        answer = `
            <h3>🔍 Misconception Detected</h3>

            <div class="mistake-box">
                ⚠️ <strong>Possible misconception</strong>
            </div>

            <br>

            <p>
                You said that atomic radius increases across a period
                because <span class="highlight">new electron shells
                are added</span>.
            </p>

            <br>

            <p>
                That's the key idea to reconsider.
            </p>

            <br>

            <p>
                As you move across a period, electrons are generally
                being added to the <span class="highlight">same
                principal shell</span>.
            </p>

            <br>

            <p>
                At the same time, the number of protons increases.
                This increases the attraction between the nucleus
                and the electrons.
            </p>

            <br>

            <div class="concept-box">
                🧠 <strong>Think about this:</strong><br><br>
                If the electrons are entering the same shell,
                but the nucleus is becoming more positively charged,
                what should happen to the size of the atom?
            </div>

            <br>

            <p>
                🎯 <span class="highlight">COSMOS learning goal:</span>
                Don't just replace the wrong answer with the right one.
                Understand why the original reasoning failed.
            </p>
        `;

    }


    else {

        answer = `
            <h3>🔍 Let's investigate your reasoning</h3>

            <p>
                COSMOS couldn't find a clear misconception yet.
            </p>

            <br>

            <div class="concept-box">
                💡 Try writing your answer with a little more
                explanation. The more reasoning you provide,
                the easier it is to identify where your thinking
                changed direction.
            </div>

            <br>

            <p>
                Remember:
                <span class="highlight">
                a mistake is useful when you understand why it happened.
                </span>
            </p>
        `;

    }


    displayAnswer(answer);
}



/* =========================
   TEST ME
========================= */

function showTest(input) {

    const lower = input.toLowerCase();

    let topic = "general science";


    if (lower.includes("atomic radius")) {

        topic = "atomic radius";

    }

    else if (lower.includes("chemical bonding")) {

        topic = "chemical bonding";

    }

    else if (lower.includes("photosynthesis")) {

        topic = "photosynthesis";

    }

    else if (lower.includes("newton")) {

        topic = "Newton's laws";

    }


    const topicQuestions =
        questions[topic] || [
            "Explain the main idea of this topic.",
            "What is the most important principle involved?",
            "Give one real-world example."
        ];


    let questionHTML = "";


    topicQuestions.forEach((question, index) => {

        questionHTML += `
            <div class="question">
                <span class="highlight">${index + 1}.</span>
                ${question}
            </div>
            <br>
        `;

    });


    const answer = `
        <h3>🎯 ${topic} — Mini Test</h3>

        <p>
            No answers yet. Try solving these without looking
            at your notes.
        </p>

        <br>

        ${questionHTML}

        <div class="concept-box">
            🔥 <strong>Challenge:</strong>
            Explain your reasoning, not just your final answer.
        </div>
    `;


    displayAnswer(answer);
}



/* =========================
   DISPLAY
========================= */

function displayAnswer(content) {

    document.getElementById("response").innerHTML = `
        <div class="ai-response">
            ${content}
        </div>
    `;

}



/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}