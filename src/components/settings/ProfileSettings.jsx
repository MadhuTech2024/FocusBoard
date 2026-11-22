import { useEffect, useRef, useState } from 'react'
import { Camera, Save, UserRound } from 'lucide-react'
import ProfileAvatar from '../common/ProfileAvatar.jsx'
import {
  isSupportedAvatarType,
  isValidProfileEmail,
  PROFILE_AVATAR_MAX_BYTES,
  PROFILE_BIO_MAX_LENGTH,
  PROFILE_EMAIL_MAX_LENGTH,
  PROFILE_NAME_MAX_LENGTH,
} from '../../utils/profileHelpers.js'

function readAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('The selected photo could not be read.'))
      }
    })
    reader.addEventListener('error', () => {
      reject(new Error('The selected photo could not be read.'))
    })
    reader.readAsDataURL(file)
  })
}

function ProfileSettings({
  profile,
  profileError,
  onSaveProfile,
}) {
  const [draft, setDraft] = useState(profile)
  const [errors, setErrors] = useState({})
  const [avatarError, setAvatarError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isReadingAvatar, setIsReadingAvatar] = useState(false)
  const avatarInputRef = useRef(null)
  const avatarReadTokenRef = useRef(0)

  useEffect(
    () => () => {
      avatarReadTokenRef.current += 1
    },
    [],
  )

  function handleFieldChange(event) {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setFeedback(null)
  }

  async function handleAvatarChange(event) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    setAvatarError('')
    setFeedback(null)
    if (!file) {
      return
    }

    if (!isSupportedAvatarType(file.type)) {
      setAvatarError('Choose a PNG, JPEG, or WebP image.')
      return
    }
    if (file.size > PROFILE_AVATAR_MAX_BYTES) {
      setAvatarError('The photo must be 512 KB or smaller.')
      return
    }

    const token = avatarReadTokenRef.current + 1
    avatarReadTokenRef.current = token
    setIsReadingAvatar(true)

    try {
      const avatar = await readAvatarFile(file)
      if (avatarReadTokenRef.current === token) {
        setDraft((current) => ({ ...current, avatar }))
      }
    } catch (error) {
      if (avatarReadTokenRef.current === token) {
        setAvatarError(
          error instanceof Error
            ? error.message
            : 'The selected photo could not be read.',
        )
      }
    } finally {
      if (avatarReadTokenRef.current === token) {
        setIsReadingAvatar(false)
      }
    }
  }

  function handleRemoveAvatar() {
    avatarReadTokenRef.current += 1
    setIsReadingAvatar(false)
    setAvatarError('')
    setFeedback(null)
    setDraft((current) => ({ ...current, avatar: '' }))
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }

  function handleCancel() {
    avatarReadTokenRef.current += 1
    setIsReadingAvatar(false)
    setDraft(profile)
    setErrors({})
    setAvatarError('')
    setFeedback(null)
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const name = draft.name.trim()
    const email = draft.email.trim()
    const bio = draft.bio
    const nextErrors = {}

    if (!name) {
      nextErrors.name = 'Enter your full name.'
    } else if (name.length > PROFILE_NAME_MAX_LENGTH) {
      nextErrors.name = `Use ${PROFILE_NAME_MAX_LENGTH} characters or fewer.`
    }
    if (!isValidProfileEmail(email)) {
      nextErrors.email = 'Enter a valid email address or leave this blank.'
    }
    if (bio.length > PROFILE_BIO_MAX_LENGTH) {
      nextErrors.bio = `Use ${PROFILE_BIO_MAX_LENGTH} characters or fewer.`
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setFeedback(null)
      document.getElementById(`profile-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }

    const result = onSaveProfile({
      ...draft,
      name,
      email,
      bio: bio.trim(),
    })
    if (!result.saved) {
      setFeedback({ type: 'error', message: result.error })
      return
    }

    setDraft((current) => ({
      ...current,
      name,
      email,
      bio: bio.trim(),
    }))
    setFeedback({ type: 'success', message: 'Profile saved.' })
  }

  return (
    <>
      <header className="settings-card__heading">
        <div className="settings-card__icon">
          <UserRound aria-hidden="true" size={18} />
        </div>
        <div>
          <h2 id="profile-settings-title">Profile</h2>
          <p>Update the local profile shown in FocusBoard.</p>
        </div>
      </header>

      {profileError && (
        <p className="profile-settings__message profile-settings__message--error" role="alert">
          {profileError}
        </p>
      )}

      <form className="profile-settings__form" onSubmit={handleSubmit} noValidate>
        <div className="profile-settings__avatar-row">
          <ProfileAvatar
            avatar={draft.avatar}
            className="profile-settings__avatar"
            name={draft.name}
          />
          <div className="profile-settings__avatar-control">
            <label htmlFor="profile-avatar">
              <Camera aria-hidden="true" size={14} />
              Profile photo
            </label>
            <input
              accept="image/png,image/jpeg,image/webp"
              aria-describedby={
                avatarError
                  ? 'profile-avatar-help profile-avatar-error'
                  : 'profile-avatar-help'
              }
              aria-invalid={Boolean(avatarError)}
              className="profile-settings__file-input"
              id="profile-avatar"
              onChange={handleAvatarChange}
              ref={avatarInputRef}
              type="file"
            />
            <p className="profile-settings__help" id="profile-avatar-help">
              PNG, JPEG, or WebP; up to 512 KB. Stored only in this browser.
            </p>
            {avatarError && (
              <p
                className="profile-settings__field-error"
                id="profile-avatar-error"
                role="alert"
              >
                {avatarError}
              </p>
            )}
            {draft.avatar && (
              <button
                className="profile-settings__remove-avatar"
                onClick={handleRemoveAvatar}
                type="button"
              >
                Remove photo
              </button>
            )}
            {isReadingAvatar && (
              <p className="profile-settings__help" role="status">
                Loading photo…
              </p>
            )}
          </div>
        </div>

        <div className="profile-settings__fields">
          <label className="profile-settings__field" htmlFor="profile-name">
            <span>Full name <span aria-hidden="true">*</span></span>
            <input
              aria-describedby={errors.name ? 'profile-name-error' : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              id="profile-name"
              maxLength={PROFILE_NAME_MAX_LENGTH}
              name="name"
              onChange={handleFieldChange}
              required
              value={draft.name}
            />
            {errors.name && (
              <span
                className="profile-settings__field-error"
                id="profile-name-error"
                role="alert"
              >
                {errors.name}
              </span>
            )}
          </label>

          <label className="profile-settings__field" htmlFor="profile-email">
            <span>Email address <span className="profile-settings__optional">(optional)</span></span>
            <input
              aria-describedby={errors.email ? 'profile-email-error' : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id="profile-email"
              maxLength={PROFILE_EMAIL_MAX_LENGTH}
              name="email"
              onChange={handleFieldChange}
              type="email"
              value={draft.email}
            />
            {errors.email && (
              <span
                className="profile-settings__field-error"
                id="profile-email-error"
                role="alert"
              >
                {errors.email}
              </span>
            )}
          </label>

          <label
            className="profile-settings__field profile-settings__field--full"
            htmlFor="profile-bio"
          >
            <span>Bio <span className="profile-settings__optional">(optional)</span></span>
            <textarea
              aria-describedby={
                errors.bio
                  ? 'profile-bio-help profile-bio-error'
                  : 'profile-bio-help'
              }
              aria-invalid={Boolean(errors.bio)}
              id="profile-bio"
              maxLength={PROFILE_BIO_MAX_LENGTH}
              name="bio"
              onChange={handleFieldChange}
              rows={4}
              value={draft.bio}
            />
            <span className="profile-settings__help" id="profile-bio-help">
              {draft.bio.length}/{PROFILE_BIO_MAX_LENGTH} characters
            </span>
            {errors.bio && (
              <span
                className="profile-settings__field-error"
                id="profile-bio-error"
                role="alert"
              >
                {errors.bio}
              </span>
            )}
          </label>
        </div>

        {feedback && (
          <p
            className={`profile-settings__message profile-settings__message--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.message}
          </p>
        )}

        <footer className="profile-settings__actions">
          <button
            className="profile-settings__cancel"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="profile-settings__save"
            disabled={isReadingAvatar}
            type="submit"
          >
            <Save aria-hidden="true" size={16} />
            <span>Save Changes</span>
          </button>
        </footer>
      </form>
    </>
  )
}

export default ProfileSettings
