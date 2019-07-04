import React from 'react'
import ContextChatBubble from './ContextChatBubble'
import './style/main.less'

class Context extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className={this.props.className}>
        {this.props.context
          .map(message => (
            <ContextChatBubble
              key={message.timestamp_ms}
              reactions={message.reactions || []}
              message={message.content}
              writer={message.sender_name}
              image={message.photos && message.photos[0]}
            />
          ))
          .reverse()}
      </div>
    )
  }
}

export default Context
