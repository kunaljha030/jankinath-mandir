// Line icons for the "ऐतिहासिक एवं आध्यात्मिक महत्व" cards (24×24, drawn with currentColor)
const icons = {
  // Madhur upasana: two linked hearts (the Divine Couple)
  hearts: (
    <>
      <path d="M9 19s-6-3.8-6-8.2A3.2 3.2 0 0 1 9 9.4a3.2 3.2 0 0 1 6 1.4c0 4.4-6 8.2-6 8.2z" />
      <path d="M15 16.5s-5-3.2-5-6.9A2.7 2.7 0 0 1 15 8.4a2.7 2.7 0 0 1 5 1.2c0 3.7-5 6.9-5 6.9z" />
    </>
  ),
  // Rasik literature: open granth
  book: (
    <>
      <path d="M3 5.5c3-1 6-.7 9 1.2v13c-3-1.9-6-2.2-9-1.2z" />
      <path d="M21 5.5c-3-1-6-.7-9 1.2v13c3-1.9 6-2.2 9-1.2z" />
    </>
  ),
  // Ganga Ji from the chimta: water drop over waves
  water: (
    <>
      <path d="M12 3s5 5.8 5 9.3a5 5 0 0 1-10 0C7 8.8 12 3 12 3z" />
      <path d="M3 20.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
    </>
  ),
  // Shri Bhaktamal: a mala of beads
  mala: (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <circle
          key={a}
          cx={12 + 6.5 * Math.sin((a * Math.PI) / 180)}
          cy={10 - 6.5 * Math.cos((a * Math.PI) / 180)}
          r="1.5"
        />
      ))}
      <path d="M12 16.5V21M10 21h4" />
    </>
  ),
  // Mandir: shikhar with dhwaja
  temple: (
    <>
      <path d="M12 2v3l3-1-3-1" />
      <path d="M12 5c-2.2 2.8-4.5 4-4.5 6.5h9C16.5 9 14.2 7.8 12 5z" />
      <path d="M6 11.5h12M7 11.5V21M17 11.5V21M4 21h16" />
      <path d="M10.3 21v-3.5a1.7 1.7 0 0 1 3.4 0V21" />
    </>
  ),
  // Gau seva: cow face
  cow: (
    <>
      <path d="M6 4.5c0 2.2 1.4 3.5 3 3.5M18 4.5c0 2.2-1.4 3.5-3 3.5" />
      <path d="M7.6 9.6 4 10.2l2.8 2.1M16.4 9.6l3.6.6-2.8 2.1" />
      <path d="M9 8h6l1.5 3-1 6.5a3.5 3.5 0 0 1-7 0L7.5 11z" />
      <path d="M10.4 12.3h.01M13.6 12.3h.01M10.8 18.4h.01M13.2 18.4h.01" />
    </>
  ),
  // Ved vidya: diya, the lamp of knowledge
  diya: (
    <>
      <path d="M12 3c1.7 2.1 2.5 3.6 2.5 5.1a2.5 2.5 0 0 1-5 0C9.5 6.6 10.3 5.1 12 3z" />
      <path d="M3.5 13h17c0 3.6-3.8 6.5-8.5 6.5S3.5 16.6 3.5 13z" />
      <path d="M20.5 13 22 11.5M8 21.5h8" />
    </>
  ),
};

export const hasSignificanceIcon = (name) => name in icons;

export default function SignificanceIcon({ name, size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}
