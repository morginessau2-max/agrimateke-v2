import { useAuth } from '../context/AuthContext'

export function usePlan() {
  const { profile } = useAuth()

  const plan = profile?.plan || 'free'

  const isFree        = plan === 'free'
  const isPro         = plan === 'pro' || plan === 'cooperative_pro'
  const isCooperative = plan === 'cooperative_pro'

  // Feature flags
  const features = {
    unlimitedShambaBot:    isPro,
    exportReports:         isPro,
    smsAlerts:             isPro,
    advancedAnalytics:     isPro,
    multiFarm:             isPro,
    cooperativeDashboard:  isCooperative,
    cropDiseaseScanner:    isPro,
  }

  // Shamba Bot daily limit
  const shambaLimit = isFree ? 10 : Infinity

  return {
    plan,
    isFree,
    isPro,
    isCooperative,
    features,
    shambaLimit,
  }
}