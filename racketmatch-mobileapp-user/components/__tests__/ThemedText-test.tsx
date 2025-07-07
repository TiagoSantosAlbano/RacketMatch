import * as React from 'react';
import renderer from 'react-test-renderer';
import { ThemedText } from '../ThemedText';


jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000'), 
}));

describe('ThemedText', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ThemedText>Snapshot test</ThemedText>).toJSON();
    expect(tree).not.toBeNull(); 
    expect(tree).toMatchSnapshot();
  });
});
