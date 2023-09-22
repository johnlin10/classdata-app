import React, { useEffect } from 'react'
import {
  getMessaging,
  getToken,
  subscribeToTopic,
  unsubscribeFromTopic,
} from 'firebase/messaging'

const messaging = getMessaging()

function subscribe() {
  getToken(messaging, {
    vapidKey:
      'BIY9Dq4ACOsylekh3P3pfereOP0O3Bb-LLBrlV8yBE1huNq672CDDDE8rtVMweLVZi8lAFXUTMdcDBmgkUIzrn4',
  })
    .then((currentToken) => {
      if (currentToken) {
        subscribeToTopic(messaging, currentToken, 'courseSch')
          .then(() => {
            console.log('Subscribed to topic')
            localStorage.setItem('courseSchSubscribed', 'true')
          })
          .catch((err) => {
            console.log('Error subscribing to topic:', err)
          })
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.'
        )
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
    })
}

function unsubscribe() {
  getToken(messaging, {
    vapidKey:
      'BIY9Dq4ACOsylekh3P3pfereOP0O3Bb-LLBrlV8yBE1huNq672CDDDE8rtVMweLVZi8lAFXUTMdcDBmgkUIzrn4',
  })
    .then((currentToken) => {
      if (currentToken) {
        unsubscribeFromTopic(messaging, currentToken, 'courseSch')
          .then(() => {
            console.log('Unsubscribed from topic')
            localStorage.setItem('courseSchSubscribed', 'false')
          })
          .catch((err) => {
            console.log('Error unsubscribing from topic:', err)
          })
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.'
        )
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
    })
}

export default function SubscribeCourseSch() {
  const [isSubscribed, setIsSubscribed] = useState(
    localStorage.getItem('courseSchSubscribed') === 'true'
  )
  useEffect(() => {
    setIsSubscribed(localStorage.getItem('courseSchSubscribed') === 'true')
  }, [localStorage.getItem('courseSchSubscribed')])
  return (
    <div>
      {isSubscribed ? (
        <button onClick={unsubscribe}>取消訂閱</button>
      ) : (
        <button onClick={subscribe}>訂閱</button>
      )}
    </div>
  )
}
