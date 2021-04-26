const HistoryLogFormatter = (props) => {
  const log = props.log, type= props.type
  switch(type){
    case "review_campaign":
      return (
        <div>
          Reviewed Campaign <mark style={{background:"#cecece"}}><i>{log.campaign_name}</i></mark>
        </div>
      )
    case "update_lineitem":
      if(log.params.is_reviewed)
        return (
          <div>
            Reviewed Line-item <mark style={{background:"#cecece"}}><i>{log.lineitem_name}</i></mark>
          </div>
        )
      else if(log.params.is_archived){
        return (
          <div>
            Archived Line-item <mark style={{background:"#cecece"}}><i>{log.lineitem_name}</i></mark>
          </div>
        )
      }else if(log.params.adjustments != undefined){
        return (
          <div>
            Edit Line-item <mark style={{background:"#cecece"}}>{log.lineitem_name}</mark> adjustments to {log.params.adjustments}
          </div>
        )
      }
    case "create_comment":
      return (
        <div>
          Comment on line-item <mark style={{background:"#cecece"}}><i>{log.lineitem_name}</i></mark>
        </div>
      )
    case "get_invoice":
      return (
        <div>
          Get invoice
          <div>Filter code: <code style={{background:"#cecece"}}>{JSON.stringify(log.options)}</code></div>
        </div>
      )
    case "download_invoice":
      return (
        <div>
          Download invoice {log.file_type.toUpperCase()} file
          <div>Filter code: <code style={{background:"#cecece"}}>{JSON.stringify(log.options)}</code></div>
        </div>
      )
    default:
      return <div />
  }
}

export default HistoryLogFormatter