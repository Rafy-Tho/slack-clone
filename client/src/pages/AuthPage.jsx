import { SignInButton } from '@clerk/clerk-react';
import '../styles/auth.css';

function AuthPage() {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="brand-container">
            <img src="/logo.png" alt="slap" className="brand-logo" />
            <span className="brand-name">Slap</span>
          </div>
          <h1>Where Work Happens ✨</h1>
          <p className="hero-subtitle">
            Connect with your team, whether you're working from home, in the
            office, or on the go.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Real-time messaging</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📹</span>
              <span>Video conferencing</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure and encrypted</span>
            </div>
          </div>
          <SignInButton mode="modal">
            <button className="cta-button">Get Started with Slap →</button>
          </SignInButton>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-image-container">
          <img src="/auth-i.png" alt="slap" className="auth-image" />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
