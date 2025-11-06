import React from 'react';
import { useProjectStore } from '../../state/useProjectStore';
import { PricingCatalog } from '../../logic/costing/pricing';
import { loadPricingFromFile } from '../../data/catalog/pricingLoader';

export const Toolbar: React.FC = () => {
  const { autoRoute, recalcBom, loadPricing } = useProjectStore();

  const handlePricingUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    try {
      const catalog: PricingCatalog = await loadPricingFromFile(event.target.files[0]);
      loadPricing(catalog);
    } catch (error) {
      console.error('Failed to load pricing file', error);
    }
  };

  return (
    <header className="toolbar">
      <h1>WireFlow Codex</h1>
      <div>
        <label className="button secondary" htmlFor="pricing-upload">
          Upload Pricing CSV
        </label>
        <input id="pricing-upload" type="file" accept=".csv" style={{ display: 'none' }} onChange={handlePricingUpload} />
        <button className="button" onClick={autoRoute} type="button">
          Auto-Route
        </button>
        <button className="button secondary" onClick={recalcBom} type="button">
          Refresh BOM
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
