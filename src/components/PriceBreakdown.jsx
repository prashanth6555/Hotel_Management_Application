import { formatMoney, nightLabel } from "../utils/format";
import { TAX_RATE } from "../utils/pricing";

export default function PriceBreakdown({ price, roomName }) {
  if (!price || price.nights < 1) {
    return <p className="muted">Add valid dates to see the total.</p>;
  }

  const taxLabel = `${Math.round(TAX_RATE * 100)}%`;

  return (
    <div>
      {roomName ? <p className="breakdown-room">{roomName}</p> : null}
      <dl className="breakdown">
        <div>
          <dt>
            {formatMoney(price.nightlyRate)} × {nightLabel(price.nights)}
          </dt>
          <dd>{formatMoney(price.roomTotal)}</dd>
        </div>
        {price.extraFee > 0 ? (
          <div>
            <dt>
              Extra guests ({price.extraGuests})
            </dt>
            <dd>{formatMoney(price.extraFee)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Taxes & fees ({taxLabel})</dt>
          <dd>{formatMoney(price.taxes)}</dd>
        </div>
        <div className="breakdown-total">
          <dt>Total</dt>
          <dd key={price.total}>{formatMoney(price.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
