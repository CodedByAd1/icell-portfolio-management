import { 
  User, 
  Project, 
  ProgressUpdate, 
  StandalonePost, 
  Comment, 
  CertificationRequest, 
  ModerationReport, 
  NotificationItem,
  AuditLogEntry
} from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-aditya',
    name: 'Aditya Sahu',
    email: 'adityasahu@nitrr.ac.in',
    role: 'authorized_overall_coordinator', // 4th year Authorized Overall Coordinator as in SRS
    affiliationStatus: 'icell_affiliated',
    institution: 'National Institute of Technology Raipur',
    department: 'Computer Science and Engineering',
    batch: 'Class of 2026',
    isAlumni: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    headline: 'Core Coordinator @ NIT Raipur I-Cell | Full-Stack & Distributed Systems',
    bio: 'Passionate about distributed consensus, scalable web systems, and student innovation ecosystems. Leading technical domain initiatives at NIT Raipur Innovation Cell.',
    location: 'Raipur, Chhattisgarh, India',
    skills: ['Next.js', 'TypeScript', 'Go', 'Distributed Systems', 'PostgreSQL', 'Docker', 'Kubernetes'],
    links: {
      github: 'https://github.com/adityasahu',
      linkedin: 'https://linkedin.com/in/adityasahu',
      portfolio: 'https://adityasahu.dev',
      leetcode: 'https://leetcode.com/adityasahu'
    },
    profileVisibility: 'public',
    certificationStatus: 'approved',
    certifiedDate: '2025-11-15T10:00:00Z',
    certificationSerial: 'NITRR-ICELL-2025-001',
    resumeUrl: '/documents/aditya_sahu_resume.pdf',
    streakEnabled: true,
    currentStreak: 34,
    longestStreak: 52,
    followersCount: 428,
    followingCount: 164,
    joinedDate: '2023-08-10'
  },
  {
    id: 'user-ananya',
    name: 'Ananya Sharma',
    email: 'asharma.it@nitrr.ac.in',
    role: 'student',
    affiliationStatus: 'icell_affiliated',
    institution: 'National Institute of Technology Raipur',
    department: 'Information Technology',
    batch: 'Class of 2027',
    isAlumni: false,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    headline: 'Edge-AI & Computer Vision Researcher | Pre-Final Year B.Tech',
    bio: 'Developing edge machine learning models for agricultural pathology and autonomous robotic inspection. Hackathon winner at Smart India Hackathon 2025.',
    location: 'Raipur, India',
    skills: ['PyTorch', 'TensorFlow Lite', 'OpenCV', 'Python', 'FastAPI', 'Edge Computing', 'React'],
    links: {
      github: 'https://github.com/ananyasharma',
      linkedin: 'https://linkedin.com/in/ananyasharma',
      devfolio: 'https://devfolio.co/@ananyasharma'
    },
    profileVisibility: 'public',
    certificationStatus: 'pending',
    streakEnabled: true,
    currentStreak: 19,
    longestStreak: 25,
    followersCount: 312,
    followingCount: 140,
    joinedDate: '2024-01-14'
  },
  {
    id: 'user-vikram',
    name: 'Vikram Malhotra',
    email: 'vikram.m@alumni.nitrr.ac.in',
    role: 'alumni',
    affiliationStatus: 'icell_affiliated',
    institution: 'National Institute of Technology Raipur',
    department: 'Electronics & Telecommunication',
    batch: 'Class of 2024',
    isAlumni: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    headline: 'Software Engineer @ Scaler Labs | Former I-Cell Robotics Lead',
    bio: 'Alumnus of NIT Raipur. Embedded firmware and cloud microservices. Retaining my portfolio to mentor upcoming student entrepreneurs and open source contributors.',
    location: 'Bengaluru, India',
    skills: ['Embedded C++', 'FreeRTOS', 'Rust', 'Kafka', 'AWS IoT Core', 'System Design'],
    links: {
      github: 'https://github.com/vikram-m',
      linkedin: 'https://linkedin.com/in/vikrammalhotra'
    },
    profileVisibility: 'public',
    certificationStatus: 'approved',
    certifiedDate: '2024-05-20T14:30:00Z',
    certificationSerial: 'NITRR-ICELL-2024-042',
    streakEnabled: false,
    currentStreak: 0,
    longestStreak: 84,
    followersCount: 680,
    followingCount: 210,
    joinedDate: '2021-09-01'
  },
  {
    id: 'user-rajesh',
    name: 'Dr. Rajesh Kumar Verma',
    email: 'rkverma@nitrr.ac.in',
    role: 'faculty_advisor',
    affiliationStatus: 'icell_affiliated',
    institution: 'National Institute of Technology Raipur',
    department: 'Innovation & Incubation Council',
    batch: 'Faculty Advisor',
    isAlumni: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    headline: 'Faculty In-Charge & Advisor @ NIT Raipur Innovation Cell',
    bio: 'Associate Professor & Mentor. Championing student patents, deep-tech incubation, and government technology grants under Startup India and NIDHI schemes.',
    location: 'NIT Raipur Campus',
    skills: ['Innovation Governance', 'Patent Strategy', 'Deep-Tech Incubation', 'Grant Review', 'Research Mentorship'],
    links: {
      scholar: 'https://scholar.google.com/citations?user=nitrr-rkverma',
      linkedin: 'https://linkedin.com/in/dr-rajesh-kumar'
    },
    profileVisibility: 'public',
    certificationStatus: 'approved',
    certifiedDate: '2023-01-01T00:00:00Z',
    certificationSerial: 'NITRR-FACULTY-ADVISOR',
    streakEnabled: false,
    currentStreak: 0,
    longestStreak: 0,
    followersCount: 1250,
    followingCount: 88,
    joinedDate: '2020-07-01'
  },
  {
    id: 'user-priya',
    name: 'Priya Nambiar',
    email: 'pnambiar.mod@nitrr.ac.in',
    role: 'moderator',
    affiliationStatus: 'icell_affiliated',
    institution: 'National Institute of Technology Raipur',
    department: 'Metallurgical & Materials Engineering',
    batch: 'Class of 2026',
    isAlumni: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    headline: 'I-Cell Editorial & Community Moderator | Material Informatics',
    bio: 'Dedicated to upholding integrity, anti-plagiarism standards, and community safety within the I-Cell student platform.',
    location: 'Raipur, India',
    skills: ['Content Moderation', 'Technical Writing', 'Data Integrity', 'Python', 'Materials Science'],
    links: {
      linkedin: 'https://linkedin.com/in/priya-nambiar'
    },
    profileVisibility: 'public',
    certificationStatus: 'not_requested',
    streakEnabled: true,
    currentStreak: 12,
    longestStreak: 30,
    followersCount: 195,
    followingCount: 110,
    joinedDate: '2023-11-05'
  },
  {
    id: 'user-rohan',
    name: 'Rohan Deshmukh',
    email: 'rdeshmukh.me@nitrr.ac.in',
    role: 'student',
    affiliationStatus: 'email_verified',
    institution: 'National Institute of Technology Raipur',
    department: 'Mechanical Engineering',
    batch: 'Class of 2027',
    isAlumni: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    headline: 'Drone Robotics & CFD Simulations Enthusiast',
    bio: 'Building autonomous quadcopters for environmental telemetry. Looking for collaborators skilled in computer vision and ROS2.',
    location: 'Raipur, India',
    skills: ['SolidWorks', 'ROS2', 'PX4 Autopilot', 'MATLAB', 'C++', 'CFD'],
    links: {
      github: 'https://github.com/rohan-deshmukh'
    },
    profileVisibility: 'public',
    certificationStatus: 'rejected',
    certificationCooldownUntil: '2026-11-15T00:00:00Z',
    streakEnabled: true,
    currentStreak: 5,
    longestStreak: 14,
    followersCount: 88,
    followingCount: 72,
    joinedDate: '2024-08-20'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'AeroSurv: Autonomous Drone for Open-Cast Mine Surveillance',
    slug: 'aerosurv-drone-surveillance',
    tagline: 'Edge AI UAV platform for real-time volumetric mapping and safety perimeter tracking in open-cast coal mines.',
    description: `AeroSurv is a custom autonomous drone system designed for harsh industrial mining environments in Central India. Built in collaboration with mining engineers, the vehicle combines high-precision RTK GPS, LiDAR, and on-board NVIDIA Jetson Orin Nano compute.

### Key Innovations
- **Real-Time Point Cloud Generation**: 3D surface topological analysis performed onboard without active cloud connectivity.
- **Slope Stability & Rockfall Detection**: Computer vision inference detects cracks and loose boulder displacements in overburden benches.
- **Fail-Safe Geo-Fencing**: Automated RTL (Return to Launch) upon RF jamming or hazardous meteorological spikes.`,
    category: 'Hardware/IoT',
    techStack: ['PX4 Autopilot', 'ROS2', 'NVIDIA Jetson', 'PyTorch', 'C++', 'OpenCV', 'React Dashboard'],
    ownerId: 'user-aditya',
    status: 'in-progress',
    visibility: 'public',
    members: [
      { userId: 'user-aditya', role: 'owner', status: 'accepted', invitedAt: '2025-02-01' },
      { userId: 'user-rohan', role: 'editor', status: 'accepted', invitedAt: '2025-02-10', acceptedAt: '2025-02-11' },
      { userId: 'user-ananya', role: 'contributor', status: 'pending', invitedAt: '2026-03-01' }
    ],
    milestones: [
      { id: 'm1', title: 'Carbon-fiber quad-frame assembly & motor calibration', completed: true, completedAt: '2025-04-10' },
      { id: 'm2', title: 'Jetson Orin Nano hardware integration & power-distribution bus', completed: true, completedAt: '2025-07-22' },
      { id: 'm3', title: 'Real-time rockfall defect detection YOLOv8 model benchmark (Target > 25 FPS)', completed: false, dueDate: '2026-04-30' },
      { id: 'm4', title: 'Field trial at SECL Korba open-cast mining pit', completed: false, dueDate: '2026-06-15' }
    ],
    repoUrl: 'https://github.com/nitrr-icell/aerosurv-drone',
    demoUrl: 'https://aerosurv-demo.nitrr.ac.in',
    videoUrl: 'https://youtube.com/watch?v=example-drone-test',
    coverImage: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2026-03-15T14:20:00Z'
  },
  {
    id: 'proj-2',
    title: 'KisanDrishti: Offline Edge-AI Crop Pathogen Diagnosis',
    slug: 'kisandrishti-crop-ai',
    tagline: 'Multilingual mobile application with offline neural network quantized inference for detecting 40+ paddy & vegetable diseases.',
    description: `Designed for rural farmers in Chhattisgarh with zero connectivity. KisanDrishti operates completely on-device using a lightweight quantized MobileNetV4 backbone.

### Highlights
- Runs in less than 35MB RAM on ultra-budget Android phones.
- Provides vernacular audio guidance in Chhattisgarhi, Hindi, and Gondi.
- Integrated fertilizer dosage calculator to prevent nitrate toxicity.`,
    category: 'AI/ML',
    techStack: ['TensorFlow Lite', 'Flutter', 'Python', 'FastAPI', 'ONNX Runtime', 'SQLite'],
    ownerId: 'user-ananya',
    status: 'completed',
    visibility: 'public',
    members: [
      { userId: 'user-ananya', role: 'owner', status: 'accepted', invitedAt: '2024-09-01' },
      { userId: 'user-aditya', role: 'contributor', status: 'accepted', invitedAt: '2024-10-15', acceptedAt: '2024-10-16' }
    ],
    milestones: [
      { id: 'kd-1', title: 'Curate dataset of 12,000 paddy leaf blight images in Durg district', completed: true, completedAt: '2024-11-20' },
      { id: 'kd-2', title: 'Model INT8 quantization & latency profiling on MediaTek Helio chips', completed: true, completedAt: '2025-01-15' },
      { id: 'kd-3', title: 'State Krishi Mela pilot testing with 250 farmers', completed: true, completedAt: '2025-03-05' }
    ],
    repoUrl: 'https://github.com/nitrr-icell/kisandrishti-mobile',
    demoUrl: 'https://kisandrishti.app',
    coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    createdAt: '2024-09-01T11:00:00Z',
    updatedAt: '2025-03-10T16:45:00Z',
    completedAt: '2025-03-10T16:45:00Z'
  },
  {
    id: 'proj-3',
    title: 'PulseGrid: IoT Smart Microgrid Telemetry & Load Balancer',
    slug: 'pulsegrid-smart-microgrid',
    tagline: 'Decentralized energy distribution telemetry unit for hybrid solar-diesel microgrids on educational campuses.',
    description: `PulseGrid continuously polls high-voltage solar inverters and diesel backup generators to balance peak load during laboratory operating hours.`,
    category: 'CleanTech',
    techStack: ['ESP32', 'FreeRTOS', 'Modbus TCP', 'Rust', 'TimescaleDB', 'Grafana', 'Next.js'],
    ownerId: 'user-vikram',
    status: 'completed',
    visibility: 'public',
    members: [
      { userId: 'user-vikram', role: 'owner', status: 'accepted', invitedAt: '2023-11-01' }
    ],
    milestones: [
      { id: 'pg-1', title: 'Circuit layout & PCB fabrication at NIT Raipur FabLab', completed: true, completedAt: '2024-01-20' },
      { id: 'pg-2', title: 'Deployment at EEE Department rooftop solar array', completed: true, completedAt: '2024-04-18' }
    ],
    repoUrl: 'https://github.com/vikram-m/pulsegrid-telemetry',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2024-04-20T12:00:00Z',
    completedAt: '2024-04-20T12:00:00Z'
  },
  {
    id: 'proj-4',
    title: 'NeuroSynthetix: Low-Cost 8-Channel EEG Brain-Computer Interface',
    slug: 'neurosynthetix-bci-prototype',
    tagline: 'Accessible assistive technology prototype translating motor-imagery brainwaves into wheelchair navigation commands.',
    description: `A research initiative in biomedical instrumentation combining dry active electrodes and open-source bio-amplifiers to deliver sub-100ms classification latency.`,
    category: 'Biotech',
    techStack: ['Python', 'SciPy', 'OpenBCI', 'PyTorch', 'STM32', 'Bluetooth LE', 'Signal Processing'],
    ownerId: 'user-aditya',
    status: 'idea',
    visibility: 'public',
    members: [
      { userId: 'user-aditya', role: 'owner', status: 'accepted', invitedAt: '2026-01-10' },
      { userId: 'user-ananya', role: 'editor', status: 'accepted', invitedAt: '2026-01-15' }
    ],
    milestones: [
      { id: 'ns-1', title: 'Analog front-end instrumentation amplifier testing', completed: false, dueDate: '2026-05-10' },
      { id: 'ns-2', title: 'EEG feature extraction pipeline (CSP + Filter Bank)', completed: false, dueDate: '2026-06-30' }
    ],
    repoUrl: 'https://github.com/nitrr-icell/neurosynthetix',
    coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-01-10T15:30:00Z',
    updatedAt: '2026-02-28T09:15:00Z'
  },
  {
    id: 'proj-5',
    title: 'Stealth Stealth Project (Confidential Patent Exploration)',
    slug: 'stealth-quantum-sensor',
    tagline: 'Private R&D project exploring quantum magnetometers for geological subsurface analysis.',
    description: 'This is a strictly private project verifying SRS BR-02/BR-05/FR-PROJ-08: private projects are strictly hidden from unauthorized visitors even if the profile is public.',
    category: 'Hardware/IoT',
    techStack: ['Quantum Physics', 'LabVIEW', 'Python'],
    ownerId: 'user-aditya',
    status: 'draft',
    visibility: 'private',
    members: [
      { userId: 'user-aditya', role: 'owner', status: 'accepted', invitedAt: '2026-02-01' }
    ],
    milestones: [],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z'
  }
];

export const INITIAL_UPDATES: ProgressUpdate[] = [
  {
    id: 'upd-1',
    projectId: 'proj-1',
    authorId: 'user-aditya',
    title: 'LiDAR Sensor Benchmarking & ROS2 PointCloud2 Node Integration',
    content: `Milestone achieved! We successfully calibrated the Livox Mid-360 LiDAR mounted onto the AeroSurv airframe.
By optimizing the custom C++ ROS2 pipeline, we lowered point cloud registration latency to 18ms on Jetson Orin Nano.
Testing with synthetic dust occlusion showed 94.2% feature retention! Huge shoutout to @rohan-deshmukh for designing the vibration-damped 3D TPU gimbal mount.`,
    tags: ['ROS2', 'LiDAR', 'Robotics', 'Jetson', 'Telemetry'],
    mediaUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-03-12T11:45:00Z',
    reactions: {
      'user-ananya': 'celebrate',
      'user-vikram': 'insightful',
      'user-rajesh': 'inspiring'
    },
    commentsCount: 3
  },
  {
    id: 'upd-2',
    projectId: 'proj-1',
    authorId: 'user-rohan',
    title: 'Field Wind-Tunnel Stress Analysis of the Dual-Bladed Propellers',
    content: `Completed torsional stress profiling in our mechanical engineering fluids lab.
At 12 m/s sustained crosswinds, maximum displacement stayed under 1.4mm. We are locking the CAD spec for carbon-infused nylon SLS 3D printing.`,
    tags: ['CFD', 'Aerodynamics', 'Hardware'],
    createdAt: '2026-03-05T09:15:00Z',
    reactions: {
      'user-aditya': 'like'
    },
    commentsCount: 1
  },
  {
    id: 'upd-3',
    projectId: 'proj-2',
    authorId: 'user-ananya',
    title: 'KisanDrishti Published! 40,000+ Leaf Scans Diagnostic Accuracy Surpassed 97.4%',
    content: `Thrilled to announce that the final pilot evaluation of KisanDrishti has concluded across 14 Gram Panchayats in Chhattisgarh!
With offline INT8 quantization, the mobile app reliably diagnoses early-stage bacterial leaf blight in under 800 milliseconds on a ₹7,000 smartphone.
Gratitude to Dr. Rajesh Kumar Verma for mentoring the patent filing process.`,
    tags: ['EdgeAI', 'Impact', 'Agriculture', 'NITRaipur'],
    mediaUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    createdAt: '2025-03-08T18:20:00Z',
    reactions: {
      'user-aditya': 'inspiring',
      'user-vikram': 'celebrate',
      'user-rajesh': 'celebrate',
      'user-priya': 'like'
    },
    commentsCount: 4
  }
];

export const INITIAL_POSTS: StandalonePost[] = [
  {
    id: 'post-1',
    authorId: 'user-aditya',
    content: `🚀 Proud to present the new Software Requirements Specification (SRS v0.1) for the NIT Raipur Innovation Cell Student Portfolio Platform!

The goal is simple yet impactful: create an open, auditable, and certified technical ecosystem where student researchers, developers, and hardware builders can showcase verified project milestones rather than resume bullet points.

Key pillars we are strictly enforcing in the architecture:
1. Strict person-level profile certification with 4-eyes approval governance.
2. Independent project vs profile visibility boundaries.
3. Activity heatmaps that honor student privacy without leaking private repositories.

Let us know your thoughts below! #NITRaipur #Innovation #OpenSource #TechCulture`,
    tags: ['InnovationCell', 'Architecture', 'StudentMakers', 'OpenSource'],
    createdAt: '2026-03-14T08:00:00Z',
    reactions: {
      'user-ananya': 'insightful',
      'user-vikram': 'like',
      'user-rajesh': 'inspiring',
      'user-priya': 'like'
    },
    commentsCount: 3
  },
  {
    id: 'post-2',
    authorId: 'user-vikram',
    content: `Advice for pre-final year engineering students at NIT Raipur:
Do not build another generic clone of Netflix or Spotify for your final-year major project.
Solve a domain problem from Central India: mining telemetry, rural supply-chains, solar micro-inverters, or local crop pathology. Those are the projects that will get you noticed by top engineering teams and research labs worldwide! 💡`,
    tags: ['EngineeringAdvice', 'Career', 'Innovation', 'NITRRAlumni'],
    createdAt: '2026-03-10T14:30:00Z',
    reactions: {
      'user-aditya': 'inspiring',
      'user-ananya': 'like',
      'user-rohan': 'like'
    },
    commentsCount: 2
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  // Comments on post-1 (Demonstrating 3-Level Nesting per SRS FR-SOC-05 & BR-07)
  {
    id: 'c-1',
    targetType: 'post',
    targetId: 'post-1',
    authorId: 'user-rajesh',
    content: 'Excellent initiative Aditya and team. The person-level certification workflow ensures authentic claims while keeping the governance audit log transparent for the institute council.',
    level: 1,
    createdAt: '2026-03-14T08:45:00Z'
  },
  {
    id: 'c-2',
    targetType: 'post',
    targetId: 'post-1',
    authorId: 'user-aditya',
    content: 'Thank you Sir! We have also added the 30-day cooldown period and self-approval block so reviewers cannot certify their own applications.',
    parentId: 'c-1',
    level: 2,
    createdAt: '2026-03-14T09:10:00Z'
  },
  {
    id: 'c-3',
    targetType: 'post',
    targetId: 'post-1',
    authorId: 'user-ananya',
    content: 'This level of detail is exactly what makes the platform credible to prospective tech recruiters.',
    parentId: 'c-2',
    level: 3, // Max depth!
    createdAt: '2026-03-14T09:40:00Z'
  },

  // Comments on update upd-1
  {
    id: 'c-4',
    targetType: 'update',
    targetId: 'upd-1',
    authorId: 'user-vikram',
    content: 'Impressive 18ms latency! Are you running Point-to-Plane ICP or NDT matching for the odometry estimation?',
    level: 1,
    createdAt: '2026-03-12T13:20:00Z'
  },
  {
    id: 'c-5',
    targetType: 'update',
    targetId: 'upd-1',
    authorId: 'user-aditya',
    content: 'We implemented a multi-threaded FAST-LIO2 variant on CUDA cores, which keeps drift under 0.8% over a 1km mining traverse.',
    parentId: 'c-4',
    level: 2,
    createdAt: '2026-03-12T14:05:00Z'
  }
];

export const INITIAL_CERTIFICATION_REQUESTS: CertificationRequest[] = [
  {
    id: 'cert-req-ananya',
    applicantId: 'user-ananya',
    submittedAt: '2026-03-10T12:00:00Z',
    state: 'pending',
    studentRollNumber: '23118021',
    statement: 'Requesting I-Cell profile certification for Edge-AI & Computer Vision research. Lead developer of KisanDrishti (State Winner 2025) and published IEEE student conference paper.',
    portfolioLinks: [
      'https://github.com/nitrr-icell/kisandrishti-mobile',
      'https://ieeexplore.ieee.org/document/example-paper',
      'https://devfolio.co/@ananyasharma'
    ],
    evidenceNotes: 'Roll No: 23118021 verified via MIS portal. Project code repository tested. Mentored by Dr. Rajesh Kumar Verma.',
    profileSnapshotDate: '2026-03-10'
  },
  {
    id: 'cert-req-aditya',
    applicantId: 'user-aditya',
    submittedAt: '2025-11-10T10:00:00Z',
    state: 'approved',
    studentRollNumber: '22115014',
    statement: 'Core Coordinator application for Technical Domain. Contributions in distributed systems, AeroSurv autonomous mine drone, and institutional open-source leadership.',
    portfolioLinks: [
      'https://github.com/adityasahu',
      'https://adityasahu.dev'
    ],
    evidenceNotes: 'Verified identity and credentials. Active contributions recognized by Innovation Cell advisory committee.',
    profileSnapshotDate: '2025-11-10',
    reviewerId: 'user-rajesh',
    decidedAt: '2025-11-15T10:00:00Z',
    decisionReason: 'Verified exemplary student leadership and proven technical artifact delivery.',
    serialNumber: 'NITRR-ICELL-2025-001'
  },
  {
    id: 'cert-req-rohan',
    applicantId: 'user-rohan',
    submittedAt: '2026-02-10T14:00:00Z',
    state: 'rejected',
    studentRollNumber: '24116035',
    statement: 'Application based on mechanical drone chassis CAD work.',
    portfolioLinks: ['https://github.com/rohan-deshmukh'],
    evidenceNotes: 'Insufficient public project verification links. Profile bio and resume missing at time of submission.',
    profileSnapshotDate: '2026-02-10',
    reviewerId: 'user-rajesh',
    decidedAt: '2026-02-15T16:00:00Z',
    decisionReason: 'Please attach official project reports and complete your technical resume before resubmitting. 30-day cooldown active per SRS FR-CERT-07.',
    rejectionCooldownUntil: '2026-03-17T00:00:00Z'
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    reporterId: 'user-rohan',
    targetType: 'post',
    targetId: 'post-sample-spam',
    reason: 'spam',
    notes: 'Commercial cryptocurrency promotion disguised as a final year blockchain project.',
    createdAt: '2026-03-13T10:00:00Z',
    status: 'pending'
  },
  {
    id: 'rep-2',
    reporterId: 'user-ananya',
    targetType: 'project',
    targetId: 'proj-plagiarism-sample',
    reason: 'plagiarism',
    notes: 'Direct fork of an existing GitHub repo without licensing or original student contribution.',
    createdAt: '2026-03-11T16:30:00Z',
    status: 'pending'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientId: 'user-aditya',
    category: 'mention',
    title: 'New Mention',
    message: 'Ananya Sharma mentioned you in a comment on "AeroSurv: Autonomous Drone for Mine Surveillance"',
    createdAt: '2026-03-14T09:40:00Z',
    read: false,
    actor: {
      id: 'user-ananya',
      name: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
    }
  },
  {
    id: 'notif-2',
    recipientId: 'user-aditya',
    category: 'collaboration',
    title: 'Project Invitation Response',
    message: 'Rohan Deshmukh accepted your invitation to join AeroSurv as an Editor.',
    createdAt: '2026-03-11T12:00:00Z',
    read: true,
    actor: {
      id: 'user-rohan',
      name: 'Rohan Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
    }
  },
  {
    id: 'notif-3',
    recipientId: 'user-aditya',
    category: 'certification',
    title: 'Certification Review Required',
    message: 'Ananya Sharma submitted a profile certification request awaiting your review.',
    createdAt: '2026-03-10T12:00:00Z',
    read: false,
    actor: {
      id: 'user-ananya',
      name: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
    }
  },
  {
    id: 'notif-4',
    recipientId: 'user-aditya',
    category: 'reaction',
    title: 'Reaction to your post',
    message: 'Dr. Rajesh Kumar Verma reacted "Inspiring" to your SRS v0.1 release update.',
    createdAt: '2026-03-14T08:30:00Z',
    read: true,
    actor: {
      id: 'user-rajesh',
      name: 'Dr. Rajesh Kumar Verma',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    actorId: 'user-rajesh',
    actorName: 'Dr. Rajesh Kumar Verma',
    action: 'CERTIFICATION_APPROVED',
    targetType: 'User',
    targetId: 'user-aditya',
    timestamp: '2025-11-15T10:00:00Z',
    details: 'Awarded official I-Cell Student Certification Serial NITRR-ICELL-2025-001.'
  },
  {
    id: 'audit-2',
    actorId: 'user-rajesh',
    actorName: 'Dr. Rajesh Kumar Verma',
    action: 'CERTIFICATION_REJECTED',
    targetType: 'User',
    targetId: 'user-rohan',
    timestamp: '2026-02-15T16:00:00Z',
    details: 'Application rejected due to incomplete public verification proofs. 30-day cooldown applied.'
  }
];

// Generates 365 days of realistic activity counts for the GitHub-style contribution heatmap
export const generateActivityData = (baselineIso: string = '2026-03-15T00:00:00Z') => {
  const data: { [key: string]: number } = {};
  const today = new Date(baselineIso);
  
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    
    // Deterministic pseudo-random calculation
    const seed = ((i * 37 + 13) % 100) / 100;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    if (seed > 0.45) {
      data[key] = isWeekend ? ((i % 4) + 1) : ((i % 8) + 1);
    } else {
      data[key] = 0;
    }
  }
  
  // Make recent days active
  for (let i = 0; i < 15; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    data[key] = (i % 5) + 2;
  }

  return data;
};
