import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTenants } from "../shared/hooks/useTentants";  

export default function TenantsScreen() {
  const { tenants, loading, error } = useTenants();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erro: {error}</Text>;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {tenants.length === 0 ? (
        <Text>Nenhum tenant encontrado.</Text>
      ) : (
        tenants.map((tenant) => (
          <Text key={tenant._id} style={{ margin: 8 }}>
            {tenant.name}
          </Text>
        ))
      )}
    </View>
  );
}
