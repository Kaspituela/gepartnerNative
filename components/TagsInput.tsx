import React , {useState,useEffect} from "react";
import { Text, View, FlatList, TextInput, Pressable } from "react-native";

export default function TagsInput (props:any,route:any) {
    console.log(props.tags)
    const [count, setCount] = useState(props.cant);
    const [tags, setTags] = useState(props.tags);

    useEffect(() => {
        let newTags:any= []
        let k = 0
        console.log(props.currentMessage)
        for(let i in props.currentMessage){
          newTags.push({
            id: k.toString(),
            tag: props.currentMessage[k],
          })
          k = k + 1;
        }
        console.log(newTags)
        setTags(newTags)
    }, [])

    const removeTags = (indexToRemove) => {
        setTags([...tags.filter((_, index) => index != indexToRemove)]);
    }
    const addTags = (text) => {
        if (text != ""){
            console.log(count);
			setTags([...tags, {id: count.toString(), tag: text}]);
			props.selectedTags([...tags, {id: count.toString(), tag: text}]);
            setCount(count +1);
            text = "";
        }
	};
    const [text, onChangeText] = useState("");
    
    return (
        <View>
            <FlatList 
                data={tags}
                keyExtractor={item=>item.id}
                renderItem={({ item, index }) => (
                    <View /*style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", margin: "5px"}}*/>
                        <Text /*style={{height: 40, borderColor: '#22577a', borderWidth: 2, marginTop: 8, borderRadius: 15, padding: 5, backgroundColor: "#57cc99"}}*/>{item.tag}</Text>
                        <Pressable /*style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, borderRadius: 4, elevation: 3, backgroundColor: '#22577a'}}*/ onPress={() => {removeTags(index)}}>
                            <Text /*style={{fontSize: 16, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25, color: 'white'}}*/>x</Text>
                        </Pressable>
                    </View>
                )}
            />
            <TextInput
                /*style={{backgroundColor: "#57cc99", paddingVertical: 5, marginTop: 25, marginBottom: 5, borderRadius: 15}}*/
                onChangeText={onChangeText}
                value={text}
            />
            <Pressable /*</View>style={{alignItems: 'center', justifyContent: 'center', borderRadius: 4, elevation: 3, backgroundColor: '#22577a'}}*/ onPress={() => {addTags(text)}}>
                <Text /*style={{fontSize: 16, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25, color: 'white'}}*/>Añadir</Text>
            </Pressable>
        </View>
    )
}