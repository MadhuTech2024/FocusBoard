import ProfileSettings from './ProfileSettings.jsx'

function ProfilePage({ profile, profileError, onSaveProfile }) {
  return (
    <main
      aria-labelledby="profile-page-title"
      className="dashboard-main settings-main"
    >
      <div className="settings-page">
        <header className="settings-page__header">
          <h1 id="profile-page-title">Profile</h1>
          <p>Manage the local profile shown in FocusBoard.</p>
        </header>
        <section
          aria-labelledby="profile-settings-title"
          className="settings-card"
        >
          <ProfileSettings
            onSaveProfile={onSaveProfile}
            profile={profile}
            profileError={profileError}
          />
        </section>
      </div>
    </main>
  )
}

export default ProfilePage
