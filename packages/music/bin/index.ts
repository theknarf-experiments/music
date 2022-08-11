#!/usr/bin/env node -r tsm
import { tuning, key, compose } from '../src/';

const tune = tuning['15edo'];
//console.log('tune', tune);

const currentKey = key(
	tune,
	tune.note.A,
	tune.scale.Major
);

//console.log(currentKey);
const cordProgression = [1, 5, 4];

const song = compose(
	currentKey,
	cordProgression
);

console.log(JSON.stringify(song));
//*/
