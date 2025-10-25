import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {Spinner} from '../components';
import PharmacyService from '../services/pharmacyService';

const PharmacyNearbyScreen = ({navigation}) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      const data = await PharmacyService.getAllPharmacies();
      setPharmacies(data || []);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPharmacies();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Spinner text="Loading..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-10 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 24}}>←</Text>
        </TouchableOpacity>
        <View className="flex-row items-center ml-3">
          <Text style={{fontSize: 18, marginRight: 6}}>📍</Text>
          <Text className="text-base font-semibold">Mohali</Text>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 70}}>
        
        {/* Title */}
        <View className="px-4 mb-3">
          <Text className="text-xl font-bold">Pharmacy Nearby</Text>
        </View>

        {/* Pharmacy Cards - Show only 2 */}
        <View className="px-4 flex-row mb-3" style={{gap: 10}}>
          {pharmacies.slice(0, 2).map((pharmacy, index) => (
            <TouchableOpacity
              key={pharmacy.Id || pharmacy.id || index}
              className="flex-1 bg-white rounded-2xl overflow-hidden"
              style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}>
              {/* Pharmacy Image Placeholder */}
              <View
                className="w-full items-center justify-center"
                style={{height: 100, backgroundColor: '#F5F5F5'}}>
                <Text style={{fontSize: 40}}>🏥</Text>
              </View>

              {/* Pharmacy Info */}
              <View className="p-3">
                <Text className="text-sm font-bold mb-1" style={{color: '#333'}}>
                  {index === 0 ? 'Path lab pharmacy' : '24 pharmacy'}
                </Text>
                <Text className="text-xs mb-1" style={{color: '#666'}}>
                  5km Away
                </Text>
                <View className="flex-row items-center">
                  <Text style={{fontSize: 12, color: '#FFA500'}}>⭐</Text>
                  <Text className="text-xs ml-1" style={{color: '#666'}}>
                    4.5 (120 review)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Prescription Section */}
        <View className="px-4">
          <Text className="text-xl font-bold text-center mb-2">
            Upload Prescription
          </Text>
          <Text className="text-xs text-center mb-4" style={{color: '#666', lineHeight: 16}}>
            We will show the pharmacy that fits as per{'\n'}your prescription.
          </Text>

          {/* Upload Options */}
          <View
            className="bg-white rounded-2xl p-5 mb-4"
            style={{borderWidth: 1, borderColor: '#E0E0E0'}}>
            <View className="flex-row justify-around">
              <TouchableOpacity className="items-center">
                <View
                  className="items-center justify-center mb-2"
                  style={{width: 50, height: 50}}>
                  <Text style={{fontSize: 32}}>📄</Text>
                </View>
                <Text className="text-sm font-medium">Upload Link</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center">
                <View
                  className="items-center justify-center mb-2"
                  style={{width: 50, height: 50}}>
                  <Text style={{fontSize: 32}}>⬆️</Text>
                </View>
                <Text className="text-sm font-medium">Upload File</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className="rounded-xl py-4 items-center"
            style={{backgroundColor: '#4CAF50'}}>
            <Text className="text-white text-base font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PharmacyNearbyScreen;
