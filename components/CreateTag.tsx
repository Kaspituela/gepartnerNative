import React from "react";
import { View } from 'react-native';
import TagsInput from './TagsInput';

const Tags = [
  {
    id: '0',
    tag: 'cadsjcn',
  },
  {
    id: '1',
    tag: 'acdsc',
  },
]

export default function CreateTag ({route}: {route: any}) {
	const selectedTags = tags => {
    console.log(route.params.currMessage)
		console.log(tags);
	};
	return (
		<View>
			<TagsInput selectedTags={selectedTags}  tags={Tags} cant={Tags.length}/>
		</View>
	);
};