import { figure, h2, list, p, pause, prompt, pull, quote, smarten } from "./blocks";

/**
 * Demo journal - what /explore shows until Sanity is connected (SANITY_PROJECT_ID in .env.local).
 *
 * Same shape the Sanity normaliser returns (lib/explore/sanity.js), so every page and component
 * works identically in both modes. The writing is placeholder copy by Claude; the art is the
 * site's own watercolours (each with its night painting where one exists).
 *
 * Cover `fit`: "cover" fills the frame (paintings, photos), "contain" floats the piece on the
 * soft stage with breathing room (medallions, book covers, tall cut-outs).
 */

/* ── Art ─────────────────────────────────────────────────────────────── */

const v = (src, width, height, position) => ({ src, width, height, ...(position ? { position } : {}) });

const ART = {
  harbour: {
    alt: "A watercolour harbour at dusk: a pine on the left, a long arched bridge and the city lights on still water",
    light: v("/images/about/bridge.png", 1536, 1024),
    dark: v("/images/about/bridge-night-harbour.png", 1536, 1024),
  },
  carriage: {
    alt: "A horse and carriage beneath a broad tree, on a road winding through misty green hills",
    light: v("/images/light/hero-landscape.png", 1536, 1024, "center 62%"),
    dark: v("/images/dark/night-hero-landscape.png", 1616, 1024, "center 62%"),
  },
  sailboat: {
    alt: "A long, low shoreline of hills and mist with a single small sailboat on the water",
    // A very wide strip: crop to the islands and the sail at the right-hand end
    light: v("/images/about/landscape-sailboat.png", 2880, 746, "100% center"),
    dark: v("/images/about/landscape-sailboat-night.png", 2880, 746, "100% center"),
  },
  range: {
    alt: "Layered mountain ridges dissolving into mist",
    light: v("/images/light/footer-landscape.png", 1536, 1024, "center 70%"),
    dark: v("/images/dark/night-range.png", 1536, 1024, "center 70%"),
  },
  telephone: {
    alt: "An old rotary telephone with a coiled cord, painted in soft watercolour",
    light: v("/images/contact/telephone.png", 856, 573),
    dark: v("/images/contact/telephone-night.png", 856, 573),
    fit: "contain",
  },
  sky: {
    alt: "A small figure reaching up to touch a curl of cloud, inside a painted circle",
    light: v("/images/features/wander.png", 640, 640),
    dark: v("/images/features/wander-night.png", 640, 640),
    fit: "contain",
  },
  companion: {
    alt: "The silhouette of a face in profile, filled with blue watercolour, inside a painted circle",
    light: v("/images/features/companion.png", 640, 640),
    dark: v("/images/features/companion-night.png", 640, 640),
    fit: "contain",
  },
  reader: {
    alt: "Someone reading in the grass under a tree, with soft hills and a cloud beyond",
    light: v("/images/features/icon-companion.png", 640, 640),
    dark: v("/images/features/icon-companion-night.png", 640, 640),
    fit: "contain",
  },
  openBook: {
    alt: "An open book with its pages fanning, painted in pale blue",
    light: v("/images/features/short-stories.png", 640, 640),
    dark: v("/images/features/short-stories-night.png", 640, 640),
    fit: "contain",
  },
  stage: {
    alt: "A little theatre stage with dancers under painted clouds",
    light: v("/images/features/icon-short-stories.png", 640, 640),
    dark: v("/images/features/icon-short-stories-night.png", 640, 640),
    fit: "contain",
  },
  bonsai: {
    alt: "A small windswept pine, a curl of cloud above and a bear cub wandering below",
    light: v("/images/light/mist-a.png", 1054, 1492),
    dark: v("/images/dark/night-tree-bear.png", 1054, 1492),
    fit: "contain",
  },
  goose: {
    alt: "A goose in a long coat leaning on a field fence, drawn in rose ink",
    light: v("/images/products/web/diary-goose.jpg", 1054, 1492),
    fit: "contain",
  },
  horse: {
    alt: "A horse standing before a chateau beneath a plum-coloured cloud",
    light: v("/images/products/web/diary-horse.jpg", 1054, 1492),
    fit: "contain",
  },
  aviators: {
    alt: "Two aviators beside a vintage biplane, a cloud curling overhead, in sepia ink",
    light: v("/images/products/web/diary-aviators.jpg", 1054, 1492),
    fit: "contain",
  },
  pagoda: {
    alt: "A pagoda on a misty lake beneath a drifting cloud, in soft blue ink",
    light: v("/images/products/web/diary-pagoda.jpg", 1054, 1492),
    fit: "contain",
  },
  carnival: {
    alt: "A night carnival drawn in fine gold lines on deep blue: a Ferris wheel, tents and a shooting star",
    light: v("/images/products/web/journal-night-carnival.jpg", 1536, 1024),
  },
  universe: {
    alt: "A navy journal cover: a small figure reaching for a cloud, titled The Universe Speaks at Night",
    light: v("/images/products/web/journal-letters-from-the-universe-night.jpg", 1000, 1532),
    fit: "contain",
  },
  basket: {
    alt: "The Life I Am Creating workbook tucked into a woven basket by a sunny window",
    light: v("/images/products/web/workbook-life-i-am-creating-basket.jpg", 1200, 1600, "center 40%"),
  },
  workbook: {
    alt: "The Life I Am Creating workbook beside a gold pen on a white desk",
    light: v("/images/products/web/workbook-life-i-am-creating.jpg", 1516, 1600),
  },
};

/** Normalised image: { alt, fit, light, dark } - dark is null when one painting serves both themes. */
const art = (name) => {
  const { alt, light, dark = null, fit = "cover" } = ART[name];
  return { alt, fit, light, dark };
};
const cover = (name, caption, credit = "Illustration · the STOEN mind") => ({ ...art(name), caption, credit });

/* ── Topics & authors ────────────────────────────────────────────────── */

export const demoTopics = [
  {
    slug: "short-stories",
    title: "Short Stories",
    description: "Little worlds to step into - small characters, quiet surprises, and a door left open at the end.",
  },
  {
    slug: "wanderings",
    title: "Wanderings",
    description: "Essays from the long way round: harbours, hills, slow roads and the thoughts that walk beside them.",
  },
  {
    slug: "the-quiet-mind",
    title: "The Quiet Mind",
    description: "Notes on attention, rest and the weather inside - the mind as something to keep company with, not to fix.",
  },
  {
    slug: "from-the-studio",
    title: "From the Studio",
    description: "Behind the pages: how our journals, workbooks and diaries are imagined, painted, bound and sent.",
  },
  {
    slug: "prompts",
    title: "Prompts",
    description: "Gentle questions for your notebook. No right answers, no deadlines - just somewhere to begin.",
  },
];

const topic = (slug) => {
  const t = demoTopics.find((item) => item.slug === slug);
  return { slug: t.slug, title: t.title };
};

// The About page's artisans (placeholder people from the Figma file) plus the studio itself.
const AUTHORS = {
  clara: {
    name: "Clara Vance",
    slug: "clara-vance",
    role: "Founder & Master Bookbinder",
    bio: "Clara binds every first copy by hand, and writes in the margins of most of them.",
  },
  julian: {
    name: "Julian Thorne",
    slug: "julian-thorne",
    role: "Illustrator",
    bio: "Julian paints the clouds, harbours and small wandering creatures that live in our books.",
  },
  elena: {
    name: "Elena Rostova",
    slug: "elena-rostova",
    role: "Writer & Editor",
    bio: "Elena looks after the words - the stories, the prompts and the quiet spaces between them.",
  },
  studio: {
    name: "The Studio",
    slug: "the-studio",
    role: "the STOEN mind",
    bio: "Notes from the people who imagine, paint, write and bind the STOEN mind's books.",
  },
};

/* ── Posts ───────────────────────────────────────────────────────────── */

const posts = [
  {
    id: "demo-harbour",
    slug: "the-harbour-at-the-edge-of-evening",
    title: "The Harbour at the Edge of Evening",
    dek: "On the hour when the day lets go of its edges, and what a city of lights can teach a restless mind about waiting.",
    topic: topic("wanderings"),
    author: AUTHORS.elena,
    publishedAt: "2026-10-20T08:00:00+05:30",
    featured: true,
    cover: cover("harbour", "The bridge at dusk, from the pine on the western shore."),
    body: [
      p("There is a moment, just after the sun has gone and just before anyone has decided it is night, when a harbour forgets to be busy. The ferries slow. The gulls fold themselves onto the railings. The bridge, which all day has been a road, becomes a line drawn across the water, and the water, which all day has been grey, becomes a second sky."),
      p("I have been going to the same bench at that hour for most of a year. Not every evening - that would make it a task - but often enough that the bench has started to feel like a place that knows me. I bring nothing. That is the only rule. No book, no headphones, no list of things to think through. Just the walk down, the bench, and the forty minutes in which the lights come on one window at a time."),
      h2("A city switching itself on"),
      p("If you watch carefully, you can see the city decide. A single office on the twelfth floor. Then a kitchen in the flats along the water. Then, all at once, the bridge - every lamp at the same instant, as if someone had been waiting with a hand on the switch. It is the most ordinary thing in the world, and it never fails to make me hold my breath."),
      p("What I have come to love is that none of it is for me. The lights are for the people cooking dinner and finishing reports and walking home. I am simply allowed to watch. There is a particular kind of rest in being a witness rather than a participant - in letting the world get on with itself while you sit very still at its edge."),
      pull("The lights are not for me. I am simply allowed to watch - and there is a rest in that I hadn't known I was missing.", "Elena Rostova"),
      p("For a long time I treated waiting as the empty space between the things that mattered. The queue before the counter. The train before the meeting. The evening before the morning. I filled those gaps as quickly as I could, with my phone, with plans, with small worries I could turn over like stones."),
      p("The harbour has been slowly un-teaching that. At the edge of evening, nothing is going to happen that you can hurry. The light will go when it goes. The lamps will come on when they come on. You can sit inside the waiting, or you can fight it - but the bridge will light up at exactly the same moment either way."),
      pause(),
      h2("What the water keeps"),
      p("Reflections are the harbour's quiet trick. Every lamp on the bridge appears twice: once in the air, sharp and certain, and once below, loosened by the water into a long, wavering ribbon. I used to think of the reflection as the lesser copy. Now I'm not so sure. The one on the water moves. It breathes. It is never the same twice."),
      p("I think minds are a little like that. There is the version of a day that happened - sharp, certain, already finished. And there is the version we carry, loosened and moving, changing shape each time we look at it. Neither is wrong. The second one is simply still alive."),
      prompt("A prompt to carry home", "Think of a place you return to without needing a reason. What does it ask of you? What does it let you put down?"),
      p("When the last of the colour has gone from the sky, I walk back up the hill. The bench stays where it is. The bridge stays lit. And something in me - I couldn't tell you what - stays a little quieter than it was when I came down."),
    ],
  },
  {
    id: "demo-goose",
    slug: "the-goose-who-waited-at-the-fence",
    title: "The Goose Who Waited at the Fence",
    dek: "Every morning, a goose in a long coat leaned on the same fence and watched the road. Nobody knew who she was waiting for. Least of all the goose.",
    topic: topic("short-stories"),
    author: AUTHORS.elena,
    publishedAt: "2026-10-18T08:00:00+05:30",
    cover: cover("goose", "From the Diaries: the Goose, in rose ink.", "From the Diaries · the STOEN mind"),
    body: [
      p("The goose arrived at the fence on a Tuesday, wearing a coat that was a little too long for her and an expression that suggested she had somewhere to be. She did not, it turned out, have anywhere to be. She had somewhere to *wait*, which is a different thing entirely."),
      p("She leaned on the top rail with both wings folded, and she watched the road."),
      p("The farmer's daughter asked her, on the third morning, who she was waiting for. The goose considered the question for a long time. \"I'll know,\" she said at last, \"when they come.\""),
      p("Weeks passed. The road brought a postman, two cyclists, a lost tourist, a flock of sheep going the wrong way and, once, a parade. The goose greeted each of them politely and went back to watching."),
      pull("\"I'll know,\" she said at last, \"when they come.\""),
      p("By autumn, the village had begun to wait with her. People brought flasks of tea to the fence. Children leaned on the rail beside her and watched the road, too. Nobody was quite sure what they were waiting for, but it turned out to be very pleasant, waiting together, with the leaves coming down."),
      p("On the first cold morning of winter, the goose straightened her coat, looked along the fence at everyone leaning there, and smiled - the slow, surprised smile of someone recognising a face in a crowd."),
      p("\"Oh,\" she said. \"There you are.\""),
    ],
  },
  {
    id: "demo-sky",
    slug: "the-mind-is-more-like-a-sky",
    title: "The Mind Is More Like a Sky",
    dek: "We are taught to treat our thoughts as problems to be solved. What if they were weather - passing through something wider that was there all along?",
    topic: topic("the-quiet-mind"),
    author: AUTHORS.clara,
    publishedAt: "2026-10-16T08:00:00+05:30",
    cover: cover("sky", "Reaching for a cloud - from the Features medallions."),
    body: [
      p("Somewhere along the way, most of us picked up the idea that the mind is a machine. It has inputs and outputs. It can be optimised. When it makes a strange noise, something must be broken, and the sensible thing to do is open the casing and find the faulty part."),
      p("It is a useful idea for some things. It is a lonely idea for most of the others."),
      h2("Weather, not wreckage"),
      p("The picture that has stayed with me instead is older and softer: the mind as a sky. Thoughts arrive like weather. Some are bright and fast. Some settle in for days. Some are storms, and storms are real, and they can be frightening. But the sky is not damaged by the storm. It is simply the place the storm is happening."),
      quote("The sky has never once been harmed by a cloud. It has only ever made room for it."),
      p("I don't find this comforting because it makes the weather go away. It doesn't. I find it comforting because it gives me somewhere to stand. When a heavy thought rolls in, I can notice it - *there's that cloud again* - without having to become it."),
      pause(),
      h2("Keeping a weather diary"),
      p("A small practice that helps: once a day, write down the weather inside. Not the reasons, not the analysis. Just the weather."),
      list([
        "*Clear, with a cool wind from the north.*",
        "*Low cloud all morning; brightening after lunch.*",
        "*A storm, mostly about the email. Passing now.*",
      ]),
      p("After a few weeks you'll notice something. The weather changes. It always changes. And the sky - the wide, patient part of you that does the noticing - is still there at the end of every entry."),
      prompt("A prompt for today", "If your mind were a sky this morning, what would the forecast say? Write it as plainly as a radio announcer would."),
    ],
  },
  {
    id: "demo-carriage",
    slug: "on-travelling-slowly",
    title: "On Travelling Slowly",
    dek: "A horse, a carriage and a road that refuses to be hurried. Notes from the long way round.",
    topic: topic("wanderings"),
    author: AUTHORS.julian,
    publishedAt: "2026-10-14T08:00:00+05:30",
    cover: cover("carriage", "The carriage under the great tree - the first painting of the home page."),
    body: [
      p("When I painted the carriage for the first page of this site, I gave the horse no particular destination. People ask about that. Where is it going? Who is inside? I tell them the truth, which is that I don't know, and that not knowing was rather the point."),
      p("A carriage is a wonderfully inefficient way to travel. You feel every rise in the road. You notice the trees one by one instead of as a green blur. You arrive later than you would have, and you arrive having *been somewhere* on the way."),
      pull("You arrive later than you would have - and you arrive having been somewhere on the way."),
      h2("The speed of noticing"),
      p("There seems to be a speed at which the world becomes visible. Walk, and you see the beetle on the path. Cycle, and you see the hedgerow. Drive, and you see the motorway signs. Fly, and you mostly see the seat in front of you."),
      p("I don't think the answer is to never go fast. Sometimes you need to be somewhere by Tuesday. But I've started to keep a few journeys deliberately slow - the walk to the post office, the bus that takes the long route by the river - simply so I remember what the world looks like at the speed of noticing."),
      prompt("Try this week", "Choose one short journey you make often. Make it slower on purpose, and write down three things you have never noticed before."),
    ],
  },
  {
    id: "demo-studio-workbook",
    slug: "behind-the-pages-the-life-i-am-creating",
    title: "Behind the Pages: Making “The Life I Am Creating”",
    dek: "From the first sunlit sketch to the last stitch of the binding - how our Day workbook came to be.",
    topic: topic("from-the-studio"),
    author: AUTHORS.studio,
    publishedAt: "2026-10-12T08:00:00+05:30",
    cover: cover("basket", "Season 1 of the workbook, in the studio window.", "Photograph · the STOEN mind"),
    body: [
      p("Every one of our workbooks starts as a walk. For *The Life I Am Creating*, it was a long, slow one along a path past a duck pond on a bright spring morning - the same path that ended up on the cover."),
      p("We knew we wanted a book that felt like daylight: a companion for mornings, for beginnings, for the sort of hopeful, unhurried planning that doesn't feel like a to-do list. So the first decision was the light itself. Julian painted the cover four times before the yellow felt warm enough to hold in your hands."),
      figure(art("workbook"), "The finished cover, beside the pen we use for every first inscription."),
      h2("A character for the journey"),
      p("Each chapter has a small character who walks beside you - noticing things, asking gentle questions, occasionally getting a little lost. We wrote her voice slowly, reading every line aloud to see whether it sounded like a friend or a teacher. Friends stayed in. Teachers were kindly asked to leave."),
      h2("Paper, thread and patience"),
      list([
        "Uncoated paper, heavy enough for ink and pencil, soft enough for watercolour.",
        "A lay-flat binding, so the book stays open while you write.",
        "Wide margins, because the best thoughts usually arrive in the margins.",
      ]),
      p("Clara bound the first fifty copies by hand. The rest are bound by a small workshop we have worked with for years, who now know exactly how loose to leave the spine."),
      pause(),
      p("If you have a copy, we'd love to hear where it has travelled. Write to us any time - the address is on the [contact page](/contact)."),
    ],
  },
  {
    id: "demo-horse",
    slug: "a-horse-named-thursday",
    title: "A Horse Named Thursday",
    dek: "The horse at the chateau had been named for the day she arrived. She had always felt it was the wrong day.",
    topic: topic("short-stories"),
    author: AUTHORS.elena,
    publishedAt: "2026-10-10T08:00:00+05:30",
    cover: cover("horse", "From the Diaries: the Horse, in plum ink.", "From the Diaries · the STOEN mind"),
    body: [
      p("Thursday had arrived at the chateau on a Thursday, which was how she got her name, and she had never been entirely happy about it."),
      p("Thursday, she felt, was a day of nearly. Nearly the weekend. Nearly finished. Nearly time. She would much rather have been a Saturday, or at the very least a Sunday afternoon, the kind with long shadows and nowhere to be."),
      p("So, one autumn, she decided to find out what the other days were like."),
      p("She spent a Monday in the orchard and found it brisk and full of good intentions. She spent a Wednesday by the lake and found it patient, and a little tired. On Saturday she went to the village fair and came home dizzy with ribbons. On Sunday she slept."),
      pull("She had been nearly something all her life. It turned out nearly was a lovely place to stand."),
      p("And on the following Thursday she stood at the gate in the late light, with the cloud turning plum above the chateau, and realised she was not unhappy at all. Thursday was the day you could still see the whole weekend ahead of you, untouched. Thursday was the day of everything still possible."),
      p("She kept the name."),
    ],
  },
  {
    id: "demo-companion",
    slug: "keeping-company-with-yourself",
    title: "Keeping Company With Yourself",
    dek: "Solitude has a reputation problem. A small defence of the evenings we spend alone - and how to make them kinder.",
    topic: topic("the-quiet-mind"),
    author: AUTHORS.elena,
    publishedAt: "2026-10-08T08:00:00+05:30",
    cover: cover("companion", "A quiet companion - from the Features medallions."),
    body: [
      p("There is a difference between being alone and being lonely, and most of us learn it the hard way. Loneliness is an absence. Solitude, at its best, is a presence: your own, at last, without anyone else in the room to perform for."),
      p("The trouble is that we are rarely taught how to be good company for ourselves. We would never invite a friend round and then ignore them for the whole evening while scrolling through our phones. And yet that is how many of our evenings alone are spent."),
      h2("Small hospitalities"),
      p("I've started treating evenings on my own the way I'd treat a guest I like:"),
      list([
        "I put on a lamp instead of the big light.",
        "I make something warm to drink, and I drink it while it's still warm.",
        "I ask myself a question - a real one - and wait for the answer.",
      ]),
      p("It sounds almost silly written down. But the effect is real. The evening stops being an empty space to be filled and becomes something closer to a visit."),
      prompt("A question to ask your own company", "What has been on your mind this week that nobody has asked you about?"),
    ],
  },
  {
    id: "demo-sailboat",
    slug: "the-art-of-not-arriving",
    title: "A Sailboat and the Art of Not Arriving",
    dek: "On a long shoreline, a single sail moves so slowly it seems to stand still. Perhaps that is the whole journey.",
    topic: topic("wanderings"),
    author: AUTHORS.julian,
    publishedAt: "2026-10-05T08:00:00+05:30",
    cover: cover("sailboat", "The long shore, with its single sail."),
    body: [
      p("I painted this shoreline over several weeks, a little at a time, and for most of those weeks the sailboat wasn't in it. The hills were there, and the mist, and the water. Something was missing, and I couldn't tell what."),
      p("The boat arrived on the last day. It is very small. You could cover it with a fingernail. And it changed everything, because suddenly the painting was not a place but a journey - and a journey that was clearly in no hurry at all."),
      pull("Suddenly the painting was not a place but a journey - and one in no hurry at all."),
      p("I think about that boat a great deal. It is not racing. It is not lost. It is simply moving along the shore at the speed the wind allows, and the shore is very long, and that seems to be fine with everyone involved."),
      prompt("A small permission", "Write down one thing you are trying to arrive at. Then write down what the journey towards it has already given you."),
    ],
  },
  {
    id: "demo-aviators",
    slug: "two-aviators-and-an-unmapped-cloud",
    title: "Two Aviators and an Unmapped Cloud",
    dek: "They had flown over every mountain on the chart. Then a cloud appeared that wasn't on any map at all.",
    topic: topic("short-stories"),
    author: AUTHORS.julian,
    publishedAt: "2026-10-02T08:00:00+05:30",
    cover: cover("aviators", "From the Diaries: the Aviators, in sepia ink.", "From the Diaries · the STOEN mind"),
    body: [
      p("Agnes and Bertrand had mapped the whole valley. Every peak had a name, every river a number, every field a neat pencilled outline on the chart they kept folded in Bertrand's breast pocket."),
      p("So when the cloud appeared over the eastern ridge one bright morning - a great, curling, unmistakable cloud, shaped rather like a question - they did what any self-respecting aviators would do. They took the chart out and looked for it."),
      p("It was not there."),
      p("\"Clouds aren't on charts,\" said Agnes, reasonably."),
      p("\"This one,\" said Bertrand, \"looks like it ought to be.\""),
      pull("\"This one,\" said Bertrand, \"looks like it ought to be.\""),
      p("They stood by the plane for a long while, watching it. It did not drift away, as clouds should. It simply hung there, curling and uncurling, as if it were waiting to be asked something."),
      p("In the end, they didn't fly to it. Some things, Agnes said, are better left unmapped. But that evening Bertrand unfolded the chart and, in the empty space above the eastern ridge, drew a very small cloud in pencil - with a question mark beside it, just in case."),
    ],
  },
  {
    id: "demo-prompts-sunday",
    slug: "seven-prompts-for-a-slow-sunday",
    pick: true,
    title: "Seven Prompts for a Slow Sunday",
    dek: "No goals, no plans, no tidy conclusions. Just seven gentle questions to take outside with a notebook and a tree to sit under.",
    topic: topic("prompts"),
    author: AUTHORS.elena,
    publishedAt: "2026-09-28T08:00:00+05:30",
    cover: cover("reader", "Reading under the great tree - from the Features medallions."),
    body: [
      p("Take these with you somewhere comfortable. Answer one, or all seven, or none - and simply let them keep you company. There are no wrong answers. There isn't really such a thing as an answer at all."),
      list(
        [
          "What did the light look like when you woke up today?",
          "Which small thing went right this week that nobody noticed?",
          "If you could keep one hour from the last month, which would it be?",
          "What are you carrying that you could set down, just for this afternoon?",
          "Describe a place you loved as a child, using only the sounds you remember.",
          "Who do you miss? Write them a postcard you'll never send.",
          "What would you like to wonder about next?",
        ],
        "number",
      ),
      pause(),
      p("When you're done, close the notebook without reading back. Let the words rest for a week. They'll be different when you return to them - and so will you."),
    ],
  },
  {
    id: "demo-bonsai",
    slug: "tending-a-very-small-tree",
    pick: true,
    title: "Tending a Very Small Tree",
    dek: "A windswept pine no taller than a teacup, and the slow lesson of caring for something that will not be rushed.",
    topic: topic("the-quiet-mind"),
    author: AUTHORS.clara,
    publishedAt: "2026-09-24T08:00:00+05:30",
    cover: cover("bonsai", "The little pine, with a wandering bear for company."),
    body: [
      p("My grandmother kept a small pine on her windowsill for forty years. It never grew much taller than a teacup. When she gave it to me, she gave me exactly one instruction: *don't hurry it.*"),
      p("I thought I understood. I didn't. It took me two years of over-watering, over-pruning and over-worrying before I realised that almost everything the tree needed from me was restraint."),
      h2("What the tree asks"),
      p("Light, mostly. A little water, less often than you'd think. A turn every week so it doesn't lean. And, once a season, a careful snip - not to make it into something, but to help it become more of what it already is."),
      pull("Not to make it into something, but to help it become more of what it already is."),
      p("I've come to think that a great deal of looking after ourselves is the same. Fewer interventions. More light. A gentle turn now and then so we don't grow lopsided. And the patience to let change happen at the speed of a tree."),
    ],
  },
  {
    id: "demo-carnival",
    slug: "the-night-carnival",
    pick: true,
    title: "The Night Carnival",
    dek: "It arrives only after midnight, and only for people who are still awake for no particular reason.",
    topic: topic("short-stories"),
    author: AUTHORS.elena,
    publishedAt: "2026-09-20T08:00:00+05:30",
    cover: cover("carnival", "The carnival, drawn in gold on night-blue paper.", "From the Night journals · the STOEN mind"),
    body: [
      p("The carnival does not advertise. There are no posters, no music drifting over the hill in the afternoon. It simply appears, a little after midnight, in the field behind the last house in the village - and only for people who happen to be awake for no particular reason."),
      p("Mira found it on a night when she couldn't sleep and didn't know why. She saw the Ferris wheel first, turning slowly against the stars, drawn in fine gold lines as if someone had sketched it on the dark."),
      p("Inside, the stalls sold things you couldn't buy anywhere else. A jar of the last warm hour of summer. A ticket for a conversation you'd been meaning to have. A small, folded worry, exchanged for a shooting star."),
      pull("A small, folded worry, exchanged for a shooting star."),
      p("Mira traded her worry - it had been about nothing, really, which is the hardest kind to put down - and watched the star go streaking off over the tents. Then she rode the wheel once, all the way to the top, where you could see the whole sleeping valley at once."),
      p("When she woke the next morning, the field was just a field. But there was gold dust on her shoes, and she slept very well for a long time afterwards."),
    ],
  },
  {
    id: "demo-telephone",
    slug: "the-call-you-never-made",
    pick: true,
    title: "The Call You Never Made",
    dek: "Some conversations live their whole lives in our heads. A gentle look at the words we rehearse and never say.",
    topic: topic("the-quiet-mind"),
    author: AUTHORS.clara,
    publishedAt: "2026-09-15T08:00:00+05:30",
    cover: cover("telephone", "The old telephone from the Contact page."),
    body: [
      p("Most of us have one. A phone call we've rehearsed so many times we know both sides of it by heart. The apology, the thank-you, the *I've been thinking about you*. We have it in the shower, on the bus, at three in the morning. We just never dial."),
      p("I don't think that makes us cowards. I think it makes us careful. The words matter, so we keep polishing them, and the more we polish, the more impossible it feels to say them out loud in their rough, real form."),
      h2("Letting the words be unfinished"),
      p("What helped me, in the end, was writing the call down - not to send, just to see it. Seeing it on paper made it smaller and more human. It wasn't a speech. It was three sentences, and one of them was just someone's name."),
      prompt("If you're carrying a call", "Write down the first sentence you'd say. Only the first. You don't have to say it - just let it exist outside your head for a moment."),
    ],
  },
  {
    id: "demo-range",
    slug: "where-the-mountains-go-quiet",
    pick: true,
    title: "Where the Mountains Go Quiet",
    dek: "Above a certain height, the noise thins out. A short walk into the mist, and what it leaves behind.",
    topic: topic("wanderings"),
    author: AUTHORS.julian,
    publishedAt: "2026-09-10T08:00:00+05:30",
    cover: cover("range", "The ridges at the foot of every page."),
    body: [
      p("There's a point on most mountain walks where the sound changes. The road falls away behind you. The birds thin out. The wind becomes the only voice, and then even the wind seems to hush, as if the mountain has asked everyone to lower their voices."),
      p("I go walking to get to that point. Not the summit - I'm rarely fussed about the summit - but the quiet, which tends to arrive somewhere around the second hour, usually in the mist."),
      pull("Not the summit. The quiet, which tends to arrive somewhere around the second hour."),
      p("In the mist the ridges become layers, each one paler than the last, until the furthest is barely a suggestion. It's the most calming thing I know how to paint, and I've painted it, in one form or another, along the bottom of every page of this site."),
    ],
  },
  {
    id: "demo-diary-surprise",
    slug: "why-every-diary-hides-one-small-story",
    pick: true,
    title: "Why Every Diary Hides One Small Story",
    dek: "Mostly blank pages - and one small surprise. On the character waiting quietly inside each of our diaries.",
    topic: topic("from-the-studio"),
    author: AUTHORS.studio,
    publishedAt: "2026-09-05T08:00:00+05:30",
    cover: cover("openBook", "Short stories - from the Features medallions."),
    body: [
      p("A blank diary is a wonderful thing, and a slightly daunting one. All those pages, all that possibility, and nothing to tell you where to begin."),
      p("So we tucked a story inside each of ours. Just one, near the front: a goose at a fence, a horse at a chateau, two aviators beneath a strange cloud. A small character with a small tale to tell, who then politely steps aside and leaves the rest of the book to you."),
      figure(art("stage"), "Every diary is a little stage. The character opens the show; the rest is yours."),
      p("We like to think of them as the friend who walks you to the door of a party and then says, *go on, you'll be fine*. Some readers write back to the characters. Some carry on their stories. Most simply start writing their own - which was always the point."),
    ],
  },
  {
    id: "demo-universe",
    slug: "letters-to-the-universe",
    pick: true,
    title: "Letters to the Universe: A Prompt for Night Owls",
    dek: "For the hours after midnight, when the house is quiet and the questions are large. Write a letter, and address it to the sky.",
    topic: topic("prompts"),
    author: AUTHORS.elena,
    publishedAt: "2026-08-30T08:00:00+05:30",
    cover: cover("universe", "Letters From the Universe - a Night journal.", "From the Night journals · the STOEN mind"),
    body: [
      p("Some questions are too big for daylight. They wait until the house is quiet and the lights are off, and then they sit on the end of the bed and look at you."),
      p("Our Night journal, *Letters From the Universe*, began with a simple idea: what if, instead of lying awake with those questions, you wrote them down - and addressed them to the sky?"),
      prompt("Tonight's letter", "Dear Universe, there is something I've been meaning to ask you…"),
      p("You don't have to finish it. You don't have to send it anywhere. But you may find, as many night owls have, that the asking is half of the answer - and that the sky, for all its size, is a surprisingly good listener."),
    ],
  },
];

export const demoPosts = smarten(posts);
