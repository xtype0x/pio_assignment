import db from "../db"

const user_login = async (req,res) => {
  const name = req.body.name

  if(!name){
    return res.status(403).json({
      message: "Missing parameter name"
    })
  }
  const {rows} = await db.query("SELECT * FROM Users WHERE name = $1",[name])
  let is_new = false;
  if(rows.length == 0){//create new user by name
    const new_user_sql = "INSERT INTO Users (name) VALUES ($1) RETURNING *"
    const result = await db.query(new_user_sql,[name])
    is_new = true;
    req.session.user = result.rows[0]
  }else{
    req.session.user = rows[0]
  }
  return res.json({user:req.session.user,is_new: is_new})
}

const user_logout = async (req,res) => {
  req.session.destroy();
  res.json({message: "logout"})
}

const check_status = async (req,res) => {
  return res.json(req.session.user?{user: req.session.user}:{message: "Not login"})
}

export default {user_login,user_logout,check_status}