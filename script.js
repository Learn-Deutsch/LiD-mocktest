
document.addEventListener("DOMContentLoaded", () => {
  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let selectedQuestions = [];

  function startQuiz() {
    const username = document.getElementById("username").value.trim();
    if (!username) return alert("Please enter your name");
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    loadQuiz();
  }

  window.startQuiz = startQuiz;

  function loadQuiz() {
    fetch("questions.js").then(res => res.text()).then(js => {
      eval(js);
      questions = window.questions;
      selectedQuestions = shuffle(questions).slice(0, 30);
      showQuestion();
    });
  }

  function showQuestion() {
    const container = document.getElementById("quiz-container");
    if (currentIndex >= selectedQuestions.length) return finishQuiz();

    const q = selectedQuestions[currentIndex];
    let html = `<div class="question"><h3>Frage ${currentIndex + 1} von 30</h3>`;
    html += `<p>${q.text}</p>`;
    if (q.image) html += `<img src="${q.image}" alt="Question Image">`;
    html += `<div class="options">`;
    for (const opt of q.options) {
      html += `<label><input type="radio" name="q${currentIndex}" value="${opt.label}"> ${opt.label}: ${opt.text}</label>`;
    }
    html += `</div><button onclick="submitAnswer()">Next</button></div>`;
    container.innerHTML = html;
  }

  window.submitAnswer = function() {
    const radios = document.getElementsByName("q" + currentIndex);
    let selected = null;
    for (const r of radios) if (r.checked) selected = r.value;
    if (selected) {
      const qid = selectedQuestions[currentIndex].id;
      if (typeof correctAnswers !== "undefined" && correctAnswers[qid] === selected) {
        score++;
      }
    }
    currentIndex++;
    showQuestion();
  };

  function finishQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    document.getElementById("score-display").innerText = `Your score: ${score} / 30`;
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
});
