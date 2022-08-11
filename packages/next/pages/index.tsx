import { useState, useMemo } from 'react';
import { Key, Note, Midi } from "@tonaljs/tonal";
import 'react-piano/dist/styles.css';
import css from '../src/components/pianoroll/pianoroll.module.css';

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

const ModeLabel : React.FC = ({children}) => {
	return <span className={css.modeLabel}>
	{children}
	</span>;
}

function App() {
	const [key, setKey] = useState(null);

  const firstNote = Midi.toMidi('c3');
  const lastNote = Midi.toMidi('f5');

	const keyInfo = useMemo(() => {
		if(key === null)
			return null;

		return Key.majorKey(Midi.midiToNoteName(key));
	}, [key]);

  return (
		<div>
			<h1>Compose</h1>
			<div>
				<h2>Pick a key (in either major or minor)</h2>
				<div>
					<span>Choosen key: {Midi.midiToNoteName(key)}</span>
				</div>
				<div>
					<span>Chose Major or minor:</span>
					<select>
						<option value="major">Major scale</option>
						<option value="minor">Minor scale</option>
					</select>
				</div>
			</div>

			<div>
				<PianoRoll
					noteRange={{ first: firstNote, last: lastNote }}
					onClick={(midiNumber) => {
						setKey(midiNumber);
					}}
					highlight={(midi) => {
						const octave = Note.octave(Note.fromMidi(midi));
						const i = keyInfo?.scale.map((note) => {
							return Note.midi(`${note}${octave}`)
						}).indexOf(midi)

						if(keyInfo !== null && i !== null) {
							return keyInfo.grades[i];
						}

						return false;
					}}
					/>
				<div>
				{
					keyInfo?.grades.map((grade, i) => (
						<div key={i}>
							{grade}, {keyInfo.chords[i]} <ModeLabel>{keyInfo.chordScales[i]}</ModeLabel>
						</div>
					))
				}
				</div>
			</div>
			<h2>Pick chord progression</h2>
			<div>- Show the XState diagram for composing a cord progression based on functional harmonic progression</div>
			<div>- Use LilyPond / LilyBin / Hacklily to show the sheet music with download buttons</div>
		</div>
  );
}

export default App;
