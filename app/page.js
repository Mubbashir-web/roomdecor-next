'use client'
import { useState } from 'react'
import styles from './page.module.css'
import Image from 'next/image'

export default function Home() {
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [showAd, setShowAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)
  const [adProgress, setAdProgress] = useState(0)
  const [adWatchCount, setAdWatchCount] = useState(0)
  const [adPlaying, setAdPlaying] = useState(false)
  const [aiImage, setAiImage] = useState(null)

  const stylesList = [
    { id: 'modern', icon: 'fa-building', label: 'Modern' },
    { id: 'classic', icon: 'fa-chess-rook', label: 'Classic' },
    { id: 'minimalist', icon: 'fa-minus-circle', label: 'Minimalist' },
    { id: 'bohemian', icon: 'fa-leaf', label: 'Bohemian' },
  ]

  const suggestions = {
    modern: [
      { title: '🛋️ Sofa', desc: 'Add a grey L-shaped sectional sofa with clean lines and metal legs.' },
      { title: '💡 Lighting', desc: 'Install recessed LED ceiling lights with a modern pendant lamp.' },
      { title: '🎨 Wall Color', desc: 'Soft white walls with one charcoal accent wall.' },
      { title: '🪴 Plants', desc: 'Add a tall fiddle leaf fig plant in the corner.' },
      { title: '🖼️ Art', desc: 'Hang abstract geometric wall art in black and white frames.' },
    ],
    classic: [
      { title: '🛋️ Sofa', desc: 'Choose a tufted Chesterfield sofa in deep burgundy velvet.' },
      { title: '💡 Lighting', desc: 'A crystal chandelier with brass floor lamps on sides.' },
      { title: '🎨 Wall Color', desc: 'Rich cream walls with detailed crown molding.' },
      { title: '🪴 Plants', desc: 'Classical urns with ivy or ferns on pedestals.' },
      { title: '🖼️ Art', desc: 'Ornate gold-framed landscape paintings.' },
    ],
    minimalist: [
      { title: '🛋️ Sofa', desc: 'Simple white low-profile sofa with no decorative elements.' },
      { title: '💡 Lighting', desc: 'One single white pendant light as statement piece.' },
      { title: '🎨 Wall Color', desc: 'Pure white walls, no patterns, keep it clean.' },
      { title: '🪴 Plants', desc: 'One small succulent in a simple white ceramic pot.' },
      { title: '🖼️ Art', desc: 'One large minimalist print — black line on white.' },
    ],
    bohemian: [
      { title: '🛋️ Sofa', desc: 'Colorful floor cushions and rattan sofa with patterned throws.' },
      { title: '💡 Lighting', desc: 'String fairy lights and Moroccan lanterns.' },
      { title: '🎨 Wall Color', desc: 'Terracotta or mustard yellow with tapestry hangings.' },
      { title: '🪴 Plants', desc: 'Lots of hanging plants in macrame holders.' },
      { title: '🖼️ Art', desc: 'Mix of dreamcatchers and woven wall art.' },
    ],
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  async function handleDecorate() {
    if (!preview) { alert('Please upload a room photo!'); return }
    if (attemptsLeft <= 0) { setShowAd(true); return }

    setLoading(true)
    setResults(null)
    setAiImage(null)

    try {
      const response = await fetch('/api/decorate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: selectedStyle })
      })

      const data = await response.json()

      if (data.success) {
        setAttemptsLeft(prev => prev - 1)
        setAiImage(data.image)
        setResults(suggestions[selectedStyle])
      } else {
        alert('AI error: ' + data.error)
      }
    } catch (error) {
      alert('Something went wrong!')
    }

    setLoading(false)
  }

  function watchAd() {
    const newCount = adWatchCount + 1
    setAdWatchCount(newCount)
    setAdPlaying(true)

    let duration = 5
    if (newCount === 2) duration = 10
    else if (newCount === 3) duration = 15
    else if (newCount === 4) duration = 20
    else if (newCount >= 5) duration = 30

    setAdCountdown(duration)
    setAdProgress(0)

    let timeLeft = duration
    const timer = setInterval(() => {
      timeLeft--
      setAdCountdown(timeLeft)
      setAdProgress(((duration - timeLeft) / duration) * 100)
      if (timeLeft <= 0) {
        clearInterval(timer)
        setAdPlaying(false)
        setAttemptsLeft(1)
        setShowAd(false)
        alert('✅ You got 1 free attempt!')
      }
    }, 1000)
  }

  return (
    <main>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <a className={styles.brand} href="#"><i className="fas fa-couch"></i> RoomAI</a>
          <div className={styles.navLinks}>
            <a href="#home">Home</a>
            <a href="#how">How It Works</a>
            <a href="#decorate">Try Now</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero} id="home">
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.container} ${styles.heroContent}`}>
          <h1>Transform Your Room With <span>AI Magic</span></h1>
          <p>Upload your room photo and let AI decorate it instantly — for free!</p>
          <a href="#decorate" className={styles.heroBtn}>
            <i className="fas fa-magic"></i> Decorate My Room — Free!
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howSection} id="how">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSub}>3 simple steps to transform your room</p>
          <div className={styles.stepsGrid}>
            {[
              { icon: 'fa-upload', title: 'Upload Photo', desc: 'Take a photo of your room and upload it' },
              { icon: 'fa-robot', title: 'AI Decorates', desc: 'AI analyzes and suggests beautiful decor' },
              { icon: 'fa-download', title: 'Save & Share', desc: 'Download your decorated room design' },
            ].map((step, i) => (
              <div className={styles.stepCard} key={i}>
                <div className={styles.stepIcon}><i className={`fas ${step.icon}`}></i></div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorate Section */}
      <section className={styles.decorateSection} id="decorate">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Decorate Your Room</h2>
          <p className={styles.sectionSub}>
            You have <span className={styles.attemptsBadge}>{attemptsLeft}</span> free attempts remaining
          </p>

          <div className={styles.toolCard}>
            {/* Upload */}
            {!preview ? (
              <label className={styles.uploadArea} htmlFor="photo-input">
                <i className="fas fa-cloud-upload-alt"></i>
                <h5>Drag & Drop or Click to Upload</h5>
                <p>Your room photo goes here</p>
                <input type="file" id="photo-input" accept="image/*" onChange={handlePhoto} hidden />
              </label>
            ) : (
              <div className={styles.previewArea}>
                <Image
                  src={aiImage}
                  alt="AI Decorated Room"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)' }}
                  unoptimized={true}
                />
                <button onClick={() => setPreview(null)} className={styles.changeBtn}>
                  <i className="fas fa-redo"></i> Change Photo
                </button>
              </div>
            )}

            {/* Style Selection */}
            <div className={styles.styleSection}>
              <h6>Choose Decoration Style:</h6>
              <div className={styles.styleGrid}>
                {stylesList.map(s => (
                  <div
                    key={s.id}
                    className={`${styles.styleCard} ${selectedStyle === s.id ? styles.active : ''}`}
                    onClick={() => setSelectedStyle(s.id)}
                  >
                    <i className={`fas ${s.icon}`}></i>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Button */}
            <div className={styles.btnCenter}>
              <button className={styles.decorateBtn} onClick={handleDecorate} disabled={loading}>
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i> AI is working...</>
                  : <><i className="fas fa-magic"></i> Decorate My Room!</>
                }
              </button>
            </div>
          </div>

          {/* Results */}
          {results && !showAd && (
            <div className={styles.resultCard}>
              {aiImage && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Image
                    src={aiImage}
                    alt="AI Decorated Room"
                    width={800}
                    height={500}
                    style={{ width: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)' }}
                  />
                  <p style={{ marginTop: '10px', color: '#7f8c8d', fontSize: '0.9rem' }}>
                    🤖 AI Generated Room Design
                  </p>
                </div>
              )}
              <h5><i className="fas fa-star"></i> AI Decoration Suggestions</h5>
              {results.map((item, i) => (
                <div className={styles.suggestionItem} key={i}>
                  <h6>{item.title}</h6>
                  <p>{item.desc}</p>
                </div>
              ))}
              <button className={styles.tryAgainBtn} onClick={() => {
                if (attemptsLeft <= 0) setShowAd(true)
                else setResults(null)
              }}>
                <i className="fas fa-redo"></i> Try Another Style
              </button>
            </div>
          )}

          {/* Ad Area */}
          {showAd && (
            <div className={styles.adCard}>
              <h5><i className="fas fa-video"></i> Watch a short ad to continue!</h5>
              <p>You have used all free attempts. Watch an ad to get more!</p>
              {adPlaying ? (
                <div className={styles.adBox}>
                  <p>Ad Playing...</p>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarFill} style={{ width: `${adProgress}%` }}></div>
                  </div>
                  <p className={styles.countdown}>Please wait <strong>{adCountdown}</strong> seconds</p>
                </div>
              ) : (
                <button className={styles.watchAdBtn} onClick={watchAd}>
                  <i className="fas fa-play"></i> Watch Ad & Get Free Attempt
                </button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2026 RoomAI — Transform Your Space with AI</p>
          <p className={styles.footerSub}>Free AI Interior Design Tool</p>
        </div>
      </footer>

    </main>
  )
}