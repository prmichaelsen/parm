import React from 'react';
import { render } from '@testing-library/react';

import ReactRedditPoster from './react-reddit-poster';

describe(' ReactRedditPoster', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactRedditPoster />);
    expect(baseElement).toBeTruthy();
  });
});
