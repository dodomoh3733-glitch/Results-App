class Student {
  #name;
  #grades = [0, 0, 0];
  #attendance = 0;

  constructor(name, grade1, grade2, grade3, attendance) {
    this.name = name;
    this.grade1 = grade1;
    this.grade2 = grade2;
    this.grade3 = grade3;
    this.attendance = attendance;
  }

  static validate(value, label) {
    if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
      throw new Error(`الحقل "${label}" فارغ أو غير صالح`);
    }
    const num = Number(value);
    if (num < 0 || num > 100) {
      throw new Error(`"${label}" يجب أن تكون بين 0 و 100`);
    }
    return num;
  }

  set name(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("اسم الطالب مطلوب");
    }
    this.#name = value.trim();
  }
  get name() { return this.#name; }

  set grade1(value) { this.#grades[0] = Student.validate(value, "درجة المادة 1"); }
  set grade2(value) { this.#grades[1] = Student.validate(value, "درجة المادة 2"); }
  set grade3(value) { this.#grades[2] = Student.validate(value, "درجة المادة 3"); }
  get grade1() { return this.#grades[0]; }
  get grade2() { return this.#grades[1]; }
  get grade3() { return this.#grades[2]; }

  set attendance(value) { this.#attendance = Student.validate(value, "نسبة الحضور"); }
  get attendance() { return this.#attendance; }

  get average() {
    return this.#grades.reduce((sum, g) => sum + g, 0) / this.#grades.length;
  }
}

const studentsList = [];

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

addBtn.onclick = function () {
  try {
    const student = new Student(
      nameInput.value,
      grade1Input.value,
      grade2Input.value,
      grade3Input.value,
      attendanceInput.value
    );
    studentsList.push(student);
    errorBox.textContent = "";
    if (studentsList.length === 1) studentsBox.innerHTML = "";
    studentsBox.innerHTML += `<div class="student-item">${studentsList.length}. ${escapeHtml(student.name)}</div>`;
    [nameInput, grade1Input, grade2Input, grade3Input, attendanceInput].forEach((i) => (i.value = ""));
  } catch (error) {
    errorBox.textContent = error.message;
  }
};

mercyBtn.onclick = function () {
  const struggling = studentsList.filter((s) => s.average >= 40 && s.average <= 49);
  const boosted = struggling.map((s) => ({ name: s.name, average: s.average + 5 }));
  const total = boosted.reduce((sum, s) => sum + s.average, 0);
  const overall = boosted.length > 0 ? total / boosted.length : 0;

  if (boosted.length === 0) {
    reportBox.innerHTML = `<div class="alert alert-info mb-0">لا يوجد طلاب متعثرون (متوسط بين 40 و 49).</div>`;
    return;
  }

  reportBox.innerHTML = `
    <p>عدد الطلاب المتعثرين: <strong>${boosted.length}</strong></p>
    <ul>
      ${boosted.map((s) => `<li>${escapeHtml(s.name)} - المتوسط بعد الرأفة: ${s.average.toFixed(2)}</li>`).join("")}
    </ul>
    <p>المتوسط العام بعد الرأفة: <strong>${overall.toFixed(2)}</strong></p>
  `;
};
