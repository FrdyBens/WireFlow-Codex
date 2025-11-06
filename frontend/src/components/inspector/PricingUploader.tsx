import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { usePricingStore } from '../../state/usePricingStore';
import { parsePricingCsv, seedPricing } from '../../logic/costing/pricing';
import samplePricing from '../../data/catalog/pricing.csv?raw';

const containerStyle = css`
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.9);
`;

function PricingUploader() {
  const { items, loadFromDb, replacePricing, loading, error } = usePricingStore();
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadFromDb();
  }, [loadFromDb]);

  useEffect(() => {
    seedPricing(items);
  }, [items]);
  useEffect(() => {
    if (items.length === 0) {
      const blob = new Blob([samplePricing], { type: 'text/csv' });
      const file = new File([blob], 'pricing.csv', { type: 'text/csv' });
      parsePricingCsv(file)
        .then((records) => replacePricing(records))
        .catch((error) => console.warn('Failed to load sample pricing', error));
    }
  }, [items.length, replacePricing]);


  return (
    <div css={containerStyle}>
      <h4>Pricing database</h4>
      <p>{items.length} items loaded.</p>
      <input
        type="file"
        accept="text/csv"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setImporting(true);
          try {
            const records = await parsePricingCsv(file);
            await replacePricing(records);
          } catch (uploadError) {
            console.error(uploadError);
          } finally {
            setImporting(false);
          }
        }}
      />
      {(loading || importing) && <p>Importing pricing...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default PricingUploader;
