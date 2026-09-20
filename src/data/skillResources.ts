export interface SkillResource {
  label: string;
  url: string;
  type: 'docs' | 'course' | 'tutorial' | 'platform';
}

// Normalized lowercase key -> resources
export const SKILL_RESOURCES: Record<string, SkillResource[]> = {
  'python': [
    { label: 'Python Docs', url: 'https://docs.python.org/3/tutorial/', type: 'docs' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', type: 'course' },
  ],
  'javascript': [
    { label: 'MDN Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript', type: 'docs' },
    { label: 'javascript.info', url: 'https://javascript.info/', type: 'tutorial' },
  ],
  'typescript': [
    { label: 'TS Handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'docs' },
  ],
  'react': [
    { label: 'React Docs', url: 'https://react.dev/learn', type: 'docs' },
  ],
  'node.js': [
    { label: 'Node.js Docs', url: 'https://nodejs.org/en/learn', type: 'docs' },
  ],
  'fastapi': [
    { label: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/tutorial/', type: 'docs' },
  ],
  'django': [
    { label: 'Django Tutorial', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/', type: 'docs' },
  ],
  'sql': [
    { label: 'SQLBolt', url: 'https://sqlbolt.com/', type: 'tutorial' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/relational-database/', type: 'course' },
  ],
  'postgresql': [
    { label: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/current/tutorial.html', type: 'docs' },
  ],
  'docker': [
    { label: 'Docker Docs', url: 'https://docs.docker.com/get-started/', type: 'docs' },
  ],
  'git': [
    { label: 'Git Book', url: 'https://git-scm.com/book/en/v2', type: 'docs' },
  ],
  'pytorch': [
    { label: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'docs' },
  ],
  'tensorflow': [
    { label: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials', type: 'docs' },
  ],
  'scikit-learn': [
    { label: 'Scikit-Learn Docs', url: 'https://scikit-learn.org/stable/tutorial/', type: 'docs' },
  ],
  'machine learning': [
    { label: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'course' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/', type: 'course' },
  ],
  'power bi': [
    { label: 'MS Learn', url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', type: 'course' },
  ],
  'tableau': [
    { label: 'Tableau Learning', url: 'https://www.tableau.com/learn/training', type: 'platform' },
  ],
  'pandas': [
    { label: 'Pandas Docs', url: 'https://pandas.pydata.org/docs/getting_started/', type: 'docs' },
  ],
  'numpy': [
    { label: 'NumPy Quickstart', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'docs' },
  ],
  'html/css': [
    { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'docs' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', type: 'course' },
  ],
  'tailwind css': [
    { label: 'Tailwind Docs', url: 'https://tailwindcss.com/docs', type: 'docs' },
  ],
  'java': [
    { label: 'Oracle Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/', type: 'docs' },
  ],
  'c++': [
    { label: 'learncpp.com', url: 'https://www.learncpp.com/', type: 'tutorial' },
  ],
  'data structures & algorithms': [
    { label: 'NeetCode', url: 'https://neetcode.io/', type: 'platform' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/', type: 'course' },
  ],
  'aws': [
    { label: 'AWS Training', url: 'https://aws.amazon.com/training/digital/', type: 'platform' },
  ],
  'rest apis': [
    { label: 'MDN HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'docs' },
  ],
  'redis': [
    { label: 'Redis Docs', url: 'https://redis.io/docs/getting-started/', type: 'docs' },
  ],
  'mlops': [
    { label: 'MLOps Guide', url: 'https://ml-ops.org/', type: 'docs' },
  ],
  'kubernetes': [
    { label: 'K8s Docs', url: 'https://kubernetes.io/docs/tutorials/', type: 'docs' },
  ],
  'graphql': [
    { label: 'GraphQL Docs', url: 'https://graphql.org/learn/', type: 'docs' },
  ],
  'system design': [
    { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'tutorial' },
  ],
  'oop': [
    { label: 'Refactoring Guru', url: 'https://refactoring.guru/design-patterns', type: 'tutorial' },
  ],
  'data visualization': [
    { label: 'D3.js Docs', url: 'https://d3js.org/getting-started', type: 'docs' },
  ],
  'statistical analysis': [
    { label: 'Khan Academy Stats', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' },
  ],
  'statistical modeling': [
    { label: 'Khan Academy Stats', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' },
  ],
  'r': [
    { label: 'R for Data Science', url: 'https://r4ds.had.co.nz/', type: 'tutorial' },
  ],
  'excel': [
    { label: 'MS Excel Training', url: 'https://support.microsoft.com/en-us/excel', type: 'docs' },
  ],
  'etl': [
    { label: 'AWS ETL Guide', url: 'https://aws.amazon.com/what-is/etl/', type: 'docs' },
  ],
  'vector databases': [
    { label: 'Pinecone Learning', url: 'https://www.pinecone.io/learn/', type: 'docs' },
  ],
  'data mining': [
    { label: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'course' },
  ],
};

/**
 * Lookup learning resources for a skill name.
 * Uses case-insensitive matching. Returns empty array if no mapping exists.
 */
export function getSkillResources(skillName: string): SkillResource[] {
  return SKILL_RESOURCES[skillName.toLowerCase().trim()] ?? [];
}

/**
 * Fallback search URL when no curated resource exists.
 */
export function getFallbackSearchUrl(skillName: string): string {
  return `https://www.google.com/search?q=learn+${encodeURIComponent(skillName)}+tutorial`;
}
