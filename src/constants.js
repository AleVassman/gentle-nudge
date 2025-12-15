// ENGLISH DEFAULTS
export const DEFAULT_TASKS_EN = [
  { text: "Open Samsung Music. Play that one song that always helps.", tier: 1, type: "default" },
  { text: "Open TikTok. Find 3 funny videos.", tier: 1, type: "default" },
  { text: "Close your eyes. Just sleep.", tier: 1, type: "default" },
  { text: "Unclench your jaw.", tier: 1, type: "default" },
  { text: "Go to the window/outside and have a smoke.", tier: 2, type: "default" },
  { text: "Drink a glass of water.", tier: 2, type: "default" },
  { text: "Sit up in bed.", tier: 2, type: "default" },
  { text: "Splash water on your face.", tier: 2, type: "default" },
  { text: "Brush your teeth.", tier: 3, type: "default" },
  { text: "Put the dirty dishes in the sink.", tier: 3, type: "default" },
  { text: "Change your shirt.", tier: 3, type: "default" },
  { text: "Take a shower.", tier: 4, type: "default" },
  { text: "Make a simple meal.", tier: 4, type: "default" },
  { text: "Clean one corner of the room.", tier: 4, type: "default" }
];

// ITALIAN DEFAULTS
export const DEFAULT_TASKS_IT = [
  { text: "Apri Samsung Music. Metti quella canzone che aiuta sempre.", tier: 1, type: "default" },
  { text: "Apri TikTok. Trova 3 video divertenti.", tier: 1, type: "default" },
  { text: "Chiudi gli occhi. Dormi e basta.", tier: 1, type: "default" },
  { text: "Rilassa la mascella.", tier: 1, type: "default" },
  { text: "Vai alla finestra/fuori e fuma una sigaretta.", tier: 2, type: "default" },
  { text: "Bevi un bicchiere d'acqua.", tier: 2, type: "default" },
  { text: "Siediti sul letto.", tier: 2, type: "default" },
  { text: "Sciacquati la faccia.", tier: 2, type: "default" },
  { text: "Lavati i denti.", tier: 3, type: "default" },
  { text: "Metti i piatti sporchi nel lavandino.", tier: 3, type: "default" },
  { text: "Cambiati la maglietta.", tier: 3, type: "default" },
  { text: "Fatti una doccia.", tier: 4, type: "default" },
  { text: "Prepara un pasto semplice.", tier: 4, type: "default" },
  { text: "Pulisci un angolo della stanza.", tier: 4, type: "default" }
];

// Default export
export const DEFAULT_TASKS = DEFAULT_TASKS_EN;

export const HELP_SLIDES = [
  {
    id: 'intro',
    icon: 'Battery', // We will map this string to the icon component later
    title: 'Check Your Battery',
    text: 'Start by choosing your energy level. Be honest. It adapts the tasks to how you feel.'
  },
  {
    id: 'tasks',
    icon: 'Layers',
    title: 'Tiny Steps',
    text: 'You get one task at a time. No giant lists. If you can\'t do it, skip it. No guilt.'
  },
  {
    id: 'tools',
    icon: 'LifeBuoy',
    title: 'Your Toolkit',
    text: 'Use the bottom dock for relief. Rain sounds for focus, Breathing for panic, or Help to reach out.'
  },
  {
    id: 'void',
    icon: 'Flame',
    title: 'The Void',
    text: 'Got negative thoughts? Type them into The Void and watch them burn. They are not saved.'
  },
  {
    id: 'history',
    icon: 'Calendar',
    title: 'Your Journey',
    text: 'We track your energy, not just your productivity. See your patterns over time.'
  }
];