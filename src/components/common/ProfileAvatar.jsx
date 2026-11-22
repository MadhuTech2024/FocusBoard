import { getProfileInitials } from '../../utils/profileHelpers.js'

function ProfileAvatar({ avatar, className = '', name }) {
  return (
    <span
      aria-hidden="true"
      className={`profile-avatar ${className}`.trim()}
    >
      {avatar ? <img alt="" src={avatar} /> : getProfileInitials(name)}
    </span>
  )
}

export default ProfileAvatar
