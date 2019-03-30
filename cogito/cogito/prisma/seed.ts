import { prisma } from './generated/prisma-client'

async function main() {
  const artsRightAnswers = await Promise.all([
    prisma.createAnswer({ text: 'Marcus Tullius Cicero' }),
    prisma.createAnswer({ text: 'Surrealism' }),
    prisma.createAnswer({ text: 'René Descartes' }),
    prisma.createAnswer({ text: 'Antonio Da Sangallo' }),
    prisma.createAnswer({ text: 'Whistler’s mother' })
  ])

  await prisma.createTest({
    name: 'Arts',
    questions: {
      create: [
        {
          text:
            'Whose book does the famous “Lorem ipsum” nonsense latin phrasing comes from?',
          answers: {
            create: [
              { text: 'Publius Vergilius Maro' },
              { text: 'Homer' },
              { text: 'Marcus Aurelius' }
            ],
            connect: { id: artsRightAnswers[0].id }
          },
          correctAnswer: { connect: { id: artsRightAnswers[0].id } }
        },
        {
          text: 'Which cultural movement did René Magritte belong to?',
          answers: {
            create: [
              { text: 'Impressionism' },
              { text: 'Expressionism' },
              { text: 'Sarcasm' }
            ],
            connect: { id: artsRightAnswers[1].id }
          },
          correctAnswer: { connect: { id: artsRightAnswers[1].id } }
        },
        {
          text: 'Who said it: “Cogito ergo sum.”?',
          answers: {
            create: [
              { text: 'Galileo Galilei' },
              { text: 'Leonardo da Vinci' },
              { text: 'Tycho Brahe' }
            ],
            connect: { id: artsRightAnswers[2].id }
          },
          correctAnswer: { connect: { id: artsRightAnswers[2].id } }
        },
        {
          text:
            'Which famous artist from the Renessaince isn’t a Teenage Mutant Ninja Turtle character as well?',
          answers: {
            create: [
              { text: 'Leonardo da Vinci' },
              { text: 'Michelangelo di Lodovico Buonarroti Sino' },
              { text: 'Raffaello Sanzia da Urbino' }
            ],
            connect: { id: artsRightAnswers[3].id }
          },
          correctAnswer: { connect: { id: artsRightAnswers[3].id } }
        },
        {
          text:
            'Whose mother’s picture is completely destroyed in the famous Mr. Bean movie?',
          answers: {
            create: [
              { text: 'Mahler’s mother' },
              { text: 'Hopper’s mother' },
              { text: 'Yours' }
            ],
            connect: { id: artsRightAnswers[4].id }
          },
          correctAnswer: { connect: { id: artsRightAnswers[4].id } }
        }
      ]
    }
  })

  const historyRightAnswers = await Promise.all([
    prisma.createAnswer({ text: 'Aristotle' }),
    prisma.createAnswer({ text: 'Wrong' }),
    prisma.createAnswer({ text: 'Library of Alexandria' }),
    prisma.createAnswer({ text: 'Scourge of God' }),
    prisma.createAnswer({ text: 'Sleipnir' })
  ])

  await prisma.createTest({
    name: 'History',
    questions: {
      create: [
        {
          text:
            'Who was Alexander the Great’s personal teacher when he was young?',
          answers: {
            create: [
              { text: 'Demosthenes' },
              { text: 'Euclid' },
              { text: 'Plato' }
            ],
            connect: { id: historyRightAnswers[0].id }
          },
          correctAnswer: { connect: { id: historyRightAnswers[0].id } }
        },
        {
          text: 'Vikings had horns on their helm:',
          answers: {
            create: [{ text: 'Right' }, { text: 'Vikings did not wear helms' }],
            connect: { id: historyRightAnswers[1].id }
          },
          correctAnswer: { connect: { id: historyRightAnswers[1].id } }
        },
        {
          text:
            'Which of the following isn’t one of the 7 wonders of the ancient world?',
          answers: {
            create: [
              { text: 'Hanging Gardens of Babylon' },
              { text: 'Colossus of Rhodes' },
              { text: 'Temple of Artemis' }
            ],
            connect: { id: historyRightAnswers[2].id }
          },
          correctAnswer: { connect: { id: historyRightAnswers[2].id } }
        },
        {
          text: 'What was the nickname of Attila the Hun?',
          answers: {
            create: [
              { text: 'Sword of God' },
              { text: 'Arrow of God' },
              { text: 'God' }
            ],
            connect: { id: historyRightAnswers[3].id }
          },
          correctAnswer: { connect: { id: historyRightAnswers[3].id } }
        },
        {
          text: 'What is the name of Odin the god’s 8 legged horse?',
          answers: {
            create: [
              { text: 'Sloppy' },
              { text: 'Schlappie' },
              { text: 'Floki' }
            ],
            connect: { id: historyRightAnswers[4].id }
          },
          correctAnswer: { connect: { id: historyRightAnswers[4].id } }
        }
      ]
    }
  })

  const sciencesRightAnswers = await Promise.all([
    prisma.createAnswer({ text: '0' }),
    prisma.createAnswer({ text: 'The jellyfish: Turritopsis Nutricula' }),
    prisma.createAnswer({ text: 'Voyager 1' }),
    prisma.createAnswer({ text: 'Marie Curie' }),
    prisma.createAnswer({ text: 'The blue whale' })
  ])

  await prisma.createTest({
    name: 'Sciences',
    questions: {
      create: [
        {
          text: 'How much is: 3+3*1+9/3*(-4+2)?',
          answers: {
            create: [{ text: '-10' }, { text: '-2' }, { text: '1' }],
            connect: { id: sciencesRightAnswers[0].id }
          },
          correctAnswer: { connect: { id: sciencesRightAnswers[0].id } }
        },
        {
          text: 'Which of the following animals is a biological immortal?',
          answers: {
            create: [
              { text: 'The octopus' },
              { text: 'Greenland shark' },
              { text: 'Lobsters' }
            ],
            connect: { id: sciencesRightAnswers[1].id }
          },
          correctAnswer: { connect: { id: sciencesRightAnswers[1].id } }
        },
        {
          text:
            'What is the farthest object in the universe that was created by mankind?',
          answers: {
            create: [
              { text: 'Voyager 2' },
              { text: 'The Hubble Space Telescope' },
              { text: 'International Space Station' }
            ],
            connect: { id: sciencesRightAnswers[2].id }
          },
          correctAnswer: { connect: { id: sciencesRightAnswers[2].id } }
        },
        {
          text: 'Who was the first in history to be awarded two Nobel Prizes?',
          answers: {
            create: [
              { text: 'Linus Pauling' },
              { text: 'John Bardeen' },
              { text: 'Frederick Sanger' }
            ],
            connect: { id: sciencesRightAnswers[3].id }
          },
          correctAnswer: { connect: { id: sciencesRightAnswers[3].id } }
        },
        {
          text: 'Which is the largest living animal?',
          answers: {
            create: [
              { text: 'African Elephant' },
              { text: 'Donald Trump' },
              { text: 'Argentinosaurus huinculensis' }
            ],
            connect: { id: sciencesRightAnswers[4].id }
          },
          correctAnswer: { connect: { id: sciencesRightAnswers[4].id } }
        }
      ]
    }
  })

  const geographyRightAnswers = await Promise.all([
    prisma.createAnswer({ text: 'Brasília' }),
    prisma.createAnswer({ text: 'Asia' }),
    prisma.createAnswer({ text: 'Cretaceous' }),
    prisma.createAnswer({ text: 'Hawaii' }),
    prisma.createAnswer({ text: 'Mariana Trench' })
  ])

  await prisma.createTest({
    name: 'Geography',
    questions: {
      create: [
        {
          text: 'What is the capital of Brazil?',
          answers: {
            create: [
              { text: 'Rio de Janeiro' },
              { text: 'Caracas' },
              { text: 'Santiago' }
            ],
            connect: { id: geographyRightAnswers[0].id }
          },
          correctAnswer: { connect: { id: geographyRightAnswers[0].id } }
        },
        {
          text: 'Which is the biggest continent?',
          answers: {
            create: [
              { text: 'Africa' },
              { text: 'Americas' },
              { text: 'Australia' }
            ],
            connect: { id: geographyRightAnswers[1].id }
          },
          correctAnswer: { connect: { id: geographyRightAnswers[1].id } }
        },
        {
          text: 'In which geologic period did the dinosaurs go extinct?',
          answers: {
            create: [
              { text: 'Jurassic' },
              { text: 'Permian' },
              { text: 'Mesosoic' }
            ],
            connect: { id: geographyRightAnswers[2].id }
          },
          correctAnswer: { connect: { id: geographyRightAnswers[2].id } }
        },
        {
          text: 'Which is the 51th State of the United States of America?',
          answers: {
            create: [
              { text: 'Minnesota' },
              { text: 'Washington' },
              { text: 'Texas' }
            ],
            connect: { id: geographyRightAnswers[3].id }
          },
          correctAnswer: { connect: { id: geographyRightAnswers[3].id } }
        },
        {
          text: 'Where is the lowest point on earth?',
          answers: {
            create: [
              { text: 'Tonga Trench' },
              { text: 'Japan Trench' },
              { text: 'Puerto Rico Trench' }
            ],
            connect: { id: geographyRightAnswers[4].id }
          },
          correctAnswer: { connect: { id: geographyRightAnswers[4].id } }
        }
      ]
    }
  })
}

main()
