import { css } from '@emotion/react';
import { useProjectStore } from '../../state/useProjectStore';

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
`;

const cellStyle = css`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 13px;
`;

function BomTable() {
  const bom = useProjectStore((state) => state.bom);

  return (
    <div>
      <table css={tableStyle}>
        <thead>
          <tr>
            <th css={cellStyle}>Item</th>
            <th css={cellStyle}>Qty</th>
            <th css={cellStyle}>Unit</th>
            <th css={cellStyle}>Unit Price</th>
            <th css={cellStyle}>Total</th>
          </tr>
        </thead>
        <tbody>
          {bom.items.map((item) => (
            <tr key={item.name}>
              <td css={cellStyle}>{item.name}</td>
              <td css={cellStyle}>{item.quantity}</td>
              <td css={cellStyle}>{item.unit}</td>
              <td css={cellStyle}>${item.unitPrice.toFixed(2)}</td>
              <td css={cellStyle}>${item.total.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td css={cellStyle} colSpan={4}>
              <strong>Total</strong>
            </td>
            <td css={cellStyle}>
              <strong>${bom.totalCost.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <h4>Cost by category</h4>
      <ul>
        {Object.entries(bom.byCategory).map(([category, value]) => (
          <li key={category}>
            {category}: ${value.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BomTable;
