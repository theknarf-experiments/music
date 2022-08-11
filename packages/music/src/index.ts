export { default as tuning } from './tuning.ts';

type Note = any;
type Scale = [number];

interface Key {
	tune: any,
	note: Note,
	scale: Scale,
}

export const key = (tune : any, note : Note, scale : Scale) => {
	return {
		tune,
		note,
		scale,
	} as Key;
}

export const cord = (key: Key, cord : number) => {
	let interval = key.note - 1 + key.scale[cord - 1];

	//console.log('key', key, 'cord', cord, 'interval', interval);

	if(key.tune.repeatingOctave)
		interval = interval % 12;
	
	//console.log('mod', interval, 'cordNote', key.tune.note[interval]);

	return {
//		key,
		cord: {
			cordNumber: cord,
			interval,
			cordNote: key.tune.note[interval],
		}
	};	
};

export const compose = (key: Key, cordProgression : [number]) => {
	const cords = cordProgression.map(i => cord(key, i));

	return {
		key,
		cords,
	}
};
