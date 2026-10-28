// Complete client-side educational knowledge base and fallback engine
// Allows full standalone functionality on static hosts like Netlify and Vercel

export const MOCK_CONCEPTS = [
  { id: 1, slug: "dbms_normalization", name: "DBMS Normalization", description: "Decomposing tables to eliminate data redundancy and insertion/update/deletion anomalies.", category: "Databases", difficulty: "Intermediate" },
  { id: 2, slug: "primary_key_vs_foreign_key", name: "Primary Key vs Foreign Key", description: "Relational database constraints ensuring entity integrity and referential integrity between relations.", category: "Databases", difficulty: "Beginner" },
  { id: 3, slug: "os_process", name: "Operating System Process", description: "A program in execution comprising program counter, process control block (PCB), stack, and heap.", category: "Operating Systems", difficulty: "Intermediate" },
  { id: 4, slug: "deadlock", name: "Deadlock", description: "A permanent blocking condition where processes hold resources and wait for resources held by others.", category: "Operating Systems", difficulty: "Advanced" },
  { id: 5, slug: "computer_network", name: "Computer Network", description: "An interconnected system of autonomous devices exchanging data via transmission media.", category: "Networking", difficulty: "Beginner" },
  { id: 6, slug: "osi_model", name: "OSI Model", description: "7-layer conceptual framework developed by ISO to standardize computer network protocol communication.", category: "Networking", difficulty: "Intermediate" },
  { id: 7, slug: "tcp_ip", name: "TCP/IP Protocol Suite", description: "The foundational 4-layer networking communication protocol suite powering the global Internet.", category: "Networking", difficulty: "Intermediate" },
  { id: 8, slug: "data_structures", name: "Data Structures", description: "Specialized formats for organizing, retrieving, and storing data efficiently in memory.", category: "Data Structures & Algorithms", difficulty: "Beginner" },
  { id: 9, slug: "binary_search", name: "Binary Search", description: "A logarithmic O(log n) divide-and-conquer search algorithm operating on sorted arrays.", category: "Data Structures & Algorithms", difficulty: "Beginner" },
  { id: 10, slug: "oop", name: "Object-Oriented Programming", description: "A software paradigm built on data abstraction, encapsulation, inheritance, and polymorphism.", category: "Software Engineering", difficulty: "Beginner" },
  { id: 11, slug: "inheritance", name: "Inheritance", description: "Mechanism where a derived class acquires properties and behaviors of a base class.", category: "Software Engineering", difficulty: "Intermediate" },
  { id: 12, slug: "polymorphism", name: "Polymorphism", description: "The ability of an entity to take multiple forms at compile-time or run-time.", category: "Software Engineering", difficulty: "Intermediate" },
  { id: 13, slug: "machine_learning", name: "Machine Learning", description: "Subfield of AI focused on algorithms learning statistical patterns from data.", category: "AI & Machine Learning", difficulty: "Intermediate" },
  { id: 14, slug: "supervised_learning", name: "Supervised Learning", description: "ML task of learning a mapping function from input features to known labeled targets.", category: "AI & Machine Learning", difficulty: "Intermediate" },
  { id: 15, slug: "neural_network", name: "Neural Network", description: "Interconnected artificial neurons in layers with learnable weights and non-linear activations.", category: "AI & Machine Learning", difficulty: "Advanced" },
  { id: 16, slug: "overfitting", name: "Overfitting", description: "Modeling error where a model learns noise, degrading out-of-sample generalization.", category: "AI & Machine Learning", difficulty: "Intermediate" },
  { id: 17, slug: "artificial_intelligence", name: "Artificial Intelligence", description: "Broad domain building systems capable of performing tasks requiring human cognition.", category: "AI & Machine Learning", difficulty: "Beginner" },
  { id: 18, slug: "sql_join", name: "SQL JOIN", description: "Relational algebraic operation combining rows from tables based on related attributes.", category: "Databases", difficulty: "Intermediate" },
  { id: 19, slug: "cloud_computing", name: "Cloud Computing", description: "On-demand network delivery of compute, storage, databases, and servers with pay-per-use pricing.", category: "Cloud & Security", difficulty: "Beginner" },
  { id: 20, slug: "cybersecurity", name: "Cybersecurity", description: "Technologies, processes, and controls protecting systems, networks, and data from attacks.", category: "Cloud & Security", difficulty: "Intermediate" }
];

export const MOCK_PERSONAS = [
  {
    id: 1,
    slug: "examiner",
    name: "Examiner",
    tagline: "Formal, academic rigor & exam evaluation criteria",
    description: "An experienced university examiner focusing on precise definitions, technical terminology, advantages/disadvantages, and key marking points.",
    role: "You are an experienced university examiner and computer science subject expert evaluating academic knowledge.",
    tone: "Use formal, precise, authoritative, and academically appropriate language. Maintain strict pedagogical rigor and zero casual filler.",
    format: "Use headings, structured bullet points, technical definitions, and exam-focused breakdown: 1. Academic Definition, 2. Core Technical Architecture, 3. Key Properties, 4. Advantages & Disadvantages, 5. Examination Pitfalls & Common Student Errors.",
    example_text: "In technical literature, this is formally characterized by...",
    instructions: "Explain the concept from basic to advanced level. Provide precise terminology, definitions, important points, advantages/disadvantages, and possible exam questions."
  },
  {
    id: 2,
    slug: "friendly_senior",
    name: "Friendly Senior",
    tagline: "Conversational, practical tips & relatable peer guidance",
    description: "A helpful college senior who has cleared placement rounds and semester exams, explaining concepts with practical advice and relatable peer language.",
    role: "You are a friendly final-year computer science senior guiding a junior student through a difficult concept.",
    tone: "Use warm, conversational, encouraging, and beginner-friendly language. Avoid unnecessary jargon and explain technical words when used.",
    format: "Organize like a peer study session: 'Hey junior! Let's break this down', 'The Core Idea (Without Jargon)', 'Where You Will Actually Use This', 'Senior Pro-Tips & Traps to Avoid'.",
    example_text: "Don't worry, everyone struggles with this in 2nd year! Think of this like your college hostel WiFi router...",
    instructions: "Start from the basics and gradually build understanding. Use practical examples and tips, highlight common mistakes junior students make."
  },
  {
    id: 3,
    slug: "child_friendly",
    name: "Child-Friendly",
    tagline: "Stories, simple vocabulary & everyday fun comparisons",
    description: "An imaginative teacher explaining complex computer science concepts through simple everyday stories, games, and playful analogies.",
    role: "You are an inspiring elementary school teacher explaining computer science to an inquisitive 10-year-old child.",
    tone: "Use very simple vocabulary, cheerful, enthusiastic, and wonder-filled tone. Friendly, colorful, and engaging.",
    format: "Storybook format: 'A Fun Story', 'What Does That Mean?', 'Everyday Example', 'Fun Mini-Quiz / Magic Rule to Remember'.",
    example_text: "Imagine you have a magical toy box with labels... Just like when everyone takes turns on the playground slide!",
    instructions: "Use extremely simple vocabulary, familiar examples, stories, and comparisons. Avoid complicated technical terminology unless explained with toys."
  },
  {
    id: 4,
    slug: "real_world_analogy",
    name: "Real-World Analogy",
    tagline: "Vivid physical metaphors with explicit mapping & boundaries",
    description: "An instructor who maps abstract technical architectures to tangible real-world systems, highlighting where the analogy works and where it breaks down.",
    role: "You are an expert educator who specializes in demystifying abstract technical computer science concepts using rich real-world physical analogies.",
    tone: "Instructive, analytical, vivid, and grounded in physical intuition.",
    format: "Four-part structured layout: 1. Brief Technical Introduction, 2. The Real-World Metaphor, 3. Concept-to-Analogy Component Mapping Table, 4. Critical Boundaries (Where Analogy Breaks Down).",
    example_text: "Consider an international airport baggage sorting facility... Luggage barcode = packet header, conveyor diverter = network router...",
    instructions: "First introduce the concept briefly. Then provide a rich real-world analogy. Map each component explicitly. Explain boundaries where the analogy breaks down."
  },
  {
    id: 5,
    slug: "exam_answer",
    name: "Exam-Answer Format",
    tagline: "2-mark, 5-mark & 10-mark structured scoring templates",
    description: "A university exam preparation guide tailored for semester exams, complete with 2-mark definitions, 5-mark short answers, and 10-mark comprehensive breakdowns.",
    role: "You are an academic exam coach helping a university student prepare for a Computer Science end-semester examination.",
    tone: "Objective, concise, structured, and strictly optimized for university mark allocation rubrics.",
    format: "Direct university answer scheme: 1. Standard Definition, 2. Salient Characteristics, 3. Working Principle, 4. Example, 5. Advantages & Limitations, 6. Quick 2-Mark Answer, 7. Standard 5-Mark Answer, 8. Comprehensive 10-Mark Blueprint.",
    example_text: "[2 Marks Question]: State definition & key property. [5 Marks]: Diagram description. [10 Marks]: Full comparative analysis.",
    instructions: "Explain the concept in an exam-ready format. Include Definition, Key points, Working/principle, Example, Short 2-mark answer, and Long 10-mark answer."
  }
];

export const MOCK_EVALUATORS = [
  { id: 1, name: "Aarav Sharma", student_id: "21BCSE101", batch: "2021-2025", department: "Computer Science & Engineering" },
  { id: 2, name: "Ananya Verma", student_id: "21BAIML042", batch: "2021-2025", department: "AI & Machine Learning" },
  { id: 3, name: "Rohan Patel", student_id: "22BCSE088", batch: "2022-2026", department: "Computer Science & Engineering" },
  { id: 4, name: "Priya Sundaram", student_id: "21BCSE154", batch: "2021-2025", department: "Computer Science & Engineering" },
  { id: 5, name: "Vikram Malhotra", student_id: "21BAIML019", batch: "2021-2025", department: "AI & Machine Learning" },
  { id: 6, name: "Neha Gupta", student_id: "22BCSE204", batch: "2022-2026", department: "Computer Science & Engineering" },
  { id: 7, name: "Aditya Iyer", student_id: "21BCSE033", batch: "2021-2025", department: "Computer Science & Engineering" },
  { id: 8, name: "Sneha Rao", student_id: "22BAIML067", batch: "2022-2026", department: "AI & Machine Learning" },
  { id: 9, name: "Kabir Mehta", student_id: "21BCSE112", batch: "2021-2025", department: "Computer Science & Engineering" },
  { id: 10, name: "Divya Nair", student_id: "22BCSE045", batch: "2022-2026", department: "Computer Science & Engineering" },
  { id: 11, name: "Arjun Deshmukh", student_id: "21BAIML081", batch: "2021-2025", department: "AI & Machine Learning" },
  { id: 12, name: "Pooja Kulkarni", student_id: "22BCSE178", batch: "2022-2026", department: "Computer Science & Engineering" },
  { id: 13, name: "Rishabh Singhal", student_id: "21BCSE099", batch: "2021-2025", department: "Computer Science & Engineering" },
  { id: 14, name: "Tanvi Saxena", student_id: "22BAIML029", batch: "2022-2026", department: "AI & Machine Learning" },
  { id: 15, name: "Siddharth Reddy", student_id: "21BCSE165", batch: "2021-2025", department: "Computer Science & Engineering" },
  { id: 16, name: "Meera Joshi", student_id: "22BCSE110", batch: "2022-2026", department: "Computer Science & Engineering" }
];

export const MOCK_ABLATION_SUMMARY = [
  { configuration: "full", config_label: "Full Modular Prompt", description: "Role + Tone + Format + Examples + Step-by-Step Instructions (Baseline)", test_count: 24, avg_clarity: 4.65, avg_correctness: 4.75, avg_usefulness: 4.70, avg_engagement: 4.55, avg_persona_match: 4.80, avg_overall: 4.69, delta_from_full: 0.0 },
  { configuration: "no_role", config_label: "Without Role", description: "Removes persona identity; tests persona anchoring contribution.", test_count: 24, avg_clarity: 4.30, avg_correctness: 4.60, avg_usefulness: 4.25, avg_engagement: 3.90, avg_persona_match: 3.40, avg_overall: 4.09, delta_from_full: -0.60 },
  { configuration: "no_tone", config_label: "Without Tone", description: "Removes tone/style constraints; tests emotional/engagement alignment.", test_count: 24, avg_clarity: 4.35, avg_correctness: 4.65, avg_usefulness: 4.20, avg_engagement: 3.50, avg_persona_match: 3.85, avg_overall: 4.11, delta_from_full: -0.58 },
  { configuration: "no_format", config_label: "Without Format", description: "Removes structural layout; tests response organization and readability.", test_count: 24, avg_clarity: 3.45, avg_correctness: 4.50, avg_usefulness: 3.30, avg_engagement: 3.20, avg_persona_match: 4.10, avg_overall: 3.71, delta_from_full: -0.98 },
  { configuration: "no_examples", config_label: "Without Examples", description: "Removes few-shot demonstrations; tests few-shot prompting impact.", test_count: 24, avg_clarity: 4.25, avg_correctness: 4.60, avg_usefulness: 4.35, avg_engagement: 4.15, avg_persona_match: 4.20, avg_overall: 4.30, delta_from_full: -0.39 },
  { configuration: "no_instructions", config_label: "Without Step-by-Step Instructions", description: "Removes pedagogical instructions; tests procedural clarity.", test_count: 24, avg_clarity: 4.10, avg_correctness: 4.20, avg_usefulness: 3.95, avg_engagement: 4.05, avg_persona_match: 4.30, avg_overall: 4.12, delta_from_full: -0.57 },
  { configuration: "minimal", config_label: "Minimal Prompt", description: "Raw user concept only ('Explain {concept}'); simulates unengineered zero-shot usage.", test_count: 24, avg_clarity: 2.80, avg_correctness: 3.40, avg_usefulness: 2.50, avg_engagement: 2.20, avg_persona_match: 2.10, avg_overall: 2.60, delta_from_full: -2.09 }
];

export function generateClientExplanation(concept, personaSlug) {
  if (personaSlug === "examiner") {
    return `### 1. Formal Academic Definition\n${concept} is a fundamental architectural concept in computer science governed by formal deterministic constraints. It provides systematic mechanisms to organize, execute, and verify system state under defined computational bounds.\n\n### 2. Core Technical Architecture\n- **Formal Specification**: Operates under rigorous state transitions and mathematical invariants.\n- **Resource Constraints**: Guarantees bounded space-time complexity (O-notation) and predictable resource allocation.\n- **Interface Contracts**: Decouples abstraction specification from hardware/OS platform implementations.\n\n### 3. Advantages vs Disadvantages\n- **Advantages**: High modularity, verifiable correctness, error containment, and predictability.\n- **Disadvantages**: Latency overhead during synchronization or parsing; requires rigorous parameter tuning for boundary conditions.\n\n### 4. Examination Marking Criteria\n- **Critical Marking Point**: Students must explicitly state invariants, boundary failure conditions, and state diagram representations.\n- **Common Candidate Pitfall**: Confusing conceptual principles with specific programming language syntax.`;
  } else if (personaSlug === "friendly_senior") {
    return `### Hey junior! Let's get clear on ${concept} 🚀\n\nWhen professors write 10-line Greek equations for **${concept}**, everyone panics. But in reality, it's just a clean engineering trick to stop programs from crashing or running at snail speed.\n\n### What it actually means in plain English\nThink of ${concept} as a clean traffic light system for your code. Without it, everything collides and creates messy bugs that take 4 hours to debug before your Friday deadline!\n\n### Where You Will Actually Use This\n- **In College Semester Projects**: Every time you build a database backend, concurrent server, or algorithms module.\n- **In Tech Placement Interviews**: Top tier companies (Google, Amazon, Microsoft) consistently ask conceptual questions on ${concept} in Round 1 & 2!\n\n### Senior Pro-Tips\n- **Avoid this trap**: Don't just memorize definitions. Sketch the state diagram on a sheet of paper.\n- **Placement Hack**: Always explain the 'Why' first—tell the interviewer what broke before we invented ${concept}!`;
  } else if (personaSlug === "child_friendly") {
    return `### 🎒 The Super Fun Story of ${concept}!\n\nImagine you have a giant wooden toy box in your bedroom with hundreds of colorful LEGO bricks, dinosaur action figures, and storybooks all piled up like a mountain.\n\nOne day, your mom asks: *"Can you find the blue LEGO block?"*\nIf everything is mixed in a heap, you'll be digging for ten whole minutes! That's where **${concept}** comes to the rescue!\n\n### 📦 The Magic Sorting Bins\nInstead of one messy box, you use small colored organizer bins:\n- **Bin 1**: Only building blocks!\n- **Bin 2**: Only crayons and storybooks!\n- **Bin 3**: Only superhero figures!\n\nNow everything is super neat, and you can find your favorite toy in 5 seconds flat!\n\n### ✨ Magic Rule to Remember\nIn computer science, **${concept}** is the computer's secret superpower for organizing things so nothing gets squished or lost! Super cool, right?`;
  } else if (personaSlug === "real_world_analogy") {
    return `### 1. Technical Introduction\n${concept} is a design abstraction in computing engineered to regulate resource flow, system state integrity, and coordination.\n\n### 2. The Real-World Analogy: Airport Baggage Handling Grid\nConsider an international airport baggage sorting terminal handling 40,000 passenger bags daily. If there were no barcode tags, conveyor diverters, or holding carousels, luggage would pile up at the runway gate, creating total gridlock.\n\nAirport engineers deploy routing diverters, optical barcode scanners, and queue buffers. This physical logistics system mirrors how **${concept}** coordinates data and compute processes inside computer architectures.\n\n### 3. Analogy Component Mapping\n| Real-World Airport Element | ${concept} Technical Equivalent |\n| :--- | :--- |\n| Luggage Baggage Tag | Packet Header / Unique Primary Key |\n| Baggage Conveyor Diverter | Routing Algorithm / Protocol Gateway |\n| Holding Carousel Area | Memory Buffer / Waiting Queue |\n| Baggage Jam on Conveyor | Resource Bottleneck / Deadlock Contention |\n\n### 4. Where the Analogy Holds vs Breaks Down\n- **Where It Holds**: Perfectly captures scheduling, flow control, and priority queues.\n- **Where It Breaks Down**: Physical bags have mass and cannot be duplicated with zero latency; computing packets and memory references can be copied with sub-microsecond overhead.`;
  } else {
    return `### 1. Formal Definition\n**${concept}** is defined as an algorithmic and architectural construct in computer science that provides systematic guarantees for data processing, system state management, and reliable resource allocation.\n\n### 2. Salient Characteristics\n1. **Deterministic Guarantees**: Operates within formal mathematical state bounds.\n2. **Modularity**: Decouples specification from low-level hardware or OS implementation.\n3. **Scalability**: Maintains asymptotic theoretical complexity bounds under scaling workloads.\n\n---\n### 3. Model 2-Mark Answer\n**Q: What is ${concept}? State its primary utility.**\n**Ans:** ${concept} is a core computing construct used to structure system resources and ensure reliable execution. Its primary utility is ensuring correctness, bounded complexity, and error prevention.\n\n### 4. Model 5-Mark Answer\n**Q: Explain the architecture and significance of ${concept}.**\n**Ans:** Define the primary principle, list 3 operational phases, describe the block diagram/flowchart, and provide at least two industrial applications (e.g. distributed computing, relational database integrity).\n\n### 5. Model 10-Mark Answer Blueprint\n1. Formal introductory definition and theoretical background.\n2. Architectural block diagram and state transitions.\n3. Algorithmic analysis with time and space complexity ($O$-notation).\n4. Comparison matrix against competing mechanisms.\n5. Practical case study and implementation considerations.`;
  }
}
