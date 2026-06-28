import type { CSSProperties, ReactElement } from 'react';

type Channel = { label: string; href: string; Icon: (p: { className?: string }) => ReactElement; external?: boolean };

export const ContactOrbit = ({ channels }: { channels: Channel[] }) => (
  <div className="contact-orbit-scene">
    <div className="contact-orbit-core" aria-hidden="true">
      <strong>Let&apos;s</strong>
      <span>connect</span>
    </div>
    <div className="contact-links">
      {channels.map(({ label, href, Icon, external }, index) => (
        <a
          key={label}
          className="contact-card"
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          style={{ '--i': index } as CSSProperties}
        >
          <Icon className="contact-card-icon" /><span>{label}</span>
        </a>
      ))}
    </div>
  </div>
);
