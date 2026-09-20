import React from 'react';
import {
  ShieldAlert,
  Cpu,
  BookOpen,
  Network,
  Sparkles,
  ArrowRight,
  Database,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-[#0067C5] transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">About ManakSetu</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-[#0067C5] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#0067C5]" />
            <span>SIH 2026 NATIONAL PROTOTYPE INITIATIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] tracking-tight">
            About ManakSetu
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            &ldquo;From Requirement to the Right Standard&rdquo; — An AI-powered decision-support platform connecting public procurement requirements to applicable Indian Standards (BIS).
          </p>
        </div>

        {/* The Problem & The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              The Challenge
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0B192C]">
              Natural Language vs Structured Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Public tenders and procurement documents are authored in descriptive natural language (e.g. <em>&ldquo;500 wall-mounted 25 litre electric storage water heaters for government hostels&rdquo;</em>). Conversely, Indian Standards published by the Bureau of Indian Standards (BIS) are rigorously structured technical specifications indexed by numerical codes.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Procurement officers and tender drafting authorities often struggle to identify the correct primary product standards, cross-referenced safety requirements, and whether cited standards have been superseded by newer editions.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0067C5] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              The Solution
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0B192C]">
              The ManakSetu Decision-Support Layer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              &ldquo;BIS provides the authoritative standards discovery layer. ManakSetu is the AI decision-support layer.&rdquo;
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              ManakSetu understands procurement requirements, retrieves candidate standards using genuine 384-dimensional semantic embeddings, determines applicability through multi-factor evidence evaluation, traces normative relationships in a knowledge graph, and alerts authorities to superseded revisions.
            </p>
          </div>
        </div>

        {/* Architecture Pipeline Visual */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0B192C] uppercase tracking-wide">
              Decision Support Architecture & Processing Flow
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end processing pipeline from user requirement to explainable standard recommendation.
            </p>
          </div>

          {/* Connected Flowchart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
            {[
              { title: 'User Requirement', sub: 'Natural text statement', bg: 'bg-slate-50 border-slate-200 text-slate-800' },
              { title: 'AI Analyzer', sub: 'Entities & context', bg: 'bg-blue-50 border-blue-200 text-[#0067C5]' },
              { title: 'Semantic Retrieval', sub: '384-d vector embeddings', bg: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
              { title: 'Evidence Engine', sub: 'Scope & title verification', bg: 'bg-purple-50 border-purple-200 text-purple-800' },
              { title: 'Knowledge Graph', sub: 'Normative references', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { title: 'Explainable Rec', sub: 'Evidence + version check', bg: 'bg-amber-50 border-amber-200 text-amber-800' },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border ${step.bg} flex flex-col justify-center items-center`}
              >
                <span className="text-xs font-black">{step.title}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{step.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Architectural Pillars */}
        <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
            Technical Design Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-blue-900/60 w-fit text-[#38BDF8]">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Genuine Semantic Retrieval</h4>
              <p className="leading-relaxed text-slate-400">
                Uses 384-dimensional vector embeddings with cosine similarity for technical candidate discovery without synthetic hash fallbacks.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-emerald-900/60 w-fit text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Strict Fingerprint Caching</h4>
              <p className="leading-relaxed text-slate-400">
                Vector cache automatically invalidates using a cryptographic fingerprint whenever standards scope, status, or attributes are modified.
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
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 space-y-2 text-amber-950 text-xs leading-relaxed">
          <div className="flex items-center space-x-2 font-black text-sm text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>DECISION-SUPPORT PROTOTYPE DISCLAIMER</span>
          </div>
          <p className="font-semibold">
            ManakSetu is an AI-powered decision-support prototype designed to assist public procurement officers and tender authorities in identifying applicable Indian Standards (BIS).
          </p>
          <p>
            ManakSetu does not replace official BIS publications, certification schemes, statutory requirements, or professional verification.
          </p>
          <p>
            Recommendations provided by this platform must be verified against authoritative Gazette notifications, official BIS documentation, and applicable Quality Control Orders (QCOs) issued by the Government of India.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0067C5] hover:bg-[#0054A3] shadow-md transition"
          >
            Start Analyzing Requirements Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
