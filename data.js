const VAL = {
  people: {
    herName: "Alina",
    herNicknames: ["princess", "aloo"],
    yourName: "Zaim"
  },

  // Passcode gate
  passcode: {
    hintShort: "our dramatic desi line 😌",
    hintLong: "type the phrase we say that basically means 'Come here my love' (no spaces and lower case)",
    value: "aajamerijaan" // <-- passcode (lowercase)
  },

  // Accent palette
  palette: {
    sage: "#90b0a4",
    blue: "#9eb0da",
    val: "#ff5a7a"
  },

  // App tiles on the home screen
  apps: [
    { id:"timeline",   title:"Timeline",   meta:"Our little history", tag:"Swipe through memories", icon:"assets/calendar.svg" },
    { id:"scrapbook",  title:"Scrapbook",  meta:"Photos + captions", tag:"Polaroid chaos", icon:"assets/photo.svg" },
    { id:"letter",     title:"Letter",     meta:"Soft & messy", tag:"Read slowly", icon:"assets/letter.svg" },
    { id:"reasons",    title:"Reasons",    meta:"Infinite love receipts", tag:"Generate more", icon:"assets/heart.svg" },
    { id:"promises",   title:"Promises",   meta:"Amanah energy", tag:"Checklist", icon:"assets/check.svg" },
    { id:"future",     title:"Future",     meta:"InshaAllah list", tag:"Dream mode", icon:"assets/stars.svg" },
    { id:"openwhen",   title:"Open When…", meta:"Envelopes", tag:"Secrets", icon:"assets/envelope.svg" },
    { id:"games",      title:"Games",      meta:"Goofy + cute", tag:"Play", icon:"assets/game.svg" },
    { id:"nikkah",     title:"Nikkah Someday", meta:"Final reveal", tag:"(don’t click too early)", icon:"assets/ring.svg" },
  ],

  // Timeline events (edit dates/text freely)
  timeline: [
  {
    title:"We “met at a research symposium” (aka muzz)",
    when:"Week 0",
    text:"Neuroscience princess meets comp sci boy. We keep the symposium cover story because it’s funnier 😭.",
    media:{ src:"media/photos/t01-muzz-symposium.jpg", alt:"muzz cover story" }
  },
  {
    title:"First FaceTime (you yapped about the symposium)",
    when:"Week 1",
    text:"Somehow your yapping was the exact moment I felt safe enough to like… actually fall.",
    media:{ src:"media/photos/t02-first-facetime.jpg", alt:"first facetime" }
  },
  {
    title:"The night we opened up (shared our vulnerabilities)",
    when:"Week 2",
    text:"We didn’t just talk. We trusted. Main tumhara ho gaya right there.",
    media:{ src:"media/photos/t03-opened-up.jpg", alt:"opened up" }
  },
  {
    title:"First note you sent me",
    when:"Week 3",
    text:"I still remember reading it like it was oxygen. Soft, sincere, you.",
    media:{ src:"media/photos/t04-first-note.jpg", alt:"first note" }
  },
  {
    title:"Long distance rituals",
    when:"Always",
    text:"Falling asleep together, brushing teeth together, reading Qur’an together, farting on facetime. We’re far, but it’s still us.",
    media:{ src:"media/photos/t05-long-distance.jpg", alt:"long distance" }
  },
  {
    title:"Memphis trips",
    when:"Visits",
    text:"Hotels + cuddles + zoo sheep + Legos + Chipotle + movies + mosque in Collierville. Real life w you just hit different.",
    media:{ src:"media/photos/t06-memphis-trip.jpg", alt:"memphis trip" }
  },
],

// Scrapbook items (replace src with your real files in /media/photos)
scrapbook: [
  { src:"media/photos/s01-us-favorite.jpg", title:"Us", text:"my favorite view." },
  { src:"media/photos/s02-her-princess.jpg", title:"Her", text:"princess energy. aloo energy. unstoppable." },
  { src:"media/photos/s03-kekeke-chat.jpg", title:"Chaos", text:"kekeke. that’s it. that’s the whole caption." },
  { src:"media/photos/s04-zoo-sheep.jpg", title:"Zoo day", text:"petting sheep with you felt like a preview of my life." },
  { src:"media/photos/s05-legos.jpg", title:"Lego architects", text:"we build legos but also… we’re building a life." },
  { src:"media/photos/s06-mosque-collierville.jpg", title:"Mosque in Collierville", text:"barakah vibes. calm with you." },
],

  // Letter (soft + goofy versions)
  letter: {
    soft:
`Alina…

You came into my life like a quiet kind of mercy. Soft, steady and somehow strong enough to make me feel safe. I dont know how I handle you ngl. Because you are way too much for me in the best way. 

I still think about that first FaceTime. You yapping about your symposium like it was the most important thing in the world. And yk what it was. Because it was you. The real start. My princess. 

I love you for the way you care, the way you overthink, the way you try even when your mind is loud. Main tumhari har soch par heraan hota hu. I love you more than you think I do.

Ik that long distance is annoying but it’s never made you feel far. You’re in my routines: in my prayers, in the way I softe, in the way I plan, in the way I shower and sleep. 

Thank you for letting me open up. Thank you for healing me in ways you didn’t even realize you were healing me.

Your Zaim 🌙`,

    goofy:
`Princess,

Official statement: you told me you loved me first… but I need you to know. I love you MORE. Like objectively. Like by law. In fact because I said so therefore!

I miss you in the stupid little ways:
- the way you call yourself a potato (lies you make me brick hard)
- the way you run and act like you’re not iconic
- the way your laugh turns into “kekeke” and suddenly I’m ruined
- the way we read Qur’an together then somehow find a verse with “booty” and lose it 😭

Also I’m still proud of my first date strategy:
(1) kissed your nose instead of your lips
(2) called a rhino a dinosaur
(3) survived the sushi restaurant lady’s stealth mode
(4) late night McDonalds like we’re in a movie

My 5'6 brown baddie I finally found you

Love, Zaim (your certified simp) 🤍`
  },

  // Reasons generator
  reasons: [
    "You make me feel safe.",
    "Your brain is beautiful and yes even when it overthinks.",
    "Your kindness has weight. It changes people.",
    "You’re art + science at the same time.",
    "You’re my peace and my favorite chaos.",
    "You run like you’re chasing dreams (and you are).",
    "You’re adorable when you pretend you’re not.",
    "You sent me that first note and my life literally shifted.",
    "You love in a way that feels like home.",
    "You’re my princess. Always."
  ],

  // Promises (checklist)
  promises: [
    "I will be gentle with your anxious days.",
    "I will show up, not just say I will.",
    "I will protect our love from ego and pride.",
    "I will keep choosing you. Even when distance is annoying.",
    "I will make you feel beautiful on the days you don’t.",
    "I will keep us close to Allah, not just close to each other.",
    "I will laugh with you (even when it’s kekeke for 30 minutes).",
    "I will always bring snacks. We’re gonna eat so good."
  ],

  // Future dreams
  future: [
    "Volunteer together (and be annoyingly wholesome).",
    "Hike + take photos like we’re a travel vlog.",
    "More zoo days. More sheep. More us.",
    "Build Legos in our own place.",
    "Travel the world + pray in new cities.",
    "One day… Nikkah. InshaAllah."
  ],

  learned:
`What I learned from you:

- softness is not weakness
- reassurance is love in action
- healing can look like listening
- it’s okay to be held
- Allah-centered love feels different
`,

  // Open When letters
  openWhen: [
    {
      title:"Open when you miss me",
      prompt:"Type: aaja",
      answer:"aaja",
      letter:
`Aloo…

I miss you too. Come here. 

You're always in my thoughts even if we are miles way

Close your eyes and imagine:
my hand on your cheek, forehead kiss and you doing that little smile you try to hide.

Main tumhara hoon. Forever
`
    },
    {
      title:"Open when you feel ugly",
      prompt:"Type: princess",
      answer:"princess",
      letter:
`Princess,

You are not a potato. You are a whole masterpiece.

Your face, your voice, your mind, the way you care… it’s all beautiful.
If you could see yourself through my eyes you’d be embarrassed at how loved you are.
`
    },
    {
      title:"Open when you’re anxious",
      prompt:"Type: breathe",
      answer:"breathe",
      letter:
`Breathe with me.

In… (4)
Hold… (4)
Out… (6)

You are safe.
I’m here.
Allah is near.
`
    },
    {
      title:"Open when you want to laugh",
      prompt:"Type: kekeke",
      answer:"kekeke",
      letter:
`KEKEKE MODE ACTIVATED.

Remember when you got high and wouldn’t stop laughing and I was like:
“ok… so this is my life now.”

I love your laugh. It’s my favorite sound. 
`
    },
    {
      title:"Open when you need motivation",
      prompt:"Type: run",
      answer:"run",
      letter:
`Go run, my girl.

Your discipline is hot.
Your effort is hot.
Your glow is inevitable.

Also come back and tell me everything.
`
    },
    {
      title:"Open when you want the future",
      prompt:"Type: nikkah",
      answer:"nikkah",
      letter:
`InshaAllah.

Not “maybe.” Not “if.”
Someday.

And I’m going to love you with amanah until then.
`
    },
  ],

  // Quiz game
  quiz: [
    { q:"Where did we *actually* meet?", a:["At a research symposium 😭","On muzz"], correct:1 },
    { q:"Who said 'I love you' first?", a:["Zaim","Alina"], correct:1 },
    { q:"Our inside joke laugh?", a:["hehehe","kekeke"], correct:1 },
    { q:"First date energy?", a:["Nose kiss + swings + rhino dinosaur","Formal dinner + speeches"], correct:0 },
    { q:"Our phrase?", a:["aaja meri jaan","good morning sir"], correct:0 },
  ],

  // Memory match tiles (emoji pairs)
  memory: ["💚","💚","🫶","🫶","🌙","🌙","🏃‍♀️","🏃‍♀️","🧠","🧠","🍪","🍪","🎹","🎹","🌸","🌸","🧩","🧩"],

/* Valentine OS — pure HTML/CSS/JS (no build tools).
   Works on GitHub Pages because all paths are relative.
*/
};
