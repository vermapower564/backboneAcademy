export const SKILL_NODES = [
  {
    id: "node-1",
    name: "Foundational Engineering",
    category: "Core",
    level: 1,
    status: "unlocked",
    xp: 250,
    prereqs: [],
    desc: "Master computer science fundamentals, OS threads, memory layout, and clean code practices.",
    icon: "Cpu"
  },
  {
    id: "node-2",
    name: "Distributed Backbones",
    category: "Cloud",
    level: 2,
    status: "unlocked",
    xp: 500,
    prereqs: ["node-1"],
    desc: "Architect microservices, RPC protocols, rate limiters, and distributed consensus.",
    icon: "Network"
  },
  {
    id: "node-3",
    name: "LLM & Agent Systems",
    category: "AI",
    level: 2,
    status: "in-progress",
    xp: 600,
    prereqs: ["node-1"],
    desc: "Build AI agent loops, tool routing, memory state, and vector database embeddings.",
    icon: "Bot"
  },
  {
    id: "node-4",
    name: "Spinal & Physical Wellness",
    category: "Ergonomics",
    level: 1,
    status: "unlocked",
    xp: 300,
    prereqs: [],
    desc: "Maintain 100% ergonomic alignment, lumbar health, and posture mobility routines.",
    icon: "Activity"
  },
  {
    id: "node-5",
    name: "Zero-Trust Encryption",
    category: "Security",
    level: 3,
    status: "locked",
    xp: 850,
    prereqs: ["node-2"],
    desc: "Implement TLS 1.3, HSM key rotation, OAuth2 enterprise flows, and identity meshes.",
    icon: "ShieldCheck"
  },
  {
    id: "node-6",
    name: "Petabyte Stream Processing",
    category: "Data",
    level: 3,
    status: "locked",
    xp: 900,
    prereqs: ["node-2"],
    desc: "Kafka partitioning, Apache Flink stateful windows, and columnar parquet optimization.",
    icon: "Database"
  },
  {
    id: "node-7",
    name: "Master Architect Mastery",
    category: "Mastery",
    level: 4,
    status: "locked",
    xp: 1500,
    prereqs: ["node-3", "node-5", "node-6"],
    desc: "The pinnacle credential of Backbone Academy. Design end-to-end mission critical tech infrastructure.",
    icon: "Award"
  }
];
