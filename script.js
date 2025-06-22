
document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;
  let score = 0;
  let selectedQuestions = [];
  let userAnswers = {};
  let flaggedQuestions = new Set();
  let quizSubmitted = false;

  
  let timerInterval;
  let timeLeft = 1800; // 30 minutes in seconds

  function startQuiz() {
    startTimer();

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
    if (quizSubmitted || currentIndex >= selectedQuestions.length) return;

    const q = selectedQuestions[currentIndex];
    const savedAnswer = userAnswers[q.id] || "";
    let html = `<div class="question"><h3>Frage ${currentIndex + 1} von 30</h3>`;
    html += `<p>${q.text}</p>`;
    if (q.image) html += `<img src="${q.image}" alt="Question Image">`;
    html += `<div class="options">`;
    for (const opt of q.options) {
      const checked = savedAnswer === opt.label ? "checked" : "";
      html += `<label style='display:block; margin: 5px 0;'><input type="radio" name="q${currentIndex}" value="${opt.label}" ${checked}> ${opt.label}: ${opt.text}</label>`;
    }
    html += `</div>`;
    html += `<div class="nav-buttons">`;
    if (currentIndex > 0) html += `<button onclick="goBack()">Back</button>`;
    html += `<button onclick="toggleFlag()">Flag</button>`;
    html += `<button onclick="goToReview()">Review Answers</button>`;
    html += `<button onclick="submitAnswer()">Next</button>`;
    html += `<button onclick="confirmSubmit()">Submit</button>`;
    html += `</div></div>`;
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
    if (currentIndex < selectedQuestions.length) {
      showQuestion();
    } else {
      goToReview();
    }
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

  window.goToReview = function() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    showReviewScreen();
  };

  function showReviewScreen() {
    let html = `<h2>Review Answers</h2><div class="review-nav">`;
    selectedQuestions.forEach((q, idx) => {
      const flagged = flaggedQuestions.has(q.id);
      const userAns = userAnswers[q.id] || "-";
      html += `<button onclick="jumpTo(${idx})" style="${flagged ? 'background-color: yellow;' : ''}">Q${idx + 1} (${userAns})</button> `;
    });
    html += `</div><br><button onclick="confirmSubmit()">Submit Quiz</button>`;
    document.getElementById("result-screen").innerHTML = html;
  }

  window.jumpTo = function(index) {
    currentIndex = index;
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    showQuestion();
  };

  window.confirmSubmit = function() {
    if (confirm("Are you sure you want to submit the quiz? You will not be able to go back.")) {
      submitQuiz();
    }
  };

  function submitQuiz() {
    quizSubmitted = true;
    document.getElementById("quiz-container").style.display = "none";
    let finalScore = calculateScore();
    let html = `<h2>Quiz Completed</h2><p>Your score: ${finalScore} / 30</p>`;
    html += `<p>Thank you for completing the quiz.</p>`;
    document.getElementById("result-screen").innerHTML = html;
  }

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

  
  function startTimer() {
    clearInterval(timerInterval); // prevent duplicates
    const timerDisplay = document.getElementById("timer");
    if (!timerDisplay) return;
    timerDisplay.style.display = "block";
    timerDisplay.textContent = "Time Left: 30:00";

    const timerDisplay = document.getElementById("timer");
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time is up! Submitting your quiz.");
        submitQuiz();
      } else {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
      }
    }, 1000);
  }
