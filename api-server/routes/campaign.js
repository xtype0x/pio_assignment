import _ from "lodash"
import db from "../db"

const NUM_PER_ROWS = 20

const get_campaigns = async (req,res) => {
  const page = +(req.query.page || 1)
  const orderBy = req.query.orderBy
  const reverseOrder = req.query.reverseOrder === '1'
  if(isNaN(page)){
    return res.status(403).json({error: "Parameter `page` is not valid"})
  }
  const ORDERBY_QUERY = {
    'id': "C.id",
    'name': "C.name",
    'is_reviewed': "C.is_reviewed",
    'lineitem_count': "lineitem_count"
  }
  const get_sql = `SELECT C.*,COUNT(L.*) AS lineitem_count , COUNT(C.*) OVER() AS total_count
    FROM Campaigns C LEFT JOIN Lineitems L ON C.id = L.campaign_id
    GROUP BY C.id ORDER BY ${ORDERBY_QUERY[orderBy]} ${reverseOrder?"DESC":"ASC"} LIMIT $1 OFFSET $2`
  const sql_params = [ NUM_PER_ROWS, NUM_PER_ROWS*(page-1)]

  const {rows} = await db.query(get_sql,sql_params)

  let respond = {
    data: rows.map(row => _.omit(row,['total_count'])),
    total_count: rows.length> 0 ? rows[0].total_count: 0,
    total_page: rows.length> 0 ? Math.ceil(rows[0].total_count / NUM_PER_ROWS): 0
  }
  return res.json(respond)
}

const update = async (req,res) => {
  const cid = req.params.id;
  const updateData = _.pick(req.body,['is_reviewed'])

  //check cid
  const sel_sql = "SELECT * FROM Campaigns WHERE id = $1"
  const result = await db.query(sel_sql,[cid])
  const users = result.rows;
  if(users.length == 0){
    return res.status(403).json({
      message: "Campaign not found"
    })
  }else{
    const user = users[0]
    if(user.is_reviewed){
      return res.status(403).json({
        message: "Reviewed campaign can't be edited"
      })
    }
  }

  const update_sql = "UPDATE Campaigns SET is_reviewed = $1 WHERE id = $2 RETURNING *"
  const sql_params = [updateData.is_reviewed, cid]

  const {rows} = await db.query(update_sql,sql_params)

  return res.json({
    message: "success",
    campaign: rows[0]
  })
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

export default {get_campaigns,search,update}