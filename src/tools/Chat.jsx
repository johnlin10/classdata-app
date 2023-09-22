// React
import React, { useState } from 'react'
// Icon Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Configuration, OpenAIApi } from 'openai'

function Chat(props) {
  const { Configuration, OpenAIApi } = require('openai')

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API,
  })
  const openai = new OpenAIApi(configuration)

  const handleInput = async (e) => {
    e.preventDefault()
    setMessages([...messages, { text: input, user: true }])
    setInput('')

    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo-0301',
      prompt: messages,
      temperature: 0.9,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['你', ' ChatGPT:'],
    })

    setMessages([...messages, { text: response.choices[0].text, user: false }])
  }

  // Chat 狀態
  const [chatActive, setChatActive] = useState(true)
  const closeOpenChat = () => {
    setChatActive((prevActive) => !prevActive)
  }

  return (
    <>
      <div
        className={`closeOpenChat ${chatActive ? 'open' : ''}`}
        // style={{ display: props.betaVersion ? '' : 'none' }}
        onClick={closeOpenChat}>
        {chatActive ? (
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-comments" />
        )}
      </div>
      <div
        id="chat"
        className={`${chatActive ? 'open' : ''}`}
        // style={{ display: props.betaVersion ? '' : 'none' }}
      >
        {/* <div className="chat-header">
          <h3>與 chatgpt 對話</h3>
        </div> */}
        <div id="chatContent">
          {/* 使用 map 方法遍歷 chatHistory 數組，根據用戶類型渲染不同的消息元素 */}
          {messages.map((message, index) => (
            <div key={index} className={`${message.user ? 'user' : 'chat'}`}>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        <form id="chatForm" onSubmit={handleInput}>
          <input
            className="chatInput"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat 無法給予回應..."
          />
          <button className="chatSubmit" type="submit">
            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
          </button>
        </form>
      </div>
    </>
  )
}

export default Chat
