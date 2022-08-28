import React from 'react';
import { Midi } from "@tonaljs/tonal";
import css from './pianoroll.module.css';

const PianoRollKey : React.FC<{
	midi: number,
	highlight?: Function
	type?: 'white' | 'black',
	onClick?: Function
}> = ({
	children,
	midi,
	highlight,
	onClick = () => {},
	type = 'white'
}) => {
	const onPianoRollKeyClick = () => {
		if(typeof onClick == 'function') {
			onClick(midi);
		}
	}

	let className = css.key
		+ ((type == 'black') ? ` ${css.black}` : '');

	if(typeof highlight == 'function') {
		const shouldHightlight = highlight(midi);
		if(shouldHightlight) {
			className += ` ${css.highlight}`;
			children = shouldHightlight;
		}
	}

	return <div className={className} onClick={onPianoRollKeyClick}>
		<span>{children}</span>
	</div>;
}

interface NoteRange {
	first: number;
	last: number;
}

const PianoRoll : React.FC<{
	noteRange: NoteRange,
	onClick?: Function
	highlight?: Function
}> = ({ noteRange, highlight, onClick }) => {
	const midiToType = (midi) => {
		switch(midi % 12) {
			case 1:
				case 3:
				case 6:
				case 8:
				case 10:
				return "black";
			break;

			default:
				return "white";
		}
	}

	const keys = Array.from(
		{ length: noteRange.last - noteRange.first },
		(_, i) => noteRange.first + i
	);

	const className = typeof onClick == 'function'
		? css.pianoroll + ' ' + css.interactive
		: css.pianoroll;

	return <div className={className}>
	{ keys.map((midi) => (
		<PianoRollKey
			key={midi}
			midi={midi}
			type={midiToType(midi)}
			onClick={onClick}
			highlight={highlight}
			>
			{Midi.midiToNoteName(midi)}
		</PianoRollKey>
	)) }
	</div>
};


export default PianoRoll;
