
import './profileScreen.css'

const ProfileScreen = ({ userProfile }) => {
  return (
    <div className="profile-container">
      <div className="profile-container-layout">
        <div className="profile-header">
          <div className="login-vc-success-header">
            <span className="login-vc-success-header-text">{`Hi ${userProfile?.first_name || ''}!`}</span>
            <span className="login-vc-success-login-text">
              {'You are now logged in'}
            </span>
          </div>
        </div>
        <div className="profile-body">
          {userProfile?.instnt_id && (<div className="account-number">
            <span className="label">{'Account Number :'}</span>
            <span className="value">{userProfile.instnt_id}</span>
          </div>)}
          {userProfile?.email && (<div className="email">
            <span className="label">{'Email :'}</span>
            <span className="value">{userProfile.email}</span>
          </div>)}
          {(userProfile?.first_name || userProfile?.last_name) && (
          <div className="name">
            <span className="label">{'Name :'}</span>
            <span className="value">{`${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`}</span>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
