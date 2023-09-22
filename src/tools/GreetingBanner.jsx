import React, { useEffect, useState } from 'react'

const greetings = {
  earlyMorning: ['是剛起床？還是剛想睡？', '早安，這麼早就醒了？'],
  earlyMorning2: ['起得這麼早？！', '太陽都還沒出來呢！', '嗚～我還想睡～'],
  morning: [
    '早安啊！',
    '早上好',
    '早安，今天有什麼計畫嗎？',
    '早安，新的一天開始了！',
    '祝你有個愉快的早晨！',
    '新的一天，新的希望！',
    '早餐吃了嗎？',
    '祝你今天一切順利！',
  ],
  morning2: ['才剛開始就累了～', '保持動力！加油！'],
  morningNoon: ['午餐吃什麼呢？', '午餐時間快到啦！'],
  afternoon: [
    '午安！',
    '中午好',
    '加油！一天過一半了！',
    '今天過半了，繼續加油！',
    '祝你度過愉快的下午！',
    '早上過得怎麼樣？',
    '該吃午餐嘍～',
    '吃午餐了嗎？',
    '休息一下，繼續加油！',
    '中午好，有什麼好吃的？',
    '下午好，一天的計畫完成得如何？',
  ],
  afternoon2: [
    '下午好啊！',
    '下午好！',
    '不會還沒吃午餐吧？',
    '下午繼續加油啊！',
    '今天還剩下幾個小時，繼續努力！',
    '下午好，開始疲憊了嗎？',
  ],
  afternoon3: [
    '下午好啊！',
    '下午好！',
    '就快結束了，加油！',
    '現在感覺有點疲累～',
  ],
  evening: [
    '晚餐吃什麼好呢？',
    '晚餐時間到！',
    '結束了一天，放鬆一下～',
    '晚安，今天過得好嗎？',
  ],
  evening2: [
    '晚上好啊！',
    '晚上好！',
    '晚安，今天過得好嗎？',
    '晚上有什麼計畫呢？',
    '祝你有個愉快的夜晚！',
    '晚安，今天辛苦了！',
    '今天過得怎麼樣？',
    '晚上好，今晚好好度過～',
  ],
  evening3: ['不早了，準備睡覺啦～', '晚安，今晚過得如何？'],
  night: [
    '晚安～祝你有個美夢！',
    '該睡覺嘍～晚安～',
    '今晚很美好，對吧？',
    '不早了，準備睡覺啦～',
    '晚安，今晚過得如何？',
  ],
  night2: [
    '晚安～祝你有個美夢！',
    '這麼晚了，還不睡啊？',
    '還不趕緊洗洗睡，晚安～',
    '能撐到現在，你也是很厲害！',
    '還在滑手機？洗洗睡去！',
    '你在幹什麼大事業啊？',
  ],
  night3: [
    '這時間...該睡了吧～',
    '夜貓子，在幹什麼大事業啊？',
    '你在幹什麼大事業啊？',
  ],
}
const specialDate = {
  five: [''],
  six: [''],
  eight: [''],
  ten: [''],
}

export default function GreetingBanner(props) {
  const [greeting, setGreeting] = useState('')
  const [specialDate, setSpecialDate] = useState(false)
  useEffect(() => {
    const date = new Date()
    const hour = date.getHours()
    let greetingMsg = ''
    const day = date.getDay()

    if (specialDate) {
    } else if (day === 0 || day === 6) {
      setGreeting('放假啦～')
    } else {
      if (hour >= 4 && hour < 6) {
        greetingMsg =
          greetings.earlyMorning2[
            Math.floor(Math.random() * greetings.earlyMorning2.length)
          ]
      } else if (hour >= 6 && hour < 8) {
        greetingMsg =
          greetings.morning[
            Math.floor(Math.random() * greetings.morning.length)
          ]
      } else if (hour >= 8 && hour < 11) {
        greetingMsg =
          greetings.morning2[
            Math.floor(Math.random() * greetings.morning2.length)
          ]
      } else if (hour >= 11 && hour < 12) {
        greetingMsg =
          greetings.morningNoon[
            Math.floor(Math.random() * greetings.morningNoon.length)
          ]
      } else if (hour >= 12 && hour < 13) {
        greetingMsg =
          greetings.afternoon[
            Math.floor(Math.random() * greetings.afternoon.length)
          ]
      } else if (hour >= 13 && hour < 14) {
        greetingMsg =
          greetings.afternoon[
            Math.floor(Math.random() * greetings.afternoon.length)
          ]
      } else if (hour >= 14 && hour < 17) {
        greetingMsg =
          greetings.afternoon3[
            Math.floor(Math.random() * greetings.afternoon3.length)
          ]
      } else if (hour >= 17 && hour < 19) {
        greetingMsg =
          greetings.evening[
            Math.floor(Math.random() * greetings.evening.length)
          ]
      } else if (hour >= 19 && hour < 21) {
        greetingMsg =
          greetings.evening2[
            Math.floor(Math.random() * greetings.evening2.length)
          ]
      } else if (hour >= 21 && hour < 22) {
        greetingMsg =
          greetings.evening3[
            Math.floor(Math.random() * greetings.evening3.length)
          ]
      } else if (hour >= 22 && hour < 24) {
        greetingMsg =
          greetings.night[Math.floor(Math.random() * greetings.night.length)]
      } else if (hour >= 0 && hour < 2) {
        greetingMsg =
          greetings.night2[Math.floor(Math.random() * greetings.night2.length)]
      } else if (hour >= 2 && hour < 4) {
        greetingMsg =
          greetings.night3[Math.floor(Math.random() * greetings.night3.length)]
      } else if (hour >= 4 && hour < 5) {
        greetingMsg =
          greetings.earlyMorning[
            Math.floor(Math.random() * greetings.earlyMorning.length)
          ]
      }
      setGreeting(greetingMsg)
    }
  }, [specialDate])
  return (
    <div id="GreetingBanner" className={`${props.isTop ? 'scrollTop' : ''}`}>
      <div>
        <h1>{greeting}</h1>
      </div>
    </div>
  )
}
