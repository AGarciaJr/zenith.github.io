import { useState, useCallback, useRef } from 'react'
import './App.css'

const TENOR_GIFS = [
  { id: '6682255795123802665', ratio: 1.579 },
  { id: '9280094880712544242', ratio: 0.974 },
  { id: '5035733483108085269', ratio: 1.122 },
  { id: '2149543906270570805', ratio: 0.835 },
  { id: '25367585', ratio: 1.296 },
  { id: '5400590', ratio: 1 },
  { id: '18492557', ratio: 1.19 },
]

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function App() {
  const [answered, setAnswered] = useState(false)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [hasMovedNo, setHasMovedNo] = useState(false)
  const [confetti, setConfetti] = useState([])
  const [showGif, setShowGif] = useState(false)
  const [gifQueue, setGifQueue] = useState([])
  const [gifIndex, setGifIndex] = useState(0)
  const containerRef = useRef(null)

  // Move the "No" button to a random spot when hovered
  const dodgeNo = useCallback(() => {
    const padding = 80
    const maxX = window.innerWidth - padding * 2
    const maxY = window.innerHeight - padding * 2
    setNoPos({
      x: Math.random() * maxX + padding,
      y: Math.random() * maxY + padding,
    })
    setHasMovedNo(true)
  }, [])

  // Spawn confetti on "Yes"
  const handleYes = () => {
    const colors = ['#e91e63', '#f8a4c8', '#d32f2f', '#ffffff', '#ff6090', '#ff80ab']
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }))
    setConfetti(pieces)
    setAnswered(true)
    // Pre-shuffle the gif queue
    setGifQueue(shuffleArray(TENOR_GIFS))
    setGifIndex(0)
  }

  // Show a random gif when heart is clicked
  const handleHeartClick = () => {
    if (showGif) {
      // Cycle to next gif
      const nextIndex = (gifIndex + 1) % TENOR_GIFS.length
      if (nextIndex === 0) {
        // Reshuffle when we've gone through all
        setGifQueue(shuffleArray(TENOR_GIFS))
      }
      setGifIndex(nextIndex)
    } else {
      setShowGif(true)
    }
  }

  const closeGif = (e) => {
    e.stopPropagation()
    setShowGif(false)
  }

  const currentGif = gifQueue[gifIndex] || TENOR_GIFS[0]

  // Floating background hearts
  const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${(i / 12) * 100 + Math.random() * 5}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    size: `${1 + Math.random() * 1.5}rem`,
  }))

  return (
    <>
      {/* Subtle floating hearts in background */}
      <div className="floating-hearts">
        {floatingHearts.map((h) => (
          <span
            key={h.id}
            className="floating-heart"
            style={{
              left: h.left,
              top: h.top,
              animationDelay: h.delay,
              fontSize: h.size,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Confetti */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="valentine-container" ref={containerRef}>
        {!answered ? (
          <>
            <div className="heart-icon">💗</div>
            <h1 className="question">Will you be my Valentine?</h1>
            <div className="buttons">
              <button className="btn btn-yes" onClick={handleYes}>
                Yes
              </button>
              {!hasMovedNo && (
                <button
                  className="btn btn-no"
                  style={{ position: 'relative' }}
                  onMouseEnter={dodgeNo}
                  onTouchStart={dodgeNo}
                >
                  No
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="celebration">
            <div
              className="celebration-heart clickable-heart"
              onClick={handleHeartClick}
              role="button"
              tabIndex={0}
              aria-label="Tap for a surprise"
              title="Tap me!"
            >
              💖
            </div>
            <h1 className="celebration-text">Yay! Happy Valentine's Day!</h1>
            <p className="celebration-subtext">I love you so much 💕</p>
            <p className="heart-hint">tap the heart for a surprise!</p>

            {/* GIF display area */}
            {showGif && (
              <div className="gif-section" key={currentGif.id}>
                <div className="gif-card">
                  <button className="gif-close" onClick={closeGif}>
                    ✕
                  </button>
                  <iframe
                    src={`https://tenor.com/embed/${currentGif.id}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    style={{
                      borderRadius: '16px',
                      aspectRatio: currentGif.ratio,
                    }}
                  />
                  <button className="gif-next" onClick={handleHeartClick}>
                    show me another 💗
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Escaped "No" button that keeps dodging */}
      {!answered && hasMovedNo && (
        <button
          className="btn btn-no"
          style={{
            position: 'fixed',
            left: `${noPos.x}px`,
            top: `${noPos.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}
          onMouseEnter={dodgeNo}
          onTouchStart={dodgeNo}
        >
          No
        </button>
      )}
    </>
  )
}

export default App
