// ═══════════════════════════════════════════════════════
// PULSE — Mock Data
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
  },
  {
    id: 'brightpath',
    name: 'Bright Path Consulting',
    theme: 'theme-brightpath',
    logo: 'BP',
    tagline: 'Clarity in every decision.',
    departments: ['Strategy', 'Technology', 'Finance', 'HR', 'Client Relations'],
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
  },
];

export const parameters = [
  { id: 'ownership',      label: 'Ownership',       iconName: 'Target',
    tip: 'Mention one specific example. It makes a bigger impact.' },
  { id: 'communication',  label: 'Communication',    iconName: 'MessageSquare',
    tip: 'Mention one recent meeting or presentation moment.' },
  { id: 'quality',        label: 'Quality of Work',  iconName: 'Zap',
    tip: 'Highlight one specific deliverable or output they owned.' },
  { id: 'collaboration',  label: 'Collaboration',    iconName: 'Users',
    tip: 'Think about a moment they actively supported the team.' },
  { id: 'initiative',     label: 'Initiative',       iconName: 'Rocket',
    tip: 'Mention one time they went beyond what was asked of them.' },
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
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Rahul consistently takes ownership and ensures things get done. Great initiative!' },
      { parameterId: 'communication', score: 0, comment: '' },
      { parameterId: 'quality',       score: 0, comment: '' },
      { parameterId: 'collaboration', score: 0, comment: '' },
      { parameterId: 'initiative',    score: 0, comment: '' },
    ],
    dueDate: '2024-07-31',
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
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Excellent ownership during the client delivery. Stepped up without being asked.' },
      { parameterId: 'communication', score: 5, comment: 'Excellent communication and collaboration with the entire team this month.' },
      { parameterId: 'quality',       score: 4, comment: 'Designs were polished and ready ahead of deadline. Strong attention to detail.' },
      { parameterId: 'collaboration', score: 4, comment: 'Worked seamlessly with engineering to resolve handoff issues early.' },
      { parameterId: 'initiative',    score: 3, comment: 'Good progress. Could proactively suggest ideas in sprint planning.' },
    ],
    overallScore: 4.0,
    dueDate: '2024-06-30',
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
    dimensions: [
      { parameterId: 'ownership',     score: 4, comment: 'Showed great ownership in the product redesign sprint.' },
      { parameterId: 'communication', score: 4, comment: 'Communicated clearly in stand-ups. Room to improve async writing.' },
      { parameterId: 'quality',       score: 3, comment: 'Some deliverables needed extra revision rounds. Getting better.' },
      { parameterId: 'collaboration', score: 4, comment: 'Good team player throughout the sprint.' },
      { parameterId: 'initiative',    score: 3, comment: 'Waiting to be asked rather than proactively raising issues.' },
    ],
    overallScore: 3.6,
    dueDate: '2024-05-31',
  },
  // Arjun — July (pending)
  {
    id: 'ev4',
    companyId: 'ashoka',
    employeeId: 'u5',
    managerId: 'u2',
    month: 'July',
    year: 2024,
    status: 'pending',
    dimensions: [],
    dueDate: '2024-07-31',
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
    dimensions: [
      { parameterId: 'ownership',     score: 5, comment: 'Sneha drives every project with a strong sense of ownership. Sets the bar.' },
      { parameterId: 'communication', score: 5, comment: 'Excellent communication. Always clear and constructive in feedback sessions.' },
      { parameterId: 'quality',       score: 5, comment: 'Design quality is consistently outstanding. Zero revisions needed this month.' },
      { parameterId: 'collaboration', score: 4, comment: 'Works beautifully with cross-functional teams.' },
      { parameterId: 'initiative',    score: 5, comment: 'Initiated the new design system without being prompted. Massive value-add.' },
    ],
    overallScore: 4.8,
    dueDate: '2024-07-31',
  },
  // Sampath — multiple months
  {
    id: 'ev6',
    companyId: 'ashoka',
    employeeId: 'u7',
    managerId: 'u2',
    month: 'June',
    year: 2024,
    status: 'locked',
    dimensions: [
      { parameterId: 'ownership',     score: 5, comment: 'Outstanding ownership on the new dashboard feature. Shipped on time.' },
      { parameterId: 'communication', score: 4, comment: 'Clear communicator. Async notes are detailed and helpful.' },
      { parameterId: 'quality',       score: 4, comment: 'Code quality improved significantly after the refactor sprint.' },
      { parameterId: 'collaboration', score: 5, comment: 'Helped two junior developers debug critical issues last week.' },
      { parameterId: 'initiative',    score: 4, comment: 'Proposed a performance optimization that saved 30% load time.' },
    ],
    overallScore: 4.4,
    dueDate: '2024-06-30',
  },
];

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
    { month: 'Apr', score: 3.5 },
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
  { id: 'n1', type: 'warning', message: "Rahul's conversation is due today.", time: '2h ago', read: false },
  { id: 'n2', type: 'info',    message: 'Sneha shared her July conversation.', time: '5h ago', read: false },
  { id: 'n3', type: 'success', message: "Arjun's conversation is complete.", time: '1d ago', read: true },
  { id: 'n4', type: 'warning', message: 'Ananya has 3 pending conversations.', time: '2d ago', read: true },
];

export const departmentProgress = {
  ashoka: [
    { name: 'Design',      progress: 90 },
    { name: 'Engineering', progress: 76 },
    { name: 'Marketing',   progress: 85 },
    { name: 'Sales',       progress: 75 },
    { name: 'Operations',  progress: 80 },
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

// Helper to get user by id
export const getUserById = (id) => users.find(u => u.id === id);
export const getCompanyById = (id) => companies.find(c => c.id === id);
export const getUsersByCompany = (companyId) => users.filter(u => u.companyId === companyId);
export const getTeamByManager = (managerId) => users.filter(u => u.managerId === managerId);
