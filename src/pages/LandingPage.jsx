import { useState, useEffect } from 'react'

export default function LandingPage({ onGetStarted, onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq]   = useState(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const features = [
    { icon: '📊', title: 'Smart Dashboard', desc: 'See your entire farm at a glance — revenue, profit, active crops and pending tasks all in one place.' },
    { icon: '🌿', title: 'Crop Tracking', desc: 'Track every crop from seedling to harvest. Never miss a planting date or harvest window again.' },
    { icon: '🐄', title: 'Livestock Management', desc: 'Manage your animals and record daily milk, egg and weight production with ease.' },
    { icon: '💰', title: 'Sales & Expenses', desc: 'Record every sale and expense. Know your exact profit at any moment.' },
    { icon: '🌦️', title: 'Real-Time Weather', desc: 'GPS-based weather forecasts with Kenyan farming advice. Know when to plant, spray and harvest.' },
    { icon: '📈', title: 'Market Prices', desc: 'Stay updated on produce prices from Wakulima, Marikiti and markets across Kenya.' },
    { icon: '🤖', title: 'Shamba Bot AI', desc: 'Ask farming questions in English or Swahili. Get expert AI answers that know your farm.' },
    { icon: '🏥', title: 'Vet Directory', desc: 'Find verified veterinarians near you by county. Call them directly from the app.' },
    { icon: '📋', title: 'Govt Grants', desc: 'Discover available funding — AFC loans, e-Voucher subsidies, Youth Fund and more.' },
  ]

  const plans = [
    {
      name: 'Free',
      price: 'KSh 0',
      period: 'forever',
      desc: 'Perfect for getting started',
      color: '#f9fafb',
      border: '#e0e0e0',
      textColor: '#212121',
      btnBg: '#2e7d32',
      btnColor: 'white',
      features: [
        'Dashboard & Analytics',
        'Crop Tracking',
        'Livestock Management',
        'Sales & Expenses',
        'Tasks & Weather',
        'Market Prices',
        'Vet Directory',
        'Govt Grants',
        '10 Shamba Bot messages/day',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: 'KSh 500',
      period: 'per month',
      desc: 'For serious individual farmers',
      color: '#1b5e20',
      border: '#1b5e20',
      textColor: 'white',
      btnBg: 'white',
      btnColor: '#1b5e20',
      features: [
        'Everything in Free',
        'Unlimited Shamba Bot AI',
        'Crop Disease Scanner 📷',
        'Advanced Analytics',
        'Export Reports (PDF)',
        'SMS Task Alerts',
        'Priority Support',
      ],
      cta: 'Get Pro',
      popular: true,
    },
    {
      name: 'Cooperative Pro',
      price: 'KSh 8,000',
      period: 'per month',
      desc: 'For cooperatives & SACCOs',
      color: '#f57f17',
      border: '#f57f17',
      textColor: 'white',
      btnBg: 'white',
      btnColor: '#f57f17',
      features: [
        'Everything in Pro',
        '20 Farmer Accounts',
        'Cooperative Head Dashboard',
        'Aggregate Analytics',
        'Member Performance Reports',
        'Bulk SMS Alerts',
        'Dedicated Support',
      ],
      cta: 'Contact Us',
      popular: false,
    },
  ]

  const faqs = [
    { q: 'Is AgriMateKE free to use?', a: 'Yes! The Free plan is free forever with no credit card required. You get access to all core features including crop tracking, livestock management, sales recording and weather.' },
    { q: 'Does it work without internet?', a: 'The app works best with internet. Offline support is coming in Phase 5. For now we recommend using it when connected to Wi-Fi or mobile data.' },
    { q: 'Is my farm data safe?', a: 'Yes. Your data is stored securely in a cloud database with bank-level encryption. We never share or sell your farm data to anyone.' },
    { q: 'Can I use it in Swahili?', a: 'Swahili language support is coming soon! For now the app is in English but Shamba Bot can understand and respond in Swahili.' },
    { q: 'How does the Cooperative plan work?', a: 'The Cooperative Head pays KSh 8,000/month and gets a special dashboard to monitor all 20 member farmers. Each farmer gets their own account linked to the cooperative.' },
    { q: 'What is Shamba Bot?', a: 'Shamba Bot is an AI farming assistant powered by advanced artificial intelligence. Ask it anything about crops, livestock, pests, markets or farm planning — in English or Swahili.' },
  ]

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', color: '#212121', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(27,94,32,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.15)' : 'none',
      }}>
        <div style={{ fontFamily: 'Cambria, serif', fontSize: '22px', color: 'white', fontWeight: '700' }}>
          🌱 AgriMateKE
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={onLogin}
            style={{
              padding: '8px 18px', background: 'transparent',
              color: 'white', border: '1.5px solid rgba(255,255,255,0.6)',
              borderRadius: '8px', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            style={{
              padding: '8px 18px', background: 'white',
              color: '#1b5e20', border: 'none',
              borderRadius: '8px', fontSize: '14px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}>
            Start Free 🌱
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <div style={{
          fontSize: '64px', marginBottom: '16px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
        }}>🌱</div>

        <div style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: '800', color: 'white',
          fontFamily: 'Cambria, serif', lineHeight: 1.15,
          marginBottom: '16px', maxWidth: '800px'
        }}>
          Smart Farming for<br />
          <span style={{ color: '#81c784' }}>Every Kenyan Farmer</span>
        </div>

        <p style={{
          fontSize: 'clamp(15px, 2.5vw, 18px)',
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '600px', lineHeight: 1.7,
          marginBottom: '36px'
        }}>
          Track crops, manage livestock, record sales, get AI farming advice
          and access market prices — all in one app built for Kenya.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
          <button
            onClick={onGetStarted}
            style={{
              padding: '14px 32px',
              background: 'white', color: '#1b5e20',
              border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '800',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
            🌱 Start Free — No Card Needed
          </button>
          <button
            onClick={onLogin}
            style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,0.5)',
              borderRadius: '10px',
              fontSize: '16px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>
            Sign In →
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '32px', flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { val: '4.5M+', label: 'Target Farmers' },
            { val: '47',    label: 'Counties Covered' },
            { val: 'Free',  label: 'To Get Started' },
            { val: 'AI',    label: 'Powered Assistant' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'white', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#2e7d32', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Everything You Need
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: '#212121', fontFamily: 'Cambria, serif', marginBottom: '12px' }}>
            Built for Kenyan Farmers
          </h2>
          <p style={{ fontSize: '16px', color: '#757575', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Every feature designed around how farming actually works in Kenya.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              padding: '24px', borderRadius: '16px',
              border: '1.5px solid #f0f0f0', background: '#fafafa',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.border = '1.5px solid #a5d6a7'
                e.currentTarget.style.background = '#f1f8f1'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1.5px solid #f0f0f0'
                e.currentTarget.style.background = '#fafafa'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#757575', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHAMBA BOT HIGHLIGHT ───────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#81c784', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              AI Powered
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: 'white', fontFamily: 'Cambria, serif', marginBottom: '16px', lineHeight: 1.2 }}>
              Meet Shamba Bot 🤖
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '24px' }}>
              Your personal AI farming expert available 24/7. Ask anything about crops, livestock, pests, market prices or farm planning — in English or Swahili.
            </p>
            {[
              'Why are my tomatoes turning yellow?',
              'When should I plant maize in Nakuru?',
              'How do I apply for an AFC loan?',
              'What is the best fertiliser for beans?',
            ].map(q => (
              <div key={q} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '99px', padding: '8px 16px',
                fontSize: '13px', color: 'rgba(255,255,255,0.9)',
                marginBottom: '8px', display: 'inline-block',
                marginRight: '8px'
              }}>
                "{q}"
              </div>
            ))}
          </div>
          <div style={{
            flex: 1, minWidth: '280px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '24px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {[
              { role: 'user', text: 'My maize leaves are turning brown at the tips. What is wrong?' },
              { role: 'bot',  text: '🌽 This sounds like leaf scorch — likely caused by:\n• Water stress (check soil moisture)\n• Potassium deficiency\n• Excess fertiliser burn\n\nTry watering deeply and check if you over-applied CAN. What stage is your maize at?' },
              { role: 'user', text: 'It is at the flowering stage' },
              { role: 'bot',  text: '✅ At flowering stage, water stress is the most common cause. Water immediately and consistently for the next 2 weeks — this is the most critical stage for maize yields in Kenya.' },
            ].map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'white' : 'rgba(255,255,255,0.15)',
                  color: msg.role === 'user' ? '#1b5e20' : 'white',
                  fontSize: '12px', lineHeight: 1.5,
                  fontWeight: msg.role === 'user' ? '600' : '400',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2e7d32', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Simple Pricing
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: '#212121', fontFamily: 'Cambria, serif', marginBottom: '12px' }}>
              Start Free. Grow with AgriMateKE.
            </h2>
            <p style={{ fontSize: '16px', color: '#757575', maxWidth: '500px', margin: '0 auto' }}>
              No hidden fees. Pay via M-Pesa. Cancel anytime.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px', alignItems: 'start'
          }}>
            {plans.map(plan => (
              <div key={plan.name} style={{
                borderRadius: '20px', padding: '28px',
                background: plan.color,
                border: `2px solid ${plan.border}`,
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 32px rgba(27,94,32,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#f57f17', color: 'white',
                    fontSize: '11px', fontWeight: '700',
                    padding: '4px 16px', borderRadius: '99px',
                    letterSpacing: '0.05em', whiteSpace: 'nowrap'
                  }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: '18px', fontWeight: '800', color: plan.textColor, marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '13px', color: plan.name === 'Free' ? '#9e9e9e' : 'rgba(255,255,255,0.75)', marginBottom: '16px' }}>{plan.desc}</div>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '800', color: plan.textColor }}>{plan.price}</span>
                  <span style={{ fontSize: '13px', color: plan.name === 'Free' ? '#9e9e9e' : 'rgba(255,255,255,0.7)', marginLeft: '6px' }}>{plan.period}</span>
                </div>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '13px', color: plan.textColor }}>
                    <span style={{ color: plan.name === 'Free' ? '#2e7d32' : 'rgba(255,255,255,0.9)', flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
                <button
                  onClick={onGetStarted}
                  style={{
                    width: '100%', padding: '12px',
                    background: plan.btnBg, color: plan.btnColor,
                    border: 'none', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '700',
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    marginTop: '20px'
                  }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: '#212121', fontFamily: 'Cambria, serif', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              border: '1.5px solid #f0f0f0', borderRadius: '12px',
              marginBottom: '10px', overflow: 'hidden'
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '16px 20px',
                  background: openFaq === i ? '#f1f8f1' : 'white',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '12px',
                  fontFamily: 'Outfit, sans-serif',
                  textAlign: 'left'
                }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>{faq.q}</span>
                <span style={{ fontSize: '18px', color: '#2e7d32', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#616161', lineHeight: 1.7, background: '#f1f8f1' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: 'white', fontFamily: 'Cambria, serif', marginBottom: '12px' }}>
          Ready to grow smarter?
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Join thousands of Kenyan farmers managing their farms better with AgriMateKE. Start free today.
        </p>
        <button
          onClick={onGetStarted}
          style={{
            padding: '16px 40px', background: 'white',
            color: '#1b5e20', border: 'none', borderRadius: '12px',
            fontSize: '17px', fontWeight: '800',
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
          🌱 Start Free Today
        </button>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ background: '#0a2e0d', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cambria, serif', fontSize: '20px', color: 'white', marginBottom: '8px' }}>
          🌱 AgriMateKE
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
          Smart Farming Companion for Kenyan Farmers
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          © 2026 AgriMateKE · Built with ❤️ for Kenyan farmers 🇰🇪
        </div>
      </footer>

    </div>
  )
}