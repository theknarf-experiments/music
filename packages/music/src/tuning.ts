enum Interval {
	Uni = 1, // 0 semitones
	Min2, // 1 semitone
	Maj2,   // 2 semitones
	Min3,   // etc.
	Maj3,
	Perf4,
	Tri,
	Perf5,
	Min6,
	Maj6,
	Min7,
	Maj7,
}

enum note15edo {
	C = 1,
	CSharp,
	D,
	DSharp,
	E,
	F,
	FSharp,
	G,
	GSharp,
	A,
	ASharp,
	B,
};

const tuning = {
	'15edo': {
		repeatingOctave: true,
		note: note15edo,
		scale: {
			Major: [
				Interval.Uni,
				Interval.Maj2,
				Interval.Maj3,
				Interval.Perf4,
				Interval.Perf5,
				Interval.Maj6,
				Interval.Maj7
			],
			Minor: {},
		},
	}
};

export default tuning;
