import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, LoaderIcon, SendIcon, SparklesIcon } from './Icons';

type InterviewChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const InterviewChatModal = ({ isOpen, onClose }: InterviewChatModalProps) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data: { answer?: string; error?: string } = await res.json();
      if (data.error) setError(data.error);
      else setResponse(data.answer ?? 'Sorry, I had no answer for that.');
    } catch {
      setError('My AI clone is currently unreachable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="interview-modal" role="presentation" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="interview-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-modal-title"
        onKeyDown={trapFocus}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButtonRef} type="button" className="interview-modal-close" onClick={onClose} aria-label="Close interview chat">
          <CloseIcon className="interview-modal-close-icon" />
        </button>
        <div className="chat-spring interview-chat">
          <h4 id="interview-modal-title" className="text-2xl font-bold text-spring-ink mb-2 flex items-center gap-2">
            <SparklesIcon className="text-teal-400 w-6 h-6" />
            Interview My AI Clone
          </h4>
          <p className="text-spring-muted text-sm mb-2">Ask my digital twin about my background.</p>
          <p className="chat-demo-note">Powered by Gemini with RAG over my résumé &amp; portfolio — answers are grounded in real facts.</p>
          <form onSubmit={handleSubmit} className="chat-form">
            <label className="sr-only" htmlFor="interview-query">Ask a question</label>
            <input
              id="interview-query"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g., Have you worked with cloud ETL pipelines?"
              className="chat-input"
            />
            <button type="submit" className="chat-submit" aria-label="Send message" disabled={isLoading}>
              {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
            </button>
          </form>
          {(response || error) && (
            <div className="chat-response">
              <p className="text-sm">{error || response}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
