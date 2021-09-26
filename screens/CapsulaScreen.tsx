import React, { useCallback, useEffect, useState } from 'react';
import { View,Text,StyleSheet } from 'react-native';

export default function CapsulasScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.innerText}>Pronto Capsulas!</Text>
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