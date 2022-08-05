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

``
```
