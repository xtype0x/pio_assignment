const HistoryLogFormatter = (props) => {
  const log = props.log, type= props.type
  let FormatLog
  switch(type){
    case "review_campaign":
      FormatLog= (
        <div>
          Reviewed Campaign <mark style={{background:"#cecece"}}><i>{log.campaign_name}</i></mark>
        </div>
      )
      break
    case "update_lineitem":
      if(log.params.is_reviewed)
        FormatLog= (
          <div>
            Reviewed Line-item <mark style={{background:"#cecece"}}><i>{log.lineitem_name}</i></mark>
          </div>
        )
      else if(log.params.is_archived){
        FormatLog= (
          <div>
            Archived Line-item <mark style={{background:"#cecece"}}><i>{log.lineitem_name}</i></mark>
          </div>
        )
      }else if(log.params.adjustments !== undefined){
        FormatLog= (
          <div>
            Edit Line-item <mark style={{background:"#cecece"}}>{log.lineitem_name}</mark> adjustments to {log.params.adjustments}
          </div>
        )
      }
      break
    case "create_comment":
      FormatLog= (
        <div>
          Comment on line-item <mark style={{background:"#cecece"}}><i>{log.lineitem_name}</i></mark>
        </div>
      )
      break
    case "get_invoice":
      FormatLog= (
        <div>
          Get invoice
          <div>Filter code: <code style={{background:"#cecece"}}>{JSON.stringify(log.options)}</code></div>
        </div>
      )
      break
    case "download_invoice":
      FormatLog= (
        <div>
          Download invoice {log.file_type.toUpperCase()} file
          <div>Filter code: <code style={{background:"#cecece"}}>{JSON.stringify(log.options)}</code></div>
        </div>
      )
      break
    default:
      FormatLog= <div />
      break
  }
  return FormatLog
}

export default HistoryLogFormatter