let current = 0;
let score = 0;
let timer;
let timeLeft = 30;
let student = { name: "", usn: "" };

let questions = JSON.parse(localStorage.getItem("questions")) || [
  {
    question: "Capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    answer: "Delhi"
  },
  {
    question: "5 x 6 = ?",
    options: ["25", "30", "20", "35"],
    answer: "30"
  }
];

let attempts = JSON.parse(localStorage.getItem("attempts")) || [];

function showAdminLogin() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("admin-login-section").style.display = "block";
}

function loginAdmin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "admin123") {
    document.getElementById("admin-login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    updateAdminInfo();
  } else {
    alert("Incorrect password!");
  }
}

function updateAdminInfo() {
  let info = "<h4>Current Questions:</h4><ol>";
  questions.forEach(q => {
    info += `<li>${q.question}</li>`;
  });
  info += "</ol>";
  document.getElementById("adminInfo").innerHTML = info;
}

function addQuestion() {
  const q = document.getElementById("newQuestion").value;
  const o1 = document.getElementById("opt1").value;
  const o2 = document.getElementById("opt2").value;
  const o3 = document.getElementById("opt3").value;
  const o4 = document.getElementById("opt4").value;
  const ans = document.getElementById("correctAnswer").value;

  if (q && o1 && o2 && o3 && o4 && ans) {
    questions.push({
      question: q,
      options: [o1, o2, o3, o4],
      answer: ans
    });
    localStorage.setItem("questions", JSON.stringify(questions));
    updateAdminInfo();
    alert("Question added!");
  } else {
    alert("Please fill all fields!");
  }
}

function deleteQuestion() {
  const idx = parseInt(document.getElementById("deleteIndex").value);
  if (!isNaN(idx) && idx >= 0 && idx < questions.length) {
    questions.splice(idx, 1);
    localStorage.setItem("questions", JSON.stringify(questions));
    updateAdminInfo();
    alert("Question deleted!");
  } else {
    alert("Invalid index!");
  }
}

function startQuiz() {
  const name = document.getElementById("name").value;
  const usn = document.getElementById("usn").value;
  if (!name || !usn) return alert("Enter name and USN!");

  student.name = name;
  student.usn = usn;
  score = 0;
  current = 0;

  document.getElementById("login-section").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";
  document.getElementById("user-info").innerText = `Name: ${name} | USN: ${usn}`;
  showQuestion();
  startTimer();
}

function showQuestion() {
  const q = questions[current];
  document.getElementById("questionBox").innerText = q.question;

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    optionsBox.appendChild(btn);
  });

  document.getElementById("answerBox").innerText = "";
  resetTimer();
}

function checkAnswer(selected) {
  const correct = questions[current].answer;
  if (selected === correct) {
    score++;
    document.getElementById("answerBox").innerText = "✅ Correct!";
  } else {
    document.getElementById("answerBox").innerText = `❌ Wrong! Correct: ${correct}`;
  }
  clearInterval(timer);
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    document.getElementById("quiz-section").style.display = "none";
    document.getElementById("result-section").style.display = "block";
    document.getElementById("finalScore").innerText = `${student.name} (${student.usn}) scored ${score}/${questions.length}`;
    attempts.push({ ...student, score });
    localStorage.setItem("attempts", JSON.stringify(attempts));
  }
}

function startTimer() {
  timeLeft = 30;
  document.getElementById("time").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function downloadQuestions() {
  const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quiz_questions.json";
  a.click();
}

function downloadAttempts() {
  let csv = "Name,USN,Score\n";
  attempts.forEach(a => {
    csv += `${a.name},${a.usn},${a.score}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "student_attempts.csv";
  a.click();
}

function goHome() {
  location.reload();
}
