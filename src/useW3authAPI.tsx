interface IverifySign {
  signature: string;
  signed_message: string;
  wallet_address: string;
}

const useW3authAPI = (API_URL = '') => {
  const verifySign = async ({
    signature,
    signed_message,
    wallet_address,
  }: IverifySign) => {
    const verifyCall = await fetch(API_URL + '/api/auth/verify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signature,
        signed_message,
        wallet_address,
      }),
    });

    const response = await verifyCall.json();

    return response;
  };

  const getNonce = async ({ wallet_address }: { wallet_address: string }) => {
    const nonceCall = await fetch(API_URL + '/api/auth/nonce', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: wallet_address }),
    });

    const response = await nonceCall.json();

    return response;
  };

  const logout = async () => {
    await fetch(API_URL + '/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: '',
    });
  };

  const refresh = async () => {
    const refreshCall = await fetch(API_URL + '/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await refreshCall.json();
    return response;
  };

  return {
    verifySign,
    getNonce,
    logout,
    refresh,
  };
};

export { useW3authAPI };
