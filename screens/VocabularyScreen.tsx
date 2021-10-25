import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function VocabularyScreen({navigation,route}: {navigation:any, route:any}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.innerText}>Vocabulario! con Id : {route.params.idCapsula} y idUsuario : {route.params.cUserId}</Text>
          <Button title="Continuar" onPress={() => navigation.navigate("ChatPerScreen", {idCapsula: route.params.idCapsula,cuserId: route.params.cUserId, Lang: route.params.Lang})}/>
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