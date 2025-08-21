import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import type { RootStackParamList } from '../types/navigation';
import type { StackScreenProps } from "@react-navigation/stack";
import { useCart } from "../context/CartContext";

type Props = StackScreenProps<RootStackParamList, "ProductDetails">;

const categoryColors: Record<string, string> = {
  Pastries: '#f9d6faff',
  Breads: '#ec9ce2ff',
  Cakes: '#fc72a0ff',
  Cupcakes: '#fa8fc5ff',
};

export default function ProductDetails({ route, navigation }: Props) {
const { name, category, price, description, imageUri, id } = route.params;
const { addToCart } = useCart();

  return (
    <View style={styles.container}>
      <Button
        title="Add to Cart"
        onPress={() => {
          addToCart({ id, name, category, price, description, imageUri });
          navigation.navigate("Cart");
        }}
      />
      <Image
        source={{ uri: imageUri ?? "https://via.placeholder.com/150" }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{name}</Text>

      <Text style={[styles.category, { color: categoryColors[category] || "#888" }]}>
        {category}
      </Text>

      <Text style={styles.price}>{`₱${price.toFixed(2)}`}</Text>
      <Text style={styles.description}>{description}</Text>

      <Button
        title="Add to Cart"
        onPress={() => console.log(`Added to cart: ${name}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  },
  category: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
});
