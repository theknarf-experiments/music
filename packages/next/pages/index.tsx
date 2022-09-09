import { useState, useMemo } from 'react';
import { Key, Note, Midi } from "@tonaljs/tonal";
import css from '../src/components/pianoroll/pianoroll.module.css';
import PianoRoll from '../src/components/pianoroll/pianoroll.tsx';
import css2 from '../src/components/box/box.module.css';

const ModeLabel : React.FC = ({children}) => {
	return <span className={css.modeLabel}>
	{children}
	</span>;
}

const Box : React.FC<{
	title: string,
	position?: { x: number, y: number },
}> = ({ title, position, children }) => {
	return <div
		className={css2.box}
		style={{ top: `${position?.y || 0}px`, left: `${position?.x || 0}px` }}
		>
		<h2>{title}</h2>
	{children}
	</div>
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
				<div>
					Pick a key (in either major or minor).
					Choosen key: {Midi.midiToNoteName(key)}.
				</div>
				<div>
					<span>Chose Major or minor:</span>
					<select>
						<option value="major">Major scale</option>
						<option value="minor">Minor scale</option>
					</select>
				</div>
			</div>

			<div style={{ marginTop: '80px' }}>
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

						if(keyInfo !== null && i !== null && keyInfo.grades[i]) {
							return keyInfo.grades[i];
						}

						return false;
					}}
					attachedLabel={(midi) => {
						const octave = Note.octave(Note.fromMidi(midi));
						const i = keyInfo?.scale.map((note) => {
							return Note.midi(`${note}${octave}`)
						}).indexOf(midi)

						if(keyInfo !== null && i !== null && keyInfo.chords[i]) {
							return <div>
								<div>{keyInfo.chords[i]}</div>
								<ModeLabel>{keyInfo.chordScales[i]}</ModeLabel>
							</div>;
						}

						return false;
					}}
					/>
			</div>
			<h2>Pick chord progression</h2>
			<div>- Show the XState diagram for composing a cord progression based on functional harmonic progression</div>
			<div className={css2.boxWrapper}>
				<Box title="Tonic" position={{ x: 50, y: 50 }}>
					<button>I</button>
					<button>vi</button>
					<button>iii</button>
				</Box>
				<Box title="Subdominant" position={{ x: 200, y: 50 }}>
					<button>IV</button>
					<button>ii</button>
				</Box>
				<Box title="Dominant" position={{ x: 100, y: 180 }}>
					<button>V</button>
					<button>vii</button>
				</Box>
			</div>
			<div>- Use LilyPond / LilyBin / Hacklily to show the sheet music with download buttons</div>
		</div>
  );
}

export default App;
