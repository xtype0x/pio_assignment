import _ from "lodash"
import db from "../db"

const NUM_PER_ROWS = 20

const get_history = async (req,res) => {
  const page = +(req.query.page || 1)

  if(isNaN(page)){
    return res.status(403).json({error: "Parameter `page` is not valid"})
  }

  const get_sql = `SELECT H.*,U.name AS user_name, COUNT(H.*) OVER() AS total_count 
    FROM History H LEFT JOIN Users U ON H.user_id = U.id
    ORDER BY created_at DESC LIMIT $1 OFFSET $2`
  const sql_params = [NUM_PER_ROWS, NUM_PER_ROWS*(page-1)]

  const {rows} = await db.query(get_sql,sql_params)

  return res.json({
    data: rows.map(row => _.omit(row,['total_count'])),
    total_page: rows.length> 0 ? Math.ceil(rows[0].total_count / NUM_PER_ROWS): 0
  })
}

export default {get_history};