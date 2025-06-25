import { MaterialIcons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';

type SymbolWeight = 'regular' | 'bold'; // ajuste conforme necessário

// Se você estiver usando um mapeamento customizado de nomes:
const MAPPING: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  home: 'home',
  settings: 'settings',
  account: 'account-circle',
  // adicione os ícones que você usa aqui
};

type IconSymbolProps = {
  name: keyof typeof MAPPING;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>; // Corrigido para aceitar estilos de texto
  weight?: SymbolWeight;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  return (
    <MaterialIcons
      name={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
