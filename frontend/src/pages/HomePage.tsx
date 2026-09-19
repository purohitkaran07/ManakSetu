import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CapabilityStrip } from '../components/home/CapabilityStrip';
import { WorkflowAndActions } from '../components/home/WorkflowAndActions';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeroSection />
      <CapabilityStrip />
      <WorkflowAndActions />
    </div>
  );
};
