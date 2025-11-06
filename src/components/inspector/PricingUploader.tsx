import React, { ChangeEvent, useCallback } from 'react';
import styled from '@emotion/styled';
import Papa from 'papaparse';
import { pricingDb } from '../../data/catalog/pricingDb';
import { PricingItem } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
`;

const Button = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
`;

export interface PricingUploaderProps {
  onProjectUpload: (file: File) => Promise<void>;
}

export const PricingUploader: React.FC<PricingUploaderProps> = ({ onProjectUpload }) => {
  const handlePricingUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const parsed = await new Promise<PricingItem[]>((resolve, reject) => {
      Papa.parse<PricingItem>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          resolve(
            result.data.map((item) => ({
              ...item,
              price: Number(item.price)
            }))
          );
        },
        error: reject
      });
    });

    await pricingDb.replaceAll(parsed);
    alert(`Loaded ${parsed.length} pricing items.`);
  }, []);

  const handleProjectUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await onProjectUpload(file);
    },
    [onProjectUpload]
  );

  return (
    <Container>
      <div>
        <strong>Import Pricing CSV</strong>
        <Input type="file" accept=".csv" onChange={handlePricingUpload} />
      </div>
      <div>
        <strong>Import Project JSON</strong>
        <Input type="file" accept="application/json" onChange={handleProjectUpload} />
      </div>
      <div>
        <Button onClick={() => window.open('/api/export/pdf', '_blank')?.focus?.()}>Export PDF</Button>
        <Button onClick={() => window.open('/api/export/csv', '_blank')?.focus?.()}>Export CSV</Button>
      </div>
    </Container>
  );
};
