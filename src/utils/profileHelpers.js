export const PROFILE_STORAGE_KEY = 'focusboard-profile'
export const PROFILE_NAME_MAX_LENGTH = 80
export const PROFILE_EMAIL_MAX_LENGTH = 254
export const PROFILE_BIO_MAX_LENGTH = 280
export const PROFILE_AVATAR_MAX_BYTES = 512 * 1024

const maximumAvatarDataUrlLength =
  Math.ceil(PROFILE_AVATAR_MAX_BYTES / 3) * 4 + 64
const avatarDataUrlPattern =
  /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/
const supportedAvatarTypes = new Set(['image/png', 'image/jpeg', 'image/webp'])

export const defaultProfile = {
  name: 'FocusBoard User',
  email: '',
  bio: '',
  avatar: '',
}

export function isValidProfileEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= PROFILE_EMAIL_MAX_LENGTH &&
    (email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
}

export function isSupportedAvatarType(type) {
  return supportedAvatarTypes.has(type)
}

export function isValidAvatarDataUrl(value) {
  return (
    typeof value === 'string' &&
    value.length <= maximumAvatarDataUrlLength &&
    avatarDataUrlPattern.test(value)
  )
}

export function getProfileInitials(name) {
  const words = typeof name === 'string' ? name.trim().split(/\s+/).filter(Boolean) : []
  return words
    .slice(0, 2)
    .map((word) => word.slice(0, 1).toUpperCase())
    .join('') || 'F'
}

export function normalizeProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { profile: { ...defaultProfile }, hasInvalidData: true }
  }

  let hasInvalidData = false
  const rawName = typeof value.name === 'string' ? value.name.trim() : ''
  if (!rawName || rawName.length > PROFILE_NAME_MAX_LENGTH) {
    hasInvalidData = true
  }
  const name = rawName.slice(0, PROFILE_NAME_MAX_LENGTH) || defaultProfile.name

  const rawEmail = typeof value.email === 'string' ? value.email.trim() : ''
  if (
    (value.email !== undefined && typeof value.email !== 'string') ||
    !isValidProfileEmail(rawEmail)
  ) {
    hasInvalidData = true
  }

  let bio = ''
  if (value.bio !== undefined && typeof value.bio !== 'string') {
    hasInvalidData = true
  } else if (typeof value.bio === 'string') {
    if (value.bio.length > PROFILE_BIO_MAX_LENGTH) {
      hasInvalidData = true
    }
    bio = value.bio.slice(0, PROFILE_BIO_MAX_LENGTH)
  }

  let avatar = ''
  if (value.avatar !== undefined && value.avatar !== '') {
    if (isValidAvatarDataUrl(value.avatar)) {
      avatar = value.avatar
    } else {
      hasInvalidData = true
    }
  }

  return {
    profile: {
      name,
      email: isValidProfileEmail(rawEmail) ? rawEmail : '',
      bio,
      avatar,
    },
    hasInvalidData,
  }
}
