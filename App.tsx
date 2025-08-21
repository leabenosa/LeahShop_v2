import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductList from './screens/ProductList';
import ProductDetails from './screens/ProductDetails';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext'; 
import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CartProvider>  
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={{ title: "Leah's Shop" }}
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
