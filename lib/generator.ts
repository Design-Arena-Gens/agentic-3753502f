type GenerateParams = { topic?: string };

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateContent({ topic }: GenerateParams) {
  const safeTopic = (topic && topic.trim()) || `Profitable Side Hustles ${new Date().getFullYear()}`;

  const keywords = [
    'how to', 'guide', 'best', 'tips', '2025', 'beginner', 'advanced', 'checklist', 'free tools', 'SEO'
  ];
  const suffix = randomFrom(keywords);
  const title = `${titleCase(safeTopic)}: ${suffix}`;

  const intro = `In this post, you will learn actionable strategies about ${safeTopic.toLowerCase()} that you can apply today. We focus on practical steps, tools, and examples.`;
  const sections = [
    {
      h2: 'Key Takeaways',
      html: `<ul>
        <li>Actionable steps you can implement immediately</li>
        <li>Budget-friendly tools to accelerate progress</li>
        <li>Metrics to track for continuous improvement</li>
      </ul>`
    },
    {
      h2: 'Step-by-Step Plan',
      html: `<ol>
        <li>Define the goal and audience</li>
        <li>Research keywords and competitors</li>
        <li>Create an outline and draft</li>
        <li>Polish with examples and visuals</li>
        <li>Publish and measure results</li>
      </ol>`
    },
    {
      h2: 'Recommended Tools',
      html: `<ul>
        <li>Google Trends for demand validation</li>
        <li>Search Console for indexing insights</li>
        <li>Canva for social-ready graphics</li>
      </ul>`
    }
  ];

  const body = `
    <p>${intro}</p>
    ${sections.map(s => `<h2>${s.h2}</h2>${s.html}`).join('\n')}
    <h2>Conclusion</h2>
    <p>If you found this useful, share it with a friend and subscribe for more hands-on guides. Comments are open—drop your questions below.</p>
  `;

  return { title, body };
}
