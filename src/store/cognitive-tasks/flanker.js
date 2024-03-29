
const getTrial = (lastPractice) => ({
  name: "trial",
  question: "",
  description: "Flanker practice",
  ui: {
    inputType: "visual-stimulus-response",
    allow: ["disableBack"]
  },
  inputOptions: [
    {
      "@type": "schema:ItemList",
      "schema:name": "trials",
      "schema:numberOfItems": 0,
      "schema:itemListElement": [
      ]
    },
    {
      "@type": "schema:ItemList",
      "schema:name": "blocks",
      "schema:numberOfItems": 5,
      "schema:itemListElement": [
      ]
    },
    {
      "schema:name": "buttons",
      "schema:itemListElement": [
        {
          "schema:name": "",
          "schema:value": 0,
          "schema:image": ""
        },
        {
          "schema:name": "",
          "schema:value": 1,
          "schema:image": ""
        }
      ]
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "showFixation",
      "schema:value": false
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "showFeedback",
      "schema:value": true
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "showResults",
      "schema:value": true
    },
    {
      "@type": "schema:Text",
      "schema:name": "samplingMethod",
      "schema:value": "randomize-order"
    },
    {
      "@type": "schema:Text",
      "schema:name": "nextButton",
      "schema:value": "OK",
    },
    {
      "@type": "schema:Number",
      "schema:name": "sampleSize",
      "schema:value": 1
    },
    {
      "@type": "schema:Number",
      "schema:name": "trialDuration",
      "schema:value": 3000
    },
    {
      "@type": "schema:Number",
      "schema:name": "fixationDuration",
      "schema:value": 0,
    },
    {
      "@type": "schema:Text",
      "schema:name": "fixationScreen",
      "schema:value": "",
      "schema:image": ""
    },
    {
      "@type": "schema:Number",
      "schema:name": "minimumAccuracy",
      "schema:value": 75
    },
    {
      "@type": "schema:Number",
      "schema:name": "maxRetryCount",
      "schema:value": 3
    },
    {
      "@type": "schema:Text",
      "schema:name": "blockType",
      "schema:value": "practice"
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "lastPractice",
      "schema:value": lastPractice
    },
    {
      "@type": "schema:Number",
      "schema:name": "blockIndex",
      "schema:value": 0
    }
  ]
})

const getTest = (lastTest, blockIndex) => ({
  question: "",
  description: "Flanker practice",
  ui: {
    inputType: "visual-stimulus-response",
    allow: ["disableBack"]
  },
  inputOptions: [
    {
      "@type": "schema:ItemList",
      "schema:name": "trials",
      "schema:numberOfItems": 0,
      "schema:itemListElement": [
      ]
    },
    {
      "@type": "schema:ItemList",
      "schema:name": "blocks",
      "schema:numberOfItems": 0,
      "schema:itemListElement": [
      ]
    },
    {
      "schema:name": "buttons",
      "schema:itemListElement": [
        {
          "schema:name": "",
          "schema:value": 0,
          "schema:image": ""
        },
        {
          "schema:name": "",
          "schema:value": 1,
          "schema:image": ""
        }
      ]
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "showFixation",
      "schema:value": false
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "showFeedback",
      "schema:value": false
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "showResults",
      "schema:value": true
    },
    {
      "@type": "schema:Text",
      "schema:name": "samplingMethod",
      "schema:value": "randomize-order"
    },
    {
      "@type": "schema:Text",
      "schema:name": "nextButton",
      "schema:value": "Continue",
    },
    {
      "@type": "schema:Number",
      "schema:name": "sampleSize",
      "schema:value": 1
    },
    {
      "@type": "schema:Number",
      "schema:name": "trialDuration",
      "schema:value": 3000
    },
    {
      "@type": "schema:Number",
      "schema:name": "fixationDuration",
      "schema:value": 0,
    },
    {
      "@type": "schema:Text",
      "schema:name": "fixationScreen",
      "schema:value": "",
      "schema:image": ""
    },
    {
      "@type": "schema:Text",
      "schema:name": "blockType",
      "schema:value": "test"
    },
    {
      "@type": "schema:Boolean",
      "schema:name": "lastTest",
      "schema:value": lastTest
    },
    {
      "@type": "schema:Number",
      "schema:name": "blockIndex",
      "schema:value": blockIndex
    },
  ]
})

const restartInstructions = {
  question: "## Instructions\nPress the Next button to restart block.",
  description: "Instructions for the Practice Phase",
  options: {options: []},
  ui: {
    inputType: "markdownMessage",
    allow: ["disableBack"]
  }
}

const nextInstructions = {
  question: "## Instructions\nPress the Next button to start next block.",
  description: "Instructions for the Practice Phase",
  options: {options: []},
  ui: {
    inputType: "markdownMessage",
    allow: ["disableBack"]
  }
}

export default {
  name: "Simple & Choice Reaction Time Task Builder",
  activityType: "FLANKER",
  description: "This activity contains Flanker item.",
  items: [
    {
      name: "vsr-instructions",
      question: "## General Instructions\n\n\n You will see arrows presented at the center of the screen that point either to the left ‘<’ or right ‘>’.\n Press the left button if the arrow is pointing to the left ‘<’ or press the right button if the arrow is pointing to the right ‘>’.\n These arrows will appear in the center of a line of other items. Sometimes, these other items will be arrows pointing in the same direction, e.g.. ‘> > > > >’, or in the opposite direction, e.g. ‘< < > < <’.\n Your job is to respond to the central arrow, no matter what direction the other arrows are pointing.\n For example, you would press the left button for both ‘< < < < <’, and ‘> > < > >’ because the middle arrow points to the left.\n Finally, in some trials dashes ‘ - ’ will appear beside the central arrow.\n Again, respond only to the direction of the central arrow. Please respond as quickly and accurately as possible.",
      description: "Instructions for the Visual Stimulus Response widget",
      ui: {
        inputType: "markdownMessage",
        allow: ["disableBack"]
      }
    },
    {
      name: "practice-instructions",
      question: "## Instructions\n\nNow you will have a chance to practice the task before moving on to the test phase.\nRemember to respond only to the central arrow\n",
      description: "Instructions for the Practice Phase",
      ui: {
        inputType: "markdownMessage",
        allow: ["disableBack"]
      }
    },
    {
      ...getTrial(false),
      name: "trial",
    },
    {
      ...restartInstructions,
      name: "trial2-instructions"
    },
    {
      ...getTrial(false),
      name: "trial2",
    },
    {
      ...restartInstructions,
      name: "trial3-instructions"
    },
    {
      ...getTrial(true),
      name: "trial3",
    },
    {
      name: "test-instructions",
      question: "## Test Instructions\n\nGood job on the practice blocks.\nYou can now move on to the test blocks.\nYou will do the same task as in the practice, responding to the direction of the central arrow.\nYou will complete 3 blocks, each about 3-5 minutes long.\nYou will have  a short break in between these blocks\n",
      description: "Instructions for the Practice Phase",
      ui: {
        inputType: "markdownMessage",
        allow: ["disableBack"]
      }
    },
    {
      ...getTest(false, 1),
      name: "test1"
    },
    {
      ...nextInstructions,
      name: "test2-instructions"
    },
    {
      ...getTest(false, 2),
      name: "test2"
    },
    {
      ...nextInstructions,
      name: "test3-instructions"
    },
    {
      ...getTest(true, 3),
      name: "test3"
    },
  ],
  allowSummary: false,
  valid: false,
}
