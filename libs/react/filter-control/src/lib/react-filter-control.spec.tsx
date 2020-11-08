import React from 'react';
import { render } from '@testing-library/react';

import ReactFilterControl from './react-filter-control';

describe(' ReactFilterControl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactFilterControl />);
    expect(baseElement).toBeTruthy();
  });
});
