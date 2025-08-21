import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import products from "../Products.json"; // adjust path if needed
import type { RootStackParamList } from "../types/navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type ProductListNavigationProp =
  NativeStackNavigationProp<RootStackParamList, "ProductList">;

export default function ProductList() {
  const navigation = useNavigation<ProductListNavigationProp>();
  const [productList] = useState(products);

  const renderItem = ({ item }: { item: typeof products[0] }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            imageUri: item.imageUri, // optional in JSON
          })
        }
      >
        <Image
          source={{ uri: item.imageUri ?? "https://via.placeholder.com/100" }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.price}>
            {`₱${item.price.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fc72a0ff",
  },
});
