export const DEFAULT_TASKS = [
  { text: "Open Samsung Music. Play that one song that always helps.", tier: 1, type: "comfort" },
  { text: "Open TikTok. Find 3 funny videos.", tier: 1, type: "distraction" },
  { text: "Close your eyes. Just sleep.", tier: 1, type: "rest" },
  { text: "Unclench your jaw.", tier: 1, type: "physical" },
  { text: "Go to the window/outside and have a smoke.", tier: 2, type: "break" },
  { text: "Drink a glass of water.", tier: 2, type: "health" },
  { text: "Sit up in bed.", tier: 2, type: "physical" },
  { text: "Splash water on your face.", tier: 2, type: "hygiene" },
  { text: "Brush your teeth.", tier: 3, type: "hygiene" },
  { text: "Put the dirty dishes in the sink.", tier: 3, type: "tidying" },
  { text: "Change your shirt.", tier: 3, type: "hygiene" },
  { text: "Take a shower.", tier: 4, type: "hygiene" },
  { text: "Make a simple meal.", tier: 4, type: "health" },
  { text: "Clean one corner of the room.", tier: 4, type: "tidying" }
];

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