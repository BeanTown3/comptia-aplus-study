/* Flashcards for Section 4 (CPUs) and Section 5 (RAM).
   IDs are topic + position. Only ever append to a topic so saved progress stays attached. */
(function () {
  const cards = [];
  const counts = {};
  function C(topic, f, b) {
    counts[topic] = (counts[topic] || 0) + 1;
    cards.push({ id: topic + '-' + counts[topic], topic, f, b });
  }

  /* ---------- Lesson 12: CPU basics ---------- */
  C('cpu-basics', 'What is the CPU, in the instructor\'s words?', 'A very powerful **calculator**. He dislikes calling it a "brain."');
  C('cpu-basics', 'How does a CPU know what a pattern of 1s and 0s means?', 'It has a built-in **code book** called its **machine language**.');
  C('cpu-basics', 'In the "man in a box" analogy, what do the light bulbs and switches stand for?', 'The **external data bus**, which is how we talk to the CPU.');
  C('cpu-basics', 'How many bits are in a byte?', '**8 bits = 1 byte.**');
  C('cpu-basics', 'What is a register?', 'A **storage area inside the CPU** used for adding, subtracting, multiplying and dividing.');
  C('cpu-basics', 'What does the "doorbell" represent in the CPU analogy?', 'The **clock**.');
  C('cpu-basics', 'What is a pipeline (laundry analogy)?', 'The CPU **overlaps commands** in steps, like running a dryer load while the next load washes.');
  C('cpu-basics', 'Roughly how many registers and how wide can a modern CPU have?', 'About **100 registers**, up to **128 bits** wide.');
  C('cpu-basics', 'Does one clock ring equal one finished command?', '**No.** Complex modern commands can take about **100 to 200** clock ticks.');

  /* ---------- Lesson 13: ISA ---------- */
  C('isa', 'What does an Instruction Set Architecture (ISA) define?', 'How the CPU interprets **low-level machine code instructions**.');
  C('isa', 'CISC stands for what, and which architecture does the course tie to it?', '**Complex Instruction Set Computer.** Tied to **x86**.');
  C('isa', 'RISC stands for what, and which architecture does the course tie to it?', '**Reduced Instruction Set Computing.** Tied to **ARM**. Focus on efficiency and speed.');
  C('isa', 'Who developed x86? Who developed x64?', 'x86 = **Intel**. x64 = **AMD**.');
  C('isa', 'Exam clue: "supports both 32-bit and 64-bit software." Which ISA?', '**x64** (also x86-64 or AMD64).');
  C('isa', 'Which ISA is built for low power and found in phones and IoT devices?', '**ARM** (Advanced RISC Machine).');
  C('isa', 'What are the two modes of x64?', '**64-bit mode** and **compatibility mode** (runs 16-bit and 32-bit software).');
  C('isa', 'What RAM limit does x86 have?', 'About **4 GB**.');
  C('isa', 'What RAM limit does x64 have, per the course?', 'About **16 exabytes**. (One summary line said petabytes; use exabytes.)');
  C('cores', 'What is a core?', 'A **processing unit**. Several fit on one CPU chip.');
  C('cores', 'What does clock speed measure?', 'Cycles per second, in **hertz (Hz)**. Gigahertz (GHz) = billions of cycles per second.');
  C('cores', 'Cores vs clock speed: which is the "number of lanes"?', '**Cores** are the lanes. Clock speed is how fast each one runs. They are separate measurements.');
  C('cores', 'Do the cores double in what pattern?', 'Powers of two: **1, 2, 4** and so on.');

  /* ---------- Lesson 14: 32 vs 64 ---------- */
  C('bits', 'What formula gives how much RAM a bit-size can address?', '**2 to the power of the number of bits.** Each address points to one byte.');
  C('bits', '2^32 addresses is about how much RAM?', 'About **4 GB**.');
  C('bits', 'What two things does the bit number set?', 'The **address bus** width (requests data from RAM) and the **data bus** width (moves data to and from RAM).');
  C('bits', 'Address bus vs data bus?', 'Address bus **requests** data from RAM. Data bus **transfers** data to and from RAM.');
  C('bits', 'What two benefits does 64-bit give besides more RAM?', 'Better **security** and better **graphics** performance.');
  C('bits', 'Can a 64-bit OS run 32-bit software? Can a 32-bit OS run 64-bit software?', '64-bit runs most 32-bit software. 32-bit **cannot** run 64-bit software.');
  C('bits', 'How do you check 32-bit vs 64-bit on Windows?', '**Settings > System > About**, then read "System type."');
  C('bits', 'Which Linux command shows architecture and CPU op-modes?', '`lscpu`');
  C('bits', 'Which macOS version was the last 32-bit Apple OS?', '**macOS 10.14 Mojave.**');

  /* ---------- Lesson 15: Choosing ---------- */
  C('choose', 'Two questions to ask before choosing a CPU?', 'What is the **primary purpose** of the PC, and which **platform** (desktop, laptop, handheld)?');
  C('choose', 'Desktop vs laptop CPU tendency?', 'Desktop = more **power**. Laptop = better **energy efficiency**.');
  C('choose', 'Four things that shorten a PC\'s lifespan?', '**Heat, accidents, obsolescence, malware** vulnerability.');
  C('choose', 'What must match between CPU and motherboard?', 'The **socket**. Check it early.');
  C('choose', 'Other compatibility factors besides the socket?', 'Thermal design, power, cooling needs, **form factor**, case size.');
  C('choose', 'Name three PC-planning tools from the lesson.', '**PC Builder, PCPartPicker.com, Build My PC.**');
  C('choose', 'Price range of CPUs, per the instructor?', 'About **$39 to just under $10,000.**');

  /* ---------- Lesson 16: Names ---------- */
  C('names', 'Break down "Intel Core i9 12900K."', 'Brand **Intel**, series **Core**, tier **i9**, generation **12**, model **900**, suffix **K**.');
  C('names', 'What does the K suffix mean?', '**Unlocked.** You can overclock it in the BIOS.');
  C('names', 'What does the X suffix mean?', 'Higher clock speeds and power use. Essentially **overclocked out of the box**.');
  C('names', 'What does the G suffix mean?', 'Includes **integrated graphics**.');
  C('names', 'Generation vs tier: which matters more across time? Within a generation?', 'Across time = **generation**. Within one generation = **tier**.');
  C('names', 'Why are newer generations faster at the same clock and core count?', 'Better **instructions per cycle** and efficiency.');
  C('names', 'Which website did the instructor use to compare CPUs?', '**TechPowerUp.**');

  /* ---------- Lesson 17: Cooling ---------- */
  C('cooling', 'Which component produces the most heat in a computer?', 'The **CPU** (the GPU is also a major source).');
  C('cooling', 'What happens if the CPU gets too hot?', 'It **slows down** (built-in protection). Also crashes, instability and intermittent shutdowns.');
  C('cooling', 'What does CFM measure?', 'Fan **airflow**: cubic feet per minute. **Not heat.**');
  C('cooling', 'Fan noise: what dB threshold is "relatively quiet"?', '**Under 25 dB.** Over 25 dB is noticeably louder.');
  C('cooling', 'What does the heatsink do, and what is it made of?', 'Absorbs heat from the CPU through thermal paste. **Aluminum or copper.**');
  C('cooling', 'What does thermal paste do?', 'Fills microscopic gaps between CPU and heatsink to **improve heat transfer**. Required.');
  C('cooling', 'Put the heat chain in order.', 'CPU die > **IHS** > thermal paste > heatsink > fan/airflow.');
  C('cooling', 'What are heat pipes?', 'Tubes in advanced heatsinks filled with liquid that **carry heat** to a cooler end.');
  C('cooling', 'Liquid cooling cycle?', 'Water block on CPU absorbs heat > pump moves coolant through tubes to **radiator** > fans pull heat away > coolant returns.');
  C('cooling', 'Most common type of liquid cooler?', '**All-In-One (AIO).**');
  C('cooling', 'Custom loop vs AIO?', 'Custom loop = you choose each part (water block, radiators, tubes), often with a reservoir. AIO = packaged.');
  C('cooling', 'Phase change cooling works like what? A chiller?', 'Phase change = a **refrigerator**. Chiller = an **air conditioner** chilling the coolant.');
  C('cooling', 'What does a reservoir do?', 'Stores extra coolant, eases filling and draining, helps remove **air bubbles**. Most systems do not need one.');
  C('cooling', 'Name common causes of overheating.', 'Dust, failing fan, heavy CPU/GPU load, too many apps/tabs, malware, frozen processes.');

  /* ---------- Lesson 18: Install ---------- */
  C('cpu-install', 'ESD protection tools for a CPU install?', '**Anti-static mat** or **anti-static wrist strap**. ESD gloves add protection.');
  C('cpu-install', 'The one hands-off rule for every CPU install?', '**Never touch the pins or contacts.**');
  C('cpu-install', 'LGA: where are the pins/contacts?', 'On the **motherboard socket**. The CPU has flat pads. Typical of Intel.');
  C('cpu-install', 'PGA: where are the pins?', 'On the **CPU**. The socket has holes. Historically AMD.');
  C('cpu-install', 'Bent pins on an LGA board damage what? On a PGA CPU?', 'LGA = the **motherboard**. PGA = the **CPU**.');
  C('cpu-install', 'What does ZIF stand for and how does it work?', '**Zero Insertion Force.** The CPU drops in with no pressure and a lever locks it.');
  C('cpu-install', 'How do you orient a CPU in the socket?', 'Match the **alignment mark** (dot, triangle or arrow) on the CPU to the socket.');
  C('cpu-install', 'CPU fits and latches but the system will not work (AMD). First theory?', '**Bent pins** touching neighbors. Inspect before blaming the motherboard.');
  C('cpu-install', 'CompTIA troubleshooting steps, in order?', '1 Identify. 2 Theory of probable cause. 3 Test. 4 Plan of action. 5 Verify full functionality. 6 Document.');
  C('cpu-install', 'System powers on then shuts off. Likely causes?', 'Missing or dried **thermal paste**, fan not on **CPU_FAN** header, heatsink not seated.');

  /* ---------- Lesson 19: RAM tech ---------- */
  C('ram-tech', 'Which RAM type has two notches, and how many pins?', '**SDRAM**, **168** pins.');
  C('ram-tech', 'DDR SDRAM pin count?', '**184** pins, one notch.');
  C('ram-tech', 'DDR2 pin count? DDR3?', 'Both **240** pins. The notch is in a different position for each.');
  C('ram-tech', 'DDR4 pin count?', '**288** pins.');
  C('ram-tech', 'What does Double Data Rate mean?', '**Two bits per clock click.**');
  C('ram-tech', 'What does "synchronous" mean for SDRAM?', 'Synchronized to the same **system crystal** that sets the CPU "metronome."');
  C('ram-tech', 'What makes DDR2 faster than DDR?', 'A **prefetch** that doubles the rate again.');
  C('ram-tech', 'How do you convert a DDR rating to a PC rating?', 'Multiply by **8.** Example: DDR-400 = PC-3200.');
  C('ram-tech', 'A stick says "PC3-12800." Which generation, and what is the DDR rating?', '**DDR3**, DDR3-**1600** (12800 / 8).');
  C('ram-tech', 'PC, PC2, PC3, PC4 prefixes map to what?', 'DDR, DDR2, DDR3, DDR4.');
  C('ram-tech', 'What is the purpose of the notch offset?', 'Keeps you from installing the **wrong memory type** in a slot.');
  C('ram-tech', 'What unit does DDR4 use for bandwidth?', '**Megatransfers per second.**');
  C('ram-tech', 'Metal covers on memory are called what?', '**Heat spreaders.**');

  /* ---------- Lesson 20: Capacity ---------- */
  C('ram-cap', 'Does DDR generation affect capacity?', '**No.** It describes speed and type only.');
  C('ram-cap', 'Why do chip sizes jump 256 MB > 1 GB > 4 GB > 16 GB?', 'The layout is a square. Doubling each side makes the chip **4x** bigger.');
  C('ram-cap', 'Where do 512 MB, 2 GB, 8 GB come from?', '**Double-sided** memory.');
  C('ram-cap', 'Why is memory sold in pairs?', 'Motherboards use **channels** (usually dual-channel).');
  C('ram-cap', 'What is dual-channel?', 'Two matching sticks in **specific slots** so the system can talk to both at once.');
  C('ram-cap', 'Where do you find which slots are Channel A and B?', 'The **motherboard book**.');
  C('ram-cap', 'One stick in a dual-channel board: what happens?', 'Some boards **will not boot**. Others boot with "running in single channel mode."');
  C('ram-cap', 'Within one channel, what must match?', 'Same **speed** and same **capacity**.');
  C('ram-cap', 'Channel A has two 8 GB. Channel B has two 4 GB. Total?', '**24 GB** (16 + 8).');
  C('ram-cap', 'Two-slot board, both full with 4 GB sticks, customer wants more. What now?', 'Remove sticks and **replace them** with larger ones. No slots are free.');

  /* ---------- Lesson 21: Features ---------- */
  C('ram-feat', 'How many chips does a normal stick have, and why?', '**Eight**, because each chip handles one bit of a byte.');
  C('ram-feat', 'How do you spot ECC or parity memory by chip count?', 'An extra **ninth chip.**');
  C('ram-feat', 'Where is ECC mostly used? Can you add it to any board?', '**Servers.** No, the board must be **designed for it.**');
  C('ram-feat', 'Parity vs ECC (per the instructor)?', 'Parity is older and less seen. ECC is the current term; more capable.');
  C('ram-feat', 'What does SODIMM stand for and where is it used?', '**Small Outline Dual Inline Memory Module.** Laptops and other tight spaces.');
  C('ram-feat', 'DDR4 SODIMM pin count? DDR3 SODIMM?', 'DDR4 = **260.** DDR3 = **204.**');
  C('ram-feat', 'What does SPD stand for and what does it do?', '**Serial Presence Detect.** A tiny chip that reports capacity, speed, type, maker and model.');
  C('ram-feat', 'Which tool did the instructor use to read SPD?', '**CPU-Z** from CPUID.');
  C('ram-feat', 'Which CPU-Z tab should you avoid?', 'The **timing tables**, used only by overclockers.');
  C('ram-feat', 'What is the SPD tab handy for with an empty slot?', 'Showing whether you can **add more memory** without opening the case.');

  /* ---------- Lesson 22: Virtual memory ---------- */
  C('vmem', 'What is virtual memory?', 'A piece of the **hard drive** used as if it were memory when RAM is full.');
  C('vmem', 'Another name for the file Windows uses for virtual memory?', 'The **paging file** or **swap file.**');
  C('vmem', 'Is virtual memory something you want to rely on?', '**No.** It is a stopgap until you add more RAM.');
  C('vmem', 'The Windows setting the instructor said is on the exam?', '**"Automatically manage paging file size for all drives."**');
  C('vmem', 'Computer slows way down and the drive light is constant. Cause and fix?', 'Heavy **virtual memory** use. **Add more RAM.**');
  C('vmem', 'Why is virtual memory so slow?', 'The CPU is writing to the **hard drive** instead of memory.');
  C('vmem', 'Windows 10 paging file setting?', 'Set it to **automatic**.');

  /* ---------- Lesson 23: Install ---------- */
  C('ram-install', 'What are the 3Fs of compatible memory?', '**Form, fit and function.**');
  C('ram-install', 'Bare minimum RAM for an OS and basic tasks?', '**8 GB.**');
  C('ram-install', 'RAM for gaming or graphics work?', 'At least **16 GB.**');
  C('ram-install', 'Before opening a PC to install RAM, what power steps?', 'Shut down, **unplug**, flip the **PSU** switch. Laptop: remove removable battery and hold power ~30 s.');
  C('ram-install', 'No ESD strap. What can you do?', 'Touch **unpainted metal** on the case.');
  C('ram-install', 'How do you remove desktop RAM?', 'Push the clips **outward**. The module pops up. Lift by the edges. Never pry.');
  C('ram-install', 'How do you install a laptop SODIMM?', 'Insert at about **45 degrees**, then press down until it clicks.');
  C('ram-install', 'How do you align a stick with a slot?', 'Line the **notch** up with the ridge in the slot. If it will not fit, flip it.');
  C('ram-install', 'Which slot do you start with when there are several?', 'The one labeled **slot 0**, or as the motherboard manual says.');
  C('ram-install', 'How do you verify new RAM?', 'Boot screen total, or Windows **Settings > System > About**.');
  C('ram-install', 'New RAM installed; powers on but nothing happens. Check first?', 'That the module is **seated properly** and locked. Then cables inside the case, then a faulty module.');
  C('ram-install', 'Why re-ground yourself after walking away mid-install?', 'Walking builds **static**, which can destroy memory.');

  window.CARDS = cards;
})();
