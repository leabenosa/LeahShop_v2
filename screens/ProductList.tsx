import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsData from '../data/products.json';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
}

type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

export default function ProductList({ navigation }: { navigation: ProductListNavigationProp }) {
  const [products] = useState<Product[]>(productsData);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);

  const categories = [...new Set(productsData.map(product => product.category))];

  const categoryColors: Record<string, string> = {
    Pastries: '#f9d6faff',   
    Breads: '#ec9ce2ff',     
    Cakes: '#fc72a0ff',     
    Cupcakes: '#fa8fc5ff',  
  };

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 0;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortOption, setSortOption] = useState<string>('');

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
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.shopName}>Leah's Shop</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <Text style={styles.filterTitle}>Categories</Text>
        <View style={styles.categoryList}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={styles.checkboxContainer}
              onPress={() => toggleCategory(category)}
            >
              <View
                style={[
                  styles.checkboxRow,
                  { backgroundColor: categoryColors[category] || '#ccc' },
                  selectedCategories.includes(category) && styles.selectedCheckboxRow,
                ]}
              >
                <Text style={styles.checkboxText}>
                  {selectedCategories.includes(category) ? '☑' : '☐'}
                </Text>
                <Text>{category}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
      borderLeftColor: categoryColors[product.category] || '#ccc',
      borderLeftWidth: 4,
    };

    const formattedPrice = product.price.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });

    return (
      <TouchableOpacity
        style={[styles.productCard, categoryStyle]}
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
        <Text
          style={[
            styles.categoryText,
            { color: categoryColors[product.category] || '#000' },
          ]}
        >
          {product.category}
        </Text>
        <Text>{formattedPrice}</Text>
      </TouchableOpacity>
    );
  }}
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create
({
  container: 
  { flex: 1, 
    backgroundColor: '#f5a9c0ff', 
    padding: 10 
  },
  header: 
  { flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  logo: 
  { width: 80, 
    height: 80, 
    marginRight: 10 
  },
  title: 
  { fontSize: 24, 
    fontWeight: 'bold' 
  },
  filters: 
  { backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  filterTitle: 
  { fontWeight: 'bold', 
    marginTop: 10 
  },
  categoryList: 
  { flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  checkboxContainer: 
  { marginRight: 10, 
    marginTop: 5 
  },
  sortButtons: 
  { flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 8,
  marginVertical: 5,
  borderRadius: 5,
  backgroundColor: '#f8e5f0ff',
},
shopName: {
    fontSize: 30,
    fontFamily: 'Calistoga-Regular',
    fontWeight: 'normal',
    marginLeft: 25,
  },
  resetButton: {
   backgroundColor: '#ec70a0ff',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
},
resetButtonText: {
  color: '#fcf5f5ff',
  fontWeight: 'bold',
  fontSize: 16,
},
sortButton: {
  backgroundColor: '#f782afff',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginHorizontal: 1,
  width: 85,
},
sortButtonText: {
  color: 'black',
  fontWeight: 'bold',
  fontSize: 12,
   lineHeight: 18,
},
activeSortButton: {
  backgroundColor: '#f73e85e5',
},
activeSortButtonText: {
  color: 'white', 
  },
  arrowText: {
    fontSize: 14
},
  checkboxRow: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 8,
  borderRadius: 6,
  marginBottom: 0,
  marginRight: -15,
  borderWidth: 1,
  borderColor: 'transparent',
},
selectedCheckboxRow: {
  borderWidth: 2,
  borderColor: 'black',
},
  checkboxText: {
    fontSize: 18,
    marginRight: 1,
  },
  productCard: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryText: 
  {
    fontSize: 14,
  }
});
