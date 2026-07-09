import { useState, useEffect, useRef } from 'react'
import { getVerification } from '../services/api'
import type { Verification } from '../types'

const MAX_ATTEMPTS = 15
const INTERVAL = 3000

export function usePolling(verificationId: string | null) {
  const [verification, setVerification] = useState<Verification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stopped, setStopped] = useState(false)
  const attemptsRef = useRef(0)

  useEffect(() => {
    if (!verificationId) return

    let active = true
    let timerId: ReturnType<typeof setTimeout>

    async function poll() {
      try {
        const response = await getVerification(verificationId)
        if (!active) return

        const data = response.data!
        setVerification(data)
        setError(null)

        if (data.status !== 'pending') {
          setIsLoading(false)
          setStopped(true)
          return
        }

        attemptsRef.current++
        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setIsLoading(false)
          setStopped(true)
          return
        }

        timerId = setTimeout(poll, INTERVAL)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Error al verificar la identidad.')
        setIsLoading(false)
        setStopped(true)
      }
    }

    poll()

    return () => {
      active = false
      clearTimeout(timerId)
    }
  }, [verificationId])

  return { verification, isLoading, error, stopped }
}
