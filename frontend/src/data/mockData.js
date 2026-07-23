// ═══════════════════════════════════════════════════════
// PULSE — Mock Data (Expanded)
// Realistic multi-tenant data for 2 companies
// ═══════════════════════════════════════════════════════

export const companies = [
  {
    id: 'ashoka',
    name: 'Ashoka Textiles',
    theme: 'theme-ashoka',
    logo: 'AT',
    tagline: 'Crafting futures, thread by thread.',
    departments: ['Design', 'Engineering', 'Marketing', 'Sales', 'Operations'],
    size: 42,
    managerCount: 5,
    hrCount: 2,
    founded: '2018',
    industry: 'Textiles & Fashion',
    completionRate: 82,
  },
  {
    id: 'brightpath',
    name: 'Bright Path Consulting',
    theme: 'theme-brightpath',
    logo: 'BP',
    tagline: 'Clarity in every decision.',
    departments: ['Strategy', 'Technology', 'Finance', 'HR', 'Client Relations'],
    size: 28,
    managerCount: 3,
    hrCount: 1,
    founded: '2019',
    industry: 'Management Consulting',
    completionRate: 91,
  },
];

export const users = [
  // ── Ashoka Textiles ──
  {
    id: 'u1',
    companyId: 'ashoka',
    name: 'Priya Sharma',
    title: 'Founder & CEO',
    email: 'priya@ashoka.com',
    avatar: null,
    initials: 'PS',
    roles: ['hr', 'admin'],
    managerId: null,
    departmentId: 'Design',
    joinDate: '2020-01-15',
    lastPromoDate: '2022-01-15',
    yearsAtCompany: 4,
  },
  {
    id: 'u2',
    companyId: 'ashoka',
    name: 'Rohan Menon',
    title: 'Engineering Lead',
    email: 'rohan@ashoka.com',
    avatar: null,
    initials: 'RM',
    roles: ['manager', 'employee'],
    managerId: 'u1',
    departmentId: 'Engineering',
    joinDate: '2021-03-10',
    lastPromoDate: '2023-03-10',
    yearsAtCompany: 3,
  },
  {
    id: 'u3',
    companyId: 'ashoka',
    name: 'Sneha Iyer',
    title: 'Design Lead',
    email: 'sneha@ashoka.com',
    avatar: null,
    initials: 'SI',
    roles: ['manager', 'employee'],
    managerId: 'u1',
    departmentId: 'Design',
    joinDate: '2021-06-01',
    lastPromoDate: '2023-06-01',
    yearsAtCompany: 3,
  },
  {
    id: 'u4',
    companyId: 'ashoka',
    name: 'Rahul Verma',
    title: 'Product Designer',
    email: 'rahul@ashoka.com',
    avatar: null,
    initials: 'RV',
    roles: ['employee'],
    managerId: 'u3',
    departmentId: 'Design',
    joinDate: '2022-02-14',
    lastPromoDate: null,
    yearsAtCompany: 2,
  },
  {
    id: 'u5',
    companyId: 'ashoka',
    name: 'Arjun Mehta',
    title: 'Backend Developer',
    email: 'arjun@ashoka.com',
    avatar: null,
    initials: 'AM',
    roles: ['employee'],
    managerId: 'u2',
    departmentId: 'Engineering',
    joinDate: '2022-08-22',
    lastPromoDate: null,
    yearsAtCompany: 2,
  },
  {
    id: 'u6',
    companyId: 'ashoka',
    name: 'Kavita Singh',
    title: 'Marketing Manager',
    email: 'kavita@ashoka.com',
    avatar: null,
    initials: 'KS',
    roles: ['manager', 'employee'],
    managerId: 'u1',
    departmentId: 'Marketing',
    joinDate: '2021-11-05',
    lastPromoDate: '2023-11-05',
    yearsAtCompany: 3,
  },
  {
    id: 'u7',
    companyId: 'ashoka',
    name: 'Sampath Kumar',
    title: 'Frontend Developer',
    email: 'sampath@ashoka.com',
    avatar: null,
    initials: 'SK',
    roles: ['employee'],
    managerId: 'u2',
    departmentId: 'Engineering',
    joinDate: '2023-01-09',
    lastPromoDate: null,
    yearsAtCompany: 1,
    isNewJoiner: true,
  },
  {
    id: 'u8',
    companyId: 'ashoka',
    name: 'Ananya Rao',
    title: 'Sales Executive',
    email: 'ananya@ashoka.com',
    avatar: null,
    initials: 'AR',
    roles: ['employee'],
    managerId: 'u6',
    departmentId: 'Sales',
    joinDate: '2023-04-17',
    lastPromoDate: null,
    yearsAtCompany: 1,
  },
  // ── Bright Path Consulting ──
  {
    id: 'b1',
    companyId: 'brightpath',
    name: 'Vivek Nair',
    title: 'Managing Director',
    email: 'vivek@brightpath.com',
    avatar: null,
    initials: 'VN',
    roles: ['hr', 'admin'],
    managerId: null,
    departmentId: 'Strategy',
    joinDate: '2019-06-01',
    lastPromoDate: '2021-06-01',
    yearsAtCompany: 5,
  },
  {
    id: 'b2',
    companyId: 'brightpath',
    name: 'Divya Krishnan',
    title: 'Technology Head',
    email: 'divya@brightpath.com',
    avatar: null,
    initials: 'DK',
    roles: ['manager', 'employee'],
    managerId: 'b1',
    departmentId: 'Technology',
    joinDate: '2020-09-14',
    lastPromoDate: '2022-09-14',
    yearsAtCompany: 4,
  },
];

export const parameters = [
  {
    id: 'ownership',
    label: 'Ownership',
    iconName: 'Target',
    tip: 'Mention one specific example. It makes a bigger impact.',
    description: 'Taking responsibility for outcomes, following through on commitments, and holding yourself accountable.',
    scoreLabels: ['No ownership shown', 'Rarely takes initiative', 'Meets expectations', 'Strong ownership', 'Exceptional — sets the standard'],
    examples: [
      'Took full responsibility for the API migration without needing reminders.',
      'Fixed a production bug over the weekend without being asked.',
      'Flagged risks early in the sprint instead of waiting for the retro.',
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    iconName: 'MessageSquare',
    tip: 'Mention one recent meeting or presentation moment.',
    description: 'Clarity, frequency, and quality of communication — written, verbal, and async.',
    scoreLabels: ['Very unclear or missing', 'Needs improvement', 'Communicates adequately', 'Clear and proactive', 'Outstanding — models best practices'],
    examples: [
      'Async updates in Slack were always clear and actionable.',
      'Presented the Q2 roadmap without needing slides — just drew it out clearly.',
      'Kept stakeholders informed about timeline changes before they needed to ask.',
    ],
  },
  {
    id: 'quality',
    label: 'Quality of Work',
    iconName: 'Zap',
    tip: 'Highlight one specific deliverable or output they owned.',
    description: 'Accuracy, craft, attention to detail, and the standard they hold their own work to.',
    scoreLabels: ['Many errors and issues', 'Below expectations', 'Meets quality bar', 'Consistently high quality', 'Exceptional — raises the bar for everyone'],
    examples: [
      'Zero bugs on the component library release — thoroughly tested.',
      'The landing page design was pixel-perfect on the first review.',
      'Documentation was thorough and self-sufficient — no follow-up questions.',
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    iconName: 'Users',
    tip: 'Think about a moment they actively supported the team.',
    description: 'How well they work with others, support colleagues, and contribute to team dynamics.',
    scoreLabels: ['Works in silos', 'Limited team engagement', 'Collaborates when asked', 'Strong team player', 'Creates a culture of collaboration'],
    examples: [
      'Unblocked two teammates by pair-programming for 3 hours.',
      'Gave thorough, constructive code reviews that improved team standards.',
      'Organized knowledge-sharing sessions that the whole team valued.',
    ],
  },
  {
    id: 'initiative',
    label: 'Initiative',
    iconName: 'Rocket',
    tip: 'Mention one time they went beyond what was asked of them.',
    description: 'Going beyond the defined role, identifying opportunities, and acting without being prompted.',
    scoreLabels: ['Waits to be told what to do', 'Rarely volunteers', 'Occasionally takes initiative', 'Proactively adds value', 'Drives change and innovation'],
    examples: [
      'Proposed and built a performance monitoring dashboard nobody asked for.',
      'Noticed a UX issue in user testing and redesigned the flow before handoff.',
      'Wrote a post-mortem doc after the outage that became the team template.',
    ],
  },
];

export const evaluations = [
  // Rahul — July (in progress, draft)
  {
    id: 'ev1',
    companyId: 'ashoka',
    employeeId: 'u4',
    managerId: 'u3',
    month: 'July',
    year: 2024,
    status: 'draft',
    dueDate: '2024-07-31',
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Rahul consistently takes ownership and ensures things get done. Great initiative on the design system update!' },
      { parameterId: 'communication', score: 0, comment: '' },
      { parameterId: 'quality',       score: 0, comment: '' },
      { parameterId: 'collaboration', score: 0, comment: '' },
      { parameterId: 'initiative',    score: 0, comment: '' },
    ],
  },
  // Rahul — June (completed)
  {
    id: 'ev2',
    companyId: 'ashoka',
    employeeId: 'u4',
    managerId: 'u3',
    month: 'June',
    year: 2024,
    status: 'locked',
    dueDate: '2024-06-30',
    overallScore: 4.0,
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Excellent ownership during the client delivery. Stepped up without being asked.' },
      { parameterId: 'communication', score: 5, comment: 'Excellent communication with the entire team this month. Kept everyone updated proactively.' },
      { parameterId: 'quality',       score: 4, comment: 'Designs were polished and ready ahead of deadline. Strong attention to detail.' },
      { parameterId: 'collaboration', score: 4, comment: 'Worked seamlessly with engineering to resolve handoff issues early.' },
      { parameterId: 'initiative',    score: 3, comment: 'Good progress. Could proactively suggest ideas in sprint planning.' },
    ],
  },
  // Rahul — May
  {
    id: 'ev3',
    companyId: 'ashoka',
    employeeId: 'u4',
    managerId: 'u3',
    month: 'May',
    year: 2024,
    status: 'locked',
    dueDate: '2024-05-31',
    overallScore: 3.6,
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Showed great ownership in the product redesign sprint.' },
      { parameterId: 'communication', score: 4, comment: 'Communicated clearly in stand-ups. Room to improve async writing.' },
      { parameterId: 'quality',       score: 3, comment: 'Some deliverables needed extra revision rounds. Getting better.' },
      { parameterId: 'collaboration', score: 4, comment: 'Good team player throughout the sprint.' },
      { parameterId: 'initiative',    score: 3, comment: 'Waiting to be asked rather than proactively raising issues.' },
    ],
  },
  // Rahul — April
  {
    id: 'ev3b',
    companyId: 'ashoka',
    employeeId: 'u4',
    managerId: 'u3',
    month: 'April',
    year: 2024,
    status: 'locked',
    dueDate: '2024-04-30',
    overallScore: 3.2,
    dimensions: [
      { parameterId: 'ownership',     score: 3, comment: 'Good ownership on the component library but dropped the ball on docs.' },
      { parameterId: 'communication', score: 4, comment: 'Clear in meetings. Async Slack messages are improving.' },
      { parameterId: 'quality',       score: 3, comment: 'Work quality was inconsistent. Some revisions needed.' },
      { parameterId: 'collaboration', score: 3, comment: 'Focused a bit too much on individual work. Could ask for help earlier.' },
      { parameterId: 'initiative',    score: 3, comment: 'Beginning to show initiative. Keep it up.' },
    ],
  },
  // Arjun — July (pending, not started)
  {
    id: 'ev4',
    companyId: 'ashoka',
    employeeId: 'u5',
    managerId: 'u2',
    month: 'July',
    year: 2024,
    status: 'pending',
    dueDate: '2024-07-31',
    dimensions: [],
  },
  // Sneha — July (completed)
  {
    id: 'ev5',
    companyId: 'ashoka',
    employeeId: 'u3',
    managerId: 'u1',
    month: 'July',
    year: 2024,
    status: 'submitted',
    dueDate: '2024-07-31',
    overallScore: 4.8,
    dimensions: [
      { parameterId: 'ownership',     score: 5, comment: 'Sneha drives every project with a strong sense of ownership. Sets the bar.' },
      { parameterId: 'communication', score: 5, comment: 'Excellent communication. Always clear and constructive in feedback sessions.' },
      { parameterId: 'quality',       score: 5, comment: 'Design quality is consistently outstanding. Zero revisions needed this month.' },
      { parameterId: 'collaboration', score: 4, comment: 'Works beautifully with cross-functional teams.' },
      { parameterId: 'initiative',    score: 5, comment: 'Initiated the new design system without being prompted. Massive value-add.' },
    ],
  },
  // Sampath — June
  {
    id: 'ev6',
    companyId: 'ashoka',
    employeeId: 'u7',
    managerId: 'u2',
    month: 'June',
    year: 2024,
    status: 'locked',
    dueDate: '2024-06-30',
    overallScore: 4.4,
    dimensions: [
      { parameterId: 'ownership',     score: 5, comment: 'Outstanding ownership on the new dashboard feature. Shipped on time.' },
      { parameterId: 'communication', score: 4, comment: 'Clear communicator. Async notes are detailed and helpful.' },
      { parameterId: 'quality',       score: 4, comment: 'Code quality improved significantly after the refactor sprint.' },
      { parameterId: 'collaboration', score: 5, comment: 'Helped two junior developers debug critical issues last week.' },
      { parameterId: 'initiative',    score: 4, comment: 'Proposed a performance optimization that saved 30% load time.' },
    ],
  },
  // Sampath — May
  {
    id: 'ev7',
    companyId: 'ashoka',
    employeeId: 'u7',
    managerId: 'u2',
    month: 'May',
    year: 2024,
    status: 'locked',
    dueDate: '2024-05-31',
    overallScore: 4.0,
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Took ownership of the auth refactor independently.' },
      { parameterId: 'communication', score: 4, comment: 'Good communication on blockers. Proactive with updates.' },
      { parameterId: 'quality',       score: 4, comment: 'Clean, readable code. Good test coverage.' },
      { parameterId: 'collaboration', score: 4, comment: 'Paired with Arjun on the API integration. Great teamwork.' },
      { parameterId: 'initiative',    score: 4, comment: 'Set up CI/CD pipeline improvements on own initiative.' },
    ],
  },
  // Ananya — July (overdue)
  {
    id: 'ev8',
    companyId: 'ashoka',
    employeeId: 'u8',
    managerId: 'u6',
    month: 'July',
    year: 2024,
    status: 'overdue',
    dueDate: '2024-07-25',
    dimensions: [],
  },
  // Kavita — July (submitted)
  {
    id: 'ev9',
    companyId: 'ashoka',
    employeeId: 'u6',
    managerId: 'u1',
    month: 'July',
    year: 2024,
    status: 'submitted',
    dueDate: '2024-07-31',
    overallScore: 4.3,
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Strong ownership on the campaign delivery despite timeline pressure.' },
      { parameterId: 'communication', score: 5, comment: 'Excellent stakeholder communication throughout. Always clear.' },
      { parameterId: 'quality',       score: 4, comment: 'Campaign quality was high. Results exceeded targets by 15%.' },
      { parameterId: 'collaboration', score: 4, comment: 'Great cross-functional work with the design team.' },
      { parameterId: 'initiative',    score: 4, comment: 'Proactively identified new channel opportunities for Q4.' },
    ],
  },
];

export const selfReflections = {
  u4: {
    month: 'July',
    year: 2024,
    submitted: true,
    submittedAt: '2024-07-20',
    wins: 'Completed the mobile component library rewrite. Unblocked the engineering team on the button inconsistency issue. Led the design review for the new onboarding flow.',
    challenges: 'Still finding it hard to push back in cross-functional meetings when timelines are unrealistic. Need to work on this.',
    focusNextMonth: 'Get better at proactive communication. Share progress updates before being asked. Work on initiative in sprint planning.',
    selfScores: {
      ownership: 4,
      communication: 3,
      quality: 4,
      collaboration: 4,
      initiative: 3,
    },
  },
};

export const goals = {
  u4: [
    { id: 'g1', title: 'Complete mobile component library rewrite', category: 'Craft', progress: 100, dueDate: 'Jul 31', status: 'done' },
    { id: 'g2', title: 'Lead at least 2 design reviews independently', category: 'Leadership', progress: 100, dueDate: 'Jul 31', status: 'done' },
    { id: 'g3', title: 'Improve async communication — write 3 design docs', category: 'Communication', progress: 67, dueDate: 'Jul 31', status: 'in-progress' },
    { id: 'g4', title: 'Present work in next all-hands meeting', category: 'Visibility', progress: 0, dueDate: 'Aug 15', status: 'upcoming' },
  ],
  u7: [
    { id: 'g5', title: 'Reduce page load time by 20%', category: 'Performance', progress: 100, dueDate: 'Jun 30', status: 'done' },
    { id: 'g6', title: 'Write 3 technical RFCs for team review', category: 'Technical Writing', progress: 67, dueDate: 'Jul 31', status: 'in-progress' },
    { id: 'g7', title: 'Mentor Arjun on React patterns', category: 'Leadership', progress: 50, dueDate: 'Jul 31', status: 'in-progress' },
  ],
  u3: [
    { id: 'g8', title: 'Launch Design System v2.0', category: 'Craft', progress: 90, dueDate: 'Jul 31', status: 'in-progress' },
    { id: 'g9', title: 'Complete all 4 team monthly reviews on time', category: 'People', progress: 75, dueDate: 'Jul 31', status: 'in-progress' },
  ],
};

export const activityFeed = {
  u3: [
    { id: 'a1', type: 'review_submitted', actor: 'You', subject: 'Sneha Iyer', message: 'Submitted July review for Kavita Singh', time: '2h ago', icon: 'check' },
    { id: 'a2', type: 'review_pending', actor: 'System', subject: 'Rahul Verma', message: "Rahul's July review is due in 4 days", time: '5h ago', icon: 'clock' },
    { id: 'a3', type: 'self_reflection', actor: 'Rahul Verma', subject: null, message: 'Rahul submitted his self-reflection for July', time: '1d ago', icon: 'star' },
    { id: 'a4', type: 'review_submitted', actor: 'You', subject: 'Sneha Iyer', message: 'Submitted June review for Arjun Mehta', time: '2d ago', icon: 'check' },
  ],
};

export const growthHistory = {
  u7: [
    { month: 'Feb', score: 3.2 },
    { month: 'Mar', score: 3.5 },
    { month: 'Apr', score: 3.8 },
    { month: 'May', score: 4.0 },
    { month: 'Jun', score: 4.4 },
    { month: 'Jul', score: 4.5 },
  ],
  u4: [
    { month: 'Feb', score: 3.0 },
    { month: 'Mar', score: 3.2 },
    { month: 'Apr', score: 3.2 },
    { month: 'May', score: 3.6 },
    { month: 'Jun', score: 4.0 },
    { month: 'Jul', score: 4.2 },
  ],
};

export const orgTree = {
  ashoka: {
    id: 'u1',
    children: [
      {
        id: 'u2',
        children: [
          { id: 'u5', children: [] },
          { id: 'u7', children: [] },
        ],
      },
      {
        id: 'u3',
        children: [
          { id: 'u4', children: [] },
        ],
      },
      {
        id: 'u6',
        children: [
          { id: 'u8', children: [] },
        ],
      },
    ],
  },
};

export const notifications = [
  { id: 'n1', type: 'warning', message: "Rahul's July review is due in 4 days.", time: '2h ago', read: false, action: '/feedback/ev1' },
  { id: 'n2', type: 'info',    message: 'Rahul submitted his self-reflection for July.', time: '5h ago', read: false, action: '/feedback/ev1' },
  { id: 'n3', type: 'success', message: "Kavita's July review was submitted.", time: '1d ago', read: true, action: null },
  { id: 'n4', type: 'warning', message: "Ananya's review is overdue by 2 days.", time: '2d ago', read: false, action: null },
  { id: 'n5', type: 'info',    message: 'Sneha improved in Communication this month.', time: '3d ago', read: true, action: '/team' },
];

export const departmentProgress = {
  ashoka: [
    { name: 'Design',      progress: 90, avgScore: 4.5, members: 3 },
    { name: 'Engineering', progress: 76, avgScore: 4.2, members: 3 },
    { name: 'Marketing',   progress: 85, avgScore: 4.1, members: 2 },
    { name: 'Sales',       progress: 50, avgScore: 3.8, members: 2 },
    { name: 'Operations',  progress: 80, avgScore: 4.0, members: 1 },
  ],
};

export const managerInsights = {
  u3: {
    completionRate: 80,
    avgWordCount: 142,
    reviewsWithActionable: 4,
    totalReviews: 6,
    reviewsNeedingDetail: 2,
  },
};

export const topPerformers = {
  ashoka: [
    { userId: 'u3', name: 'Sneha Iyer', title: 'Design Lead', score: 4.8, trend: 'up' },
    { userId: 'u7', name: 'Sampath Kumar', title: 'Frontend Developer', score: 4.5, trend: 'up' },
    { userId: 'u6', name: 'Kavita Singh', title: 'Marketing Manager', score: 4.3, trend: 'stable' },
  ],
};

export const pendingManagers = {
  ashoka: [
    { managerId: 'u6', name: 'Kavita Singh', dept: 'Marketing', pending: 1, overdue: 1 },
    { managerId: 'u2', name: 'Rohan Menon', dept: 'Engineering', pending: 1, overdue: 0 },
  ],
};

export const recentActivity = {
  ashoka: [
    { type: 'submitted', actor: 'Sneha Iyer', subject: 'Kavita Singh', time: '2h ago' },
    { type: 'submitted', actor: 'Priya Sharma', subject: 'Sneha Iyer', time: '1d ago' },
    { type: 'overdue', actor: 'System', subject: 'Ananya Rao', time: '2d ago' },
    { type: 'draft', actor: 'Sneha Iyer', subject: 'Rahul Verma', time: '3d ago' },
  ],
};

export const completionTrend = {
  ashoka: [
    { month: 'Feb', rate: 70 },
    { month: 'Mar', rate: 75 },
    { month: 'Apr', rate: 68 },
    { month: 'May', rate: 80 },
    { month: 'Jun', rate: 85 },
    { month: 'Jul', rate: 82 },
  ],
};

// Helper functions
export const getUserById        = (id) => users.find(u => u.id === id);
export const getCompanyById     = (id) => companies.find(c => c.id === id);
export const getUsersByCompany  = (companyId) => users.filter(u => u.companyId === companyId);
export const getTeamByManager   = (managerId) => users.filter(u => u.managerId === managerId);
export const getEvalsByEmployee = (empId) => evaluations.filter(e => e.employeeId === empId && e.status === 'locked');
export const getLatestEval      = (empId) => {
  const locked = evaluations.filter(e => e.employeeId === empId && ['locked','submitted'].includes(e.status));
  return locked[0] || null;
};
