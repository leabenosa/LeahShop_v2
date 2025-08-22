import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsData from '../Products.json';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  quantity?: number; 
}

type ProductListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

export default function ProductList({ navigation }: { navigation: ProductListNavigationProp }) {
  const [products] = useState<Product[]>(productsData);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);

  const categories = [...new Set(productsData.map(product => product.category))];

  const categoryColors: Record<string, string> = {
    Pastries: '#f7d6faff',
    Breads: '#f3b3ecff',
    Cakes: '#fc72a0ff',
    Cupcakes: '#fa8fc5ff',
  };

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 0;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortOption, setSortOption] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addToCart = async (product: Product) => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const index = cart.findIndex((item: Product) => item.id === product.id);
      if (index > -1) {
        cart[index].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log('Added to cart:', product.name);
    } catch (error) {
      console.log('Error adding to cart', error);
    }
  };

  const filterAndSort = useCallback(() => {
    let filteredList = [...products];

    if (selectedCategories.length > 0) {
      filteredList = filteredList.filter(product => selectedCategories.includes(product.category));
    }

    filteredList = filteredList.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (sortOption === 'priceAsc') filteredList.sort((a, b) => a.price - b.price);
    if (sortOption === 'priceDesc') filteredList.sort((a, b) => b.price - a.price);
    if (sortOption === 'nameAsc') filteredList.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === 'nameDesc') filteredList.sort((a, b) => b.name.localeCompare(a.name));

    setFilteredProducts(filteredList);
  }, [products, selectedCategories, priceRange, sortOption]);

  useEffect(() => {
    filterAndSort();
  }, [filterAndSort]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortOption('');
    setFilteredProducts(products);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.shopName}>Leah's Shop</Text>
      </View>

      <View style={styles.filters}>
        <Text style={styles.filterTitle}>Categories</Text>
        <View style={styles.categoryList}>
          {categories.map(category => {
            const isSelected = selectedCategories.includes(category);
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  { backgroundColor: categoryColors[category] || '#ccc' },
                  isSelected && styles.categoryButtonActive,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={styles.checkboxSymbol}>{isSelected ? '☑' : '☐'}</Text>
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.filterTitle}>Price Range</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Max Price"
          value={priceRange[1].toString()}
          onChangeText={value => {
            const enteredPrice = parseFloat(value) || 0;
            setPriceRange([0, enteredPrice]);
          }}
        />

        <Text style={styles.filterTitle}>Sort By</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'priceAsc' && styles.activeSortButton]}
            onPress={() => setSortOption('priceAsc')}
          >
            <Text style={styles.sortButtonText}>Price ↑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'priceDesc' && styles.activeSortButton]}
            onPress={() => setSortOption('priceDesc')}
          >
            <Text style={styles.sortButtonText}>Price ↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'nameAsc' && styles.activeSortButton]}
            onPress={() => setSortOption('nameAsc')}
          >
            <Text style={styles.sortButtonText}>Name A-Z</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'nameDesc' && styles.activeSortButton]}
            onPress={() => setSortOption('nameDesc')}
          >
            <Text style={styles.sortButtonText}>Name Z-A</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={product => product.id.toString()}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item: product }) => {
          const categoryStyle = {
            backgroundColor: categoryColors[product.category] || '#fff',
          };

          const formattedPrice = product.price.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          });

          return (
            <View style={[styles.productCard, categoryStyle]}>
              <TouchableOpacity
                style={styles.productDetailsButton}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    description: product.description ?? 'This is a dummy description for now.',
                    imageUri: undefined,
                  })
                }
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.categoryText}>{product.category}</Text>
                <Text>{formattedPrice}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5a9c0ff', padding: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logo: { width: 80, height: 80, marginRight: 10 },
  shopName: { fontSize: 30, fontFamily: 'Calistoga-Regular', marginLeft: 25 },

  filters: { backgroundColor: 'white', padding: 10, borderRadius: 10, marginBottom: 10 },
  filterTitle: { fontWeight: 'bold', marginTop: 10 },

  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 5 },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginLeft: -8,
  },
  categoryButtonActive: { borderWidth: 2, borderColor: '#000' },
  categoryButtonText: { fontWeight: 'bold', fontSize: 13 },
  checkboxSymbol: { marginRight: 6, fontSize: 14 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#f8e5f0ff',
  },

  sortButtons: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  sortButton: {
    backgroundColor: '#f782afff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: 80,
    alignItems: 'center',
  },
  sortButtonText: { color: 'black', fontWeight: 'bold', fontSize: 12 },
  activeSortButton: { backgroundColor: '#f73e85e5' },

  resetButton: {
    backgroundColor: '#ec70a0ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  flatListContent: { paddingBottom: 20 },
  productCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productName: { fontWeight: 'bold', fontSize: 16 },
  categoryText: { fontSize: 14, marginBottom: 5 },
  productDetailsButton: { flex: 1 },
});
