import { useEffect, useState } from 'react';
import { NAV_SECTIONS, NAV_CENTER_SECTIONS, PROFILE_LINKS } from '../data';
import { GitHubIcon, LinkedInIcon, DownloadIcon, MenuIcon, CloseIcon } from './Icons';

export const SiteNav = () => {
  const [activeId, setActiveId] = useState<string>(NAV_SECTIONS[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -52% 0px', threshold: [0.12, 0.35, 0.6] }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu automatically if the viewport grows back past the breakpoint
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 860) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
    setIsMenuOpen(false);
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
            className={`site-nav-action${activeId === 'contact' ? ' site-nav-action--active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          <a href={PROFILE_LINKS.github} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <GitHubIcon className="site-nav-action-icon" />
          </a>
          <a href={PROFILE_LINKS.linkedin} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <LinkedInIcon className="site-nav-action-icon" />
          </a>
          <button
            type="button"
            className="site-nav-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="site-nav-mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <CloseIcon className="site-nav-toggle-icon" /> : <MenuIcon className="site-nav-toggle-icon" />}
          </button>
        </div>
      </nav>

      <div id="site-nav-mobile-menu" className={`site-nav-mobile-menu${isMenuOpen ? ' site-nav-mobile-menu--open' : ''}`}>
        <ul className="site-nav-mobile-links">
          {NAV_SECTIONS.map(({ id, label, emoji }) => (
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
        <div className="site-nav-mobile-social">
          <a href={PROFILE_LINKS.resume} target="_blank" rel="noopener noreferrer" className="site-nav-action">
            <DownloadIcon className="site-nav-action-icon" />
            <span>Resume</span>
          </a>
          <a href={PROFILE_LINKS.github} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <GitHubIcon className="site-nav-action-icon" />
          </a>
          <a href={PROFILE_LINKS.linkedin} className="site-nav-action site-nav-action--icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <LinkedInIcon className="site-nav-action-icon" />
          </a>
        </div>
      </div>
    </header>
  );
};
