# useW3auth

w3auth react hook

[![w3auth](https://raw.githubusercontent.com/Devzstudio/useW3auth/main/preview.png 'w3auth')]()

# Usage

1. Install Package

```
yarn add @devzstudio/w3auth-hook
```

or

```
npm install @devzstudio/w3auth-hook
```

2. Import w3auth-hook

```
import { useW3auth } from '@devzstudio/w3auth-hook'
```

3. Initialize hook with sign function

```
const { data, error, signMessage } = useSignMessage();

const { verifySignIn, processDisconnect } = useW3auth({
	API_URL: API_URL,
	wallet_address: account?.address,
	signMessageText: Config.SignMessageText,
	token: auth.token,
	onLogout: () => {
		disconnect();
	},
	onSignIn: (response) => {
		if (response) {
			authDispatch({
				type: AuthActionTypes.SET_USER,
				payload: response,
			});
		}
	},
	signMessage: async (message) => {
		await signMessage({ message });
	},
});

useEffect(() => {
	if (data) {
		verifySignIn({
			signature: data,
		});
	}
}, [data]);

useEffect(() => {
	if (error) {
		processDisconnect();
	}
}, [error]);

```

# useW3auth Props

| Name            | Description                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API_URL         | (Optional) If w3auth is hosted on another domain or subdomain, specify that domain.                                                                             |
| wallet_address  | Pass the wallet address to login                                                                                                                                |
| signMessageText | (Optional) This message will be shown to the user on sign in page                                                                                               |
| token           | Pass the JWT token obtained after sign in (You can pass null initially)                                                                                         |
| onLogout        | This function will be called once the user logout.                                                                                                              |
| onSignIn        | This function will be called once the user sign in. Token and user details will be on the response                                                              |
| signMessage     | Message with nonce is passed to this function. Based on the blockchain you need to sign the message. In the above example wagmi.sh is used to sign in ETH Chain |
