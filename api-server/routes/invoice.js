import _ from "lodash"
import db from "../db"
import {gen_sql_values, check_options} from "../lib/invoice"

const NUM_PER_ROWS = 20;

const get_invoice = async (req,res) => {
  let options = req.body || {}

  //check options
  const {valid, message} = check_options(options)
  if(!valid){
    return res.status(403).json(message)
  }

  const {sql, values} = gen_sql_values(options)

  const {rows} = await db.query(sql,values)

  let respond = {
    data: rows.map(row => {
      row = _.omit(row,['total_count','grand_total'])
      row.sub_total = +row.sub_total
      return row
    }),
    grand_total: rows.length> 0 ? +rows[0].grand_total: 0,
    total_count: rows.length> 0 ? rows[0].total_count: 0,
    total_page: rows.length> 0 ? Math.ceil(rows[0].total_count / NUM_PER_ROWS): 0
  }
  return res.json(respond)
}



export default {get_invoice}