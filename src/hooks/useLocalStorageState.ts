import React, { useEffect, useState } from "react";

// A custom hook that automatically saves state to local storage when it changes
export const useLocalStorageState = <T>(defaultState: T, localStorageKey: string) => {
    const [localStorageState, setLocalStorageState] = useState(getInitialState());

    function getInitialState() {
        const localStorageItem = localStorage.getItem(localStorageKey);

        return localStorageItem ? JSON.parse(localStorageItem) : defaultState;
    }

    useEffect(() =>
        localStorage.setItem(localStorageKey, JSON.stringify(localStorageState))
        , [localStorageState])

    return [localStorageState, setLocalStorageState];
}