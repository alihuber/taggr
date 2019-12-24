import React from 'react';
import { mount } from 'enzyme';
import App from '../src/components/App';

test('App renders', () => {
  const app = mount(<App />);
  expect(app.find('button').text()).toContain('Primary');
});
