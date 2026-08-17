import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NAV_SECTIONS, NAV_CENTER_SECTIONS, PROFILE_LINKS } from '../data';
import { GitHubIcon, LinkedInIcon } from './Icons';
import { InterviewChatModal } from './InterviewChatModal';

export const SiteNav = () => {
  const [activeId, setActiveId] = useState<string>(NAV_SECTIONS[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_SECTIONS.map(({ id }) => id);
    const onScroll = () => {
      const line = Math.max(80, window.innerHeight * 0.32);
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
        else break;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <nav className="site-nav-inner" aria-label="Page sections">
        <div className="site-nav-left">
          <a href="#home" className="site-nav-brand" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <span className="site-nav-brand-dot" aria-hidden="true" />PG
          </a>
        </div>
        <div className="site-nav-center">
          <ul className="site-nav-links">
            {NAV_CENTER_SECTIONS.map(({ id, label, emoji }) => (
              <li key={id}>
                <a href={`#${id}`}
                  className={`site-nav-link${activeId === id ? ' site-nav-link--active' : ''}`}
                  aria-current={activeId === id ? 'true' : undefined}
                  onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>
                  <span className="site-nav-link-emoji" aria-hidden="true">{emoji}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-nav-right">
          <a href="#contact"
            className={`site-nav-action site-nav-action--contact${activeId === 'contact' ? ' site-nav-action--active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          <a href={PROFILE_LINKS.github} className="site-nav-action site-nav-action--icon site-nav-action--github" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <GitHubIcon className="site-nav-action-icon" />
          </a>
          <a href={PROFILE_LINKS.linkedin} className="site-nav-action site-nav-action--icon site-nav-action--linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <LinkedInIcon className="site-nav-action-icon" />
          </a>
        </div>
      </nav>
      {!isChatOpen && createPortal(
        <button type="button" className="interview-fab" onClick={() => setIsChatOpen(true)} aria-label="Interview me — open AI chat">
          <span className="interview-fab-icon" aria-hidden="true"><img src="/moxie_robot.png" alt="" className="interview-fab-img" /></span>
          <span className="interview-fab-label">Interview Me</span>
        </button>,
        document.body
      )}
      <InterviewChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </header>
  );
};
