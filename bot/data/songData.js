import { randomChoice } from '../helpers.js';

// All piano notes
export const songNotes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
];

// All scales
export const songScales = {
  standardScales: {
    'major scale': {
      notes: [1, 3, 5, 6, 8, 10, 12],
      weight: 10
    },
    'major bebop scale': {
      notes: [1, 3, 5, 6, 8, 9, 10, 12],
      weight: 2
    },
    'major pentatonic scale': {
      notes: [1, 3, 5, 8, 10],
      weight: 3
    },
    'minor harmonic scale': {
      notes: [1, 3, 4, 6, 8, 9, 12],
      weight: 3
    },
    'minor hungarian scale': {
      notes: [1, 3, 4, 7, 8, 9, 12],
      weight: 2
    },
    'minor melodic scale': {
      notes: [1, 3, 4, 6, 8, 10, 12],
      weight: 3
    },
    'minor natural (aeolian) scale': {
      notes: [1, 3, 4, 6, 8, 9, 11],
      weight: 10
    },
    'minor neapolitan scale': {
      notes: [1, 2, 4, 6, 8, 9, 12],
      weight: 2
    },
    'minor pentatonic scale': {
      notes: [1, 4, 6, 8, 11],
      weight: 3
    }
  },
  otherScales: {
    'arabic scale': {
      notes: [],
      weight: 0
    },
    'blues scale': {
      notes: [],
      weight: 0
    },
    'diminished scale': {
      notes: [],
      weight: 0
    },
    'dominant bebop scale': {
      notes: [],
      weight: 0
    },
    'dorian scale': {
      notes: [],
      weight: 0
    },
    'enigmatic scale': {
      notes: [],
      weight: 0
    },
    'japanese insen scale': {
      notes: [],
      weight: 0
    },
    'locrian scale': {
      notes: [],
      weight: 0
    },
    'lydian scale': {
      notes: [],
      weight: 0
    },
    'mixolydian scale': {
      notes: [],
      weight: 0
    },
    'neapolitan scale': {
      notes: [],
      weight: 0
    },
    'phrygian scale': {
      notes: [],
      weight: 0
    },
    'whole tone scale': {
      notes: [],
      weight: 0
    }
  }
};

// Common time signatures
export const timeSignatures = {
  '4/4': 10,
  '3/4': 5,
  '5/4': 1,
  '12/8': 2,
  '6/8': 2,
  '7/4': 1
};

export function generateData (minBPM = 30, maxBPM = 512, preference = null) {
  // Check if min BPM is higher than max BPM
  if (minBPM > maxBPM) {
    minBPM = 30;
    maxBPM = 512;
  }

  // Put all scale weights into an array
  const scaleWeights = [];
  for (const scale of Object.values(songScales.standardScales)) {
    scaleWeights.push(scale.weight);
  }

  // Randomly choose a scale based on weights
  let scale = randomChoice(Object.keys(songScales.standardScales), scaleWeights);

  // If the user had a preference, make sure we chose the preferred scale
  if (preference) {
    while (!scale.includes(preference)) {
      scale = randomChoice(Object.keys(songScales.standardScales), scaleWeights);
    }
  }

  // Put all time signature values and weights into two arrays
  const timeSignatureValues = Object.keys(timeSignatures);
  const timeSignatureWeights = Object.values(timeSignatures);

  // Randomly choose everything
  const bpm = Math.floor((Math.random() * (maxBPM - minBPM)) + minBPM);
  const key = randomChoice(songNotes);
  const notes = [];
  const timeSignature = randomChoice(timeSignatureValues, timeSignatureWeights);

  const keyIndex = songNotes.indexOf(key);

  // Add all the notes of the scale to an array
  for (let i = keyIndex; i < keyIndex + 12; i++) {
    const x = i % songNotes.length;
    if (songScales.standardScales[scale].notes.includes(x)) {
      notes.push(songNotes[x]);
    }
  }

  return {
    bpm,
    key,
    scale,
    notes,
    timeSignature
  };
}
