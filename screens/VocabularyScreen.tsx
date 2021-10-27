import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

export default function VocabularyScreen({navigation,route}: {navigation:any, route:any}) {
    const [isBusy, setBusy] = useState(true)
    const [noBody, setBody] = useState()
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [rows, setRows] = useState([{}])
    useEffect( () => {
        fetch('https://gepartner-app.herokuapp.com/caps?data=content&gid=' + route.params.idCapsula)
            .then(response => {return response.json();})
            .then(data => {
                let content = JSON.parse(data.data.content)
                console.log(content["examples"])
                setTitle(content["title"])
                setDesc(content["description"])
                let newWords = []
                for(let i = 0; i< content["words"].length; i++){
                    let aux = {
                        id: i,
                        word: content["words"][i],
                        example: content["examples"][i],
                    }
                    newWords.push(aux)
                }
                setRows(newWords)
                console.log("newWords",newWords)
                setBusy(false)
            });
    }, [noBody])

    const renderItem  = ({item}) => {
        console.log("item",item)
        return(
            <View style={styles.row}>
                { item.word !== undefined && <View style={styles.div}>
                <Text style={styles.innerText}> {item.word[0]}</Text>
                <Text style={styles.translateText}> {item.word[1]}</Text>
                </View>}
                {item.example !== undefined && <View style={styles.div}>
                <Text style={styles.innerText}> {item.example[0]}</Text>
                <Text style={styles.translateText}> {item.example[1]}</Text>
                </View>}
            </View>
        )
    };

    return (
        <View style={styles.container}>
            { isBusy ? <ActivityIndicator size="large" color="#00ff00"/> : 
            <View style = {styles.subContainer}>
                <View style={styles.onlyText}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descText}>{desc}</Text>
                </View>
                <View style={styles.cabecera}>
                    <View style={styles.div}>
                    <Text style={styles.cabeceraText}>Palabras</Text>
                    </View>
                    <View style={styles.div}>
                    <Text style={styles.cabeceraText}>Ejemplos</Text>
                    </View>
                </View>
                <View style= {styles.flatList}>
                    <FlatList 
                        data={rows}
                        renderItem={renderItem}
                        keyExtractor={(item:any) => item.id}
                        extraData={isBusy}
                    />
                </View>
                <View style = {styles.viewButton}>
                    <TouchableOpacity style={styles.button} onPress={() =>(navigation.navigate("ChatPerScreen", {idCapsula: route.params.idCapsula}))}>
                        <Text style={styles.innerButton}> Continuar </Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subContainer:{
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    innerText: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#22577a',
    },
    translateText: {
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "italic",
        color: '#38a3a5',
    },
    cabeceraText:{
        fontSize: 15,
        fontWeight: "bold",
        color: '#80ed99',
        marginHorizontal: 4,
    },
    onlyText:{
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c7f9cc',
        borderWidth: 2,
        borderColor: '#22577a',
        marginBottom: 5,
        width: 388,
        padding: 10,
    },
    innerButton:{
        fontSize: 16,
        fontWeight: "bold",
        color: '#fff',
    },
    titleText:{
        fontSize: 20,
        fontWeight: "bold",
        color: '#22577a',
        marginBottom: 5,
    },
    descText:{
        fontSize:15,
        fontWeight: "bold",
        color: '#22577a',
        textAlign: 'justify',
    },
    button: {
        backgroundColor: '#22577a',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginHorizontal: 2,
        elevation: 2,
        alignItems: 'center',
    },
    row: {
        flex: 2,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#c7f9cc',
        borderColor: '#22577a',
        borderWidth: 2,
        marginTop: -2,
        alignItems: 'center',
        padding: 2,
    },
    cabecera:{
        flex: 2,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#22577a',
        borderColor: '#22577a',
        borderWidth: 2,
        marginTop: -2,
        alignItems: 'center',
        padding: 2,
    },
    div: {
        width: 190,
    },
    flatList:{
        flex: 15,
    },
    viewButton:{
        flex: 1,
        justifyContent: 'center',

    }
});