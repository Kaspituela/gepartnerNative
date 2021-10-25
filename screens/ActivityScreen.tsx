import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Pressable } from 'react-native';
import { isSameUser } from 'react-native-gifted-chat/lib/utils';

export default function ActivityScreen({route}: {route:any}) {
    const [pos,setPos] = useState(0)
    const [text,setText] = useState("")
    const [inputText,setInputText] = useState("")
    const [answer,setAnswer] = useState("")
    const [elements,setElements] = useState([])
    const [order,setOrder] = useState([])
    let sentenceList:any = []
    function shuffle(array:any) {
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    function obtainList(sentence:string){
        const array = sentence.split(" ")
        const cant = Math.ceil(array.length / 3)
        let newArray = []
        let subSentence = ""
        let aux = 0
        for(let i = 0; i < array.length; i++){
            if(aux === cant){
                newArray.push(subSentence)
                subSentence = ""
                aux = 0
            }
            aux = aux + 1
            subSentence = subSentence + " " + array[i]
        }
        if(subSentence !== ""){
            newArray.push(subSentence)
        }
        return newArray
    }
    
    const [buttonSentence, setButtonSentence] = useState([
        {
            id : 0,
            isSelected: 0,
            color: '#80ed99',
        },
        {
            id: 1,
            isSelected: 0,
            color: '#80ed99',
        },
        {
            id: 2,
            isSelected: 0,
            color: '#80ed99',
        },
    ])

    const [Activity,setActivity] = useState([
        {
            id: 0,
            sentence: "Hi, my name is Guillermo",
            color: "#3e946f",
            type: Math.random(),
            answer: "",
            isCorrect: -1,
            list: obtainList("Hi, my name is Guillermo"),
        },
        {
            id: 1,
            sentence: "That was awesome my dude",
            color: "#80ed99",
            type: Math.random(),
            answer: "",
            isCorrect: -1,    
            list: obtainList("That was awesome my dude"),
        },
        {
            id: 2,
            sentence: "Keep trying and get better",
            color: "#80ed99",
            type: Math.random(),
            answer: "",
            isCorrect: -1,
            list: obtainList("Keep trying and get better"),
        }, 
        {
            id: 3,
            sentence: "This is a message by default, totally unexpected",
            color: "#80ed99",
            type: Math.random(),
            answer: "",
            isCorrect: -1,
            list: obtainList("This is a message by default, totally unexpected"),
        }
    ])

    function changeColor(prev:any,num:any){ //'#80ed99' verde claro, '#3e946f'  verde oscuro
        let newActivity = Activity          //'#22577a' azul oscuro. '#47a2de' azul claro
        let prevColor = '#80ed99'
        if(newActivity[prev].color === '#ad374b'){
            prevColor = '#db465f'
        } else if(newActivity[prev].color === '#22577a'){
            prevColor = '#47a2de'
        }
        newActivity[prev].color = prevColor
        let nextColor = '#3e946f'
        if(newActivity[num].color === '#db465f'){
            nextColor = '#ad374b'
        } else if(newActivity[num].color === '#47a2de'){
            nextColor = '#22577a'
        }
        newActivity[num].color = nextColor
        setActivity(newActivity)
    }

    function clearButtons(){
        let auxButtonSentence = buttonSentence
        for(let i = 0; i < auxButtonSentence.length; i++){
            auxButtonSentence[i].isSelected = 0
            auxButtonSentence[i].color = '#80ed99'
        }
        setElements([])
        setOrder([])
    }
    
    function Prev(){
        const prev = pos
        const num = pos === 0 ? 0 : pos - 1
        setPos(num)
        changeColor(prev,num)
        let newText = Activity[num].isCorrect === -1 ? "" : Activity[num].isCorrect === 0 ? "La respuesta correcta era: " + Activity[num].sentence : "Respuesta Correcta"
        setText(newText)
        setInputText("")
        setAnswer(Activity[num].answer)
        clearButtons()
    }

    function Next(){
        const prev = pos
        const num = pos === Activity.length - 1 ? Activity.length - 1 : pos + 1
        setPos(num)
        changeColor(prev,num)
        let newText = Activity[num].isCorrect === -1 ? "" : Activity[num].isCorrect === 0 ? "La respuesta correcta era: " + Activity[num].sentence : "Respuesta Correcta"
        setText(newText)
        setInputText("")
        setAnswer(Activity[num].answer)
        clearButtons()
    }

    function circleStyle(element:any) {
        return {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: element.color,
        }
    }

    function answerStyle(num:any){
        let color = Activity[num].color === '#3e946f' ? '#c7f9cc': Activity[num].color === '#22577a' ? '#47a2de': '#db465f'
        return{
            flex: 2,
            backgroundColor: color,
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 10,
            borderColor: '#22577a',
            borderWidth: 2,
            marginHorizontal: 5,
            marginBottom: 10,
        }
    }
    function isCorrect(currAnswer:string,num:any){
        let color:string = '#22577a' 
        let answer1 = currAnswer.replace(/\s+/g, '').toLowerCase()
        let answer2 = Activity[num].sentence.replace(/\s+/g, '').toLowerCase()
        if(answer1.localeCompare(answer2) !== 0){
            color= '#ad374b'
        }
        return color
    }

    function Finalize(num:any){
        let otherActivity = Activity
        otherActivity[num].answer = answer
        otherActivity[num].color = isCorrect(answer,num) //'#db465f' color rojo , '#ad374b' rojo oscuro
        if(otherActivity[num].color === '#ad374b'){
            setText("La respuesta correcta era: " + otherActivity[num].sentence)
            otherActivity[num].isCorrect = 0
        } else{
            setText("Respuesta Correcta")
            otherActivity[num].isCorrect = 1
        }
        setActivity(otherActivity)
    }

    function changeAnswer(text:string, num:any){
        let currAnswer = Activity[num].list[0] + " " + text + " "+ Activity[num].list[2]
        setInputText(text)
        setAnswer(currAnswer)
    }

    function completeSentence(num: any){
        const format = <View style={styles.containerSentence}>
            <Text style={styles.titleText}>Completa la Palabra</Text>
            <Text style={styles.innerText}>La siguiente actividad consiste en completar el espacio en blanco para crear una oración.</Text>
            <View style={styles.containerTextSentence}>
                <Text style={styles.innerText}>{Activity[num].list[0]}</Text>
                <TextInput onChangeText={text => changeAnswer(text,num)} value={inputText} editable={!flagButton(num)} style={styles.textInput}></TextInput>
                <Text style={styles.innerText}>{Activity[num].list[2]}</Text>
            </View>
        </View>
        return format
    }
    function changeAnswerbyButton(num: any){
        let text = ""
        for(let i = 0; i < elements.length; i++){
            text = i === 0 ? text + elements[i] : text + " " + elements[i]
        }
        setAnswer(text)
    }

    function selectButton(num: any,pos: any){
        let aux = buttonSentence[pos].isSelected === 0 ? 1: 0
        let auxColor = aux === 1 ? '#3e946f': '#80ed99'
        let newButtonSentence = buttonSentence
        newButtonSentence[pos].isSelected = aux
        newButtonSentence[pos].color = auxColor
        let auxElements:any = elements
        let auxOrder:any = order
        if(aux === 1){
            auxElements.push(Activity[num].list[pos])
            auxOrder.push(pos)
            setElements(auxElements)
            setOrder(auxOrder)
        } else{
            for(let i = 0; i < auxOrder.length; i++){
                if(auxOrder[i] === pos){
                    if(i === 0){
                        auxElements.splice(i,i+1)
                        auxOrder.splice(i,i+1)
                    } else{
                        auxElements.splice(i,i)
                        auxOrder.splice(i,i)
                    }
                }
            }
            setElements(auxElements)
            setOrder(auxOrder)
        }
        setButtonSentence(newButtonSentence)
        changeAnswerbyButton(num)
    }

    function sortSentence(num: any){
        const format = <View style={styles.containerSort}>
            <Text style={styles.titleText}>Ordena las Palabras</Text>
            <Text style={styles.innerText}>La siguiente actividad consiste en ordenar las siguientes palabras para crear una oración.</Text>
            <View style={styles.containerButtons}> 
                <Button color={buttonSentence[0].color} title={Activity[num].list[0]} onPress={() =>(selectButton(num,0))} disabled={flagButton(num)}/>
                <Button color={buttonSentence[1].color} title={Activity[num].list[1]} onPress={() =>(selectButton(num,1))} disabled={flagButton(num)}/>
                <Button color={buttonSentence[2].color} title={Activity[num].list[2]} onPress={() =>(selectButton(num,2))} disabled={flagButton(num)}/>
            </View>
        </View>
        return format
    }

    function flagButton(num:any){
        let flag = Activity[num].isCorrect === -1 ? false : true
        return flag
    }

    function EndProcess(){
        alert("finalizado")
    }
    return (
        <View style={styles.container}>
        <View style={styles.circles}>
            {Activity.map((element) => <View key={element.id} style={circleStyle(element)}></View>)}
        </View>
        <View style={styles.buttons}>
            <Button color='#22577a' title="Prev" onPress={() =>(Prev())}/>
            <Button color='#22577a' title="Next" onPress={() =>(Next())}/>
        </View>
        <View style={styles.activity}>
            {Activity[pos].type > 0.5 ? completeSentence(pos) : sortSentence(pos)}
        </View>
        <View style={answerStyle(pos)}>
            <Text style={styles.innerText}>Respuesta: </Text>
            <Text style={styles.innerText}>{answer}</Text>
        </View>     
        <View style={styles.finalize}>
            <Text style={styles.titleText}>Resultado</Text>
            <Text style={styles.innerText}>{text}</Text>
        </View>   
        <View style={styles.endButtons}>
            <Button color='#22577a' title="Responder" onPress={() =>(Finalize(pos))} disabled={flagButton(pos)}/>
            <Button color='#22577a' title="Finalizar" onPress={() =>(EndProcess())}/>
        </View>
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
        color: '#22577a',
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: '#22577a',
        marginBottom: 20,
    },
    buttons:{
        flex: 1,
        flexDirection: 'row',
        marginBottom: 50,
    },
    circles: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    activity:{
        flex: 10,
    },
    finalize:{
        flex: 4,
        backgroundColor: '#c7f9cc', //verde pastel
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 2,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    endButtons:{
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
    },
    containerFinalize:{
        backgroundColor: '#c7f9cc',
        alignItems: 'center',
    },
    container:{
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    containerSentence:{
        alignItems: 'center',
        backgroundColor: '#c7f9cc', //verde pastel
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 2,
        marginHorizontal: 5,
    },
    containerButtons:{
        flex: 1,
        flexDirection: 'row',
        marginTop: 50,
        marginBottom: 50,
    },
    containerSort:{
        alignItems: 'center',
        backgroundColor: '#c7f9cc',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: '#22577a',
        borderWidth: 2,
        marginHorizontal: 5,
    },
    containerTextSentence:{
        flex: 1,
        flexDirection: 'row',
        marginTop: 50,
        marginBottom: 50,
    },
    textInput:{
        backgroundColor: '#57cc99',
        borderWidth: 2,
        borderColor: '#22577a',
        borderRadius: 5,
        marginRight: 10,
        marginLeft: 10,
    },
});