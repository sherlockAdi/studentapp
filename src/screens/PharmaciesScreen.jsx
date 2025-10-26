import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Alert as RNAlert,
} from 'react-native';
import {Container, Card, Button, Spinner, EmptyState, Badge} from '../components';
import PharmacyService from '../services/pharmacyService';

const PharmaciesScreen = ({navigation}) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      setError(null);
      console.log('Loading pharmacies...');
      const data = await PharmacyService.getAllPharmacies();
      console.log('Pharmacies loaded:', data);
      
      if (Array.isArray(data)) {
        setPharmacies(data);
      } else {
        setPharmacies([]);
        console.warn('Pharmacies data is not an array:', data);
      }
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      setError(error.message || 'Failed to load pharmacies');
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyPharmacies = async (latitude, longitude) => {
    try {
      const data = await PharmacyService.getNearbyPharmacies(latitude, longitude);
      setPharmacies(data || []);
      setUserLocation({latitude, longitude});
    } catch (error) {
      console.error('Error loading nearby pharmacies:', error);
      RNAlert.alert('Error', 'Failed to load nearby pharmacies');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPharmacies();
    setRefreshing(false);
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      RNAlert.alert('No Phone', 'Phone number not available');
    }
  };

  const handleDirections = (pharmacy) => {
    const {latitude, longitude} = pharmacy;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleFindNearby = () => {
    // Mock location for demo - in production, use Geolocation API
    RNAlert.alert(
      'Find Nearby',
      'This would use your device location to find nearby pharmacies',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Use Demo Location',
          onPress: () => loadNearbyPharmacies(40.7128, -74.006),
        },
      ]
    );
  };

  const renderPharmacy = ({item}) => (
    <Card padding="md" style={{marginBottom: 12}}>
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold text-gray-900 flex-1">
          {item.Name || item.name}
        </Text>
        {(item.distanceKM || item.DistanceKM) && (
          <Badge variant="primary">
            {(item.distanceKM || item.DistanceKM).toFixed(1)} km
          </Badge>
        )}
      </View>

      <View className="mb-3">
        <Text className="text-gray-600 text-sm">
          📍 {item.Address || item.address}, {item.City || item.city}, {item.State || item.state}
        </Text>
        <Text className="text-gray-600 text-sm mt-1">
          🌍 {item.Country || item.country}
        </Text>
        {(item.Phone || item.phone) && (
          <Text className="text-gray-600 text-sm mt-1">
            📞 {item.Phone || item.phone}
          </Text>
        )}
      </View>

      <View className="flex-row" style={{gap: 8}}>
        <Button
          title="Call"
          variant="primary"
          size="sm"
          onPress={() => handleCall(item.Phone || item.phone)}
          icon={<Text style={{fontSize: 16, color: '#fff'}}>📞</Text>}
          iconPosition="left"
          style={{flex: 1}}
        />
        <Button
          title="Directions"
          variant="secondary"
          size="sm"
          onPress={() => handleDirections({
            latitude: item.Latitude || item.latitude,
            longitude: item.Longitude || item.longitude,
          })}
          icon={<Text style={{fontSize: 16}}>🗺️</Text>}
          iconPosition="left"
          style={{flex: 1}}
        />
      </View>
    </Card>
  );

  if (loading) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center">
          <Spinner text="Loading pharmacies..." />
        </View>
      </Container>
    );
  }

  return (
    <Container safe>
      {/* Header */}
      <View className="p-4 bg-blue-600">
        <Text className="text-white text-2xl font-bold">Pharmacies</Text>
        <Text className="text-blue-100 mt-1">
          {pharmacies.length} pharmacies {userLocation ? 'nearby' : 'available'}
        </Text>
      </View>

      {/* Find Nearby Button */}
      <View className="px-4 py-3">
        <Button
          title="Find Nearby Pharmacies"
          variant="primary"
          fullWidth
          onPress={handleFindNearby}
          icon={<Text style={{fontSize: 20, color: '#fff'}}>📍</Text>}
          iconPosition="left"
        />
      </View>

      {/* Pharmacies List */}
      <View className="flex-1 px-4">
        {error ? (
          <EmptyState
            icon={<Text style={{fontSize: 48}}>⚠️</Text>}
            title="Error Loading Pharmacies"
            description={error}
            actionLabel="Retry"
            onActionPress={loadPharmacies}
          />
        ) : pharmacies.length === 0 ? (
          <EmptyState
            icon={<Text style={{fontSize: 48}}>💊</Text>}
            title="No pharmacies found"
            description="No pharmacies available at the moment. Try again later."
            actionLabel="Retry"
            onActionPress={loadPharmacies}
          />
        ) : (
          <FlatList
            data={pharmacies}
            renderItem={renderPharmacy}
            keyExtractor={(item, index) => (item.Id || item.id) ? (item.Id || item.id).toString() : `pharmacy-${index}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{paddingBottom: 12}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Container>
  );
};

export default PharmaciesScreen;
