import React from 'react';
import {
  ShieldAlert,
  Cpu,
  BookOpen,
  Network,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            SIH 2026 NATIONAL PROTOTYPE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About ManakSetu
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            "From Requirement to the Right Standard" — An AI-powered decision-support layer connecting public procurement clauses to applicable Indian Standards.
          </p>
        </div>

        {/* The Problem & The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              The Challenge
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Natural Language vs Structured Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Public tenders and procurement documents are authored in descriptive natural language (e.g. <em>"500 wall-mounted 25 litre electric storage water heaters for government hostels"</em>). Conversely, Indian Standards published by the Bureau of Indian Standards (BIS) are rigorously structured technical codes indexed by formal numerical designations.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Procurement officers and tender drafting authorities often struggle to identify the correct primary product standards, cross-referenced safety requirements, and whether referenced standards have been superseded by newer editions.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              The Solution
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              The ManakSetu Decision-Support Layer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>"BIS provides the authoritative standards discovery layer. ManakSetu is the AI decision-support layer."</strong>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              ManakSetu understands procurement requirements, retrieves candidate standards using genuine 384-dimensional semantic embeddings, determines applicability through multi-factor evidence evaluation, traces normative relationships in a knowledge graph, and alerts authorities to superseded revisions.
            </p>
          </div>
        </div>

        {/* Architecture Pipeline Visual */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Decision Support Architecture & Flow
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end processing pipeline from user requirement to explainable standard recommendation.
            </p>
          </div>

          {/* Connected Flowchart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
            {[
              { title: 'User Requirement', sub: 'Natural text statement', bg: 'bg-slate-50 border-slate-200 text-slate-800' },
              { title: 'AI Analyzer', sub: 'Entities & context', bg: 'bg-blue-50 border-blue-200 text-blue-800' },
              { title: 'Semantic Retrieval', sub: '384-d vector embeddings', bg: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
              { title: 'Evidence Engine', sub: 'Scope & title verification', bg: 'bg-purple-50 border-purple-200 text-purple-800' },
              { title: 'Knowledge Graph', sub: 'Normative references', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { title: 'Explainable Rec', sub: 'Evidence + version check', bg: 'bg-amber-50 border-amber-200 text-amber-800' },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border ${step.bg} flex flex-col justify-center items-center`}
              >
                <span className="text-xs font-extrabold">{step.title}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{step.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Architectural Pillars */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Technical Design Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-blue-900/60 w-fit text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Genuine Semantic Retrieval</h4>
              <p className="leading-relaxed text-slate-400">
                Uses sentence-transformers/all-MiniLM-L6-v2 to generate 384-dimensional vector embeddings with cosine similarity. No synthetic hash embeddings.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-emerald-900/60 w-fit text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Strict Fingerprint Caching</h4>
              <p className="leading-relaxed text-slate-400">
                Vector cache automatically invalidates using a 9-field cryptographic fingerprint whenever standards scope, status, or attributes are modified.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-amber-900/60 w-fit text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Source-Bound Certification</h4>
              <p className="leading-relaxed text-slate-400">
                Certification status values are preserved verbatim from the authoritative database, avoiding fabricated regulatory assertions.
              </p>
            </div>
          </div>
        </div>

        {/* Non-Affiliation Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 space-y-2 text-amber-900 text-xs leading-relaxed">
          <div className="flex items-center space-x-2 font-extrabold text-sm text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>DECISION-SUPPORT PROTOTYPE DISCLAIMER</span>
          </div>
          <p className="font-semibold">
            ManakSetu is an AI-powered decision-support prototype designed to help users understand which Indian Standards may apply to a procurement requirement.
          </p>
          <p>
            ManakSetu is a decision-support prototype and does not replace official BIS publications, certification processes, legal requirements, or professional verification.
          </p>
          <p>
            Recommendations provided by this platform are potentially applicable standards identified from the available knowledge base and must be verified against authoritative BIS publications, Gazette notifications, and applicable Quality Control Orders (QCOs) issued by the Government of India.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
          >
            Start Analyzing Requirements Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
