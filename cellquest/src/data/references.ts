export interface ReferenceLink {
  title: string
  href: string
  note: string
}

/** Reputable, verifiable biology references — do not invent citations. */
export const REFERENCES: ReferenceLink[] = [
  {
    title: 'Khan Academy — Osmosis and tonicity',
    href: 'https://www.khanacademy.org/science/ap-biology/cell-structure-and-function/membrane-permeability/a/osmosis',
    note: 'Clear intro to hypotonic, isotonic, and hypertonic conditions.',
  },
  {
    title: 'Khan Academy — Enzymes and reaction rates',
    href: 'https://www.khanacademy.org/science/ap-biology/cellular-energetics/enzyme-structure-and-catalysis/a/enzymes-and-the-active-site',
    note: 'Enzyme basics, active sites, and factors that affect rate.',
  },
  {
    title: 'Khan Academy — Membrane permeability',
    href: 'https://www.khanacademy.org/science/ap-biology/cell-structure-and-function/membrane-permeability/a/membrane-permeability',
    note: 'Which molecules cross bilayers and which need transport proteins.',
  },
  {
    title: 'NIH / NCBI Bookshelf — Molecular Biology of the Cell (Alberts et al.)',
    href: 'https://www.ncbi.nlm.nih.gov/books/NBK26871/',
    note: 'Open chapter context on membrane transport (advanced reference).',
  },
  {
    title: 'OpenStax Biology 2e — The Cell Membrane',
    href: 'https://openstax.org/books/biology-2e/pages/5-1-components-and-structure',
    note: 'Peer-reviewed open textbook chapters on membranes and transport.',
  },
]
