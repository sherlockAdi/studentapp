import React from 'react';
import {View} from 'react-native';

const Grid = ({
  children,
  columns = 2,
  gap = 4,
  style,
}) => {
  const gapClass = `gap-${gap}`;
  
  return (
    <View className={`flex-row flex-wrap ${gapClass}`} style={style}>
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / columns - (gap * (columns - 1)) / columns}%`,
            marginBottom: gap * 4,
          }}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default Grid;
