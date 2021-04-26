import _ from "lodash"
import fs from "fs"
import path from "path"
import db from "../db"
import {gen_sql_values, check_options, generate_csv, generate_xlsx} from "../lib/invoice"
import {save_history} from "../lib/history"

const NUM_PER_ROWS = 20;

const get_invoice = async (req,res) => {
  const options = req.body || {}

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

  //save history
  await save_history(req,"get_invoice",{
    options: options,
    grand_total: +rows[0].grand_total,
    rows_num: rows.length
  })

  return res.json(respond)
}

const download_invoice_file = async (req,res) => {
  const options = req.body.options || {}
  const file_type = req.body.file_type

  if(["csv","xlsx"].indexOf(file_type) == -1){
    return res.status(403).json({
      message: "file type not valid"
    })
  }

  //check options
  const {valid, message} = check_options(options)
  if(!valid){
    return res.status(403).json(message)
  }

  const {sql, values} = gen_sql_values(options)

  const {rows} = await db.query(sql,values)

  const {file,filename,contentType} = file_type === "csv"?generate_csv(options,rows):generate_xlsx(options,rows)

  //save history
  await save_history(req,"download_invoice",{
    options: options,
    file_type: file_type
  })

  res.header('Content-Type', contentType);
  return res.attachment(filename).end(file,'binary')
}

const get_history = async (req,res) => {
  const uid = req.session.user.id
  const get_sql = `SELECT *
    FROM History
    WHERE user_id = $1 AND type IN ('get_invoice','download_invoice')
    ORDER BY created_at DESC LIMIT 10`
  const sql_params = [uid]

  const {rows} = await db.query(get_sql,sql_params)

  return res.json(rows)
}

export default {get_invoice,download_invoice_file,get_history}