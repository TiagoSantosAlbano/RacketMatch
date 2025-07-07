import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Platform, Linking, Alert } from 'react-native';
import api from '../config/api';

interface PayPalButtonProps {
  matchId: string;
  amount: number;
  disabled?: boolean;
}

export default function PayPalButton({ matchId, amount, disabled }: PayPalButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handlePayWithPayPal = async () => {
    try {
      setLoading(true);
      
      const { data } = await api.post('/paypal/create-payment', { matchId, amount });
      const approvalUrl = data.approvalUrl;

      if (Platform.OS === 'web') {
        window.open(approvalUrl, '_blank');
      } else {
        Linking.openURL(approvalUrl); 
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro ao iniciar pagamento PayPal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#ffc439',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        opacity: disabled || loading ? 0.5 : 1,
        marginTop: 12,
      }}
      onPress={handlePayWithPayPal}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#333" />
      ) : (
        <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16 }}>
          Pagar {amount.toFixed(2)}€ com PayPal
        </Text>
      )}
    </TouchableOpacity>
  );
}
