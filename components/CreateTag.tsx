import React, { useCallback, useEffect, useState } from "react";
import { View } from 'react-native';
import TagsInput from './TagsInput';

export default function CreateTag ({route}: {route: any}) {
  let Tags = []
  // const [Tags,setTags] = useState([])

  // useEffect(() => {
  //   Tags = Object.assign({}, route.params.currMessage.tags);
  //   // console.log(newTags)
  //   // setTags(newTags)
    
  // }, [])

	const selectedTags = tags => {
    let newUid = route.params.currMessage.user._id < 5 ? route.params.currMessage.user._id : route.params.currMessage.user._id - 5
    const requestOptions = { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mid: route.params.currMessage._id,
        tag: tags[tags.length - 1].tag,
        add: true,
        uid: newUid,
      })
    }
    route.params.currMessage.tags.push(tags[tags.length - 1].tag)
    console.log(requestOptions)
    fetch('http://gepartner-app.herokuapp.com/msg', requestOptions)
		.then(response => {return response.json();})
		.then(data => {
      console.log(data)
    });
		console.log(tags);
	};

	return (
		<View>
			<TagsInput selectedTags={selectedTags}  tags={Tags} cant={route.params.currMessage.tags.length} currentMessage={route.params.currMessage.tags}/>
		</View>
	);
};