const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const startButton = document.getElementById("startButton");
const opening = document.getElementById("opening");
const message = document.getElementById("message");
const musicError = document.getElementById("musicError");

let isPlaying = false;

function updateMusicButton() {
    musicIcon.textContent = isPlaying ? "♫" : "♪";
    musicButton.classList.toggle("playing", isPlaying);
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
}

startButton.addEventListener("click", async () => {
    opening.hidden = true;
    message.classList.remove("hidden");
    musicButton.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });

    try {
        await music.play();
        isPlaying = true;
        musicError.hidden = true;
    } catch (error) {
        isPlaying = false;
        musicError.hidden = false;
    }
    updateMusicButton();
});

musicButton.addEventListener("click", async () => {
    if (isPlaying) {
        music.pause();
        return;
    }

    try {
        await music.play();
        musicError.hidden = true;
    } catch (error) {
        musicError.hidden = false;
    }
});

music.addEventListener("pause", () => {
    isPlaying = false;
    updateMusicButton();
});

music.addEventListener("play", () => {
    isPlaying = true;
    updateMusicButton();
});

/* Existing interactive question */
const choices = document.querySelectorAll(".choice");
const choiceResponse = document.getElementById("choiceResponse");

choices.forEach((choice) => {
    choice.setAttribute("aria-pressed", "false");

    choice.addEventListener("click", () => {
        choices.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });

        choice.classList.add("active");
        choice.setAttribute("aria-pressed", "true");
        choiceResponse.hidden = false;
    });
});

/* QUICK BRAIN TEST */
const brainQuestions = [
    {
        question: "2, 4, 8, 16, ... angka berikutnya?",
        answers: ["18", "24", "32", "36"],
        correct: 2,
        explanation: "betul kalau 32! angkanya selalu dikali 2."
    },
    {
        question: "Kalau semua A adalah B, dan semua B adalah C, berarti...",
        answers: ["Semua A adalah C", "Semua C adalah A", "A bukan C", "Tidak bisa disimpulkan"],
        correct: 0,
        explanation: "yapp, semua A termasuk C juga."
    },
    {
        question: "Ada 5 mesin membuat 5 barang dalam 5 menit. 100 mesin membuat 100 barang butuh berapa menit?",
        answers: ["5 menit", "20 menit", "100 menit", "500 menit"],
        correct: 0,
        explanation: "5 menit! setiap mesin membuat 1 barang dalam 5 menit."
    }
];

const brainProgress = document.getElementById("brainProgress");
const brainQuestion = document.getElementById("brainQuestion");
const brainAnswers = document.getElementById("brainAnswers");
const brainFeedback = document.getElementById("brainFeedback");
const brainNext = document.getElementById("brainNext");
const brainRestart = document.getElementById("brainRestart");

let brainIndex = 0;
let brainScore = 0;
let brainAnswered = false;

function renderBrainQuestion() {
    const item = brainQuestions[brainIndex];

    brainProgress.textContent = `soal ${brainIndex + 1} dari ${brainQuestions.length}`;
    brainQuestion.textContent = item.question;
    brainAnswers.replaceChildren();
    brainFeedback.hidden = true;
    brainNext.hidden = true;
    brainRestart.hidden = true;
    brainAnswered = false;

    item.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "brain-option";
        button.textContent = answer;

        button.addEventListener("click", () => {
            if (brainAnswered) return;
            brainAnswered = true;

            const correct = index === item.correct;
            if (correct) brainScore++;

            [...brainAnswers.children].forEach((option, optionIndex) => {
                option.disabled = true;
                if (optionIndex === item.correct) option.classList.add("correct");
            });

            if (!correct) button.classList.add("wrong");

            brainFeedback.textContent = correct
                ? `benerr! ${item.explanation}`
                : `belum tepat wkwk. ${item.explanation}`;
            brainFeedback.hidden = false;

            if (brainIndex < brainQuestions.length - 1) {
                brainNext.hidden = false;
            } else {
                brainQuestion.textContent = `skor kamu: ${brainScore}/${brainQuestions.length} 🧠`;
                brainProgress.textContent = "challenge selesai!";
                brainFeedback.textContent = brainScore === 3
                    ? "perfect score! wihh, mantap juga kamu 😭"
                    : brainScore >= 2
                        ? "udah bagus kok wkwk, lumayan bikin mikir kan?"
                        : "makasih udah nyobain! yang penting jangan lupa istirahat juga ♡";
                brainRestart.hidden = false;
            }
        });

        brainAnswers.appendChild(button);
    });
}

brainNext.addEventListener("click", () => {
    if (brainIndex < brainQuestions.length - 1) {
        brainIndex++;
        renderBrainQuestion();
    }
});

brainRestart.addEventListener("click", () => {
    brainIndex = 0;
    brainScore = 0;
    renderBrainQuestion();
});

renderBrainQuestion();

/* REACTION TIME TEST */
const reactionArea = document.getElementById("reactionArea");
const reactionSymbol = document.getElementById("reactionSymbol");
const reactionText = document.getElementById("reactionText");
const reactionResult = document.getElementById("reactionResult");

let reactionState = "idle";
let reactionTimer = null;
let reactionStart = 0;

reactionArea.addEventListener("click", () => {
    if (reactionState === "idle" || reactionState === "result") {
        clearTimeout(reactionTimer);
        reactionState = "waiting";
        reactionArea.className = "reaction-area waiting";
        reactionSymbol.textContent = "⏳";
        reactionText.textContent = "tunggu warna hijau...";
        reactionResult.textContent = "jangan buru-buru yaa.";

        const delay = 1800 + Math.random() * 3200;
        reactionTimer = setTimeout(() => {
            reactionState = "ready";
            reactionStart = performance.now();
            reactionArea.className = "reaction-area ready";
            reactionSymbol.textContent = "⚡";
            reactionText.textContent = "SEKARANG! TAP!";
            reactionResult.textContent = "cepetan!";
        }, delay);

        return;
    }

    if (reactionState === "waiting") {
        clearTimeout(reactionTimer);
        reactionState = "result";
        reactionArea.className = "reaction-area too-early";
        reactionSymbol.textContent = "😭";
        reactionText.textContent = "ehh kecepetan!";
        reactionResult.textContent = "wkwkwk sabar dulu 😭 tap lagi buat coba ulang.";
        return;
    }

    if (reactionState === "ready") {
        const elapsed = Math.round(performance.now() - reactionStart);
        reactionState = "result";
        reactionArea.className = "reaction-area";
        reactionSymbol.textContent = "🏁";
        reactionText.textContent = `${elapsed} ms`;

        let comment;
        if (elapsed < 200) {
            comment = "WIIH refleks kamu cepet banget!";
        } else if (elapsed < 300) {
            comment = "mantapp, refleksnya lumayan gesit ⚡";
        } else if (elapsed < 450) {
            comment = "not bad wkwk, coba sekali lagi?";
        } else {
            comment = "wkwk santai, mungkin lagi capek. coba lagi!";
        }

        reactionResult.textContent = `${comment} tap lagi kalau mau mengulang.`;
    }
});

window.addEventListener("pagehide", () => clearTimeout(reactionTimer));