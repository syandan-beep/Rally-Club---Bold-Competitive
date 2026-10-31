/* RALLY HOUSE: all editable content lives here.
   Image names map to assets/img/<name>-sm.webp and <name>-lg.webp. */
window.RH = {
  contact: {
    city: 'Bengaluru, India',
    hours: 'Open daily, 6:00 AM to 10:00 PM'
  },

  courts: [
    { id: 'signature', no: '01', name: 'Signature Court', img: 'court-signature', rate: 2400,
      alt: 'Panoramic padel court beneath a steel canopy',
      desc: 'Professional-grade courts built for players who love every second of the rally.',
      details: ['Panoramic glass enclosure.', 'Premium playing surface.', 'Professional lighting.'] },
    { id: 'outdoor', no: '02', name: 'Outdoor Court', img: 'court-garden', rate: 1800,
      alt: 'Two players on an open-air padel court with pine trees and open sky behind',
      desc: 'Take your game outside. Fresh air, open skies and uninterrupted play.',
      details: ['Open-air environment.', 'Landscaped surroundings.', 'Day and evening sessions.'] },
    { id: 'competition', no: '03', name: 'Competition Court', img: 'court-private', rate: 3200,
      alt: 'Indoor padel courts side by side, separated by glass walls',
      desc: 'Built for the big points, intense rallies and your next personal best.',
      details: ['Tournament-ready setup.', 'Professional lighting.', 'Competition-friendly environment.'] }
  ],

  experience: [
    { no: '01', name: 'The Clubhouse', img: 'exp-lounge', alt: 'Clubhouse lounge with armchairs, pendant lights and plants',
      desc: 'A social space to meet players, catch your breath and keep the conversations going.',
      more: 'Open before and after play for members and their guests. Replay the third set as many times as you like.' },
    { no: '02', name: 'The Café', img: 'exp-cafe', alt: 'Bright café with a long counter and timber floors',
      desc: 'Good coffee, refreshing drinks and post-match favourites.',
      more: 'Strong coffee before the first game, cold drinks after the last one and food worth sharing with your crew.' },
    { no: '03', name: 'The Social Zone', img: 'exp-social', alt: 'Two friends laughing together over coffee',
      desc: 'A place for community gatherings, watch parties and spontaneous meetups.',
      more: 'Where results get argued over, big matches go on the screen and next week’s doubles gets arranged.' },
    { no: '04', name: 'The Pro Shop', img: 'exp-shop', alt: 'Padel rackets resting against the net',
      desc: 'Gear up with curated padel equipment, apparel and accessories.',
      more: 'Rackets, balls, shoes and apparel, with straight advice from people who play.' }
  ],

  /* Edit price, per and benefits here. */
  plans: [
    { id: 'Social Member', no: '01', name: 'Social Member', price: '₹1,499', per: '/ month',
      desc: 'For people who love the energy of the club as much as the game.',
      benefits: ['Access to social events.', 'Member community.', 'Clubhouse access.', 'Priority access to selected events.'],
      cta: 'Join as Social Member' },
    { id: 'Club Member', no: '02', name: 'Club Member', price: '₹2,999', per: '/ month', featured: true,
      desc: 'For regular players who want more time on the court.',
      benefits: ['All Social Member benefits.', 'Priority court booking.', 'Member playing rates.', 'Complimentary guest passes.', 'Tournament access.'],
      cta: 'Join the Club' },
    { id: 'Founding Member', no: '03', name: 'Founding Member', price: '₹4,999', per: '/ month',
      desc: 'For players who want to be part of the RALLY HOUSE inner circle.',
      benefits: ['All Club Member benefits.', 'Exclusive member events.', 'Extended booking privileges.', 'Premium guest access.', 'Club merchandise.'],
      cta: 'Become a Founding Member' }
  ],

  /* weekday: 0 Sunday to 6 Saturday. monthly: true means first such weekday of each month.
     status: Registration Open, Upcoming or Full. tone: orange for competition, lime otherwise. */
  events: [
    { id: 'open', no: '01', name: 'Rally Open', type: 'Tournament', tone: 'orange', status: 'Registration Open', img: 'event-open', alt: 'Two players competing at the net on an indoor court',
      desc: 'Our monthly club tournament. Bring your best game and compete for the top spot.',
      details: 'Monthly · All skill levels', weekday: 6, monthly: true, time: 'All skill levels',
      more: 'Groups are balanced by level so every match is a real contest. Everyone stays for the final.' },
    { id: 'league', no: '02', name: 'Friday Night League', type: 'League', tone: 'orange', status: 'Upcoming', img: 'event-mixer', alt: 'Two players tapping rackets over the net',
      desc: 'Fast-paced evening matches, new opponents and a leaderboard worth climbing.',
      details: 'Every Friday · 6:00 PM', weekday: 5, time: '6:00 PM',
      more: 'Every result counts towards the season table. Arrive with a partner or get paired on the night.' },
    { id: 'doubles', no: '03', name: 'Social Doubles', type: 'Community', tone: 'lime', status: 'Full', img: 'event-sunday', alt: 'Friends sharing coffee around a table',
      desc: 'Meet new players, find your playing partner and enjoy an evening of friendly competition.',
      details: 'Every Sunday · 9:00 AM', weekday: 0, time: '9:00 AM',
      more: 'Partners rotate every twenty minutes, so you never need to bring a team. Rackets are available to borrow.' }
  ],

  /* Standings. played = matches, pts = league points. */
  leaderboard: {
    'Friday League': [['Mehra / Iyer', 14, 38], ['Shah / D’Souza', 14, 35], ['Rao / Fernandes', 13, 31], ['Kapoor / Nair', 14, 28], ['Bose / Menon', 12, 24]],
    'Rally Open': [['Menon / Kulkarni', 6, 18], ['Mehra / Iyer', 6, 15], ['Thomas / Reddy', 6, 13], ['Bose / Menon', 6, 10], ['Das / Pillai', 6, 9]],
    'Most Improved': [['Ananya R.', 22, 41], ['Kabir S.', 19, 36], ['Meera T.', 24, 33], ['Rohan V.', 17, 27], ['Tara J.', 15, 22]]
  },

  coaching: [
    { id: 'First Serve', no: '01', name: 'First Serve', img: 'coach-first', alt: 'Player holding a padel racket on an indoor court',
      desc: 'Learn the basics, understand the game and get comfortable on the court.',
      more: 'No experience or equipment needed. You’ll play real points by the end of your first session.' },
    { id: 'Private Training', no: '02', name: 'Private Training', img: 'coach-private', alt: 'Player holding racket and ball, ready to serve',
      desc: 'One-to-one sessions focused on your technique, positioning and personal goals.',
      more: 'Work on the wall game, the bandeja or your match temperament, at a pace set around you.' },
    { id: 'Group Training', no: '03', name: 'Group Training', img: 'coach-group', alt: 'Player laughing during a group session at the net',
      desc: 'Train with others, improve together and take your game to the next level.',
      more: 'Small groups matched by level. It’s often where you find your next doubles partner.' }
  ],

  stats: [
    { value: 6, pad: 2, label: 'Premium Padel Courts' },
    { value: 800, suffix: '+', label: 'Community Members' },
    { value: 25, suffix: '+', label: 'Monthly Events' },
    { value: 16, label: 'Hours Open Every Day' }
  ],

  gallery: [
    { img: 'final', area: 'a', alt: 'Two players walking off an outdoor court', cap: 'Walk-off. Outdoor court.' },
    { img: 'g-player', area: 'b', alt: 'Player ready at the baseline on a padel court', cap: 'Ready position' },
    { img: 'g-handover', area: 'c', alt: 'Close-up of two players passing a racket over the net', cap: 'Your serve' },
    { img: 'g-coach', area: 'd', alt: 'Player practising with a racket on an indoor court', cap: 'One more from the baseline' },
    { img: 'g-shadow', area: 'e', alt: 'Shadow of a player and racket falling across the court', cap: 'Late light on court three' },
    { img: 'g-team', area: 'f', alt: 'Two friends talking over coffee in a bright café', cap: 'Between games' },
    { img: 'g-kit', area: 'g', alt: 'Padel racket, ball and shoes laid out on the court', cap: 'Everything you need' },
    { img: 'g-bar', area: 'h', alt: 'Tiled bar with arched, softly lit shelves', cap: 'After hours at the bar' },
    { img: 'g-cafe', area: 'i', alt: 'Bright café interior with bar stools and a long counter', cap: 'First coffee of the day' },
    { img: 'g-lounge', area: 'j', alt: 'Lounge corner with a sofa and a large plant', cap: 'The clubhouse, quiet for once' }
  ],

  booking: {
    slots: ['07:00 AM', '08:30 AM', '10:00 AM', '12:00 PM', '04:00 PM', '05:30 PM', '07:00 PM', '08:30 PM'],
    players: [2, 3, 4],
    session: '90-minute session'
  },

  faqs: [
    ['Do I need to be a member to play?', 'No. Guests are welcome to book courts, and members get priority and member playing rates.'],
    ['I’ve never played padel. Where do I start?', 'First Serve is designed for complete beginners, and Social Doubles is an easy way to meet people.'],
    ['Can I borrow equipment?', 'Yes. Rackets are available to borrow and balls are available at the Pro Shop.'],
    ['How many people play on a court?', 'Padel is played as doubles, so four is ideal, though two or three players can book a court too.']
  ]
};
