import React, { Component, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView,StatusBar,Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
 
const FilterTag = ({route}: {route: any}) =>{
  let uid = route.params.cUserId
  let lang = route.params.Lang == 'english' ? 0 : 1
  const [selectedItems,setSelectedItems] = useState([])
  const [items,setItems] = useState([])
  const [DATA,setDATA] = useState([])
  useEffect(() => {
    
    const requestOptions = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    console.log(requestOptions)
    fetch('http://gepartner-app.herokuapp.com/user?uid=' + uid, requestOptions)
		.then(response => {return response.json();})
		.then(data => {
      let Tags:any= []
      let k = 0
      for(let i in data.user.tags){
        Tags.push({
          id: (k + 1).toString(),
          name: data.user.tags[k],
        })
        k = k + 1;
      }
      setItems([{
        name: "Tags",
        id: 0,
        children : Tags
      }])
      console.log(items)
    });
  }, [])

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    const requestOptions = { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    let bot_id = 5 + parseInt(uid)
    let request:string = "uid="+uid+"&lng="+lang+"&bid="+bot_id+"&tags="
    let k = 0
    for(let i in selectedItems){
      let text = k === 0 ? selectedItems[k] : "$"+ selectedItems[k]
      request  = request + text
      k = k + 1       
    }
    console.log('http://gepartner-app.herokuapp.com/msg?' +request)

    fetch('http://gepartner-app.herokuapp.com/msg?' + request, requestOptions)
		.then(response => {return response.json();})
		.then(data => {
      let messages = data.user.concat(data.bot);
      messages = sortMessages(messages,"id")
      let newData = []
      for(let i = 0; i < messages.length; i++){
        let userText = messages[i].user_id === 5 || messages[i].user_id === 6 ? "Bot: " + messages[i].content : "User: " + messages[i].content 
        let newMessage = {
          id: messages[i].id,
          title: userText,
        } as any
        newData.push(newMessage)
        console.log(newMessage)
      }
      setDATA(newData)
      console.log(newData)
      console.log(DATA)
      console.log(data)
    });
    console.log(selectedItems)
  };

  const sortMessages = (array:any,key:any) =>{
    return array.sort(function(a:any, b:any) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <SectionedMultiSelect
        items={items}
        IconRenderer={Icon}
        uniqueKey="name"
        subKey="children"
        selectText="Elige los tags"
        showDropDowns={true}
        readOnlyHeadings={true}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
});

export default FilterTag