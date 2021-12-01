
import axios from "axios/index";
import { withRouter } from 'react-router-dom';
// import Cookies from 'universal-cookie';
// import { v4 as uuid } from 'uuid';
import api from "../../../shared/util/api";
import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';
import { React, useContext, useEffect, useRef, useState } from "react";
// const cookies = new Cookies();


function ChatbotRefactor() {

  // const [state, setState] = useState({
  //   messages: [],
  //   showBot: true,
  //   shopWelcomeSent: false
  // })

  const [messages, setMessages] = useState({messages:[]})
  const [showBot, setShowBot] = useState(true)
  const [shopWelcomeSent, setWelcomeSent] = useState(false)
  const [loading, setLoading] = useState(false)



  const messagesEnd = useRef("")
  let talkInput;
  useEffect(() => {
    df_event_query('Welcome')
    setWelcomeSent(true)
    setShowBot(true)
  }, [])

  useEffect(() => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    if (talkInput) {
      talkInput.focus();
    }
  })


  const df_text_query = async (queryText) => {
    setLoading(true)
    let says = {
      speaks: 'user',
      msg: {
        text: {
          text: queryText
        }
      }
    }
    // setMessages([...messages, says] );
    setMessages({messages: [...messages.messages, says]} );

    // const res = await axios.post('/api/chatbot/df_text_query',  {text: queryText});
    const res = await api({
      url: 'chatbot/df_text_query',
      method: "POST",
      data: { text: queryText }
    })
    for (let msg of res.result.fulfillmentMessages) {
      says = {
        speaks: 'bot',
        msg: msg
      }
      // setMessages([...messages, says] );
      setMessages({messages: [...messages.messages, says]} );
    }
    setLoading(false)
  };
  const df_event_query = async (eventName) => {
    setLoading(true)
    const res = await api({
      url: 'chatbot/df_event_query',
      method: "POST",
      data: { event: eventName }
    })
    for (let msg of res.result.fulfillmentMessages) {
      let says = {
        speaks: 'bot',
        msg: msg
      }
      // setMessages( [...messages, says] );
      setMessages({messages: [...messages.messages, says]} );
    }
    setLoading(false)
  };

  const resolveAfterXSeconds = (x) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    })
  }

  const show = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowBot(true)
  }

  const hide = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowBot(false)
  }

  const handleQuickReplyPayload = (event, payload, text) => {
    event.preventDefault();
    event.stopPropagation();
    switch (payload) {
      case 'recommended_yes':
        df_event_query('SHOW_RECOMMENDATIONS');
        break;
      case 'training_masterclass':
        df_event_query('MASTERCLASS');
        break;
      default:
        df_text_query(text);
        break;
    }
  }


  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      df_text_query(e.target.value);
      e.target.value = '';
    }
  }

  // console.log("messages: ", messages)
  // console.log("messages to re ", messages.map((message, i) => {
  //   console.log("tesst ", message.msg.text.text[i])
  // }) )


  console.log("messages", messages.messages)

  return (
    <>
      <div>
        {!loading && showBot && messages && (<div style={{ minHeight: 500, maxHeight: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray' }}>
          <nav>
            <div className="nav-wrapper">
              <a href="/" className="brand-logo">ChatBot</a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><a href="/" onClick={hide}>Close</a></li>
              </ul>
            </div>
          </nav>
          <div id="chatbot" style={{ minHeight: 388, maxHeight: 388, width: '100%', overflow: 'auto' }}>
           {messages.messages.map((mess, i) => 
             (mess.msg && mess.msg.text && mess.msg.text.text && <Message key={i} speaks={mess.speaks} text={mess.msg.text.text}/>)   
           )}

           {/* {messages.messages.map((mess, i) => 
           (mess.msg && mess.msg.payload.fields.cards && 
             <div key={i}>
               <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{ overflow: 'hidden' }}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{mess.speaks}</a>
                        </div>
                        <div style={{ overflow: 'auto', overflowY: 'scroll' }}>
                            <div style={{ height: 300, width: mess.msg.payload.fields.cards.listValue.values.length * 270 }}>
                                {mess.msg.payload.fields.cards.listValue.values.map((card, i) => (
                                  <Card key={i} payload={card.structValue} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

             </div>
           ))}

          {
            messages.messages.map((mess, i) => (
              mess.msg &&
              mess.msg.payload &&
              mess.msg.payload.fields &&
              mess.msg.payload.fields.quick_replies && (
                <QuickReplies
                text={mess.msg.payload.fields.text ? mess.msg.payload.fields.text : null}
                key={i}
                replyClick={handleQuickReplyPayload}
                speaks={mess.speaks}
                payload={mess.msg.payload.fields.quick_replies.listValue.values}
                />
              )
            ))
          }  */}
          
            <div ref={messagesEnd}
              style={{ float: "left", clear: "both" }}>
            </div>
          </div>
          <div className=" col s12" >
            <input style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%' }} ref={(input) => { talkInput = input; }} placeholder="type a message:" onKeyPress={handleInputKeyPress} id="user_says" type="text" />
          </div>
        </div>
        )}
      </div>

      {!showBot && (
        <div style={{ minHeight: 40, maxHeight: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray' }}>
          <nav>
            <div className="nav-wrapper">
              <a href="/" className="brand-logo">ChatBot</a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><a href="/" onClick={show}>Show</a></li>
              </ul>
            </div>
          </nav>
          <div ref={(el) => { messagesEnd = el; }}
            style={{ float: "left", clear: "both" }}>
          </div>
        </div>
      )}


    </>
  )
}

export default ChatbotRefactor

