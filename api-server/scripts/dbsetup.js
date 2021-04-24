import fs from "fs"
import path from "path"
import {Client} from "pg";
import dotenv from "dotenv"

dotenv.config()

const client = new Client()

async function main(){
  await client.connect()
  //create tables
  const create_user_sql = "CREATE TABLE IF NOT EXISTS Users (id SERIAL PRIMARY KEY, name VARCHAR(30) NOT NULL);"
  const create_campaign_sql = "CREATE TABLE IF NOT EXISTS Campaigns (\
    id INT PRIMARY KEY NOT NULL,\
    name VARCHAR(256) NOT NULL,\
    is_reviewed BOOLEAN DEFAULT FALSE\
    );"
  const create_lineitem_sql = "CREATE TABLE IF NOT EXISTS Lineitems(\
    id INT PRIMARY KEY NOT NULL,\
    campaign_id INT NOT NULL,\
    name VARCHAR(256) NOT NULL,\
    booked_amount DECIMAL NOT NULL,\
    actual_amount DECIMAL NOT NULL,\
    adjustments DECIMAL NOT NULL,\
    is_reviewed BOOLEAN DEFAULT FALSE,\
    is_archived BOOLEAN DEFAULT FALSE,\
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id)\
    );"
  const create_lineitem_comments_sql = "CREATE TABLE IF NOT EXISTS LineitemComments(\
    id SERIAL PRIMARY KEY,\
    user_id INT NOT NULL,\
    lineitem_id INT NOT NULL,\
    content TEXT NOT NULL,\
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    FOREIGN KEY (user_id) REFERENCES Users(id),\
    FOREIGN KEY (lineitem_id) REFERENCES Lineitems(id)\
    );"
  const create_history_sql = "CREATE TABLE IF NOT EXISTS History(\
    id SERIAL PRIMARY KEY,\
    type VARCHAR(30) NOT NULL,\
    user_id INT NOT NULL,\
    log JSON,\
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\
    );"
  await client.query(create_user_sql)
  await client.query(create_campaign_sql)
  await client.query(create_lineitem_sql)
  await client.query(create_lineitem_comments_sql)
  await client.query(create_history_sql)
  console.log("Create tables done.")

  //insert lineitems and campaigns
  const data_path = path.join(__dirname, '../../placements_teaser_data.json')
  if(!fs.existsSync(data_path)){
    console.log("[Warning] placements_teaser_data.json not found!")
  }else{
    const rawdata = fs.readFileSync(data_path);
    const data = JSON.parse(rawdata)
    let lineitem_values = [], campaign_values = [], campaignids = new Set();
    for(let i=0;i<data.length;i++){
      const row = data[i]
      if(!campaignids.has(row.campaign_id)){
        campaignids.add(row.campaign_id)
        campaign_values.push(row.campaign_id)
        campaign_values.push(row.campaign_name)
      }
      lineitem_values = lineitem_values.concat([row.id,row.campaign_id,row.line_item_name,row.booked_amount,row.actual_amount,row.adjustments])
    }

    function expand(rowCount, columnCount, startAt=1){
      var index = startAt
      return Array(rowCount).fill(0).map(v => `(${Array(columnCount).fill(0).map(v => `$${index++}`).join(", ")})`).join(", ")
    }
    const insert_campaign_sql = "INSERT INTO Campaigns (id,name) VALUES "+expand(campaign_values.length/2,2)
    const insert_lineitems_sql = "INSERT INTO Lineitems(id,campaign_id,name,booked_amount,actual_amount,adjustments) VALUES "+expand(lineitem_values.length/6,6)

    await client.query(insert_campaign_sql,campaign_values)
    await client.query(insert_lineitems_sql,lineitem_values)

    console.log("Insert campaigns and lineitems done.")
  }

  await client.end()
}

main()