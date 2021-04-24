import _ from "lodash"
import db from "../db"

const NUM_PER_ROWS = 20

const get_lineitems = async (req,res) => {
  const page = +(req.query.page || 1)
  const is_archived = (req.query.is_archived === '1')
  if(isNaN(page)){
    return res.status(403).json({error: "Parameter `page` is not valid"})
  }
  const get_sql = `SELECT L.*, C.name AS campaign_name, COUNT(LC.*) AS comment_count, COUNT(L.*) OVER() AS total_count
    FROM Lineitems L LEFT JOIN LineitemComments LC ON L.id = LC.lineitem_id
    LEFT JOIN Campaigns C on L.campaign_id = C.id
    GROUP BY (L.id,C.id) HAVING L.is_archived = $1 ORDER BY L.id LIMIT $2 OFFSET $3`
  const sql_params = [is_archived, NUM_PER_ROWS, NUM_PER_ROWS*(page-1)]

  const {rows} = await db.query(get_sql,sql_params)

  let respond = {
    data: rows.map(row => _.omit(row,['total_count'])),
    total_count: rows.length> 0 ? rows[0].total_count: 0,
    total_page: rows.length> 0 ? Math.ceil(rows[0].total_count / NUM_PER_ROWS): 0
  }
  return res.json(respond)
}

const search = async (req,res) => {
  const q = req.query.q || ''
  if(q === '')
    return res.json([])
  const search_sql = "SELECT id, name FROM Lineitems WHERE name LIKE $1 ORDER BY name ASC LIMIT 50"
  const sql_params = ['%'+q+'%']

  const {rows} = await db.query(search_sql,sql_params)

  return res.json(rows)
}

export default {get_lineitems,search}