import _ from "lodash"
import db from "../db"
import {save_history} from "../lib/history"

const NUM_PER_ROWS = 20

const get_lineitems = async (req,res) => {
  const page = +(req.query.page || 1)
  const is_archived = (req.query.is_archived === '1')
  const orderBy = req.query.orderBy
  const reverseOrder = req.query.reverseOrder === '1'
  if(isNaN(page)){
    return res.status(403).json({error: "Parameter `page` is not valid"})
  }
  const ORDERBY_QUERY = {
    'id': "L.id",
    'name': "L.name",
    'is_reviewed': "L.is_reviewed",
    'campaign_name': "campaign_name",
    'booked_amount': "L.booked_amount",
    'actual_amount': "L.actual_amount",
    'adjustments': "adjustments",
    'comment_count': "comment_count"
  }
  const get_sql = `SELECT L.*, C.name AS campaign_name, COUNT(LC.*) AS comment_count, COUNT(L.*) OVER() AS total_count
    FROM Lineitems L LEFT JOIN LineitemComments LC ON L.id = LC.lineitem_id
    LEFT JOIN Campaigns C on L.campaign_id = C.id
    GROUP BY (L.id,C.id) HAVING L.is_archived = $1 ORDER BY ${ORDERBY_QUERY[orderBy]} ${reverseOrder?"DESC":"ASC"} LIMIT $2 OFFSET $3`
  const sql_params = [is_archived, NUM_PER_ROWS, NUM_PER_ROWS*(page-1)]

  const {rows} = await db.query(get_sql,sql_params)

  let respond = {
    data: rows.map(row => _.omit(row,['total_count'])),
    total_count: rows.length> 0 ? rows[0].total_count: 0,
    total_page: rows.length> 0 ? Math.ceil(rows[0].total_count / NUM_PER_ROWS): 0
  }
  return res.json(respond)
}

const update = async (req,res) => {
  const lid = req.params.id;
  const updateData = _.pick(req.body,['is_reviewed','is_archived','adjustments'])

  if(_.isEmpty(updateData)){
    return res.status(403).json({
      message: "No data to update"
    })
  }

  //check lid
  const sel_sql = "SELECT * FROM Lineitems WHERE id = $1"
  const result = await db.query(sel_sql,[lid])
  const lineitems = result.rows;
  if(lineitems.length == 0){
    return res.status(403).json({
      message: "Lineitem not found"
    })
  }else{
    const lineitem = lineitems[0]
    if(lineitem.is_reviewed && updateData.adjustments){
      return res.status(403).json({
        message: "Reviewed lineitem can't be edited"
      })
    }else if(lineitem.is_archived){
      return res.status(403).json({
        message: "Archived lineitem can't be edited"
      })
    }
  }

  let set_sql = [],i=1,sql_params = []
  _.forIn(updateData, (v,k) => {
    set_sql.push(k+" = $"+i++)
    sql_params.push(v)
  })
  sql_params.push(lid)
  const update_sql = `UPDATE Lineitems SET ${set_sql.join(", ")} WHERE id = $${i} RETURNING *`

  const {rows} = await db.query(update_sql,sql_params)

  //save history
  await save_history(req,"update_lineitem",{
    lineitem_id: lineitems[0].id,
    lineitem_name: lineitems[0].name,
    params: updateData
  })

  return res.json({
    message: "success",
    lineitem: rows[0]
  })
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

const get_comments = async (req,res) => {
  const lid = req.params.id;

  const get_sql = "SELECT LC.*, U.name AS user_name FROM LineitemComments LC LEFT JOIN Users U ON LC.user_id = U.id WHERE LC.lineitem_id = $1 ORDER BY LC.created_at"
  const sql_params = [lid]

  const {rows} = await db.query(get_sql,sql_params)

  return res.json(rows)
}

const create_comment = async (req,res) => {
  const lid = req.params.id;
  const user_id = req.session.user.id
  const content = req.body.content

  //check lid
  const sel_sql = "SELECT * FROM Lineitems WHERE id = $1"
  const result = await db.query(sel_sql,[lid])
  const lineitems = result.rows;
  if(lineitems.length == 0){
    return res.status(403).json({
      message: "Lineitem not found"
    })
  }

  const insert_sql = "INSERT INTO LineitemComments (lineitem_id,user_id,content) VALUES ($1,$2,$3) returning *"
  const sql_params = [lid,user_id,content] 

  const {rows} = await db.query(insert_sql,sql_params)

  var newComment = rows[0]
  newComment.user_name = req.session.user.name

  //save history
  await save_history(req,"create_comment",{
    lineitem_id: lineitems[0].id,
    lineitem_name: lineitems[0].name,
    comment: newComment
  })

  return res.json({
    message: "success",
    comment: newComment
  })
}

export default {
  get_lineitems,
  search,
  update,
  get_comments,
  create_comment
}
