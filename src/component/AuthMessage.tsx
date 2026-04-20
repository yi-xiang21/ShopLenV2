import { useEffect, useState } from 'react'

type AuthMessageProps = {
  message: string
}

const AuthMessage = ({ message }: AuthMessageProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    if (!message) {
      return
    }

    const resetTimer = window.setTimeout(() => {
      setIsVisible(true)
      setIsFadingOut(false)
    }, 0)

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true)
    }, 9000)

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false)
    }, 10000)

    return () => {
      window.clearTimeout(resetTimer)
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [message])

  if (!message || !isVisible) {
    return null
  }

  return (
    <div
      className={`mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {message}
    </div>
  )
}

export default AuthMessage