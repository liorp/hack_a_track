import { useEffect, useState } from 'react'
import localforage from 'localforage'

export default function useLocalForage ( key: string, initialValue?: any ) {
	const [storedValue, setStoredValue] = useState(initialValue);

	useEffect(() => {
		(async function () {
			try {
				const value = await localforage.getItem(key);
				setStoredValue(value);
			} catch ( err ) {
				return initialValue;
			}
		})();
	}, [initialValue, storedValue, key]);

	/** Set value */
	const set = ( value: any ) => {
		(async function () {
			try {
				await localforage.setItem(key, value);
				setStoredValue(value);
			} catch (err) {
				return initialValue;
			}
		})();
	};

	/** Removes value from local storage */
	const remove = () => {
		(async function () {
			try {
				await localforage.removeItem(key);
				setStoredValue(null);
			} catch (e) {}
		})();
	};

	return [storedValue, set, remove];
}
