import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import ProductList from './screens/ProductList';
import ProductDetails from './screens/ProductDetails';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext'; 
import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();


function CartButton({ navigation }: { navigation: any }) {
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("Cart")}
      style={styles.cartButton}
    >
      <Image
        source={require("./assets/cart.png")}
        style={styles.cartIcon}
      />
    </TouchableOpacity>
  );
}

function productListOptions(navigation: any) {
  return {
    headerRight: () => <CartButton navigation={navigation} />,
  };
}

export default function App() {
  return (
    <CartProvider>  
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff', 
            },
            headerTitle: "", 
            headerTitleStyle: { fontSize: 14}, 
          }}
        >
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={({ navigation }) => productListOptions(navigation)}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetails}
            options={{ title: "Product Details" }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: "Cart" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 15,
  },
  cartIcon: {
    width: 40,
    height: 40,
  },
});
