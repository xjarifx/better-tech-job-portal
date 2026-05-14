export interface TagGroup {
  label: string
  key: string
  tags: string[]
}

export const tagGroups: TagGroup[] = [
  {
    label: 'Role',
    key: 'role',
    tags: [
      'AI/ML',
      'Frontend',
      'Backend',
      'Full Stack',
      'DevOps',
      'Data',
      'Mobile',
      'Security',
      'Design',
      'Product',
      'Hardware',
      'Research',
      'QA',
      'Robotics',
      'AR/VR',
    ],
  },
  {
    label: 'Location',
    key: 'location',
    tags: ['Remote', 'On-site', 'Hybrid', 'US Only', 'Global', 'EU'],
  },
  {
    label: 'Stage',
    key: 'stage',
    tags: ['Startup', 'Mid-size', 'Big Tech', 'Public'],
  },
  {
    label: 'Industry',
    key: 'industry',
    tags: [
      'Fintech',
      'Health',
      'Gaming',
      'E-commerce',
      'Social',
      'SaaS',
      'Infrastructure',
      'Security',
      'Biotech',
      'EdTech',
      'Climate',
      'Media',
      'Enterprise',
      'Telecom',
      'Consulting',
      'Portal',
      'Defense',
      'Energy',
      'Web3',
      'Creator Economy',
      'Freelance',
      'General',
      'Developer',
      'Diversity',
      'Publishing',
      'Entertainment',
      'Creative',
      'Education',
    ],
  },
  {
    label: 'Program',
    key: 'program',
    tags: ['Internship', 'New Grad', 'Visa Sponsorship', 'Relocation'],
  },
]

export const tagToGroup: Record<string, string> = {}
for (const group of tagGroups) {
  for (const tag of group.tags) {
    tagToGroup[tag] = group.key
  }
}

export const validTags = new Set(Object.keys(tagToGroup))

export function validateTags(tags: string[]): string[] {
  return tags.filter((t) => !validTags.has(t))
}
