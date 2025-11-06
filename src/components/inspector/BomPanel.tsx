import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useProjectStore } from '../../state/useProjectStore';

const Section = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #d1d5db;
`;

const Td = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const BomPanel: React.FC = () => {
  const { bom, refreshBom } = useProjectStore();

  useEffect(() => {
    refreshBom();
  }, [refreshBom]);

  return (
    <Section>
      <h3>Bill of Materials</h3>
      <Table>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Qty</Th>
            <Th>Unit</Th>
            <Th>Total</Th>
          </tr>
        </thead>
        <tbody>
          {bom.items.map((item) => (
            <tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.quantity.toFixed(2)}</Td>
              <Td>{item.unit}</Td>
              <Td>{item.totalPrice ? `£${item.totalPrice.toFixed(2)}` : '—'}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ marginTop: '1rem', fontWeight: 600 }}>Total: £{bom.totalCost.toFixed(2)}</div>
    </Section>
  );
};
