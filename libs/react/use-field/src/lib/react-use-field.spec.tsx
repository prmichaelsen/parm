import React from 'react';
import { render } from '@testing-library/react';

import ReactUseField from './react-use-field';

describe(' ReactUseField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactUseField />);
    expect(baseElement).toBeTruthy();
  });
});
