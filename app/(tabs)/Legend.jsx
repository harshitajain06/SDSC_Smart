import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Legend = ({ sessionTypes, sessionColors }) => {
  return (
    <View style={styles.legendContainer}>
      {sessionTypes.map((session) => (
        <View key={session.value} style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: sessionColors[session.value] },
            ]}
          />
          <Text style={styles.legendLabel}>{session.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'col',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: '#19235E',
  },
});

export default Legend;
