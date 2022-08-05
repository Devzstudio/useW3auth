import { useCallback, useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import useW3authAPI from './useW3authAPI';

interface IuseW3auth {
  API_URL?: string;
  token?: string;
  wallet_address?: string;
  signMessageText?: string;
  signMessage: (message: string) => void;
  onLogout: () => void;
  onSignIn: (response: any) => void;
}

const useW3auth = ({
  API_URL = '',
  wallet_address,
  token,
  signMessageText = `Welcome , please sign this message to verify your identity.`,
  signMessage,
  onLogout,
  onSignIn,
}: IuseW3auth) => {
  const { verifySign, getNonce, logout, refresh } = useW3authAPI(API_URL);
  const [signedText, setSignedText] = useState<null | string>(null);

  const [userResponse, setUserReponse] = useState(null);
  const [refreshFailed, setRefreshFailed] = useState(false);

  const verifySignIn = async ({ signature }: { signature: string }) => {
    if (signature != '' && wallet_address) {
      const user_response = await verifySign({
        signature,
        signed_message: signedText!,
        wallet_address,
      });

      if (user_response.error) {
        toast.error(user_response.error);
        processDisconnect();
      } else {
        window.localStorage.setItem('refresh_token', 'true');

        setUserReponse(user_response);
      }
    } else {
      processDisconnect();
    }
  };

  /*
   * Get nonce from backend , verify it with the signature and save to context
   */

  const handleSignature = useCallback(async () => {
    const refreshToken = window.localStorage.getItem('refresh_token');

    if (wallet_address && token == null && !refreshToken) {
      const nonceData = await getNonce({
        wallet_address: wallet_address,
      });

      if (nonceData.error) {
        toast.error(nonceData.error);
        processDisconnect();
      }

      if (nonceData.nonce) {
        const message = `${signMessageText} Nonce: ${nonceData.nonce} \n Address: ${wallet_address}`;
        setSignedText(message);
        await signMessage(message);
      }
    }
  }, [wallet_address, token, signMessage]);

  const processDisconnect = useCallback(async () => {
    logout();

    onLogout();

    window.localStorage.removeItem('refresh_token');
  }, []);

  /*
   *	Refresh state
   */

  const handleRefreshToken = useCallback(async () => {
    if (token == null) {
      const refreshToken = window.localStorage.getItem('refresh_token');

      if (refreshToken) {
        const user_response = await refresh();

        setRefreshFailed(true);
        if (user_response.error) {
          toast.error(user_response.error);
          processDisconnect();
        } else {
          window.localStorage.setItem('refresh_token', 'true');

          setUserReponse(user_response);
        }
      } else {
        setRefreshFailed(true);
      }
    }
  }, [token]);

  useEffect(() => {
    handleRefreshToken();
  }, [handleRefreshToken]);

  useEffect(() => {
    if (token == null && wallet_address) {
      handleSignature();
    }
  }, [refreshFailed]);

  useEffect(() => {
    if (userResponse) {
      onSignIn(userResponse);
    }
  }, [userResponse]);

  return {
    verifySignIn,
    processDisconnect,
  };
};

export default useW3auth;
