import React from 'react';
import './style/main.less';
import ChatBubble from './ChatBubble';
import Context from './Context';


class Highscore extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { reaction: '😆', messages: props.messages, unfilteredMessages: props.unfilteredMessages }
  }

  compressArray = original => {
    var compressed = []
    // make a copy of the input array
    var copy = original.slice(0)

    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0
      var actors = []
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i] && copy[w] && original[i].reaction == copy[w].reaction) {
          // increase amount of times duplicate is found
          myCount++
          actors.push(copy[w].actor)
          // sets item to undefined
          delete copy[w]
        }
      }

      if (myCount > 0) {
        var a = new Object()
        a.value = original[i]
        a.value.actors = actors
        a.count = myCount
        compressed.push(a)
      }
    }
    //console.log(compressed)
    return compressed
  }
  componentDidMount() {
    // const messages = this.state.messages.map(message => {
    //   message.reactions = this.compressArray(message.reactions)
    //   return message
    // })
    // console.log(messages)
    // this.setState({ messages })
  }

  onChange = () => {
    const value = event.target.value
    this.setState({ reaction: value })
  }

  setContextToShow = (key, contentIndex) => {
    console.log('setContextToShow ' + typeof key)
    // console.log('contentIndex '+contentIndex);
    if (contentIndex === this.state.contentIndex) {
      this.setState({ contentIndex: null }, () => console.log('Now is the state set'))
    } else {
      this.setState({ contextToShow: key, contentIndex }, () => console.log('Now is the state set'))
    }
  }
  render() {
    console.log(
      this.state.messages
        .filter(message => message.reactions.some(reaction => reaction.reaction === this.state.reaction))
        .sort((messageA, messageB) => {
          const a = this.compressArray(messageA.reactions).find(reaction => reaction.value.reaction === this.state.reaction)
          const b = this.compressArray(messageB.reactions).find(reaction => reaction.value.reaction === this.state.reaction)
          return b.count - a.count
        })
    )

    return (
      <div>
        <h1>High scores</h1>
        <select value={this.state.reaction} onChange={this.onChange}>
          <option value="😆">😆</option>
          <option value="😍">😍</option>
          <option value="😮">😮</option>
          <option value="👍">👍</option>
          <option value="👎">👎</option>
          <option value="😢">😢</option>
          <option value="😠">😠</option>
          <option value="❤">❤</option>
        </select>
        <div className="row">
          <div>
            {this.state.messages &&
              this.state.messages
                .filter(message => message.reactions.some(reaction => reaction.reaction === this.state.reaction))
                .sort((messageA, messageB) => {
                  const a = this.compressArray(messageA.reactions).find(reaction => reaction.value.reaction === this.state.reaction)
                  const b = this.compressArray(messageB.reactions).find(reaction => reaction.value.reaction === this.state.reaction)
                  return b.count - a.count
                })
                .map(message => (
                  <ChatBubble
                    key={message.timestamp_ms}
                    timestamp={message.timestamp_ms}
                    reactions={message.reactions}
                    message={message.content}
                    writer={message.sender_name}
                    image={(message.photos && message.photos[0]) || (message.gifs && message.gifs[0])}
                    //context={context}
                    contextToShow={this.state.contextToShow}
                    setContextToShow={this.setContextToShow}
                    index={message.index}
                  />
                ))}
          </div>
          <div className={`${this.state.contentIndex ? 'fadeIn' : 'fadeOut'} sticky`}>
            <h1>Context</h1>
            <Context
              //className={`${this.state.contentIndex ? 'fadeIn' : 'fadeOut'} sticky`}
              context={
                this.state.contentIndex ? this.state.unfilteredMessages.slice(this.state.contentIndex- 4, this.state.contentIndex ) : []
              }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Highscore
