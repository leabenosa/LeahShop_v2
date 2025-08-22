import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import type { RootStackParamList } from "../types/navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCart } from "../context/CartContext";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

const categoryColors: Record<string, string> = {
  Pastries: "#f9d6faff",
  Breads: "#ec9ce2ff",
  Cakes: "#fc72a0ff",
  Cupcakes: "#fa8fc5ff",
};

export default function ProductDetails({ route, navigation }: Props) {
  const { id, name, category, price, description, imageUri } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, name, category, price, description, imageUri });
    navigation.navigate("Cart"); 
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri ?? "https://via.placeholder.com/150" }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{name}</Text>
      <Text
        style={[styles.category, { color: categoryColors[category] || "#888" }]}
      >
        {category}
      </Text>
      <Text style={styles.price}>{`₱${price.toFixed(2)}`}</Text>
      <Text style={styles.description}>{description}</Text>

      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffe4ec",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#0e0308ff",
  },
  category: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#fa1313ff",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});
