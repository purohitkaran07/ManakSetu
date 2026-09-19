import React from 'react';
import { StructuredRequirement } from '../../types';
import { CheckCircle2, AlertCircle, Box, Layers, Hash, Wrench, Building2, FileCheck } from 'lucide-react';

interface Props {
  data: StructuredRequirement;
}

export const RequirementSummary: React.FC<Props> = ({ data }) => {
  const isFieldInferred = (fieldName: string) => {
    return data.inferred_fields.includes(fieldName);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center">
            <Box className="w-4 h-4 mr-2 text-blue-600" />
            Requirement Understanding & Entity Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured parameters extracted from natural language. Explicit values are separated from inferred domains.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-semibold">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>
            EXPLICIT
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></span>
            INFERRED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Product */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold flex items-center">
              <Box className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Target Product
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700">
              EXPLICIT
            </span>
          </div>
          <span className="font-bold text-sm text-slate-900">
            {data.product || 'Not Specified'}
          </span>
        </div>

        {/* Category */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              Product Category
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
              isFieldInferred('product_category')
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {isFieldInferred('product_category') ? 'INFERRED' : 'EXPLICIT'}
            </span>
          </div>
          <span className="font-bold text-slate-900">
            {data.product_category || 'General Equipment'}
          </span>
        </div>

        {/* Quantity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold flex items-center">
              <Hash className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Quantity
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700">
              EXPLICIT
            </span>
          </div>
          <span className="font-bold text-slate-900">
            {data.quantity !== null && data.quantity !== undefined ? `${data.quantity} units` : 'Not Specified'}
          </span>
        </div>

        {/* Specifications / Capacity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold flex items-center">
              <Wrench className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Specifications & Capacity
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700">
              EXPLICIT
            </span>
          </div>
          <span className="font-bold text-slate-900">
            {Object.keys(data.specifications).length > 0
              ? Object.entries(data.specifications).map(([k, v]) => `${k}: ${v}`).join(', ')
              : 'None Stated'}
          </span>
        </div>

        {/* Installation */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Installation Type
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700">
              EXPLICIT
            </span>
          </div>
          <span className="font-bold text-slate-900">
            {data.installation || 'Not Specified'}
          </span>
        </div>

        {/* Application / Context */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold flex items-center">
              <FileCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Application & Procurement Context
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700">
              EXPLICIT
            </span>
          </div>
          <span className="font-bold text-slate-900">
            {[data.application, data.procurement_context].filter(Boolean).join(' • ') || 'Standard Procurement'}
          </span>
        </div>
      </div>

      {/* Explicit standard mentions if any */}
      {data.explicitly_mentioned_standards.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Explicit standard citation detected in requirement text:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono font-bold text-blue-800">
            {data.explicitly_mentioned_standards.map((std, idx) => (
              <span key={idx} className="bg-white px-2 py-0.5 rounded border border-blue-300">
                {std}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing / Unspecified Information section */}
      {(() => {
        const missing: string[] = [];
        if (!data.quantity) missing.push('Quantity / Volume');
        if (!data.specifications || Object.keys(data.specifications).length === 0) missing.push('Detailed Specifications / Ratings');
        if (!data.installation) missing.push('Installation / Mounting Type');
        if (!data.application) missing.push('Facility / Application Environment');
        if (missing.length === 0) return null;
        return (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Unspecified / Omitted Parameters in Requirement:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((item, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
