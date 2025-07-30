'use client';

import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Transition context
 * state:  'idle' | 'exit'
 */
const TransitionCtx = createContext({
  state: 'idle',
  startExit: () => {},
  reset: () => {},
});

/* ------------------------------------------------------------
   Provider
------------------------------------------------------------ */
export function RouteTransitionProvider({ children }) {
  const [state, setState] = useState('idle');   // <-- plain JS, no generics

  const startExit = useCallback(() => setState('exit'), []);
  const reset     = useCallback(() => setState('idle'), []);

  return (
    <TransitionCtx.Provider value={{ state, startExit, reset }}>
      {children}
    </TransitionCtx.Provider>
  );
}

/* ------------------------------------------------------------
   Hook
------------------------------------------------------------ */
export function useRouteTransition() {
  return useContext(TransitionCtx);
}
