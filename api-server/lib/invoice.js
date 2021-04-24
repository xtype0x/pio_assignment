import _ from "lodash"

const NUM_PER_ROWS = 20;

export const gen_sql_values = (options) => {
  let sql = "", values = []

  //select
  let select_sql = `SELECT ${options.group_by_campaign?"":"L.name,"} C.name AS campaign_name, 
    ${options.group_by_campaign?"SUM":""}(L.actual_amount + L.adjustments) AS sub_total,
    ${options.group_by_campaign?"SUM(SUM(L.actual_amount + L.adjustments))":"SUM(L.actual_amount + L.adjustments)"} OVER() AS grand_total,
    COUNT(*) OVER() AS total_count`

  //filter
  let filter_sub_query = "SELECT * FROM Lineitems", query_filter = ["is_archived = FALSE"]
  if(options.filter_by_lineitem){
    values.push(options.filter_by_lineitem)
    query_filter.push(`id = ANY ($${values.length})`)
  }
  if(options.filter_by_campaign){
    values.push(options.filter_by_campaign)
    query_filter.push(`campaign_id = ANY ($${values.length})`)
  }
  if(query_filter.length > 0){
    filter_sub_query += ` WHERE ${query_filter.join(" AND ")}`
  }

  sql = `${select_sql} FROM (${filter_sub_query}) L LEFT JOIN Campaigns C ON L.campaign_id = C.id`

  if(options.group_by_campaign){
    sql += " GROUP BY C.id"
  }

  return {
    sql: sql,
    values: values
  }
}

export const check_options= (options) => {
  const VALIDOPTIONS = ['filter_by_lineitem','filter_by_campaign','group_by_campaign']
  let message = "", is_valid = true
  for(let opt in options){
    if(VALIDOPTIONS.indexOf(opt) == -1){
      is_valid = false
      message = `'${opt}' is not valid option`
      break
    }
  }
  return {
    valid: is_valid,
    message: message
  }
}