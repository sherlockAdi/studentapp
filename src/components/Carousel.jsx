import React, {useState, useRef} from 'react';
import {View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Carousel = ({
  data = [],
  renderItem,
  autoPlay = false,
  autoPlayInterval = 3000,
  showPagination = true,
  itemWidth = SCREEN_WIDTH,
  itemHeight = 200,
  loop = false,
  onIndexChange,
  style,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const autoPlayTimer = useRef(null);

  React.useEffect(() => {
    if (autoPlay && data.length > 1) {
      autoPlayTimer.current = setInterval(() => {
        const nextIndex = loop
          ? (activeIndex + 1) % data.length
          : Math.min(activeIndex + 1, data.length - 1);

        scrollViewRef.current?.scrollTo({
          x: nextIndex * itemWidth,
          animated: true,
        });
      }, autoPlayInterval);

      return () => {
        if (autoPlayTimer.current) {
          clearInterval(autoPlayTimer.current);
        }
      };
    }
  }, [activeIndex, autoPlay, loop, data.length]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
      if (onIndexChange) onIndexChange(index);
    }
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * itemWidth,
      animated: true,
    });
  };

  return (
    <View style={style}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={itemWidth}
        snapToAlignment="center">
        {data.map((item, index) => (
          <View key={index} style={{width: itemWidth, height: itemHeight}}>
            {renderItem({item, index})}
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {showPagination && data.length > 1 && (
        <View className="flex-row justify-center items-center mt-2">
          {data.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              className={`mx-1 rounded-full ${
                index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              style={{
                width: index === activeIndex ? 24 : 8,
                height: 8,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Carousel;
