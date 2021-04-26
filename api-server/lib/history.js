import db from "../db"

export const save_history = async (req,type, log) => {
  const uid = req.session.user.id

  const insert_sql = "INSERT INTO History (user_id, type, log) VALUES ($1,$2,$3)"
  const sql_params = [uid, type, JSON.stringify(log)]

  await db.query(insert_sql,sql_params)

  return true
}
