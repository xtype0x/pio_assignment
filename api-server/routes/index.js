import userRoute from "./user"
import lineitemRoute from "./lineitem"
import campaignRoute from "./campaign"
import invoiceRoute from "./invoice"
import historyRoute from "./history"

function wrap (callback) {// for async/await
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}

const login_check = (req,res,next) => {
  if(!req.session.user){
    return res.status(403).json({
      error: 'Not Login'
    })
  }
  return next()
}

const Routes = (app) => {
  app.get('/',(req,res) => res.send(":)"))

  app.post('/login',wrap(userRoute.user_login))
  app.get('/user/status',wrap(userRoute.check_status))

  app.use(login_check) //--- need login api ---
  app.get('/logout', wrap(userRoute.user_logout))

  app.get('/lineitem',wrap(lineitemRoute.get_lineitems))
  app.put('/lineitem/:id',wrap(lineitemRoute.update))
  app.get('/lineitem/search',wrap(lineitemRoute.search))
  app.get('/lineitem/:id/comment',wrap(lineitemRoute.get_comments))
  app.post('/lineitem/:id/comment',wrap(lineitemRoute.create_comment))

  app.get('/campaign',wrap(campaignRoute.get_campaigns))
  app.put('/campaign/:id',wrap(campaignRoute.update))
  app.get('/campaign/search',wrap(campaignRoute.search))

  app.post('/invoice', wrap(invoiceRoute.get_invoice))
  app.post('/invoice/download',wrap(invoiceRoute.download_invoice_file))

  app.get('/history',wrap(historyRoute.get_history))
}

export default Routes;