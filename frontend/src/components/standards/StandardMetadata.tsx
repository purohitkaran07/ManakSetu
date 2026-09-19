import React from 'react';
import { StandardDetail } from '../../types';

interface Props {
  standard: StandardDetail;
}

export const StandardMetadata: React.FC<Props> = ({ standard }) => {
  const metadataEntries = [
    { label: 'Standard Number', value: standard.standard_number, isMono: true },
    { label: 'Edition / Year', value: String(standard.year) },
    { label: 'Standard Type', value: standard.standard_type },
    { label: 'Classification', value: standard.classification },
    { label: 'Life Cycle Status', value: standard.status, isBadge: true },
    { label: 'Certification Status', value: standard.certification_status },
    ...(standard.source_reference
      ? [{ label: 'Authoritative Source Reference', value: standard.source_reference }]
      : []),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Official Standard Metadata
        </h3>
      </div>
      <div className="p-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
          {metadataEntries.map((item, idx) => (
            <div key={idx} className="border-b border-slate-100 pb-2">
              <dt className="text-slate-500 font-medium">{item.label}</dt>
              <dd className={`mt-0.5 font-bold text-slate-900 ${item.isMono ? 'font-mono text-sm text-blue-700' : ''}`}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
