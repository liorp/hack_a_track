import React, { useEffect, useRef } from 'react'
import Typography from '@material-ui/core/Typography'

interface CountdownProps {
  to: Date
}

export default function Countdown ({ to }: CountdownProps): JSX.Element {
  const countdownText = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Update the count down every 10 milliseconds
    const x = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance: number = new Date(to).getTime() - now

      // Time calculations for days, hours, minutes, seconds and milliseconds
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
      const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
      const milliseconds = Math.floor(distance % 1000).toString().padStart(3, '0')

      // Display the result in the element with id="demo"
      if ((countdownText?.current) != null) {
        countdownText.current.innerHTML = hours + 'h:' +
                    minutes + 'm:' + seconds + 's:' + milliseconds + 'ms '
      }

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x)
        if ((countdownText?.current) != null) {
          countdownText.current.innerHTML = 'ENDED'
          countdownText.current.style.color = 'red'
          countdownText.current.classList.add('blink')
        }
      }
    }, 10)
    return () => (clearInterval(x))
  })
  return (
    <div className='countdown-container'>
      <Typography variant='h5'>Countdown</Typography>
      <p ref={countdownText} />
    </div>
  )
}
