import { useDispatch } from 'react-redux';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { googleAuth } from '../../redux/auth/authSlice';
import type { AppDispatch } from '../../redux/store';

type CredentialResponse = {
  credential?: string;
  select_by?: string;
  clientId?: string;
};

interface GoogleAuthButtonProps {
  clientId?: string;
  onSuccess?: (_credentialResponse: CredentialResponse) => void;
  onError?: () => void;
  useOneTap?: boolean;
  className?: string;
}

export default function GoogleAuthButton({
  clientId,
  onSuccess,
  onError,
  useOneTap = true,
  className = 'mb-6 flex justify-center',
}: GoogleAuthButtonProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (onSuccess) {
      onSuccess(credentialResponse);
    } else if (credentialResponse.credential) {
      dispatch(googleAuth(credentialResponse.credential));
    }
  };

  const handleError = () => {
    if (onError) {
      onError();
    } else {
      console.log('Login Failed');
    }
  };

  const googleClientId = clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <div className={className}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap={useOneTap} />
      </GoogleOAuthProvider>
    </div>
  );
}
