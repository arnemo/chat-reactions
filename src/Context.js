import React from 'react'
import ContextChatBubble from './ContextChatBubble'
import './style/main.less'

class Context extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    console.log('context' + JSON.stringify(this.props.context));
    return (
      <div>
        {this.props.context
          .map(message => (
            <div className="margin-bottom">
              <ContextChatBubble
                className="margin-bottom"
                key={message.timestamp_ms}
                timestamp={message.timestamp_ms}
                reactions={message.reactions || []}
                message={message.content}
                writer={message.sender_name}
                image={message.photos && message.photos[0]}
              />
            </div>
          ))
          .reverse()}
      </div>
    )
  }
}

export default Context
