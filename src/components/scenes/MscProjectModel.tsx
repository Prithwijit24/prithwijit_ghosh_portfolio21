export const MscProjectModel = () => (
  <div className="msc-model scene-3d" aria-hidden="true">
    <div className="msc-model-card">
      <svg className="msc-model-svg" viewBox="0 0 360 260">
        <defs>
          <linearGradient id="surfaceGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.7" />
            <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="axisGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path className="model-grid-line" d="M44 202 C116 166 224 166 316 202" />
        <path className="model-grid-line" d="M62 177 C132 145 226 145 296 177" />
        <path className="model-grid-line" d="M88 153 C142 130 218 130 272 153" />
        <path className="model-surface" d="M42 204 C92 172 112 94 180 74 C248 94 266 172 318 204 C240 230 120 230 42 204Z" fill="url(#surfaceGrad)" />
        <path className="model-curve" d="M48 199 C86 190 103 91 180 57 C257 91 274 190 312 199" />
        <path className="model-axis" d="M44 216 H320" />
        <path className="model-axis" d="M180 220 V44" />
        {[72, 112, 152, 192, 232, 272].map((x, index) => (
          <circle key={x} className="model-sample" cx={x} cy={188 - Math.sin(index / 5 * Math.PI) * 88} r="5" />
        ))}
      </svg>
      <div className="msc-model-label">
        <strong>Statistical model space</strong>
        <span>surface · fit · uncertainty</span>
      </div>
    </div>
  </div>
);
