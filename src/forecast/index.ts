import React from 'react';
import { createRoot } from 'react-dom/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

import { TimedGraph } from './TimedGraph';  // Import your TimedGraph component
import './sandbox-styles.css';  // Import any required CSS

const root = createRoot(document.getElementById('root')!);

root.render(
  <ParentSize>{({ width, height }) => <TimedGraph width={width} height={height} />}</ParentSize>,  // Render TimedGraph inside ParentSize
);
