import React from 'react'
import ReactDOM from 'react-dom'
import './style/main.less'
import messages from '../message_1'
import ChatBubble from './ChatBubble'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      participants: messages.participants,
      messages: '',
      unfilteredMessages: messages.messages,
      loading: true,
    }
  }

  decodeFBString = (str, key) => {
    let strArr = []

    if (typeof str === 'string') {
      for (var i = 0; i < str.length; i++) {
        strArr.push(str.charCodeAt(i))
      }
    } else if (key === 'reactions') {
      let test = this.processMessages(str)
      return test
    } else {
      return str
    }

    return Buffer.from(strArr).toString('utf8')
  }

  setContextToShow = key => {
    console.log('setContextToShow' + typeof key)
    this.setState({ contextToShow: key }, () => console.log('Now is the state set'))
  }

  processMessages = messageArray => {
    return messageArray.map(message => this.processMessage(message))
  }

  processMessage = message => {
    let originalMessage = message
    let array = []
    return Object.keys(message).reduce((obj, key) => {
      obj[key] = this.decodeFBString(message[key], key)

      return obj
    }, {})
  }
  componentDidMount() {
    let unfilteredMessages = this.processMessages(this.state.unfilteredMessages)
    const messages = unfilteredMessages.filter(message => message.reactions && message.reactions.length > 3)
    let messagesWithMostReactionsSorted = messages.sort((a, b) => b.reactions.length - a.reactions.length)
    messagesWithMostReactionsSorted.map(message => {
      const index = this.state.unfilteredMessages.findIndex(unfilteredMessage => unfilteredMessage.timestamp_ms === message.timestamp_ms)
      message.index = index
    })
    this.setState({ unfilteredMessages, messages, messagesWithMostReactionsSorted, loading: false })
  }
  render() {
    return (
      <div className="rootroot">
        <div className="container">
          {/* {!this.state.loading &&
            this.state.messages.map(message => {
              const index = this.state.unfilteredMessages.findIndex(
                unfilteredMessage => unfilteredMessage.timestamp_ms === message.timestamp_ms
              )
              const context = this.state.unfilteredMessages.slice(index + 1, index + 6)
              return (
                <div key={message.timestamp_ms}>
                  <Emoji
                    key={this.state.unfilteredMessages[index - 1].timestamp_ms}
                    reactions={[]}
                    message={this.state.unfilteredMessages[index - 1].content}
                    writer={this.state.unfilteredMessages[index - 1].sender_name}
                  />
                  <Emoji
                    key={message.timestamp_ms}
                    reactions={message.reactions}
                    message={message.content}
                    writer={message.sender_name}
                    image={message.photos && message.photos[0]}
                    context={context}
                  />
                </div>
              )
            })} */}
        </div>
        <div className="container">
          <h1>Flest reaktioner</h1>
          {!this.state.loading &&
            this.state.messagesWithMostReactionsSorted.map(message => {
              const context = this.state.unfilteredMessages.slice(message.index, message.index + 8)
              return (
                <ChatBubble
                  key={message.timestamp_ms}
                  timestamp={message.timestamp_ms}
                  reactions={message.reactions}
                  message={message.content}
                  writer={message.sender_name}
                  image={(message.photos && message.photos[0]) || (message.gifs && message.gifs[0])}
                  context={context}
                  contextToShow={this.state.contextToShow}
                  setContextToShow={this.setContextToShow}
                />
              )
            })}
        </div>
      </div>
    )
  }
}

export default App

//ReactDOM.render(<Welcome />, document.getElementById('root'))
