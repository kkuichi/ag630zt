import pool from "../db/index.js";

export async function getAllTests() {
  const result = await pool.query("SELECT * FROM tests ORDER BY created_at DESC");
  return result.rows;
}

export async function insertTest(client, name, description, targetGroup) {
  const result = await client.query("INSERT INTO tests (name, description, target_group) VALUES ($1, $2, $3) RETURNING *", [
    name,
    description,
    targetGroup,
  ]);
  return result.rows[0];
}

export async function insertQuestion(client, testId, questionText) {
  const result = await client.query("INSERT INTO questions (test_id, question_text) VALUES ($1, $2) RETURNING *", [testId, questionText]);
  return result.rows[0];
}

export async function insertAnswer(client, questionId, answerText, isCorrect) {
  const result = await client.query("INSERT INTO answers (question_id, answer_text, is_correct) VALUES ($1, $2, $3) RETURNING *", [
    questionId,
    answerText,
    isCorrect,
  ]);
  return result.rows[0];
}

export async function getTestById(id) {
  const test = await pool.query("SELECT * FROM tests WHERE id = $1", [id]);
  if (!test.rows[0]) return null;

  const questions = await pool.query("SELECT * FROM questions WHERE test_id = $1 ORDER BY id ASC", [id]);

  for (const q of questions.rows) {
    const answers = await pool.query("SELECT * FROM answers WHERE question_id = $1 ORDER BY id ASC", [q.id]);
    q.answers = answers.rows;
  }

  return { ...test.rows[0], questions: questions.rows };
}

export async function updateTestInfo(client, id, name, description, targetGroup) {
  await client.query("UPDATE tests SET name = $1, description = $2, target_group = $3 WHERE id = $4", [name, description, targetGroup, id]);
}

export async function deleteQuestionsByTestId(client, testId) {
  await client.query("DELETE FROM questions WHERE test_id = $1", [testId]);
}

export async function deleteTest(id) {
  await pool.query("DELETE FROM tests WHERE id = $1", [id]);
}

export async function getAssignedTestsForEmployee(employeeId) {
  const result = await pool.query(
    `SELECT at.id, at.status, at.deadline, at.assigned_at, at.score, at.max_score,
            t.name, t.description
     FROM assigned_tests at
     JOIN tests t ON t.id = at.test_id
     WHERE at.employee_id = $1
     ORDER BY at.assigned_at DESC`,
    [employeeId],
  );
  return result.rows;
}

export async function getAssignedTestsForCompany(companyId) {
  const result = await pool.query(
    `SELECT at.id, at.status, at.deadline, at.assigned_at, at.score, at.max_score,
            t.name, t.description,
            emp.full_name AS employee_name,
            emp.role AS employee_role,
            mgr.full_name AS assigned_by_name
     FROM assigned_tests at
     JOIN tests t ON t.id = at.test_id
     JOIN users emp ON emp.id = at.employee_id
     JOIN users mgr ON mgr.id = at.assigned_by
     WHERE emp.company_id = $1
     ORDER BY at.assigned_at DESC`,
    [companyId],
  );
  return result.rows;
}

export async function insertAssignedTest(testId, employeeId, assignedBy, deadline) {
  const result = await pool.query(
    `INSERT INTO assigned_tests (test_id, employee_id, assigned_by, deadline, status)
     VALUES ($1, $2, $3, $4, 'Otvorený') RETURNING *`,
    [testId, employeeId, assignedBy, deadline || null],
  );
  return result.rows[0];
}

export async function updateAssignedTestDeadline(id, deadline) {
  await pool.query("UPDATE assigned_tests SET deadline = $1 WHERE id = $2", [deadline || null, id]);
}

export async function deleteAssignedTest(id) {
  await pool.query("DELETE FROM assigned_tests WHERE id = $1", [id]);
}

export async function getAssignedTestForTaking(assignedTestId, employeeId) {
  const at = await pool.query("SELECT id, status, test_id FROM assigned_tests WHERE id = $1 AND employee_id = $2", [assignedTestId, employeeId]);
  if (!at.rows[0]) return null;

  const test = await pool.query("SELECT id, name, description FROM tests WHERE id = $1", [at.rows[0].test_id]);
  if (!test.rows[0]) return null;

  const questions = await pool.query("SELECT id, question_text FROM questions WHERE test_id = $1 ORDER BY id ASC", [at.rows[0].test_id]);

  for (const q of questions.rows) {
    const answers = await pool.query("SELECT id, answer_text FROM answers WHERE question_id = $1 ORDER BY id ASC", [q.id]);
    q.answers = answers.rows;
  }

  return {
    assignedTestId: at.rows[0].id,
    status: at.rows[0].status,
    ...test.rows[0],
    questions: questions.rows,
  };
}

export async function evaluateAndSubmitTest(assignedTestId, employeeId, selectedAnswers) {
  const at = await pool.query("SELECT test_id FROM assigned_tests WHERE id = $1 AND employee_id = $2", [assignedTestId, employeeId]);
  if (!at.rows[0]) return null;

  const questions = await pool.query("SELECT id FROM questions WHERE test_id = $1", [at.rows[0].test_id]);

  let score = 0;
  const maxScore = questions.rows.length;

  for (const q of questions.rows) {
    const selectedAnswerId = selectedAnswers[String(q.id)];
    if (selectedAnswerId) {
      const answer = await pool.query("SELECT is_correct FROM answers WHERE id = $1 AND question_id = $2", [selectedAnswerId, q.id]);
      if (answer.rows[0]?.is_correct) score++;
    }
  }

  await pool.query("UPDATE assigned_tests SET score = $1, max_score = $2, submitted_at = NOW(), status = 'Dokončený' WHERE id = $3", [
    score,
    maxScore,
    assignedTestId,
  ]);

  return { score, maxScore };
}
