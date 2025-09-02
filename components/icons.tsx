import React from 'react';

export const NewMeLogo: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#icon-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#a855f7'}} />
                <stop offset="50%" style={{stopColor: '#ec4899'}} />
                <stop offset="100%" style={{stopColor: '#f97316'}} />
            </linearGradient>
        </defs>
        <path d="M4 4v16h16" />
        <path d="M4 20l7-7" />
        <path d="M11 13l4 4" />
        <path d="M15 17l5-5" />
    </svg>
);


export const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
  </svg>
);

export const PlusIcon: React.FC = () => (
  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
  </svg>
);

export const TrashIcon: React.FC = () => (
  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 5h16M7 8v8m4-8v8M5 5v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5M3 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v0" />
  </svg>
);

export const AwaitingIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l2.35 6.86h7.15l-5.77 4.2 2.35 6.88-5.78-4.2-5.79 4.2 2.36-6.88-5.77-4.2h7.15L12 2z"/>
    </svg>
);

export const TextIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 6.1H3" />
        <path d="M21 12.1H3" />
        <path d="M15.1 18.1H3" />
    </svg>
);

export const ImageIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const LinkIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
  </svg>
);

export const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const MagicWandIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2L12 7.5 9.5 2 4 4.5 9.5 7 2 9.5 7 12 2 14.5 9.5 17 4 19.5 9.5 22l2.5-5.5L14.5 22l5.5-2.5-2.5-5.5L22 14.5 17 12 22 9.5 17 7l5.5-2.5z"></path>
    </svg>
);

export const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className = "w-5 h-5", filled = true }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const TagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z"></path>
        <path d="M7 7h.01"></path>
    </svg>
);

export const CopyIcon: React.FC<{ copied?: boolean, className?: string }> = ({ copied = false, className = "w-5 h-5" }) => (
    copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} text-green-500`}>
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    )
);

export const AmazonLogo: React.FC = () => (
    <svg height="25" viewBox="0 0 102 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.98 20.255c-4.417 0-6.223-2.614-6.282-5.943h11.95c.01-.157.01-.314.01-.48 0-5.59-3.906-9.617-9.656-9.617C19.7 4.215 15 8.658 15 14.332c0 5.492 4.093 9.77 10.352 9.77 3.867 0 6.64-1.805 8.01-3.69l-2.076-1.564c-.95.99-2.295 1.835-3.64 1.835-1.785 0-2.858-.91-3.323-1.666l8.63-.03Zm-8.62-7.59c.284-1.637 1.63-2.79 3.324-2.79 1.64 0 2.927 1.153 3.197 2.79h-6.52Z" fill="#232F3E"></path>
        <path d="M43.792 23.857h-3.41V4.46h3.41v19.397Z" fill="#232F3E"></path>
        <path d="M54.192 14.332c0-5.55 3.79-9.617 9.53-9.617 5.75 0 9.54 4.067 9.54 9.617s-3.79 9.617-9.54 9.617c-5.74 0-9.53-4.067-9.53-9.617Zm15.75 0c0-3.64-.99-6.3-5.93-6.3-5.068 0-6.173 2.72-6.173 6.3 0 3.514 1.012 6.3 6.173 6.3 4.94 0 5.93-2.66 5.93-6.3Z" fill="#232F3E"></path>
        <path d="M85.034 10.74c1.325-1.393 2.53-1.606 4.015-1.606 1.765 0 2.5.58 2.5 1.836v12.642h-3.41V11.23c0-.687-.107-1.123-1.107-1.123-.625 0-1.178.294-1.578.852v12.653h-3.41V9.41h3.01v1.33Z" fill="#232F3E"></path>
        <path d="M96.444 14.332c0-5.55 3.79-9.617 9.53-9.617 5.75 0 9.54 4.067 9.54 9.617s-3.79 9.617-9.54 9.617c-5.74 0-9.53-4.067-9.53-9.617Zm15.75 0c0-3.64-.99-6.3-5.93-6.3-5.068 0-6.173 2.72-6.173 6.3 0 3.514 1.012 6.3 6.173 6.3 4.94 0 5.93-2.66 5.93-6.3Z" fill="#232F3E"></path>
        <path d="M3.593 23.857 7.18 4.46h3.69l3.587 19.397H11.23l-.76-4.54H6.12l-.76 4.54H3.593Zm4.46-7.39h.06L9.2 8.427 10.287 16.467H8.053Z" fill="#232F3E"></path>
        <path d="M0 16.15C0 14.025 1.57 13.5 3.19 13.5c2.42 0 4.85.5 4.85 2.65 0 2.15-2.43 2.65-4.85 2.65C1.57 18.8 0 18.275 0 16.15Zm1.16-5.76c-.7.1-1.16.48-1.16 1.07 0 .6.46.98 1.16.98.7 0 1.16-.37 1.16-.98 0-.6-.46-1.07-1.16-1.07Zm10.87-2.3c-.7.1-1.16.48-1.16 1.07 0 .6.46.98 1.16.98.7 0 1.16-.37 1.16-.98 0-.6-.46-1.07-1.16-1.07ZM19.2 16.15c0-2.125 1.57-2.65 3.19-2.65 2.42 0 4.85.5 4.85 2.65 0 2.15-2.43 2.65-4.85 2.65-1.62 0-3.19-.525-3.19-2.65ZM10.45 23.3c.7.1 1.16.48 1.16 1.07 0 .6-.46.98-1.16.98-.7 0-1.16-.37-1.16-.98 0-.6.46-1.07 1.16-1.07Zm-9.29 2.3c.7.1 1.16.48 1.16 1.07 0 .6-.46.98-1.16.98-.7 0-1.16-.37-1.16-.98 0-.6.46-1.07 1.16-1.07Z" fill="#FF9900"></path>
        <path d="M15.42 18.51c-1.33.2-2.9.2-4.14 1.18-.3.2-.6.4-.89.69a6.04 6.04 0 0 0-.25 8.43c.1.1.2.2.3.3l.03.02c.07.05.15.1.23.15.2.1.4.2.6.3.2.1.4.2.6.3l.02.01c2.16 1.28 5.2 1.07 7.02-.49a6.04 6.04 0 0 0 2.22-7.02c-.1-.2-.2-.4-.3-.6a6.04 6.04 0 0 0-4.5-3.5c-.3-.05-.6-.1-.9-.1ZM12.7 27.5c-2.9-1.72-3.2-5.7-1-8.1 2.2-2.4 6.3-2.1 8.1.8 1.78 2.9.3 6.8-2.6 8.1-1.4.8-3.1.8-4.5 0Z" fill="#FF9900"></path>
    </svg>
);
export const FlipkartLogo: React.FC = () => (
    <svg height="25" viewBox="0 0 102 31" fill="#2874F0" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.15 3.65h5.1v2.5H10.15v5h3.9v2.5h-3.9v7.7h-5.2v-17.7h5.2v2.5Z"></path>
        <path d="M22.95 21.35c2.7 0 4.2-1.6 4.2-3.8 0-2.3-1.5-3.8-4.2-3.8h-2.6v7.6h2.6Zm-2.6-10.1h2.8c2.4 0 3.8-1.3 3.8-3.3 0-2-1.4-3.3-3.8-3.3h-2.8v6.6Z"></path>
        <path d="M37.35 15.15h-4.8v6.2h5.7v-2.5h-3.2v-1.2h3.2v-2.5Zm.2-10.6c.9 0 1.5.6 1.5 1.4s-.6 1.4-1.5 1.4-1.5-.6-1.5-1.4.6-1.4 1.5-1.4Z"></path>
        <path d="M52.35 3.65h-5.2v17.7h5.2v-17.7Z"></path>
        <path d="M57.65 14.05v-10.4h5.2v10.2c0 3.2 1.8 4.9 4.8 4.9s4.8-1.7 4.8-4.9V3.65h5.2v10.4c0 6-4.3 8.3-10 8.3s-10-2.3-10-8.3Z"></path>
        <path d="M83.45 3.65h5.1v2.5h-5.1v5h3.9v2.5h-3.9v7.7h-5.2v-17.7h5.2v2.5Z"></path>
        <path d="M96.75 14.15c0 3.5 2 5.1 4.8 5.1s4.8-1.6 4.8-5.1V3.65h-5.2v10.3c0 1.2-.5 1.9-1.9 1.9s-1.9-.7-1.9-1.9V3.65h-5.2v10.5h.1Z"></path>
    </svg>
);
export const MeeshoLogo: React.FC = () => (
    <svg height="25" viewBox="0 0 102 31" fill="#F43397" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.24 3.7h8.8v2.7h-2.8v14.8h-3.2V6.4h-2.8V3.7Z"></path>
        <path d="M21.94 3.7c3.3 0 5.4 1.9 5.4 4.7v9h-3.2v-9c0-1.2-.8-1.9-2.2-1.9s-2.2.7-2.2 1.9v9h-3.2v-9c0-2.8 2.1-4.7 5.4-4.7Z"></path>
        <path d="M43.04 3.7c2.1 0 3.4.8 4.1 2l-2.4 1.5c-.3-.5-.9-.8-1.7-.8s-1.8.3-1.8 1.1v.2c.8-.3 1.8-.4 2.8-.4 3.3 0 5.2 1.6 5.2 4.6 0 2.9-2.1 4.7-5.4 4.7-3.4 0-5.6-1.9-5.6-4.8 0-3.3 2.1-5.1 4.8-5.1Zm-2.2 8.3c0 1.3.8 2 2.2 2s2.2-.7 2.2-2-1-2-2.3-2c-1.2 0-2.1.6-2.1 2Z"></path>
        <path d="M59.34 3.7c3.3 0 5.4 1.9 5.4 4.7v9h-3.2v-9c0-1.2-.8-1.9-2.2-1.9s-2.2.7-2.2 1.9v9h-3.2v-9c0-2.8 2.1-4.7 5.4-4.7Z"></path>
        <path d="M72.94 17.4h6.7v3.8h-9.9V3.7h3.2v13.7Z"></path>
        <path d="M90.34 3.7c3.3 0 5.4 1.9 5.4 4.7 0 1.9-.9 3.2-2.4 4l2.7 4.7h-3.7l-2.2-4.1h-1.6v4.1h-3.2V3.7h5Zm-2.2 6.5c1.2 0 2.1-.6 2.1-1.6s-.9-1.6-2.1-1.6h-1.6v3.2h1.6Z"></path>
    </svg>
);
export const MyntraLogo: React.FC = () => (
    <svg height="25" viewBox="0 0 102 31" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.7 13.1c0-.2-.1-.4-.2-.5l-3.1-3.1c-1.1-1.2-2.7-1.8-4.3-1.8h-4.9c-.3 0-.6.1-.8.4l-3.9 4.3v.1l-4 4.3c-.2.3-.2.6 0 .8.1.1.2.2.4.2h3.4c.2 0 .4-.1.5-.2l3.1-3.1c1.2-1.2 2.7-1.8 4.4-1.8h4.8c.3 0 .6-.1.8-.4l3.9-4.2v-.1l.1-.1Z"></path>
        <path d="m39.2 15.6-.1.1-3.9 4.2c-.2.3-.5.4-.8.4h-4.8c-1.7 0-3.3-.6-4.4-1.8l-3.1-3.1c-.1-.1-.3-.2-.5-.2h-3.4c-.2 0-.3 0-.4-.2-.2-.2-.2-.5 0-.8l4-4.3v-.1l3.9-4.3c.2-.3.5-.4.8-.4h4.9c1.6 0 3.1.6 4.3 1.8l3.1 3.1c.1.1.2.3.2.5l-4 4.3Z"></path>
        <path d="M51.9 13.1c0-.2-.1-.4-.2-.5l-3.1-3.1c-1.2-1.2-2.7-1.8-4.3-1.8h-4.9c-.3 0-.6.1-.8.4l-3.9 4.3v.1l-4 4.3c-.2.3-.2.6 0 .8.1.1.2.2.4.2h3.4c.2 0 .4-.1.5-.2l3.1-3.1c1.2-1.2 2.7-1.8 4.4-1.8h4.8c.3 0 .6-.1.8-.4l3.9-4.2v-.1l.1-.1Z"></path>
        <path d="m49.4 15.6-.1.1-3.9 4.2c-.2.3-.5.4-.8.4h-4.8c-1.7 0-3.3-.6-4.4-1.8l-3.1-3.1c-.1-.1-.3-.2-.5-.2h-3.4c-.2 0-.3 0-.4-.2-.2-.2-.2-.5 0-.8l4-4.3v-.1l3.9-4.3c.2-.3.5-.4.8-.4h4.9c1.6 0 3.1.6 4.3 1.8l3.1 3.1c.1.1.2.3.2.5l-4 4.3Z"></path>
        <path d="M72.9 20.3h2.3V8h-2.3v12.3Z"></path>
        <path d="m63 20.3h2.3V8h-2.3v12.3Z"></path>
        <path d="M83 20.3h2.3l-5.6-12.3h-2.3l-5.6 12.3h2.4l1.2-2.7h6.1l1.1 2.7Zm-5.3-4.4 1.9-4.4 1.9 4.4h-3.8Z"></path>
        <path d="M12.9 13.1c0-.2-.1-.4-.2-.5l-3.1-3.1c-1.1-1.2-2.7-1.8-4.3-1.8H.4c-.1 0-.2.1-.2.2s0 .2.1.3l6.4 7.1c.2.2.5.4.8.4h3.4c.2 0 .4-.1.5-.2l3.1-3.1c1.2-1.2 2.7-1.8 4.4-1.8h4.8c.3 0 .6-.1.8-.4l3.9-4.2v-.1c0-.2-.1-.4-.2-.5L18 2.5c-1.2-1.2-2.7-1.8-4.3-1.8H8.8c-.3 0-.6.1-.8.4L4.1 5.4v.1L.2 9.8c-.2.3-.2.6 0 .8.1.1.2.2.4.2h3.4c.2 0 .4-.1.5-.2l3.1-3.1c1.2-1.2 2.7-1.8 4.4-1.8h4.8c.3 0 .6-.1.8-.4l3.9-4.2v-.1l-4-4.3Z"></path>
        <path d="m96.3 8-6.1 12.3h2.4l4.9-10v10h2.2V8h-3.4Z"></path>
    </svg>
);