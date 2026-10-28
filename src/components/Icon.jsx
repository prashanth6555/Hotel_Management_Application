const icons = {
  search: () => (
    <>
      <circle cx="11" cy="11" r="6.25" />
      <path d="M16 16.5 20.5 21" />
    </>
  ),
  pin: () => (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  calendar: () => (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M3.5 10h17" />
    </>
  ),
  users: () => (
    <>
      <path d="M16 20v-1.2A3.8 3.8 0 0 0 12.2 15H7.8A3.8 3.8 0 0 0 4 18.8V20" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 20v-1.1A3.4 3.4 0 0 0 17.2 15.6" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6" />
    </>
  ),
  star: () => <polygon points="12 3.2 14.7 8.7 20.7 9.4 16.2 13.6 17.4 19.6 12 16.6 6.6 19.6 7.8 13.6 3.3 9.4 9.3 8.7" fill="currentColor" stroke="none" />,
  check: () => <path d="M5 12.5 9.2 17 19 7" />,
  close: () => (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  arrow: () => <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: () => (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  wifi: () => (
    <>
      <path d="M4.5 10.2a11 11 0 0 1 15 0" />
      <path d="M7.4 13.2a7 7 0 0 1 9.2 0" />
      <path d="M12 18h.01" />
    </>
  ),
  pool: () => (
    <>
      <path d="M3 16c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />
      <path d="M3 20c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" />
      <path d="M7 12V6.5a2 2 0 0 1 4 0" />
    </>
  ),
  spa: () => (
    <>
      <path d="M12 21c4-3 6-6.2 6-9.2A6 6 0 0 0 6 11.8C6 14.8 8 18 12 21z" />
      <path d="M12 21V10" />
    </>
  ),
  breakfast: () => (
    <>
      <path d="M5 9h9v5a4.5 4.5 0 0 1-9 0V9z" />
      <path d="M14 10h2.5a2.5 2.5 0 0 1 0 5H14" />
      <path d="M7 4.5v2M10 4.5v2" />
    </>
  ),
  parking: () => (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M9 17V7.5h3.2a2.6 2.6 0 0 1 0 5.2H9" />
    </>
  ),
  ac: () => (
    <>
      <path d="M12 3v4M12 17v4M4.8 6.2l2.8 2.8M16.4 15l2.8 2.8M3 12h4M17 12h4M4.8 17.8 7.6 15M16.4 9l2.8-2.8" />
    </>
  ),
  gym: () => (
    <>
      <path d="M6 9v6M18 9v6M3.5 10.5v3M20.5 10.5v3M6 12h12" />
    </>
  ),
  beach: () => (
    <>
      <circle cx="16" cy="7" r="2.4" />
      <path d="M3 18c2 1.4 3.8 1.4 5.8 0s3.8-1.4 5.8 0 3.8 1.4 5.8 0" />
      <path d="M8 18 12.5 8" />
    </>
  ),
  fire: () => <path d="M12 21c4 0 6-2.8 6-6.2 0-3.2-2.4-5-3.2-7.3 0 0-.2 2.4-1.8 3.5C11.2 8.2 12 4 12 4c-3.2 2.4-6 5.6-6 10.2C6 18 8.2 21 12 21z" />,
  bell: () => (
    <>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  car: () => (
    <>
      <path d="M4 15.5 6 9.5h12l2 6" />
      <path d="M3.5 15.5h17V18a1 1 0 0 1-1 1h-1.2" />
      <path d="M6.2 19H5.5a1 1 0 0 1-1-1" />
      <circle cx="7.5" cy="18.2" r="1.4" />
      <circle cx="16.5" cy="18.2" r="1.4" />
    </>
  ),
  kitchen: () => (
    <>
      <path d="M8 3.5v7M6 3.5v3.2M10 3.5v3.2M8 7.2v3.3" />
      <path d="M8 10.5V21" />
      <path d="M15 3.5c1.6 2 2.4 3.8 2.4 6.2 0 2.2-1.2 3.3-2.4 3.3S12.6 11.9 12.6 9.7c0-2.4.8-4.2 2.4-6.2z" />
      <path d="M15 13v8" />
    </>
  ),
  bed: () => (
    <>
      <path d="M3.5 18V8" />
      <path d="M3.5 14h17V18" />
      <path d="M20.5 18v-6a2 2 0 0 0-2-2H9v6" />
      <circle cx="7.2" cy="12" r="1.1" />
    </>
  ),
};

export default function Icon({ name, className = "icon" }) {
  const Graphic = icons[name] || icons.check;
  const filled = name === "star";
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Graphic />
    </svg>
  );
}
