import { formatINR } from "../../utils/money.js";

// Progress bar + "₹x raised of ₹goal" + number of donations
export default function DonationProgress({ raised, goal, percent, donationCount }) {
  return (
    <div className="donation-progress">
      <div
        className="donation-progress__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`लक्ष्य का ${percent}% प्राप्त`}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="donation-progress__stats">
        <div>
          <strong>{percent}%</strong>
          <span>
            {formatINR(goal)} में से {formatINR(raised)}
          </span>
        </div>
        <div className="donation-progress__count">
          <strong>{donationCount}</strong>
          <span>दान</span>
        </div>
      </div>
    </div>
  );
}
