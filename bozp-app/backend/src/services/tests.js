import pool from "../db/index.js";
import { insertTest, insertQuestion, insertAnswer, updateTestInfo, deleteQuestionsByTestId } from "../models/tests.js";

export async function updateTest(id, name, description, targetGroup, questions) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await updateTestInfo(client, id, name, description, targetGroup);
    await deleteQuestionsByTestId(client, id);

    for (const q of questions) {
      const question = await insertQuestion(client, id, q.question_text);
      for (const a of q.answers) {
        await insertAnswer(client, question.id, a.answer_text, a.is_correct);
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function createTest(name, description, targetGroup, questions) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const test = await insertTest(client, name, description, targetGroup);

    for (const q of questions) {
      const question = await insertQuestion(client, test.id, q.question_text);
      for (const a of q.answers) {
        await insertAnswer(client, question.id, a.answer_text, a.is_correct);
      }
    }

    await client.query("COMMIT");
    return test;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
