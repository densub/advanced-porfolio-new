import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import ParticleField from '@/components/portfolio/ParticleField'
import HUDNav from '@/components/portfolio/HUDNav'
import HeroSection from '@/components/portfolio/HeroSection'
import SectionWrapper from '@/components/portfolio/SectionWrapper'
import TimelineCard from '@/components/portfolio/TimelineCard'
import GitHubProjects from '@/components/portfolio/GitHubProjects'
import GenericSection from '@/components/portfolio/GenericSection'
import CertCard from '@/components/portfolio/CertCard'
import FooterSection from '@/components/portfolio/FooterSection'
import SecretDoor from '@/components/portfolio/SecretDoor'
import TerminalAssistant from '@/components/portfolio/TerminalAssistant'

const DEFAULT_SECTIONS = [
  {
    section_key: 'hero',
    title: 'HERO',
    order: 0,
    visible: true,
    content: {
      name: 'DENISH SUBEDI',
      tagline: 'Software Engineer // New York, NY',
      bio: 'Senior Software Engineer at Fearless. M.S. Computer & Information Systems Security (Information Assurance) @ American Public University System · B.S. Mathematics & Computer Science @ East Central University. Focused on cloud, data, AI, and secure, scalable systems.',
    },
  },
  {
    section_key: 'education',
    title: 'EDUCATION',
    order: 1,
    visible: true,
    content: {
      items: [
        {
          title: 'M.S. Computer and Information Systems Security',
          subtitle: 'American Public University System · Information Assurance',
          period: 'Nov 2023 – Dec 2025',
          description:
            'Graduate work in security and information assurance aligned with modern enterprise and cloud environments.',
        },
        {
          title: "Bachelor's · Mathematics and Computer Science",
          subtitle: 'East Central University',
          period: 'Completed',
          description: 'Foundation in mathematics, computing, and software engineering.',
        },
      ],
    },
  },
  {
    section_key: 'experience',
    title: 'EXPERIENCE',
    order: 2,
    visible: true,
    content: {
      items: [
        {
          title: 'Senior Software Engineer',
          subtitle: 'Fearless · Full-time',
          period: 'Jan 2024 – Present',
          description:
            'Delivering software solutions in a full-time engineering role; collaborating on scalable systems and modern development practices.',
          tags: ['Software Engineering', 'Full-time'],
        },
        {
          title: 'Senior Software Engineer',
          subtitle: 'Principal Financial Group · Full-time',
          period: 'Feb 2022 – Feb 2024 · 2 yrs 1 mo',
          description:
            'Senior engineering work across the stack in a financial services environment.',
          tags: ['FinTech', 'Enterprise'],
        },
        {
          title: 'Full Stack Engineer',
          subtitle: 'CurrentDesk · Full-time',
          period: 'Jan 2019 – Feb 2022 · 3 yrs 2 mo',
          description:
            'End-to-end development: APIs, services, and user-facing features across the product.',
          tags: ['Full Stack', 'Node.js'],
        },
      ],
    },
  },
  {
    section_key: 'projects',
    title: 'PROJECTS',
    order: 3,
    visible: true,
    content: {
      items: [
        {
          title: 'Clawbank',
          subtitle: 'Agent-to-agent platform',
          description:
            'Platform for agent-to-agent transactions and for building, composing, and operating autonomous agents at scale.',
          tags: ['AI agents', 'Multi-agent', 'Platform'],
        },
        {
          title: 'MyCareerNJ',
          subtitle: 'State of New Jersey · Government program',
          description:
            'Public-sector workforce initiative helping New Jersey residents explore careers, training, and employment pathways—full-stack delivery in a regulated government context.',
          tags: ['Government', 'Public sector', 'Workforce'],
          url: 'https://mycareer.nj.gov/',
        },
        {
          title: 'Federated GraphQL',
          subtitle: 'Enterprise integration layer',
          description:
            'Federated GraphQL architecture unifying distributed services behind one graph—schema composition, resolver orchestration, and operational GraphQL in production.',
          tags: ['GraphQL', 'Federation', 'APIs'],
        },
        {
          title: 'DataSyndicate',
          subtitle: 'Web3 · Crypto wallet intelligence',
          description:
            'Blockchain and NFT–focused Web3 application: crypto wallet tracking with complex analytics, live monitoring, and transactional visibility across on-chain activity.',
          tags: ['Web3', 'Blockchain', 'NFTs', 'Wallets'],
        },
        {
          title: 'Roko Network',
          subtitle: 'roko.network · Early contributor',
          description:
            'Novel blockchain infrastructure combining nanosecond-scale timing precision (~1ns) with enterprise-grade reliability—temporal accuracy at scale, 24/7 operations, built for the next generation of Web3 and DeFi. Early engineering during the network’s formative phase.',
          tags: ['Blockchain', 'DeFi', 'Infrastructure', 'Web3'],
          url: 'https://roko.network',
        },
        {
          title: 'CRM development',
          subtitle: 'Custom CRM programs',
          description:
            'End-to-end CRM builds—sales pipelines, customer data, integrations, and internal tooling tailored to how teams actually work.',
          tags: ['CRM', 'Integrations', 'Full stack'],
        },
      ],
    },
  },
  {
    section_key: 'certifications',
    title: 'CERTIFICATIONS',
    order: 4,
    visible: true,
    content: {
      items: [
        {
          title: 'Databricks Data Engineering',
          issuer: 'Databricks',
          issuerUrl: 'https://www.databricks.com/learn/certification',
          inProgress: true,
          skills: 'Data engineering, Apache Spark, lakehouse',
        },
        {
          title: 'Mathematics for Machine Learning',
          issuer: 'Imperial College London',
          issuerUrl: 'https://www.coursera.org/specializations/mathematics-machine-learning',
          inProgress: true,
          skills: 'Linear algebra, multivariate calculus, PCA for ML',
        },
        {
          title: 'Google Cloud AI Infrastructure Specialization',
          issuer: 'Google',
          issuerUrl: 'https://cloud.google.com/learn/certification',
          date: 'Issued Apr 2026',
          credentialId: 'U5JE2NYATKWC',
          url: 'https://www.coursera.org/account/accomplishments/specialization/U5JE2NYATKWC',
        },
        {
          title: 'Build AI Agents using MCP (Model Context Protocol)',
          issuer: 'IBM',
          issuerUrl: 'https://www.ibm.com/training',
          date: 'Issued Mar 2026',
          credentialId: 'ATGYFLF22JKP',
          url: 'https://www.coursera.org/account/accomplishments/verify/ATGYFLF22JKP',
        },
        {
          title: 'The AI Awakening: Implications for the Economy and Society',
          issuer: 'Stanford University',
          issuerUrl: 'https://online.stanford.edu/',
          date: 'Issued Feb 2026',
          credentialId: 'OJ15QKHU3RPD',
          url: 'https://www.coursera.org/account/accomplishments/verify/OJ15QKHU3RPD',
        },
        {
          title: 'Introduction to Large Language Models',
          issuer: 'LinkedIn',
          issuerUrl: 'https://www.linkedin.com/learning/',
          date: 'Issued Dec 2024',
          skills: 'Large Language Models (LLM)',
          url: 'https://www.linkedin.com/in/subedidenish/details/certifications/',
        },
        {
          title: 'AWS Certified Developer – Associate',
          issuer: 'Amazon Web Services (AWS)',
          issuerUrl: 'https://aws.amazon.com/certification/',
          date: 'Issued Jul 2024',
          expires: 'Jul 2027',
          skills: 'Amazon Web Services (AWS)',
          url: 'https://aws.amazon.com/certification/certified-developer-associate/',
        },
        {
          title: 'Learning Cloud Computing: Core Concepts',
          issuer: 'LinkedIn',
          issuerUrl: 'https://www.linkedin.com/learning/',
          date: 'Issued Jan 2022',
          url: 'https://www.linkedin.com/learning/search?keywords=Learning%20Cloud%20Computing%3A%20Core%20Concepts',
        },
        {
          title: 'Programming Foundations: Data Structures',
          issuer: 'LinkedIn',
          issuerUrl: 'https://www.linkedin.com/learning/',
          date: 'Issued Jan 2022',
          url: 'https://www.linkedin.com/learning/search?keywords=Programming%20Foundations%3A%20Data%20Structures',
        },
        {
          title: 'Learning Amazon Web Services (AWS) for Developers',
          issuer: 'LinkedIn',
          issuerUrl: 'https://www.linkedin.com/learning/',
          date: 'Issued Jan 2022',
          url: 'https://www.linkedin.com/learning/search?keywords=Learning%20Amazon%20Web%20Services%20AWS%20for%20Developers',
        },
        {
          title: 'Programming Foundations with JavaScript, HTML and CSS',
          issuer: 'Duke University',
          issuerUrl: 'https://www.coursera.org/partners/duke-university',
          date: 'Issued Mar 2018',
          credentialId: 'LY23CSSPEJDZ',
          url: 'https://www.coursera.org/account/accomplishments/verify/LY23CSSPEJDZ',
        },
      ],
    },
  },
  {
    section_key: 'skills',
    title: 'SKILLS',
    order: 5,
    visible: true,
    content: {
      items: [
        {
          title: 'AI, ML & intelligent systems',
          subtitle: 'Agents · LLMs · infrastructure · theory',
          description:
            'Large-scale AI reasoning, agent tooling, and societal/technical context—Google Cloud AI Infrastructure, IBM MCP agents, Stanford “AI Awakening,” LinkedIn LLM fundamentals. Building toward deeper mathematical ML literacy (Imperial College “Mathematics for Machine Learning,” in progress). Project experience includes multi-agent and agent-to-agent platforms.',
          tags: [
            'LLMs',
            'AI agents',
            'MCP',
            'Google Cloud AI',
            'AI infrastructure',
            'Math for ML',
          ],
        },
        {
          title: 'Data engineering & analytics',
          subtitle: 'Lakehouse & Spark mindset',
          description:
            'Pursuing Databricks Data Engineering certification—aligning ETL/ELT thinking, Spark-based processing, and lakehouse patterns with secure, observable pipelines. Complements cloud and AI work when shipping data-heavy features.',
          tags: ['Databricks', 'Apache Spark', 'Lakehouse', 'Data pipelines', 'SQL'],
        },
        {
          title: 'Cloud & AWS',
          subtitle: 'Certified multi-cloud developer',
          description:
            'AWS Certified Developer – Associate; Google Cloud AI specialization and AI infrastructure coursework; dedicated LinkedIn paths in cloud computing and AWS for developers. Comfortable designing and operating services in regulated, cost-conscious environments.',
          tags: [
            'AWS',
            'Google Cloud',
            'Cloud architecture',
            'Cloud security awareness',
            'Developer tooling',
          ],
        },
        {
          title: 'GraphQL, APIs & integration',
          subtitle: 'Federated graphs & service boundaries',
          description:
            'Hands-on with federated GraphQL—composing subgraphs, unifying distributed services behind one graph, and shipping operational GraphQL in production alongside REST and event-driven patterns.',
          tags: ['GraphQL', 'Schema federation', 'API design', 'Microservices', 'Integration'],
        },
        {
          title: 'Web3, blockchain & on-chain analytics',
          subtitle: 'Wallets · NFTs · DeFi infrastructure',
          description:
            'Built Web3-style applications with wallet tracking, live on-chain monitoring, and transactional analytics (NFT/blockchain contexts). Early engineering on high-precision blockchain infrastructure (nanosecond-scale timing, 24/7 DeFi-oriented stacks) and exploration of next-gen network design.',
          tags: ['Web3', 'Blockchain', 'NFTs', 'DeFi', 'Wallets', 'On-chain analytics'],
        },
        {
          title: 'Software engineering & product delivery',
          subtitle: 'Full stack · CRM · government-scale',
          description:
            'End-to-end delivery from CurrentDesk through senior roles—Node.js, JavaScript/TypeScript ecosystems, APIs, and UIs; custom CRM builds with integrations and workflows. Shipped public-sector workforce technology (state government) and agent-oriented platforms. CS foundations: data structures, web programming (Duke), B.S. Math & CS (ECU, honors).',
          tags: [
            'Full-stack',
            'Node.js',
            'JavaScript',
            'CRM',
            'Public sector',
            'APIs & services',
          ],
        },
        {
          title: 'Security & information assurance',
          subtitle: 'Graduate concentration',
          description:
            'M.S. Computer & Information Systems Security (Information Assurance) at APUS—applied alongside secure SDLC habits, threat-aware design, and delivery in enterprise and regulated industries.',
          tags: [
            'Information assurance',
            'Secure development',
            'Risk-aware design',
            'Enterprise security context',
          ],
        },
        {
          title: 'Cross-industry & regulated delivery',
          subtitle: 'Enterprise · FinTech · digital services',
          description:
            'Senior Software Engineer at Fearless; prior senior engineering at Principal Financial Group (FinTech/enterprise); full-stack at CurrentDesk. Comfortable with compliance-heavy domains, scalable releases, and cross-functional delivery—from internal platforms to citizen-facing programs.',
          tags: [
            'Enterprise software',
            'FinTech',
            'Scalable systems',
            'Cross-functional delivery',
            'Regulated environments',
          ],
        },
      ],
    },
  },
]

const DEFAULT_LINKS = [
  {
    id: 'default-1',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/subedidenish',
    visible: true,
    order: 0,
  },
  {
    id: 'default-2',
    platform: 'GitHub',
    url: 'https://github.com/densub',
    visible: true,
    order: 1,
  },
]

export default function Portfolio() {
  const [secretOpen, setSecretOpen] = useState(false)

  const { data: sections = [] } = useQuery({
    queryKey: ['portfolio-sections'],
    queryFn: () => base44.entities.PortfolioSection.list('order'),
  })

  const { data: socialLinks = [] } = useQuery({
    queryKey: ['social-links'],
    queryFn: () => base44.entities.SocialLink.list('order'),
  })

  const activeSections = sections.length > 0 ? sections : DEFAULT_SECTIONS
  const activeLinks = socialLinks.length > 0 ? socialLinks : DEFAULT_LINKS
  const sortedSections = [...activeSections].sort((a, b) => (a.order || 0) - (b.order || 0))
  const heroSection = sortedSections.find((s) => s.section_key === 'hero')
  const otherSections = sortedSections.filter((s) => s.section_key !== 'hero' && s.visible !== false)

  const renderSection = (section, index) => {
    const content = section.content || {}
    const key = section.section_key

    if (key === 'education' || key === 'experience') {
      return (
        <SectionWrapper key={key} id={key} title={section.title} index={index}>
          <div className="space-y-0">
            {(content.items || []).map((item, i) => (
              <TimelineCard key={i} item={item} index={i} />
            ))}
          </div>
        </SectionWrapper>
      )
    }

    if (key === 'projects') {
      const featured = content.items?.length > 0
      return (
        <SectionWrapper key={key} id={key} title={section.title} index={index}>
          <div className="space-y-10">
            {featured && <GenericSection content={content} />}
            <GitHubProjects socialLinks={activeLinks} />
          </div>
        </SectionWrapper>
      )
    }

    if (key === 'certifications') {
      return (
        <SectionWrapper key={key} id={key} title={section.title} index={index}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(content.items || []).map((cert, i) => (
              <CertCard key={i} cert={cert} index={i} />
            ))}
          </div>
        </SectionWrapper>
      )
    }

    return (
      <SectionWrapper key={key} id={key} title={section.title} index={index}>
        <GenericSection content={content} />
      </SectionWrapper>
    )
  }

  return (
    <div className="relative min-h-screen bg-background scanline-overlay">
      <ParticleField />
      {/* z-10 keeps content above particle canvas; pointer-events ensures clicks work */}
      <div className="relative z-10 pointer-events-auto">
        <HUDNav sections={sortedSections} onSecretClick={() => setSecretOpen(true)} />
        <HeroSection content={heroSection?.content} socialLinks={activeLinks} />
        {otherSections.map((section, i) => renderSection(section, i))}
        <FooterSection socialLinks={activeLinks} />
        <TerminalAssistant sections={sortedSections} links={activeLinks} />
      </div>
      <SecretDoor isOpen={secretOpen} onClose={() => setSecretOpen(false)} />
    </div>
  )
}
