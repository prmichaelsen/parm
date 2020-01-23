import { configure } from '@storybook/react';

const req = require.context('../../libs/react', true, /\.stories.[jt]sx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
