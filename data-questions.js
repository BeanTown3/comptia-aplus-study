/* Original practice questions. Written for this app, not copied from the notes' review lists.
   Kinds: recall, compare, scenario, pbq.
   MC: first option listed is the correct one; the app shuffles at runtime.
   IDs are topic + position: only append so saved results stay attached. */
(function () {
  const qs = [];
  const counts = {};
  function id(topic) { counts[topic] = (counts[topic] || 0) + 1; return topic + '-q' + counts[topic]; }
  function MC(kind, topic, q, correct, wrongs, why) {
    qs.push({ id: id(topic), type: 'mc', kind, topic, q, opts: [correct].concat(wrongs), why });
  }
  function MULTI(topic, q, good, bad, why) {
    qs.push({ id: id(topic), type: 'multi', kind: 'pbq', topic, q, good, bad, why });
  }
  function ORDER(topic, q, items, why) {
    qs.push({ id: id(topic), type: 'order', kind: 'pbq', topic, q, items, why });
  }
  function MATCH(topic, q, pairs, why) {
    qs.push({ id: id(topic), type: 'match', kind: 'pbq', topic, q, pairs, why });
  }

  /* ======================= SECTION 4: CPUs ======================= */

  /* ---- recall ---- */
  MC('recall', 'cpu-basics', `What does the course call the built-in "code book" that tells a CPU what each pattern of 1s and 0s means?`,
    `Machine language`, [`The BIOS`, `The clock`, `The pipeline`],
    `Every CPU has its machine language built in. It maps bit patterns to actions such as "add the two registers."`);
  MC('recall', 'cpu-basics', `In the "man in a box" analogy, what do the racks of 16 bulbs represent?`,
    `Registers`, [`The clock`, `The external data bus`, `The code book`],
    `Registers are CPU storage areas for math. The data bus is the switches and bulbs on the box wall; the clock is the doorbell.`);
  MC('recall', 'isa', `About how much RAM can an x86 (32-bit) system address?`,
    `4 GB`, [`16 GB`, `64 GB`, `4 TB`], `2^32 addresses, one byte each, is about 4 GB.`);
  MC('recall', 'isa', `Per the course, which company originally developed x64?`,
    `AMD`, [`Intel`, `ARM`, `Microsoft`], `x86 came from Intel. x64 (also called AMD64) came from AMD.`);
  MC('recall', 'bits', `What formula gives the number of RAM addresses a bit-size can reach?`,
    `2 raised to the number of bits`, [`Bits multiplied by 8`, `Bits squared`, `Bits divided by 2`],
    `A 32-bit address is 2^32 locations; a 64-bit address is 2^64 locations.`);
  MC('recall', 'cores', `Which unit is used to measure CPU clock speed?`,
    `Gigahertz (GHz)`, [`Cubic feet per minute (CFM)`, `Decibels (dB)`, `Megatransfers per second`],
    `One hertz is one cycle per second. GHz is billions of cycles per second.`);
  MC('recall', 'names', `On a CPU named like "Core i9 12900K," what does the K suffix mean?`,
    `Unlocked for overclocking`, [`Includes integrated graphics`, `Low power`, `Server-grade ECC support`],
    `K = unlocked. G = integrated graphics. X = higher clocks out of the box.`);
  MC('recall', 'cooling', `What does a fan's CFM rating measure?`,
    `Airflow volume`, [`Heat produced`, `Noise level`, `Fan speed in RPM`],
    `CFM is cubic feet per minute: how much air moves. Noise is measured in dB.`);
  MC('recall', 'cpu-install', `With an LGA socket, where are the contacts that can be damaged?`,
    `On the motherboard socket`, [`On the CPU`, `On the heatsink`, `On the power supply`],
    `LGA = contacts on the motherboard. PGA = pins on the CPU.`);
  MC('recall', 'cpu-install', `What does ZIF stand for?`,
    `Zero Insertion Force`, [`Zero Input Frequency`, `Zone Integrated Fan`, `Zinc Insulated Foil`],
    `A ZIF socket lets the CPU drop in without pressure, then a lever locks it.`);

  /* ---- compare ---- */
  MC('compare', 'isa', `Which statement best contrasts CISC and RISC as the course teaches them?`,
    `CISC has a large, complex instruction set (x86); RISC has a smaller, simpler set aimed at efficiency (ARM)`,
    [`CISC is for phones and RISC is for desktops`, `CISC and RISC differ only in clock speed`, `RISC has more instructions than CISC`],
    `x86 = CISC, ARM = RISC. ARM's efficiency is why it shows up in phones and IoT devices.`);
  MC('compare', 'bits', `Which comparison of 32-bit and 64-bit software support is correct?`,
    `64-bit runs 32-bit and 64-bit software; 32-bit runs only 32-bit`,
    [`32-bit runs both; 64-bit runs only 64-bit`, `Both run only their own bit size`, `32-bit runs both on Windows only`],
    `Backward compatibility goes one way: 64-bit can run 32-bit, not the reverse.`);
  MC('compare', 'cores', `One CPU is single-core at 3.0 GHz and another is dual-core at 3.0 GHz. What is true?`,
    `The dual-core has two lanes, each running at the same per-core speed`,
    [`The dual-core runs at 6.0 GHz`, `They are identical in capability`, `The single-core is faster per core`],
    `Cores add parallel lanes. Clock speed is per core and is a separate measurement.`);
  MC('compare', 'names', `Which CPU is likely the newer design?`,
    `Core i5 13400`, [`Core i7 10700`, `They are the same age`, `Cannot tell without the GHz rating`],
    `Across time, generation matters more than tier. 13th generation beats 10th, even with a lower tier.`);
  MC('compare', 'names', `Which statement about the K and X suffixes is correct?`,
    `K is unlocked so you can overclock it; X has higher clocks and power out of the box`,
    [`K means integrated graphics; X means unlocked`, `X is unlocked; K is low power`, `Both mean the CPU cannot be overclocked`],
    `G is the suffix for integrated graphics.`);
  MC('compare', 'cooling', `What is the difference between a heatsink and thermal paste?`,
    `The heatsink absorbs CPU heat; thermal paste fills gaps to improve the transfer`,
    [`Thermal paste absorbs heat; the heatsink fills gaps`, `They are two names for the same part`, `Paste is optional and the heatsink is required`],
    `Paste is required for proper heat transfer. It is not optional.`);
  MC('compare', 'cooling', `Which describes an All-In-One (AIO) cooler compared with a custom loop?`,
    `AIO is a packaged, common liquid cooler; a custom loop lets you pick each part`,
    [`AIO needs a reservoir; a custom loop never does`, `AIO is air cooled; a custom loop is liquid cooled`, `AIO uses a refrigerator cycle`],
    `Phase change works like a refrigerator. Most AIOs do not use a reservoir.`);
  MC('compare', 'cpu-install', `Which statement about bent pins is correct?`,
    `LGA bent pins damage the motherboard; PGA bent pins damage the CPU`,
    [`LGA bent pins damage the CPU; PGA bent pins damage the motherboard`, `Bent pins only matter on laptops`, `Bent pins are cosmetic`],
    `Whichever side holds the pins is the side that breaks.`);
  MC('compare', 'bits', `Which bus requests data from RAM, and which moves it?`,
    `Address bus requests; data bus moves`, [`Data bus requests; address bus moves`, `Both only move data`, `Both only request data`],
    `The bit size sets both widths.`);

  /* ---- scenario ---- */
  MC('scenario', 'bits', `A user installs 8 GB of RAM in a PC running 32-bit Windows and the system reports only a little over 3 GB usable. What is the best explanation and fix?`,
    `A 32-bit OS tops out around 4 GB total; install a 64-bit OS`,
    [`The RAM is defective; replace it`, `The paging file is too small; increase it`, `The CPU is overheating; clean the fans`],
    `32-bit addressing is a hard limit, and hardware mapping eats part of the 4 GB.`);
  MC('scenario', 'choose', `A customer wants a travel laptop and cares most about battery life. Which CPU tendency should you recommend?`,
    `Fewer cores and lower clock speed for power efficiency`, [`The most cores available regardless of power`, `An unlocked K model for overclocking`, `A desktop-class CPU in a bigger case`],
    `Laptop CPUs favor efficiency; desktop CPUs favor raw performance.`);
  MC('scenario', 'choose', `A user runs several virtual machines at once. Which CPU feature should you prioritize?`,
    `Core count`, [`Fan noise rating`, `Socket color`, `Highest dB rating`],
    `Multitasking and VMs benefit from cores. Single-threaded tasks and gaming lean on clock speed.`);
  MC('scenario', 'cooling', `A PC shuts down randomly under load. Inside, the fans and heatsink fins are caked with dust. What do you do first?`,
    `Clean the dust and confirm the fans spin`, [`Replace the hard drive`, `Reinstall the operating system`, `Add more RAM`],
    `Dust blocks airflow and traps heat. Fix the obvious cause before swapping parts.`);
  MC('scenario', 'cpu-install', `A new build powers on and shuts off after a few seconds. Which is a likely cause?`,
    `The CPU fan is not on the CPU_FAN header or the heatsink is not seated/no thermal paste`,
    [`The RAM has two notches`, `The 32-bit OS is installed`, `The CPU is a PGA instead of an LGA`],
    `Missing paste, a loose heatsink or an unconnected CPU fan lets the CPU overheat, and protection shuts the system down.`);
  MC('scenario', 'cpu-install', `You seat an AMD CPU, the lever latches, but the system will not start. What is the best next step?`,
    `Remove the CPU and inspect the pins for bending`, [`Replace the motherboard`, `Order a larger power supply`, `Flash the BIOS`],
    `The six-step process says form a theory first. Bent pins are the likely cause, not a bad motherboard.`);
  MC('scenario', 'cpu-install', `You are about to install a CPU in a carpeted room with no mat. Which is the best protection?`,
    `Wear an anti-static wrist strap`, [`Touch the CPU pins to discharge them`, `Wear rubber gloves only`, `Work on a plastic bag`],
    `Use an anti-static strap or mat. Never touch the pins or contacts.`);
  MC('scenario', 'names', `A customer wants a CPU they can overclock from the BIOS. Which fits?`,
    `Core i7 12700K`, [`Core i7 12700G`, `Core i7 12700`, `Core i7 12700T`],
    `The K suffix means unlocked. G means integrated graphics.`);
  MC('scenario', 'names', `A build has no separate graphics card. Which CPU suffix signals integrated graphics?`,
    `G`, [`K`, `X`, `Z`], `G includes integrated graphics. An APU is a CPU with a GPU built in.`);
  MC('scenario', 'cooling', `A quiet-build customer wants a case fan that is relatively quiet. Which rating fits the course's guidance?`,
    `Under 25 dB`, [`Over 25 dB`, `Over 100 CFM only`, `Any rating works`],
    `Under 25 dB is relatively quiet. Over 25 dB is noticeably louder.`);
  MC('scenario', 'cpu-basics', `A programmer sends the pattern that means "add the two registers and put the result in AX," then the pattern for "put AX on the bus." What does the bus show for 2 + 3?`,
    `Binary 5`, [`Binary 23`, `Binary 6`, `Nothing; the clock never rang`],
    `The CPU adds the two registers, stores the result in AX, and puts it on the data bus.`);

  /* ======================= SECTION 5: RAM ======================= */

  /* ---- recall ---- */
  MC('recall', 'ram-tech', `Which memory type is the only one with two notches?`,
    `SDRAM (168 pins)`, [`DDR (184 pins)`, `DDR3 (240 pins)`, `DDR4 (288 pins)`],
    `SDRAM is the only type with two notches. Every DDR generation has one.`);
  MC('recall', 'ram-tech', `How many pins does DDR4 DIMM memory have?`,
    `288`, [`168`, `184`, `240`], `SDRAM 168, DDR 184, DDR2 and DDR3 240, DDR4 288.`);
  MC('recall', 'ram-tech', `How do you convert a DDR rating to a PC rating?`,
    `Multiply by 8`, [`Divide by 8`, `Multiply by 2`, `Add 8`], `Example: DDR-400 is PC-3200.`);
  MC('recall', 'ram-cap', `Which memory setup does a typical modern desktop board expect?`,
    `Two matching sticks in specific slots (dual-channel)`, [`One very large stick only`, `Any mix of DDR3 and DDR4`, `Three different sizes`],
    `Memory is sold in pairs because boards use channels. The motherboard book shows the slots.`);
  MC('recall', 'ram-feat', `How many pins does a DDR4 SODIMM have?`,
    `260`, [`204`, `240`, `288`], `DDR3 SODIMM is 204; DDR4 SODIMM is 260.`);
  MC('recall', 'ram-feat', `What does the SPD chip on a RAM stick do?`,
    `Reports its capacity, speed, type, maker and model`, [`Cools the module`, `Stores the BIOS`, `Corrects memory errors`],
    `SPD = Serial Presence Detect. A tool like CPU-Z reads it.`);
  MC('recall', 'vmem', `Virtual memory uses which resource as if it were RAM?`,
    `Space on the hard drive`, [`The CPU cache`, `The video card`, `The BIOS chip`], `It is the paging or swap file.`);
  MC('recall', 'ram-install', `What are the "3Fs" of memory compatibility?`,
    `Form, fit and function`, [`Fast, fair and free`, `Frequency, fan and firmware`, `Fill, flip and fasten`],
    `Check the motherboard documentation or the manufacturer's lookup tool.`);
  MC('recall', 'ram-feat', `How can you recognize an ECC or parity stick by its chips?`,
    `It has a ninth chip`, [`It has two notches`, `It has a metal heat spreader`, `It has four chips`],
    `Most sticks have eight chips (one per bit of a byte). ECC adds a ninth.`);
  MC('recall', 'ram-install', `What is the bare minimum RAM the course gives for an operating system and basic tasks?`,
    `8 GB`, [`2 GB`, `4 GB`, `64 GB`], `Gaming and graphics work should aim for at least 16 GB.`);

  /* ---- compare ---- */
  MC('compare', 'ram-tech', `How do DDR2 and DDR3 DIMMs differ physically?`,
    `Both have 240 pins; the notch is in a different place`, [`DDR2 has 184 pins and DDR3 has 288`, `DDR3 has two notches`, `They are physically identical and interchangeable`],
    `The notch offset prevents installing the wrong type.`);
  MC('compare', 'ram-cap', `Which RAM type explains in-between capacities like 2 GB and 8 GB?`,
    `Double-sided modules`, [`Single-sided modules`, `ECC modules`, `SODIMM modules`],
    `Chip sizes jump 4x (1 GB, 4 GB, 16 GB). Double-sided memory gives the 2x steps.`);
  MC('compare', 'ram-feat', `Which statement about ECC memory is correct?`,
    `It needs a motherboard designed for it and is mostly used in servers`,
    [`Any desktop board can take ECC with a BIOS update`, `It is the cheapest option`, `It has fewer chips than normal memory`],
    `ECC is expensive and cannot be bolted onto an ordinary board.`);
  MC('compare', 'vmem', `Which comparison of physical and virtual memory is correct?`,
    `Physical is the installed RAM sticks; virtual is a chunk of the hard drive acting as memory`,
    [`Virtual memory is faster than physical`, `Physical memory is on the hard drive`, `They are the same thing`],
    `Virtual memory is slow because the drive is much slower than RAM.`);
  MC('compare', 'ram-cap', `Compare one stick in a dual-channel board with two matched sticks in the right slots.`,
    `One stick may not boot or runs in single channel mode; two matched sticks use dual channel`,
    [`One stick is always faster`, `They behave identically`, `Two sticks only work if they are different sizes`],
    `With channels the system talks to both sticks at once.`);
  MC('compare', 'ram-tech', `A stick is labeled PC4 and another PC2. Which is the newer technology?`,
    `PC4 (DDR4)`, [`PC2 (DDR2)`, `They are the same generation`, `Neither maps to a generation`],
    `PC, PC2, PC3, PC4 map to DDR, DDR2, DDR3, DDR4.`);
  MC('compare', 'ram-feat', `In CPU-Z, how do the SPD tab and Memory tab differ?`,
    `SPD shows per-slot module details; Memory shows a quick overall summary`,
    [`SPD is for overclockers; Memory shows timing tables`, `They show identical information`, `Memory shows each slot's maker`],
    `Stay away from the timing tables. They are for overclockers.`);
  MC('compare', 'ram-feat', `Which pairing of SODIMM type to pin count is correct?`,
    `DDR3 = 204, DDR4 = 260`, [`DDR3 = 260, DDR4 = 204`, `DDR3 = 240, DDR4 = 288`, `DDR3 = 168, DDR4 = 184`],
    `Those are the SODIMM (laptop) counts. Full DIMMs are 240 and 288.`);

  /* ---- scenario ---- */
  MC('scenario', 'ram-tech', `A loose stick is labeled only "PC3-12800." What is it?`,
    `DDR3 at a DDR rating of 1600`, [`DDR2 at 800`, `DDR4 at 3200`, `SDRAM at 100`],
    `PC3 means DDR3. 12800 divided by 8 is 1600.`);
  MC('scenario', 'ram-cap', `Channel A holds two 16 GB sticks and Channel B holds two 8 GB sticks. What is the total?`,
    `48 GB`, [`24 GB`, `32 GB`, `64 GB`], `Total is the sum of all sticks: 32 + 16.`);
  MC('scenario', 'ram-cap', `A two-slot board already has two 4 GB sticks and the customer wants more RAM. What do you advise?`,
    `Replace the existing sticks with larger ones, since no slots are free`,
    [`Add a third stick in the CPU socket`, `Enable virtual memory instead`, `Buy ECC memory`],
    `You are out of slots, so the customer gets memory back.`);
  MC('scenario', 'ram-cap', `A PC boots with the message "running in single channel mode." What is the likely cause?`,
    `Only one stick, or sticks in the wrong slots, on a dual-channel board`,
    [`The paging file is disabled`, `The CPU is unlocked`, `The memory is ECC`],
    `Install a matching second stick in the paired slot from the motherboard book.`);
  MC('scenario', 'ram-feat', `You want to know if a customer's PC has free memory slots without opening the case. Which tool and tab helps?`,
    `CPU-Z, SPD tab`, [`CPU-Z, timing tables`, `The BIOS boot logo`, `Device Manager, display adapters`],
    `The SPD tab lets you click through each slot, including empty ones.`);
  MC('scenario', 'ram-feat', `An admin wants ECC memory in an ordinary consumer desktop. What should you tell them?`,
    `The board must be designed for ECC; a regular board will not support it`,
    [`ECC works in any board if the pins match`, `ECC works after a BIOS update`, `ECC only fits laptops`],
    `You cannot upgrade a regular motherboard to ECC.`);
  MC('scenario', 'vmem', `A PC slows to a crawl and the drive activity light stays on. What is happening and what is the fix?`,
    `It is relying on virtual memory; add more RAM`, [`The CPU is too cold; add a fan`, `The paging file is corrupted; delete it`, `The power supply is failing; replace it`],
    `The CPU is writing to the drive instead of memory. Virtual memory is a stopgap.`);
  MC('scenario', 'vmem', `For Windows 10, which paging file setting matches the course?`,
    `Automatically manage paging file size for all drives`, [`Disable the paging file`, `Set it to 1 MB`, `Move it to a USB drive`],
    `Manual configuration is long over.`);
  MC('scenario', 'ram-install', `After installing RAM the system powers on but nothing appears. What do you check first?`,
    `That the module is fully seated and the clips are locked`, [`Replace the CPU`, `Reinstall Windows`, `Update the BIOS`],
    `Check power, then seating, then cables, then a faulty module.`);
  MC('scenario', 'ram-install', `You are installing a SODIMM in a laptop. How do you seat it?`,
    `Insert at about 45 degrees, then press down until it clicks`, [`Press straight down like a desktop DIMM`, `Slide it in horizontally with a screwdriver`, `Heat it first`],
    `Desktop DIMMs go straight down; laptop SODIMMs go in at an angle.`);
  MC('scenario', 'ram-install', `You have no ESD strap but must install RAM. What does the lesson allow?`,
    `Touch unpainted metal on the case to ground yourself`, [`Touch a painted panel`, `Skip grounding for small modules`, `Hold the module by its contacts`],
    `Also unplug the PC and flip the PSU switch. Re-ground yourself if you walk away.`);
  MC('scenario', 'ram-install', `A customer's laptop is sluggish after an OS upgrade and has 4 GB. What is the most likely helpful change?`,
    `Add more RAM (8 GB at minimum)`, [`Replace the screen`, `Add a heat spreader`, `Install a second CPU`],
    `A sluggish system after an upgrade probably needs more memory.`);

  /* ======================= PBQ-STYLE ======================= */

  ORDER('cpu-install', `Put the CompTIA troubleshooting steps in order.`, [
    `Identify the problem`, `Establish a theory of probable cause`, `Test the theory`,
    `Establish a plan of action`, `Verify full system functionality`, `Document findings`],
    `Inspect and theorize before you test; verify and document last.`);
  ORDER('cpu-install', `Order the steps to install a CPU.`, [
    `Stand on an anti-static mat or put on a wrist strap`, `Open the ZIF mechanism`, `Remove the plastic protective cover`,
    `Match the alignment mark on the CPU to the socket`, `Set the CPU in gently`, `Close and latch the ZIF mechanism`],
    `Protect from ESD first, then open, align, seat and lock.`);
  ORDER('cooling', `Order the heat path from the CPU to the air.`, [
    `CPU die`, `Integrated heat spreader`, `Thermal paste`, `Heatsink`, `Fan airflow`],
    `The paste fills the microscopic gaps between the IHS and the heatsink.`);
  MATCH('names', `Match each CPU name part or suffix to its meaning.`, [
    [`K suffix`, `Unlocked for overclocking`],
    [`X suffix`, `Higher clocks and power out of the box`],
    [`G suffix`, `Integrated graphics`],
    [`i9 / Ryzen 9`, `Performance tier`]],
    `Generation shows age; tier compares performance within a generation.`);
  MATCH('isa', `Classify each clue as x86 or x64.`, [
    [`Limited to about 4 GB of RAM`, `x86`],
    [`Runs both 32-bit and 64-bit software`, `x64`],
    [`Originally developed by Intel`, `x86`],
    [`Originally developed by AMD`, `x64`]],
    `x64 is backward compatible with 32-bit software.`);
  MATCH('cpu-install', `Match each install term to its meaning.`, [
    [`LGA`, `Contacts on the motherboard socket`],
    [`PGA`, `Pins on the CPU`],
    [`ZIF`, `Lever locks the CPU with no insertion pressure`],
    [`ESD`, `Static that can damage components`]],
    `LGA and PGA are named for where the pins live.`);
  MATCH('cooling', `Match each cooling part to its job.`, [
    [`Heatsink`, `Absorbs heat from the CPU`],
    [`Thermal paste`, `Fills gaps to improve heat transfer`],
    [`Radiator`, `Dissipates heat from circulating coolant`],
    [`Water block`, `Absorbs CPU heat into the coolant`]],
    `Heat flows from the CPU through paste to the heatsink or water block.`);
  MULTI('cooling', `Select ALL common causes of CPU overheating.`,
    [`Dust blocking fans and vents`, `A damaged or failing case fan`, `Many browser tabs or malware loading the CPU`],
    [`Fresh thermal paste on the IHS`, `Installing more RAM`],
    `Fresh paste helps. RAM capacity does not cause CPU heat.`);
  MULTI('cpu-install', `Select ALL valid ESD protection measures.`,
    [`Anti-static wrist strap`, `Anti-static mat`, `ESD gloves`],
    [`Rubber-soled shoes on carpet`, `Touching the CPU pins to discharge`],
    `Never touch pins or contacts.`);

  ORDER('ram-install', `Order the steps to install desktop RAM.`, [
    `Gather an ESD strap or mat; keep memory in its antistatic bag`, `Shut down, unplug and flip the PSU switch`, `Open the case`,
    `Push the clips outward to remove old memory`, `Line up the notch and press straight down until the clips snap`,
    `Power on and check the total on the boot screen or in Settings > About`, `Close the case`],
    `Power off before opening; verify before closing.`);
  MATCH('ram-tech', `Match each memory type to its DIMM pin count.`, [
    [`SDRAM`, `168`], [`DDR`, `184`], [`DDR2`, `240`], [`DDR4`, `288`]],
    `DDR2 and DDR3 share 240 pins and differ by notch position.`);
  MATCH('ram-tech', `Match each memory generation to its PC rating prefix.`, [
    [`DDR`, `PC-`], [`DDR2`, `PC2-`], [`DDR3`, `PC3-`], [`DDR4`, `PC4-`]],
    `The number in the PC rating matches the DDR generation.`);
  MATCH('ram-cap', `Match each configuration to its total capacity.`, [
    [`A: 2 x 8 GB, B: 2 x 4 GB`, `24 GB`],
    [`A: 2 x 16 GB, B: 2 x 4 GB`, `40 GB`],
    [`A: 2 x 4 GB only`, `8 GB`],
    [`A: 2 x 16 GB, B: 2 x 16 GB`, `64 GB`]],
    `Total memory is the sum of all sticks.`);
  MATCH('vmem', `Match each symptom to the best fix.`, [
    [`Slow, drive light constant`, `Add more RAM`],
    [`Powers on after RAM install, nothing happens`, `Reseat the module`],
    [`Single channel mode warning`, `Install a matching stick in the paired slot`],
    [`Will not power on at all`, `Check the power cable and PSU switch`]],
    `Start with the easiest, most common cause.`);
  MULTI('ram-cap', `Select ALL true statements about dual-channel memory.`,
    [`Use the slots the motherboard book assigns to each channel`, `Within a channel, size and speed should match`, `Different sizes across channels are allowed`],
    [`DDR3 and DDR4 can share a channel`, `Any two slots work equally well`],
    `The book names Channel A and Channel B slots.`);
  MULTI('ram-install', `Select ALL safe RAM-handling practices.`,
    [`Keep the module in its antistatic bag until use`, `Hold it by the edges`, `Press straight down until the clips snap`],
    [`Touch the metal contacts`, `Pry the module out with a screwdriver`],
    `Never pry or force memory.`);

  window.QUESTIONS = qs;
})();
