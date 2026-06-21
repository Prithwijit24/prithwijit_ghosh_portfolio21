import { type ReactNode } from 'react';
import { blendStops } from '../theme';
import type { CSSProperties } from 'react';

type SectionShellProps = {
  id: string;
  accentKey: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const SectionShell = ({
  id, accentKey, children, className = '', contentClassName = 'max-w-6xl'
}: SectionShellProps) => {
  const { from, to } = blendStops(accentKey);
  const styleVars = {
    '--accent-in': from,
    '--accent-out': to
  } as CSSProperties;
  return (
    <section
      id={id}
      className={`section-shell blend-section content-section scroll-section ${className}`}
      style={styleVars}
    >
      <div className={`section-shell-content ${contentClassName}`}>
        {children}
      </div>
      <span className="section-blend-overlay" aria-hidden="true" />
    </section>
  );
};
