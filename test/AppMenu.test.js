import React from 'react';
import { mount } from 'enzyme';
import AppMenu from '../src/components/AppMenu';

test('AppMenu renders', () => {
  const appMenu = mount(<AppMenu />);
  expect(appMenu.find('h6').text()).toContain('taggr');
});
