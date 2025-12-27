import { useEffect } from 'react';

export default function SocialButtons() {
  useEffect(() => {
    // Load Google SDK
    const gScript = document.createElement('script');
    gScript.src = 'https://accounts.google.com/gsi/client';
    gScript.async = true;
    gScript.defer = true;
    document.body.appendChild(gScript);

    // Load Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 'YOUR_FACEBOOK_APP_ID',
        cookie: true,
        xfbml: false,
        version: 'v13.0',
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleGoogleLogin = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: async (response) => {
        const tokenId = response.credential;
        // Send tokenId to backend
        const res = await fetch('/api/v1/auth/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId }),
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          window.location.href = '/dashboard';
        } else {
          alert('Google login failed');
        }
      },
    });
    google.accounts.id.prompt();
  };

  const handleFacebookLogin = () => {
    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          // Send accessToken and userID to backend
          const res = await fetch('/api/v1/auth/facebook-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, userID }),
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            window.location.href = '/dashboard';
          } else {
            alert('Facebook login failed');
          }
        } else {
          alert('Facebook login cancelled or failed');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
      >
        <img
          alt="Google"
          className="w-5 h-5"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
        />
        <span className="text-sm">Google</span>
      </button>
      <button
        onClick={handleFacebookLogin}
        className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
      >
        <img
          alt="Facebook"
          className="w-5 h-5"
          src="https://www.svgrepo.com/show/475647/facebook-color.svg"
        />
        <span className="text-sm">Facebook</span>
      </button>
    </div>
  );
}
