import { useEffect, useRef, useState } from 'react';
import { ROLES } from '../data';

export const useTypewriter = () => {
  const [text, setText] = useState('');
  const stateRef = useRef({ roleIndex: 0, charIndex: 0, isDeleting: false });
  useEffect(() => {
    const state = stateRef.current;
    const currentRole = ROLES[state.roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!state.isDeleting && state.charIndex < currentRole.length) {
      timeout = setTimeout(() => { state.charIndex += 1; setText(currentRole.slice(0, state.charIndex)); }, 80);
    } else if (!state.isDeleting && state.charIndex === currentRole.length) {
      timeout = setTimeout(() => { state.isDeleting = true; }, 2000);
    } else if (state.isDeleting && state.charIndex > 0) {
      timeout = setTimeout(() => { state.charIndex -= 1; setText(currentRole.slice(0, state.charIndex)); }, 40);
    } else if (state.isDeleting && state.charIndex === 0) {
      state.isDeleting = false;
      state.roleIndex = (state.roleIndex + 1) % ROLES.length;
    }
    return () => clearTimeout(timeout);
  }, [text]);
  return text;
};
