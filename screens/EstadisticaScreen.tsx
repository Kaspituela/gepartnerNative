import React, { useCallback, useEffect, useState } from 'react';
import { View,Text,StyleSheet } from 'react-native';

export default function EstadisticaScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.innerText}>Pronto Estadisticas!</Text>
        </View>
      );
}

const styles = StyleSheet.create({
    baseText: {
        fontFamily: "Cochin"
    },
    innerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: 'white'
    }
});