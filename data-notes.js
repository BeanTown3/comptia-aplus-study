/* Study notes, condensed from the Notion pages:
   Section 4: Chapter 3 (CPUs), lessons 12-18
   Section 5: Chapter 4 (RAM), lessons 19-23
   Markup: **bold**. Block types: {h, p:[bullets]}, {h, table:{head,rows}}, {note, kind}. */
window.TOPICS = [
  { id: 'cpu-basics',  sec: 4, lesson: 12, name: 'CPU basics & pipeline' },
  { id: 'isa',         sec: 4, lesson: 13, name: 'ISA: x86, x64, ARM' },
  { id: 'cores',       sec: 4, lesson: 13, name: 'Cores & clock speed' },
  { id: 'bits',        sec: 4, lesson: 14, name: '32-bit vs 64-bit' },
  { id: 'choose',      sec: 4, lesson: 15, name: 'Choosing a CPU' },
  { id: 'names',       sec: 4, lesson: 16, name: 'CPU names & suffixes' },
  { id: 'cooling',     sec: 4, lesson: 17, name: 'CPU cooling' },
  { id: 'cpu-install', sec: 4, lesson: 18, name: 'CPU install & troubleshooting' },
  { id: 'ram-tech',    sec: 5, lesson: 19, name: 'RAM technology & ratings' },
  { id: 'ram-cap',     sec: 5, lesson: 20, name: 'RAM capacity & channels' },
  { id: 'ram-feat',    sec: 5, lesson: 21, name: 'ECC, SODIMM & SPD' },
  { id: 'vmem',        sec: 5, lesson: 22, name: 'Virtual memory' },
  { id: 'ram-install', sec: 5, lesson: 23, name: 'RAM install & troubleshooting' }
];

window.SECTIONS = [
  { n: 4, title: 'Central Processing Units', chapter: 'Chapter 3', blurb: 'Lessons 12 to 18. How a CPU works, x86 vs x64, cores, names, cooling, install.' },
  { n: 5, title: 'Random Access Memory', chapter: 'Chapter 4', blurb: 'Lessons 19 to 23. DDR generations, channels, ECC, SODIMM, virtual memory, install.' }
];

window.EXAM_FIVE = {
  4: [
    'CPU = a very powerful **calculator** (the instructor dislikes the word "brain").',
    '**x86** = 32-bit, about 4 GB of RAM. **x64** = 64-bit, runs 32-bit and 64-bit software.',
    '**Cores** and **clock speed** are the two main CPU measurements.',
    '**Intel = LGA** (contacts on the socket). **AMD = PGA** (pins on the CPU), though AMD has started using LGA too.',
    'Always use **ESD protection** and **never touch pins or contacts**.'
  ],
  5: [
    '**DDR rating x 8 = PC rating.** The instructor said this is on the exam.',
    'Each DDR generation has its own **pin count and notch position**. They cannot be mixed in a slot.',
    'Memory is sold in **pairs** because motherboards use **channels**. Match size and ideally speed.',
    '**ECC** memory has an extra **ninth chip** and only works on boards designed for it (mostly servers).',
    '**Virtual memory is a stopgap.** Slowdown plus a busy drive light means add more RAM.'
  ]
};

window.LESSONS = [
/* ============================ SECTION 4 ============================ */
{ id: 12, sec: 4, topic: 'cpu-basics', title: 'What Is a CPU?', mins: 15, blocks: [
  { h: 'How does the CPU know what a pattern of 1s and 0s means?', p: [
    'Instructions arrive as **patterns of 1s and 0s** on the **external data bus**.',
    'Every CPU has a **code book built in**. The instructor calls it the **machine language** of the CPU.',
    'A **programmer** writes these patterns to make the CPU do work.',
    'The instructor\'s code book is not real. It is loosely based on the **Intel 8088**, used in the first PCs.'
  ]},
  { h: 'The "man in a box" analogy', table: {
    head: ['Analogy piece', 'What it represents'],
    rows: [
      ['The box', 'The CPU'],
      ['The man inside', 'A calculator that adds, subtracts, multiplies and divides'],
      ['Light bulbs and switches', 'The **external data bus**'],
      ['On / off', '**1 / 0** (binary)'],
      ['One light', 'A **bit**'],
      ['Eight lights across', 'A **byte** (8 bits = 1 byte)'],
      ['Code book', '**Machine language**, built into every CPU'],
      ['Racks of 16 bulbs', '**Registers** (storage for math)'],
      ['Doorbell', 'The **clock**']
    ]}},
  { h: 'Adding 2 + 3 (the instructor\'s example)', p: [
    'Send the pattern for "put the next number in the AX register."',
    'Ring the clock until the lights zero out (the CPU is ready for the next command).',
    'Send the number **2** in binary. Send the pattern for "put the next number in the second register," then send **3**.',
    'Send the pattern for "add the two registers, put the result in AX."',
    'Send the pattern for "put AX on the external data bus." The bus shows binary **5**.'
  ]},
  { h: 'Key teaching points', p: [
    '**Registers** are storage areas the CPU uses for adding, subtracting, multiplying and dividing.',
    '**General purpose registers** can be used for anything.',
    'The example had 4 registers of 16 bits. Modern CPUs can have about **100 registers**, up to **128 bits** wide.',
    '**One clock ring does not equal one finished command.** Complex modern commands can take about 100 to 200 clock ticks.',
    'A CPU has many **logic units**. Some are good at integer math, some at moving data.'
  ]},
  { h: 'Pipeline (laundry analogy)', p: [
    'You do not finish all washing, then all drying. You overlap loads. A CPU **overlaps commands** the same way. That is a **pipeline**.',
    'Simple example = **4 steps** (prefetch, integer, long integer, cache). Modern CPUs = **16**, even up to **30** steps.',
    'A **faster clock = faster CPU**, but only up to a point.'
  ]},
  { note: 'Verification note: the instructor says a pipeline is "also known as a core." That is not how the terms are normally used. A core is a full processing unit; a pipeline is the step-by-step flow inside it. Keep "pipeline = overlapping steps."', kind: 'warn' }
]},

{ id: 13, sec: 4, topic: 'isa', title: 'Modern CPUs', mins: 10, blocks: [
  { h: 'Instruction Set Architecture (ISA)', p: [
    'An **ISA** defines how the CPU interprets low-level machine code instructions.',
    '**CISC** (Complex Instruction Set Computer) = large, complex built-in instruction set. Several instructions take multiple cycles.',
    '**RISC** (Reduced Instruction Set Computing) = smaller, simpler instruction set. Focus on **efficiency and speed**.',
    'x64 has two modes: **64-bit mode** and **compatibility mode** (supports 16-bit and 32-bit software).'
  ]},
  { h: 'x86 vs x64 vs ARM', table: {
    head: ['', 'x86', 'x64 (x86-64, AMD64)', 'ARM'],
    rows: [
      ['Developed by', 'Intel', 'AMD', 'Not stated'],
      ['Style', 'CISC', 'Extension of x86', 'RISC'],
      ['Bit width', '16-bit, later 32-bit', '64-bit', 'n/a'],
      ['RAM limit', '4 GB', '16 exabytes (see conflict)', 'n/a'],
      ['Software', '32-bit only', '32-bit **and** 64-bit', 'n/a'],
      ['Key clue', 'Since 1978 (8086, 8088)', 'Released 2000, based on x86', 'Efficiency, low power'],
      ['Common uses', 'Portable computers, IoT', 'Supercomputers, high-end systems', 'Smartphones, IoT, now desktops and servers']
    ]}},
  { note: 'Course source conflict: earlier the transcript says x64 addresses 16 exabytes of RAM; the summary says 16 petabytes. Lesson 14 also says 16 exabytes. Use exabytes unless your quiz says otherwise. Also, ARM = RISC and x86 = CISC is the course clue to hold onto.', kind: 'warn' },
  { h: 'Cores and clock speed', table: {
    head: ['Term', 'Plain meaning', 'Instructor analogy'],
    rows: [
      ['Single core', 'One processor on the chip', 'One street to the stadium (traffic backs up)'],
      ['Dual core', 'Two cores', 'Two lanes'],
      ['Quad core', 'Four cores', 'Four lanes'],
      ['Clock speed', 'Tasks done per second', 'One breath is about 1 second'],
      ['Clock cycle', 'Measure of CPU speed in cycles per second', ''],
      ['Hertz (Hz)', '1 cycle per second', ''],
      ['Gigahertz (GHz)', 'Billions of cycles per second', '']
    ]}},
  { p: [
    'Cores come from fitting **multiple processors on one chip**. Cores grow in powers of two: 1, 2, 4.',
    'Some instructions need **one** clock cycle. Others need more.',
    'In one breath a CPU can process **a billion or more tasks**.',
    'Cores and clock speed are **two separate measurements**. Cores add parallel lanes.'
  ]}
]},

{ id: 14, sec: 4, topic: 'bits', title: '32-Bit vs. 64-Bit Computing', mins: 4, blocks: [
  { table: {
    head: ['', '32-bit', '64-bit'],
    rows: [
      ['RAM addressing', '2^32, about **4 GB**', '2^64, about **16 exabytes**'],
      ['Bus size', '32-bit', '64-bit'],
      ['Software', '32-bit only', '64-bit **and** most 32-bit legacy software'],
      ['Availability', 'Hard to find new', 'Nearly all computers sold in the last ~5 years'],
      ['Benefits', 'n/a', 'Better **security** and **graphics** performance']
    ]}},
  { h: 'How it works', p: [
    'The main difference is **how much data can be addressed in RAM**. Each address points to **one byte**.',
    'Formula: **2 to the power of the number of bits**.',
    'The bit number sets two values: the **address bus** width (requests data from RAM) and the **data bus** width (moves data to and from RAM).',
    'Doubling the data bus from 32 to 64 bits doubles the data moved at once.'
  ]},
  { h: 'Operating system notes', p: [
    'Most **Linux distros** still have 32-bit versions.',
    '**macOS 10.14 Mojave** was the last 32-bit Apple OS.',
    '**Windows 10** was available as 32-bit.',
    'Microsoft, Apple and many Linux makers are moving to **64-bit only**.'
  ]},
  { h: 'How to check 32-bit vs 64-bit', table: {
    head: ['OS', 'Method'],
    rows: [
      ['Windows', 'Settings > System > **About** (look at "System type")'],
      ['macOS', 'A **Terminal** command. In the earlier notes: `sysctl -n machdep.cpu.brand_string`'],
      ['Linux', '`lscpu` (check Architecture and CPU op-mode lines)']
    ]}}
]},

{ id: 15, sec: 4, topic: 'choose', title: 'Choosing the Right CPU', mins: 5, blocks: [
  { h: 'Ask first', p: [
    'What is the **primary purpose** of the PC?',
    'Which **platform**: desktop, laptop or handheld?',
    'Heavy apps (high-end video editing, gaming) need a **more powerful CPU**.'
  ]},
  { table: {
    head: ['Platform', 'CPU tendency'],
    rows: [
      ['Desktop', 'More **power**'],
      ['Laptop', 'Better **energy efficiency**'],
      ['Handheld', 'Portable tasks, such as data collection on the go']
    ]}},
  { h: 'What shortens a PC\'s lifespan', p: [
    '**Heat** (and wear from moving parts like hard drives).',
    '**Accidents** (spills, drops; common on laptops and handhelds).',
    '**Obsolescence**.',
    '**Malware** vulnerability.'
  ]},
  { h: 'Budget examples (instructor\'s prices)', table: {
    head: ['CPU', 'Cores', 'Approx. price'],
    rows: [
      ['Intel Core i7', '20', '$400'],
      ['Intel Core i5', '10', '$210'],
      ['AMD Ryzen 5 5600', '6', '$230']
    ]}},
  { p: [
    'CPU prices run from about **$39 to just under $10,000**. Choose by **what you truly need**.',
    '**The motherboard socket must match the CPU.** Check this early.',
    'Intel boards usually use **LGA**. AMD boards generally used **PGA**.',
    'Other factors: **thermal design, power, cooling needs, form factor, case size**.',
    'Planning tools: PC Builder, PCPartPicker.com, Build My PC.'
  ]}
]},

{ id: 16, sec: 4, topic: 'names', title: 'CPU Generations and Architecture', mins: 5, blocks: [
  { h: 'Decoding a CPU name', table: {
    head: ['Part', 'Meaning', 'Example'],
    rows: [
      ['Brand', 'Intel or AMD', 'Intel, AMD'],
      ['Series', 'The processor line', 'Core, Ryzen'],
      ['Tier', 'Performance level (higher = more powerful)', 'i9, i7, i5 / Ryzen 9'],
      ['Generation + model', 'Generation shows age; model compares CPUs in the same generation', '12900K, 5900X'],
      ['Suffix', 'Special features', 'K, X, G']
    ]}},
  { h: 'Suffixes', table: {
    head: ['Suffix', 'Meaning'],
    rows: [
      ['**K**', '**Unlocked.** You can overclock it in the BIOS'],
      ['**X**', 'Higher clock speeds and power use. Essentially overclocked out of the box'],
      ['**G**', 'Includes **integrated graphics**']
    ]}},
  { h: 'Key points', p: [
    '**Newer generations** often have better **instructions per cycle** and efficiency, even at the same clock speed and core count.',
    'A higher tier number = more powerful.',
    '**TechPowerUp** lets you compare CPUs by maker, cores, mobile, generation, socket type and more.',
    'Across time, **generation** matters more than tier. Within one generation, **tier** matters more.'
  ]}
]},

{ id: 17, sec: 4, topic: 'cooling', title: 'CPU Cooling', mins: 6, blocks: [
  { h: 'Why cooling matters', p: [
    'The CPU makes **the most heat** in a computer.',
    'Too much heat causes **slowdowns, instability, crashes and intermittent shutdowns**.',
    'Built-in protection: if the CPU gets too hot it **slows down**.'
  ]},
  { h: 'Common causes of overheating', table: {
    head: ['Cause', 'Why'],
    rows: [
      ['Dust on fans and vents', 'Blocks airflow, traps heat'],
      ['Damaged or failing case fan', 'Restricted airflow'],
      ['CPU or GPU load', 'Biggest heat producers'],
      ['Too many processes or apps', 'CPU heats more than cooling can handle'],
      ['Many browser tabs, viruses, malware, frozen processes', 'Add CPU load']
    ]}},
  { note: 'Troubleshooting clue: if everything else looks normal but the system overheats, the CPU or GPU is likely the culprit.', kind: 'tip' },
  { h: 'Air cooling', table: {
    head: ['Part', 'Job / key fact'],
    rows: [
      ['Cooling fan', 'Moves warm air out, cool air in'],
      ['CFM (Cubic Feet per Minute)', 'Air a fan moves in 1 minute (**airflow, not heat**)'],
      ['Decibel (dB)', 'Noise. **Under 25 dB = relatively quiet.** Over 25 dB = louder'],
      ['Integrated heat spreader (IHS)', 'Metal plate on top of the CPU'],
      ['Heatsink', 'Absorbs heat through thermal paste. **Aluminum or copper**'],
      ['Heat pipes', 'In advanced heatsinks. Carry heat through tubes filled with liquid'],
      ['Thermal paste', 'Fills gaps between CPU and heatsink to improve heat transfer. Required']
    ]}},
  { p: ['Heat chain: **CPU die > IHS > thermal paste > heatsink > fan/airflow**.'] },
  { h: 'Liquid cooling', p: [
    'Cycle: coolant absorbs heat in the **water block** on the CPU, is pumped through tubes to a **radiator**, fans pull heat away, then coolant returns to the water block.',
    '**All-In-One (AIO)** = the most common liquid cooler.',
    '**Custom loop** = you pick each part (water block, radiators, tubes). Often has a reservoir.',
    '**Phase change** works like a modern refrigerator. A **chiller** works like an air conditioner.',
    '**Reservoirs** store extra coolant, ease filling and draining, and help remove air bubbles. Most systems do not need one.'
  ]}
]},

{ id: 18, sec: 4, topic: 'cpu-install', title: 'Installing and Troubleshooting a CPU', mins: 7, blocks: [
  { h: 'Safety first', p: [
    '**ESD protection:** an **anti-static mat** (ESD mat) or an **anti-static wrist strap**.',
    '**ESD gloves** add protection.',
    '**Do not touch** the mounting pins or contacts with bare hands. The CPU is extremely sensitive.'
  ]},
  { h: 'Socket types', table: {
    head: ['', 'LGA (Land Grid Array)', 'PGA (Pin Grid Array)'],
    rows: [
      ['Contacts', 'On the **motherboard socket**', '**Pins on the CPU**, holes in the socket'],
      ['Typical maker', 'Intel (AMD has begun using it)', 'AMD (historically)'],
      ['Bent pins damage', 'The **motherboard**', 'The **CPU**']
    ]}},
  { p: ['**ZIF** (Zero Insertion Force) exists on both. A locking arm seats the CPU without bending pins.'] },
  { h: 'Install steps', p: [
    'Stand on the **anti-static mat**.',
    'Open the packaging (it protects the contacts on the back of the CPU).',
    '**Open the ZIF** mechanism.',
    'Remove the **plastic protective cover**. Do not touch the socket pins.',
    '**Match the alignment mark** on the CPU to the socket.',
    'Set the CPU in gently.',
    '**Close and latch** the ZIF mechanism.'
  ]},
  { h: 'Troubleshooting: bent pins on an AMD CPU', table: {
    head: ['Symptom', 'Likely cause', 'What to check', 'Fix'],
    rows: [['CPU fits and the lever latches, but the system does not work', '**Bent pins** touching neighbors', 'Inspect the pins closely', 'Bend back carefully, or replace the CPU']]
  }},
  { h: 'CompTIA six steps applied', table: {
    head: ['Step', 'Instructor\'s application'],
    rows: [
      ['1. Identify the problem', 'Bent pins touching adjacent pins'],
      ['2. Establish a theory of probable cause', 'Do not jump to "motherboard incompatible." Inspection shows bent pins'],
      ['3. Test the theory', 'Bend pins back and reinstall. If that fails, make a **new theory**: try an undamaged CPU'],
      ['4. Establish a plan of action', 'If damage is permanent, **replace the CPU**. Check the manufacturer\'s documentation'],
      ['5. Verify full system functionality', 'Confirm it works. Add preventative measures (spare CPU, training)'],
      ['6. Document findings', 'Record the issue, actions and outcome']
    ]}},
  { note: 'Why this order matters: inspecting first stops the wrong "bad motherboard" guess. Testing with an undamaged CPU confirms the cause.', kind: 'tip' }
]},

/* ============================ SECTION 5 ============================ */
{ id: 19, sec: 5, topic: 'ram-tech', title: 'RAM Technology', mins: 10, blocks: [
  { h: 'Technology comparison', table: {
    head: ['Technology', 'Pins', 'Notches', 'Clue'],
    rows: [
      ['SDRAM', '168', 'Two (the only type with two)', 'Synchronized to the system crystal'],
      ['DDR SDRAM', '184', 'One', 'Two bits per clock click'],
      ['DDR2', '240', 'One, slightly offset', 'Prefetch doubles again'],
      ['DDR3', '240', 'One, clearly offset', 'Doubled again'],
      ['DDR4', '288', 'One, well offset', 'Rated in megatransfers per second']
    ]}},
  { h: 'Key points', p: [
    'Memory older than SDRAM is **not on the exam**.',
    '**Synchronous** means synchronized to the same system crystal that sets the CPU "metronome."',
    '**DDR** = two bits per clock click. A huge breakthrough.',
    '**DDR2** doubles a second time using a **prefetch**.',
    '**DDR3** doubled again, so actual I/O speed is four times the core speed.',
    'The **notch offset** keeps you from putting the wrong type into a motherboard.',
    'Metal covers are called **heat spreaders**.'
  ]},
  { h: 'Speed ratings', p: [
    'DDR rating: "DDR" a dash, then a number. It is the core (motherboard) speed doubled.',
    '**PC rating = DDR rating x 8.** Example: DDR-400 is PC-3200; DDR4-3200 is PC4-25600.',
    '**"PC-"** means DDR. **"PC2-"** means DDR2. **"PC3-"** means DDR3. **"PC4-"** means DDR4.',
    'Ratings are printed on the stick or the box. Makers use one or both. Do not count on both.',
    'DDR4 uses the term **bandwidth** in **megatransfers per second**.'
  ]},
  { note: 'Exam trap: if a stick does not say DDR or DDR2, read the PC rating. "PC-" is DDR and "PC2-" is DDR2.', kind: 'warn' }
]},

{ id: 20, sec: 5, topic: 'ram-cap', title: 'RAM Capacity', mins: 8, blocks: [
  { h: 'Capacity', p: [
    '**Technology generation has nothing to do with capacity.** DDR, DDR2, DDR3 only describe speed and type.',
    'Chip layout is a **square**. Doubling each side makes the chip **four times** bigger: 256 MB, then **1 GB**, then **4 GB**, then **16 GB**.',
    'In-between sizes (512 MB, 2 GB, 8 GB) come from **double-sided** memory.'
  ]},
  { table: {
    head: ['Type', 'Description', 'Caution'],
    rows: [
      ['Single-sided', 'Chips on one side only', 'None mentioned'],
      ['Double-sided', 'Chips on both sides; very common', 'A few boards have problems; check the motherboard book']
    ]}},
  { h: 'Slots and channels', p: [
    'Desktop boards commonly have **four slots**. Some have two. Big servers can have eight or sixteen.',
    'Total memory is the **sum of all sticks**.',
    'Memory is almost always sold in **pairs** because motherboards use **channels**.',
    '**Dual-channel** (very common) = two sticks of the same size, ideally the same speed, in **specific slots**.',
    '**Triple-channel** existed for a few years and needed three sticks.',
    'The **motherboard book** shows which slots are Channel A and Channel B.',
    'With channels the system talks to **both sticks at once**.'
  ]},
  { h: 'Channel rules', table: {
    head: ['Situation', 'Result'],
    rows: [
      ['One stick in a dual-channel board', 'Some boards **will not boot**. Others boot with a warning: **"running in single channel mode."**'],
      ['Two sticks', 'Use the **specific slots** from the motherboard book'],
      ['Four sticks', 'Fill all the slots'],
      ['Within one channel', '**Same speed and same capacity** required'],
      ['Across channels', 'Different sizes allowed. Different speeds possible but not advised']
    ]}},
  { h: 'Capacity math', table: {
    head: ['Setup', 'Total'],
    rows: [
      ['Channel A: two 8 GB. Channel B: two 4 GB.', '16 + 8 = **24 GB**'],
      ['Channel A: two 16 GB. Channel B: two 4 GB.', '32 + 8 = **40 GB**']
    ]}},
  { note: 'A two-slot board holding two 4 GB sticks has 8 GB. To add more you must take sticks out and replace them. You are out of slots.', kind: 'tip' }
]},

{ id: 21, sec: 5, topic: 'ram-feat', title: 'RAM Features', mins: 7, blocks: [
  { h: 'Parity vs. ECC', p: [
    'Memory is measured in **bytes**, with **eight bits per byte**.',
    'Each chip handles one bit, so most sticks have **eight chips**.',
    'Parity and ECC memory add a **ninth chip**.',
    'It is still ordinary DRAM and can be DDR2, DDR3 or DDR4.'
  ]},
  { table: {
    head: ['Feature', 'Parity', 'ECC (Error Correction Code)'],
    rows: [
      ['Age and use', 'Older, seen less', 'Today\'s term for the feature'],
      ['Instructor\'s difference', 'One chip out of eight can be bad', 'Two chips out of eight can be bad'],
      ['Notes', 'Rare', '**Expensive.** Board must be **designed for it.** Mostly **servers**']
    ]}},
  { note: 'Exam trap: you cannot upgrade a regular motherboard to use ECC memory. The board must be designed for it. (Outside note: general A+ material says ECC corrects single-bit errors and detects double-bit errors.)', kind: 'warn' },
  { h: 'SODIMM (Small Outline Dual Inline Memory Module)', table: {
    head: ['Technology', 'Pins'],
    rows: [['DDR4 SODIMM', '**260**'], ['DDR3 SODIMM', '**204**']]
  }},
  { p: [
    'Used where big sticks do not fit, such as **laptops**.',
    'Only DDR3 and DDR4 packages can be predicted by pin count.',
    'Everything else still applies: dual channel, identical types, pairs. They are just smaller.'
  ]},
  { h: 'SPD (Serial Presence Detect)', p: [
    'Every stick has a tiny **SPD chip**. It lets the system **query the stick**: capacity, speed, technology, manufacturer, model.',
    'You need a tool to read it. The instructor used **CPU-Z**.',
    'CPU-Z **SPD tab**: click through each slot. Shows type, size, maker, speed and the **week and year** made. An empty slot shows you can add more.',
    'CPU-Z **Memory tab**: quick overview (type, total size, channels, frequency).',
    'CPU-Z **timing tables**: stay away. Used by overclockers only.'
  ]}
]},

{ id: 22, sec: 5, topic: 'vmem', title: 'Virtual Memory', mins: 6, blocks: [
  { h: 'The beaker analogy', p: [
    'A **16 GB beaker** represents all the memory in the computer.',
    'Windows takes roughly **2 GB** at boot. Each program fills more of the beaker.',
    'When it is full you get an **"out of memory"** error.'
  ]},
  { h: 'Virtual memory', p: [
    'Makes a little of the **hard drive** "think it is memory" so the computer keeps running.',
    'Every operating system has it. It is **not something you want to use.** It is a stopgap until you add more RAM.',
    'It starts small and can grow up to the size set in settings.',
    '**Swap file** and **paging file** mean the same idea.'
  ]},
  { h: 'Windows settings', table: {
    head: ['Step', 'Detail'],
    rows: [
      ['Path', 'System properties > Advanced > Settings > Advanced > **Change**'],
      ['Setting to know', '**"Automatically manage paging file size for all drives."** The instructor said it appears on the exam'],
      ['Windows 10', 'Set it to **automatic.** Manual configuration is long over']
    ]}},
  { h: 'Symptoms and fix', table: {
    head: ['Symptom', 'Why', 'Fix'],
    rows: [
      ['Computer slows way down', 'CPU is writing to the hard drive instead of memory', '**Add more memory**'],
      ['Hard drive activity light goes crazy', 'The drive is busy with virtual memory', '**Add more memory**']
    ]}}
]},

{ id: 23, sec: 5, topic: 'ram-install', title: 'Installing and Troubleshooting RAM', mins: 11, blocks: [
  { h: 'Sizing guidance', p: [
    'A sluggish system, especially after an OS upgrade or new software, probably needs more memory.',
    '**8 GB** is the bare minimum for an OS and basic tasks.',
    'For gaming, graphics work or many programs at once: **at least 16 GB**.',
    'Upgrading a laptop can be more involved than a desktop.'
  ]},
  { h: 'Find compatible memory', p: [
    'Compatibility means **form, fit and function** (the **3Fs**).',
    'Manufacturers have lookup tools. Example: **Micron\'s Crucial** site.',
    'Example spec: two 16 GB DDR4 3200 MHz SODIMM modules, **CAS latency 22**, **260 pins**, **non-ECC**.'
  ]},
  { h: 'Installation steps', table: {
    head: ['Step', 'Action'],
    rows: [
      ['1. Gather tools', 'Memory in an **antistatic bag**; clean non-static surface; **ESD** wrist strap or mat; **non-magnetic screwdriver**; technical manual for laptops'],
      ['2. Power off, remove all power', 'Shut down, **unplug**, flip the **PSU** switch. Laptop: remove removable battery, then **hold power button ~30 seconds**. No strap? Touch **unpainted metal**'],
      ['3. Open the case', 'Desktop: remove side panel. Slots are the long slots next to the CPU socket. Laptop: bottom panel or under keyboard; **check the docs**'],
      ['4. Remove old memory', 'Desktop: push clips **outward**. Laptop SODIMM: push metal tabs apart and it springs up at an angle. Lift by the **edges**. **Never pry or force**'],
      ['5. Install new memory', 'Line up the **notch** with the slot ridge. Press **straight down** until the clips snap. Laptop: insert at about **45 degrees**, then press down until it clicks'],
      ['6. Test', 'Power on. Check the **boot screen**, or Windows **Settings > System > About**'],
      ['7. Close up', 'Replace the panel or keyboard']
    ]}},
  { p: [
    'Stay in one place while working. Walking builds static, so **ground yourself again** before returning.',
    'Do not touch the **metal contacts** on the memory.',
    'If there are multiple slots, start with the one labeled **slot 0**, or follow the motherboard manual.'
  ]},
  { h: 'Troubleshooting', table: {
    head: ['Symptom', 'Likely cause', 'Fix'],
    rows: [
      ['Will not power on at all', 'Power problem (cable, battery, PSU switch)', 'Restore power'],
      ['Power on, but nothing happens', 'Memory **not seated properly**', 'Shut down, reseat'],
      ['Same', 'Cable bumped loose while working', 'Reconnect cables'],
      ['Still failing', 'Module **defective** or damaged by static', 'Replace it']
    ]}},
  { note: 'Order the instructor gave: check power first, then seating, then cables inside the case, then a faulty module. A bad module is the last thing to suspect.', kind: 'tip' }
]}
];
