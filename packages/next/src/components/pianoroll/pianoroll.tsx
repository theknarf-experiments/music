import React from 'react';
import { Midi } from "@tonaljs/tonal";
import css from './pianoroll.module.css';

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

const AttachedLabel : React.FC<{
	midi: number,
}> = ({ midi, children }) => {
	const type = midiToType(midi) == 'black' ? css.black : css.white;
	return <div className={`${css.attachedLabel} ${type}`}>
		<div>
		{children}
		</div>
	</div>;
}

const PianoRollKey : React.FC<{
	midi: number,
	highlight?: Function
	type?: 'white' | 'black',
	onClick?: Function,
	attachedLabel?: Funtion
}> = ({
	children,
	midi,
	highlight,
	attachedLabel,
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

	let shouldShowAttachedLabel;
	if(typeof attachedLabel == 'function') {
		shouldShowAttachedLabel = attachedLabel(midi);
	}

	return <div className={className} onClick={onPianoRollKeyClick}>
		<span>{children}</span>
		{ shouldShowAttachedLabel && (
			<AttachedLabel midi={midi}>{shouldShowAttachedLabel}</AttachedLabel>
		) }
	</div>;
}

interface NoteRange {
	first: number;
	last: number;
}

const PianoRoll : React.FC<{
	noteRange: NoteRange,
	onClick?: Function,
	highlight?: Function,
	attachedLabel?: Function,
}> = ({ noteRange, onClick, highlight, attachedLabel  }) => {
	const keys = Array.from(
		{ length: noteRange.last - noteRange.first },
		(_, i) => noteRange.first + i
	);

	const className = typeof onClick == 'function'
		? css.pianoroll + ' ' + css.interactive
		: css.pianoroll;

	return <div className={css.pianorollWrapper}>
		<div className={className}>
		{ keys.map((midi) => (
			<PianoRollKey
				key={midi}
				midi={midi}
				type={midiToType(midi)}
				onClick={onClick}
				highlight={highlight}
				attachedLabel={attachedLabel}
				>
				{Midi.midiToNoteName(midi)}
			</PianoRollKey>
		)) }
		</div>
	</div>
};


export default PianoRoll;
