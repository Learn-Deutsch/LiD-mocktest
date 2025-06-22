
document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;
  let score = 0;
  let selectedQuestions = [];
  let userAnswers = {};
  let flaggedQuestions = new Set();

  function startQuiz() {
    const username = document.getElementById("username").value.trim();
    if (!username) return alert("Please enter your name");
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    if (!window.questions || !Array.isArray(window.questions)) {
      alert("Failed to load questions.");
      return;
    }

    selectedQuestions = shuffle(window.questions).slice(0, 30);
    showQuestion();
  }

  window.startQuiz = startQuiz;

  function showQuestion() {
    const container = document.getElementById("quiz-container");
    if (currentIndex >= selectedQuestions.length) return finishQuiz();

    const q = selectedQuestions[currentIndex];
    const savedAnswer = userAnswers[q.id] || "";
    let html = `<div class="question"><h3>Frage ${currentIndex + 1} von 30</h3>`;
    html += `<p>${q.text}</p>`;
    if (q.image) html += `<img src="${q.image}" alt="Question Image">`;
    html += `<div class="options">`;
    for (const opt of q.options) {
      const checked = savedAnswer === opt.label ? "checked" : "";
      html += `<label><input type="radio" name="q${currentIndex}" value="${opt.label}" ${checked}> ${opt.label}: ${opt.text}</label>`;
    }
    html += `</div>`;
    html += `<button onclick="goBack()">Back</button>`;
    html += `<button onclick="toggleFlag()">Flag</button>`;
    html += `<button onclick="submitAnswer()">Next</button></div>`;
    container.innerHTML = html;
  }

  window.submitAnswer = function() {
    const radios = document.getElementsByName("q" + currentIndex);
    let selected = null;
    for (const r of radios) if (r.checked) selected = r.value;
    if (selected) {
      const qid = selectedQuestions[currentIndex].id;
      userAnswers[qid] = selected;
    }
    currentIndex++;
    showQuestion();
  };

  window.goBack = function() {
    if (currentIndex > 0) {
      currentIndex--;
      showQuestion();
    }
  };

  window.toggleFlag = function() {
    const qid = selectedQuestions[currentIndex].id;
    if (flaggedQuestions.has(qid)) {
      flaggedQuestions.delete(qid);
    } else {
      flaggedQuestions.add(qid);
    }
    alert("Question " + (currentIndex + 1) + (flaggedQuestions.has(qid) ? " flagged." : " unflagged."));
  };

  function finishQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    showReviewScreen();
  }

  function showReviewScreen() {
    let html = `<h2>Review Answers</h2><p>Your score: ${calculateScore()} / 30</p><div class="review-nav">`;
    selectedQuestions.forEach((q, idx) => {
      const flagged = flaggedQuestions.has(q.id);
      html += `<button onclick="jumpTo(${idx})" style="${flagged ? 'background-color: yellow;' : ''}">Q${idx + 1}</button> `;
    });
    html += `</div>`;
    document.getElementById("result-screen").innerHTML = html;
  }

  window.jumpTo = function(index) {
    currentIndex = index;
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    showQuestion();
  };

  function calculateScore() {
    let s = 0;
    selectedQuestions.forEach(q => {
      if (userAnswers[q.id] && typeof correctAnswers !== "undefined" && correctAnswers[q.id] === userAnswers[q.id]) {
        s++;
      }
    });
    return s;
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
});
