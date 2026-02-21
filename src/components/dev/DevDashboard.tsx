'use client';

import React from 'react';
import { DevLayout } from './DevLayout';
import { DesignSystem } from './DesignSystem';
import { IconTest } from './IconTest';

/**
 * DevDashboard Component
 *
 * Aggregates all development test components into a single unified view.
 * This encapsulates the layout and composition for use in the /dev route.
 */
export function DevDashboard() {
  return (
    <DevLayout
      title='Developer Dashboard'
      description='Unified view of all project design system and component benchmarks'
    >
      <div className='space-y-10xl'>
        <DesignSystem showLayout={false} />
        <IconTest showLayout={false} />
      </div>
    </DevLayout>
  );
}
