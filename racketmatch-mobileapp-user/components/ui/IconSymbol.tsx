import { MaterialIcons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';

type SymbolWeight = 'regular' | 'bold'; 


const MAPPING: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  home: 'home',
  settings: 'settings',
  account: 'account-circle',

};

type IconSymbolProps = {
  name: keyof typeof MAPPING;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>; 
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
