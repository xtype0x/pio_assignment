import _ from "lodash"
import db from "../db"

const NUM_PER_ROWS = 20

const get_campaigns = async (req,res) => {
  const page = +(req.query.page || 1)
  if(isNaN(page)){
    return res.status(403).json({error: "Parameter `page` is not valid"})
  }
  const get_sql = `SELECT C.*,COUNT(L.*) AS lineitem_count , COUNT(C.*) OVER() AS total_count
    FROM Campaigns C LEFT JOIN Lineitems L ON C.id = L.campaign_id
    GROUP BY C.id ORDER BY C.id LIMIT $1 OFFSET $2`
  const sql_params = [ NUM_PER_ROWS, NUM_PER_ROWS*(page-1)]

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
  const search_sql = "SELECT id, name FROM Campaigns WHERE name LIKE $1 ORDER BY name ASC LIMIT 50"
  const sql_params = ['%'+q+'%']

  const {rows} = await db.query(search_sql,sql_params)

  return res.json(rows)
}

export default {get_campaigns,search}