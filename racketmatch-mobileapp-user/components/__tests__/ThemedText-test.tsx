import * as React from 'react';
import renderer from 'react-test-renderer';
import { ThemedText } from '../ThemedText';

// 🧪 Mock do hook de tema usado pelo ThemedText
jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000'), // Simula retorno da cor
}));

describe('ThemedText', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ThemedText>Snapshot test</ThemedText>).toJSON();
    expect(tree).not.toBeNull(); // Verifica se o componente foi renderizado
    expect(tree).toMatchSnapshot();
  });
});
