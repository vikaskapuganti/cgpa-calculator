// CGPA Calculator by Vikas Kapuganti
// SGPA = sum(credits x grade points) / sum(credits)
// CGPA = sum(semester credits x SGPA) / sum(semester credits)

const GRADES = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0 };
const STORAGE_KEY = "cgpa-calculator-v1";

const subjectList = document.getElementById("subject-list");
const semesterList = document.getElementById("semester-list");

// ---------- Saving (so a refresh doesn't wipe your data) ----------
function save() {
  const data = {
    subjects: [...subjectList.children].map(row => ({
      name: row.querySelector(".name").value,
      credits: row.querySelector(".credits").value,
      grade: row.querySelector(".grade").value
    })),
    semesters: [...semesterList.children].map(row => ({
      credits: row.querySelector(".credits").value,
      sgpa: row.querySelector(".sgpa").value
    })),
    formula: document.getElementById("formula").value
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* storage not available */ }
}

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
}

// ---------- Building rows ----------
function addSubject(name = "", credits = "", grade = "O") {
  const row = document.createElement("div");
  row.className = "row";
  const options = Object.keys(GRADES)
    .map(g => `<option value="${g}" ${g === grade ? "selected" : ""}>${g}</option>`)
    .join("");
  row.innerHTML = `
    <input class="name" type="text" placeholder="Subject ${subjectList.children.length + 1}" aria-label="Subject name">
    <input class="credits" type="number" min="0" step="0.5" inputmode="decimal" placeholder="3" aria-label="Credits">
    <select class="grade" aria-label="Grade">${options}</select>
    <button class="remove" aria-label="Remove subject">&times;</button>`;
  row.querySelector(".name").value = name;
  row.querySelector(".credits").value = credits;
  subjectList.appendChild(row);
}

function addSemester(credits = "", sgpa = "") {
  const row = document.createElement("div");
  row.className = "row";
  const number = semesterList.children.length + 1;
  row.innerHTML = `
    <input type="text" value="Sem ${number}" disabled aria-label="Semester">
    <input class="credits" type="number" min="0" step="0.5" inputmode="decimal" placeholder="20" aria-label="Semester credits">
    <input class="sgpa" type="number" min="0" max="10" step="0.01" inputmode="decimal" placeholder="8.50" aria-label="SGPA">
    <button class="remove" aria-label="Remove semester">&times;</button>`;
  row.querySelector(".credits").value = credits;
  row.querySelector(".sgpa").value = sgpa;
  semesterList.appendChild(row);
}

function renumberSemesters() {
  [...semesterList.children].forEach((row, i) => {
    row.querySelector("input[disabled]").value = `Sem ${i + 1}`;
  });
}

// ---------- Calculations ----------
function calcSGPA() {
  let totalCredits = 0, totalPoints = 0;
  for (const row of subjectList.children) {
    const credits = parseFloat(row.querySelector(".credits").value);
    const points = GRADES[row.querySelector(".grade").value];
    if (credits > 0) {
      totalCredits += credits;
      totalPoints += credits * points;
    }
  }
  const sgpa = totalCredits ? totalPoints / totalCredits : 0;
  return { sgpa, totalCredits };
}

function calcCGPA() {
  let totalCredits = 0, totalPoints = 0;
  for (const row of semesterList.children) {
    const credits = parseFloat(row.querySelector(".credits").value);
    const sgpa = parseFloat(row.querySelector(".sgpa").value);
    if (credits > 0 && sgpa >= 0 && sgpa <= 10) {
      totalCredits += credits;
      totalPoints += credits * sgpa;
    }
  }
  return totalCredits ? totalPoints / totalCredits : 0;
}

function toPercentage(cgpa) {
  if (cgpa === 0) return 0;
  const formula = document.getElementById("formula").value;
  if (formula === "aicte") return Math.max(0, (cgpa - 0.75) * 10);
  if (formula === "x95") return cgpa * 9.5;
  return cgpa * 10;
}

function update() {
  const { sgpa, totalCredits } = calcSGPA();
  document.getElementById("sgpa-result").textContent = sgpa.toFixed(2);
  document.getElementById("sgpa-credits").textContent = totalCredits;

  const cgpa = calcCGPA();
  document.getElementById("cgpa-result").textContent = cgpa.toFixed(2);
  document.getElementById("percent-result").textContent = toPercentage(cgpa).toFixed(2) + "%";

  save();
}

// ---------- Events ----------
document.addEventListener("input", update);
document.addEventListener("change", update);

document.addEventListener("click", e => {
  if (e.target.classList.contains("remove")) {
    const list = e.target.closest("#subject-list, #semester-list");
    e.target.closest(".row").remove();
    if (list === semesterList) renumberSemesters();
    update();
  }
});

document.getElementById("add-subject").addEventListener("click", () => { addSubject(); update(); });
document.getElementById("add-semester").addEventListener("click", () => { addSemester(); update(); });

document.getElementById("send-to-cgpa").addEventListener("click", () => {
  const { sgpa, totalCredits } = calcSGPA();
  if (!totalCredits) { alert("Add at least one subject with credits first."); return; }
  // Fill the first empty semester row if there is one, otherwise add a new row
  const empty = [...semesterList.children].find(r => !r.querySelector(".credits").value && !r.querySelector(".sgpa").value);
  if (empty) {
    empty.querySelector(".credits").value = totalCredits;
    empty.querySelector(".sgpa").value = sgpa.toFixed(2);
  } else {
    addSemester(totalCredits, sgpa.toFixed(2));
  }
  switchTab("cgpa");
  update();
});

document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Clear all subjects and semesters?")) return;
  subjectList.innerHTML = "";
  semesterList.innerHTML = "";
  for (let i = 0; i < 5; i++) addSubject();
  addSemester();
  update();
});

function switchTab(name) {
  document.querySelectorAll(".tab").forEach(t => {
    const on = t.dataset.tab === name;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === name));
}
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));

// ---------- Start ----------
const saved = load();
if (saved && (saved.subjects?.length || saved.semesters?.length)) {
  saved.subjects.forEach(s => addSubject(s.name, s.credits, s.grade));
  saved.semesters.forEach(s => addSemester(s.credits, s.sgpa));
  if (saved.formula) document.getElementById("formula").value = saved.formula;
} else {
  for (let i = 0; i < 5; i++) addSubject();
  addSemester();
}
update();
