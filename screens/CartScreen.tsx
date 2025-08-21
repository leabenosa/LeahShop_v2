import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const confirmClear = () => {
    if (cartItems.length === 0) return;
    Alert.alert("Clear Cart", "Are you sure you want to clear all items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => clearCart() },
    ]);
  };

  const renderItem = ({ item }: { item: typeof cartItems[0] }) => (
    <View style={styles.cartItem}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₱{total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.clearButton} onPress={confirmClear}>
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fdf0f7" },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 18, color: "#777" },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: { fontWeight: "bold", fontSize: 16 },
  itemCategory: { color: "#555", marginTop: 2 },
  itemPrice: { marginTop: 4, fontWeight: "bold" },
  removeButton: {
    backgroundColor: "#fc6c91",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: "center",
  },
  removeButtonText: { color: "white", fontWeight: "bold" },
  footer: { marginTop: 20 },
  total: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  clearButton: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: { color: "white", fontWeight: "bold" },
  flatListContent: {
    paddingBottom: 20,
  },
});
