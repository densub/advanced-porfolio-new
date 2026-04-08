import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Trash2 } from 'lucide-react'

const DEFAULT_SECTIONS_SEED = [
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

const DEFAULT_LINKS_SEED = [
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/subedidenish', order: 0, visible: true },
  {
    platform: 'GitHub',
    url: 'https://github.com/densub',
    order: 1,
    visible: true,
    icon: 'github',
  },
]

export default function Admin() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: sections = [] } = useQuery({
    queryKey: ['portfolio-sections'],
    queryFn: () => base44.entities.PortfolioSection.list('order'),
  })

  const { data: links = [] } = useQuery({
    queryKey: ['social-links'],
    queryFn: () => base44.entities.SocialLink.list('order'),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['portfolio-sections'] })
    queryClient.invalidateQueries({ queryKey: ['social-links'] })
  }

  const seedMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.PortfolioSection.upsertMany([])
      const existingLinks = await base44.entities.SocialLink.list()
      await Promise.all(existingLinks.map((l) => base44.entities.SocialLink.delete(l.id)))

      const seededSections = DEFAULT_SECTIONS_SEED.map((s, i) => ({
        id: crypto.randomUUID(),
        ...s,
        order: s.order ?? i,
      }))
      await base44.entities.PortfolioSection.upsertMany(seededSections)
      await Promise.all(
        DEFAULT_LINKS_SEED.map((l, i) =>
          base44.entities.SocialLink.create({ ...l, order: l.order ?? i })
        )
      )
    },
    onSuccess: () => {
      invalidate()
      toast({ title: 'Demo data loaded', description: 'Sections and links saved locally.' })
    },
    onError: (e) => toast({ title: 'Error', description: String(e.message), variant: 'destructive' }),
  })

  const clearMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.PortfolioSection.upsertMany([])
      const allLinks = await base44.entities.SocialLink.list()
      await Promise.all(allLinks.map((l) => base44.entities.SocialLink.delete(l.id)))
    },
    onSuccess: () => {
      invalidate()
      toast({ title: 'Storage cleared', description: 'Portfolio will use built-in defaults until you add data again.' })
    },
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground mb-1">// ADMIN</p>
            <h1 className="font-orbitron text-2xl text-primary">Portfolio CMS</h1>
            <p className="font-rajdhani text-sm text-muted-foreground mt-1">
              Data is stored in localStorage (Base44 stand-in). Replace <code className="text-xs">base44Client</code>{' '}
              with your real API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft size={16} />
                Site
              </Link>
            </Button>
            <Button variant="secondary" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
              Load demo data
            </Button>
            <Button variant="destructive" onClick={() => clearMutation.mutate()} disabled={clearMutation.isPending}>
              Clear storage
            </Button>
          </div>
        </div>

        <Card className="border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle className="font-orbitron text-lg">Portfolio sections</CardTitle>
            <CardDescription>
              {sections.length === 0
                ? 'No saved sections — the public site uses embedded defaults.'
                : `${sections.length} section(s) in local storage`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.length === 0 ? (
              <p className="font-mono text-sm text-muted-foreground">// Empty — use Load demo data or add via API.</p>
            ) : (
              sections.map((s) => (
                <SectionEditor key={s.id} section={s} onSaved={invalidate} toast={toast} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle className="font-orbitron text-lg">Social links</CardTitle>
            <CardDescription>
              Include a GitHub link so the Projects section can list your public repositories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LinkEditor onCreated={invalidate} toast={toast} />
            {links.length === 0 ? (
              <p className="font-mono text-sm text-muted-foreground">// No custom links saved.</p>
            ) : (
              links.map((l) => <SocialRow key={l.id} link={l} onSaved={invalidate} toast={toast} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SectionEditor({ section, onSaved, toast }) {
  const [title, setTitle] = useState(section.title)
  const [order, setOrder] = useState(String(section.order ?? 0))
  const [visible, setVisible] = useState(section.visible !== false)
  const [contentJson, setContentJson] = useState(JSON.stringify(section.content ?? {}, null, 2))
  const [busy, setBusy] = useState(false)

  const save = async () => {
    let content
    try {
      content = JSON.parse(contentJson || '{}')
    } catch {
      toast({ title: 'Invalid JSON', description: 'Fix the content field.', variant: 'destructive' })
      return
    }
    setBusy(true)
    try {
      await base44.entities.PortfolioSection.update(section.id, {
        ...section,
        title,
        order: Number(order) || 0,
        visible,
        content,
      })
      onSaved()
      toast({ title: 'Section saved' })
    } catch (e) {
      toast({ title: 'Error', description: String(e.message), variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-md border border-border p-4 space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="font-mono text-xs text-muted-foreground">section_key</Label>
          <Input value={section.section_key} disabled className="font-mono text-xs" />
        </div>
        <div className="space-y-1 flex-1 min-w-[120px]">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1 w-24">
          <Label>Order</Label>
          <Input value={order} onChange={(e) => setOrder(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <Switch checked={visible} onCheckedChange={setVisible} id={`vis-${section.id}`} />
          <Label htmlFor={`vis-${section.id}`} className="text-xs">
            Visible
          </Label>
        </div>
      </div>
      <div className="space-y-1">
        <Label>content (JSON)</Label>
        <Textarea
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          className="font-mono text-xs min-h-[160px]"
        />
      </div>
      <Button size="sm" onClick={save} disabled={busy}>
        Save section
      </Button>
    </div>
  )
}

function SocialRow({ link, onSaved, toast }) {
  const [platform, setPlatform] = useState(link.platform)
  const [url, setUrl] = useState(link.url)
  const [order, setOrder] = useState(String(link.order ?? 0))
  const [visible, setVisible] = useState(link.visible !== false)
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      await base44.entities.SocialLink.update(link.id, {
        ...link,
        platform,
        url,
        order: Number(order) || 0,
        visible,
      })
      onSaved()
      toast({ title: 'Link saved' })
    } catch (e) {
      toast({ title: 'Error', description: String(e.message), variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await base44.entities.SocialLink.delete(link.id)
      onSaved()
      toast({ title: 'Link removed' })
    } catch (e) {
      toast({ title: 'Error', description: String(e.message), variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-md border border-border p-4 flex flex-col gap-3 md:flex-row md:items-end md:flex-wrap">
      <div className="space-y-1 flex-1 min-w-[140px]">
        <Label>Platform</Label>
        <Input value={platform} onChange={(e) => setPlatform(e.target.value)} />
      </div>
      <div className="space-y-1 flex-[2] min-w-[200px]">
        <Label>URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div className="space-y-1 w-24">
        <Label>Order</Label>
        <Input value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pb-2">
        <Switch checked={visible} onCheckedChange={setVisible} id={`link-vis-${link.id}`} />
        <Label htmlFor={`link-vis-${link.id}`} className="text-xs">
          Visible
        </Label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={busy}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={remove} disabled={busy}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}

function LinkEditor({ onCreated, toast }) {
  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('https://')
  const [busy, setBusy] = useState(false)

  const add = async () => {
    if (!platform.trim() || !url.trim()) {
      toast({ title: 'Missing fields', variant: 'destructive' })
      return
    }
    setBusy(true)
    try {
      const list = await base44.entities.SocialLink.list('order')
      const nextOrder = list.length ? Math.max(...list.map((l) => l.order ?? 0)) + 1 : 0
      await base44.entities.SocialLink.create({
        platform: platform.trim(),
        url: url.trim(),
        order: nextOrder,
        visible: true,
      })
      setPlatform('')
      setUrl('https://')
      onCreated()
      toast({ title: 'Link added' })
    } catch (e) {
      toast({ title: 'Error', description: String(e.message), variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-md border border-dashed border-primary/30 p-4 space-y-3">
      <p className="font-mono text-xs text-primary">Add link</p>
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="space-y-1 flex-1">
          <Label>Platform</Label>
          <Input placeholder="GitHub" value={platform} onChange={(e) => setPlatform(e.target.value)} />
        </div>
        <div className="space-y-1 flex-[2]">
          <Label>URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <Button type="button" onClick={add} disabled={busy}>
          Add
        </Button>
      </div>
    </div>
  )
}
