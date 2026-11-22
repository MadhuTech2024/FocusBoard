import { useState } from 'react'
import {
  defaultProfile,
  normalizeProfile,
  PROFILE_STORAGE_KEY,
} from '../utils/profileHelpers.js'

function readStoredProfile() {
  try {
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (storedProfile === null) {
      return { profile: { ...defaultProfile }, error: '' }
    }

    const normalized = normalizeProfile(JSON.parse(storedProfile))
    return {
      profile: normalized.profile,
      error: normalized.hasInvalidData
        ? 'Some saved profile details were invalid. Review them before saving.'
        : '',
    }
  } catch {
    return {
      profile: { ...defaultProfile },
      error: 'Saved profile data could not be read. A neutral profile is shown.',
    }
  }
}

function useProfile() {
  const [storedState] = useState(readStoredProfile)
  const [profile, setProfile] = useState(storedState.profile)
  const [profileError, setProfileError] = useState(storedState.error)

  function saveProfile(value) {
    const normalized = normalizeProfile(value)
    if (normalized.hasInvalidData) {
      return {
        saved: false,
        error: 'Profile details are invalid. Review the fields and try again.',
      }
    }

    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(normalized.profile),
      )
      setProfile(normalized.profile)
      setProfileError('')
      return { saved: true, error: '' }
    } catch {
      return {
        saved: false,
        error: 'Profile could not be saved in this browser.',
      }
    }
  }

  return { profile, profileError, saveProfile }
}

export default useProfile
