import type {
  ExperimentMeta,
  PredictionOption,
  ReflectQuestion,
} from '../types/experiments'

export const EXPERIMENTS: ExperimentMeta[] = [
  {
    id: 'osmosis',
    title: 'Osmosis: The Balancing Act',
    subtitle: 'Watch water reshape a cell',
    topic: 'Transport',
    topics: ['Transport', 'Homeostasis'],
    difficulty: 'Intro',
    durationMinutes: 8,
    summary:
      'Place an animal cell in different solutions and see how net water movement changes its volume.',
    learningGoals: [
      'Distinguish hypotonic, isotonic, and hypertonic conditions',
      'Connect solute concentration differences to net water movement',
      'Recognize that isotonic means no net water movement, not “no water movement”',
    ],
  },
  {
    id: 'enzymes',
    title: 'Enzymes: Finding the Sweet Spot',
    subtitle: 'Substrate, temperature, and reaction rate',
    topic: 'Macromolecules',
    topics: ['Macromolecules'],
    difficulty: 'Intermediate',
    durationMinutes: 10,
    summary:
      'Tune substrate concentration and temperature to explore a saturating rate model and an illustrative temperature curve.',
    learningGoals: [
      'See how reaction rate saturates as substrate rises',
      'Compare cold-slowed activity with heat-impaired function',
      'Read a chart that matches the same model as the animation',
    ],
  },
  {
    id: 'membranes',
    title: 'Membranes: Who Gets Through?',
    subtitle: 'Selective permeability in action',
    topic: 'Membranes',
    topics: ['Membranes', 'Transport'],
    difficulty: 'Intro',
    durationMinutes: 9,
    summary:
      'Toggle transporters and channels to discover which particles cross a membrane — and how.',
    learningGoals: [
      'Contrast bilayer diffusion with protein-assisted routes',
      'Explain why glucose and Na⁺ need helpers',
      'Keep electrical driving force in mind when thinking about real ions',
    ],
  },
]

export function getExperiment(id: string): ExperimentMeta | undefined {
  return EXPERIMENTS.find((e) => e.id === id)
}

export const OSMOSIS_PREDICTIONS: PredictionOption[] = [
  {
    id: 'swell',
    label: 'The cell will swell as net water enters.',
    correct: true,
    feedback:
      'Correct for a hypotonic outside: lower external solute means water enters and volume rises.',
  },
  {
    id: 'shrink',
    label: 'The cell will shrink as net water leaves.',
    correct: false,
    feedback:
      'That happens in a hypertonic outside. For a dilute outside, expect net water in.',
  },
  {
    id: 'unchanged',
    label: 'Volume will stay exactly the same with zero water movement.',
    correct: false,
    feedback:
      'Isotonic conditions have no net water movement, but water still moves both ways. Hypotonic solutions change volume.',
  },
]

export const ENZYME_PREDICTIONS: PredictionOption[] = [
  {
    id: 'saturate',
    label: 'Raising substrate a lot will keep increasing rate forever at the same steep slope.',
    correct: false,
    feedback:
      'Rates rise quickly at first, then level off as enzymes become occupied — saturation.',
  },
  {
    id: 'level',
    label: 'Rate rises with substrate, then levels off as enzymes saturate.',
    correct: true,
    feedback:
      'Yes. The Michaelis–Menten-style curve approaches a maximum when enzymes are busy.',
  },
  {
    id: 'hot-always',
    label: 'Higher temperature always speeds the reaction without limit.',
    correct: false,
    feedback:
      'Warmth can help up to a point, but this hypothetical enzyme loses function at high heat.',
  },
]

export const MEMBRANE_PREDICTIONS: PredictionOption[] = [
  {
    id: 'all-free',
    label: 'O₂, water, glucose, and Na⁺ all freely cross the bilayer the same way.',
    correct: false,
    feedback:
      'Only small nonpolar molecules like O₂ cross the bilayer readily. Others need help or move slowly.',
  },
  {
    id: 'helpers',
    label: 'O₂ crosses the bilayer; glucose and Na⁺ need protein helpers.',
    correct: true,
    feedback:
      'Right. Water is helped by aquaporins; glucose needs a transporter; Na⁺ needs a channel.',
  },
  {
    id: 'pump-only',
    label: 'Nothing crosses unless a pump spends energy to move it against a gradient.',
    correct: false,
    feedback:
      'This lab models passive movement down gradients. Active pumps are real — but out of scope here.',
  },
]

export const OSMOSIS_REFLECT: ReflectQuestion[] = [
  {
    id: 'iso-net',
    prompt: 'In an isotonic solution, what is true about water movement?',
    options: [
      {
        id: 'none',
        label: 'Water molecules stop moving entirely.',
        correct: false,
        feedback: 'Water still moves both ways; the net flow is zero.',
      },
      {
        id: 'net-zero',
        label: 'Water moves both ways, but net movement is about zero.',
        correct: true,
        feedback: 'Exactly — dynamic balance, not a frozen membrane.',
      },
    ],
  },
  {
    id: 'amount',
    prompt: 'If cell volume rises while solute amount stays fixed, internal concentration…',
    options: [
      {
        id: 'falls',
        label: 'Falls, because the same solute is diluted in more water.',
        correct: true,
        feedback: 'Concentration = amount ÷ volume, so larger volume lowers concentration.',
      },
      {
        id: 'rises',
        label: 'Rises, because larger cells hold more solute automatically.',
        correct: false,
        feedback: 'Solute amount is fixed in this model; dilution lowers concentration.',
      },
    ],
  },
]

export const ENZYME_REFLECT: ReflectQuestion[] = [
  {
    id: 'km-shape',
    prompt: 'Why does the substrate curve flatten at high concentration?',
    options: [
      {
        id: 'enzymes-busy',
        label: 'Most enzyme active sites are occupied; adding substrate helps less and less.',
        correct: true,
        feedback: 'Saturation: the rate approaches Vmax as free enzyme becomes scarce.',
      },
      {
        id: 'substrate-gone',
        label: 'Substrate molecules stop colliding when crowded.',
        correct: false,
        feedback: 'Crowding isn’t the model here — limited enzyme capacity is.',
      },
    ],
  },
  {
    id: 'temp',
    prompt: 'Very high temperature in this hypothetical enzyme model mainly…',
    options: [
      {
        id: 'denature',
        label: 'Reduces function (illustrative loss of activity).',
        correct: true,
        feedback: 'This curve is illustrative — hot conditions impair the enzyme’s activity.',
      },
      {
        id: 'universal',
        label: 'Shows the universal optimum shared by every enzyme on Earth.',
        correct: false,
        feedback: 'Optima differ by enzyme and organism; this curve is labeled hypothetical.',
      },
    ],
  },
]

export const MEMBRANE_REFLECT: ReflectQuestion[] = [
  {
    id: 'glucose',
    prompt: 'Why doesn’t glucose freely cross the lipid bilayer in this model?',
    options: [
      {
        id: 'polar',
        label: 'It is polar and relatively large, so it needs a transporter for facilitated diffusion.',
        correct: true,
        feedback: 'Correct — polarity and size keep glucose from dissolving into the bilayer.',
      },
      {
        id: 'tiny',
        label: 'It is smaller than O₂, so it should cross even faster without help.',
        correct: false,
        feedback: 'Glucose is larger and polar; O₂ is the easy bilayer traveler here.',
      },
    ],
  },
  {
    id: 'sodium',
    prompt: 'What does this model intentionally simplify about Na⁺?',
    options: [
      {
        id: 'electrical',
        label: 'It holds electrical driving force fixed and shows concentration-driven channel flux.',
        correct: true,
        feedback: 'Real ions feel both concentration and voltage; we keep voltage fixed for clarity.',
      },
      {
        id: 'free',
        label: 'It lets Na⁺ dissolve freely through the bilayer like oxygen.',
        correct: false,
        feedback: 'Na⁺ stays blocked without a channel in this lab.',
      },
    ],
  },
]
