import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, GitFork, ExternalLink, GitBranch, Circle } from 'lucide-react'
import {
  extractGitHubUsername,
  fetchGitHubReposWithReadmes,
  GITHUB_REPOS_CACHE_TTL_MS,
  clearGithubReposCache,
  getGithubReposQueryInitialState,
} from '@/lib/githubRepos'

const MotionA = motion.a

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Ruby: '#701516',
  PHP: '#4F5D95',
}

export default function GitHubProjects({ socialLinks }) {
  const queryClient = useQueryClient()
  const githubLink = socialLinks?.find((l) => l.platform?.toLowerCase().includes('github'))
  const username = extractGitHubUsername(githubLink?.url)
  const queryInit = getGithubReposQueryInitialState(username)

  const { data: repos = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['github-repos-with-readmes', username],
    queryFn: () => fetchGitHubReposWithReadmes(username),
    enabled: !!username,
    staleTime: GITHUB_REPOS_CACHE_TTL_MS,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...(queryInit
      ? { initialData: queryInit.initialData, initialDataUpdatedAt: queryInit.initialDataUpdatedAt }
      : {}),
  })

  const forceRefreshFromGitHub = () => {
    if (!username) return
    clearGithubReposCache(username)
    queryClient.invalidateQueries({ queryKey: ['github-repos-with-readmes', username] })
  }

  if (!username) {
    return (
      <div className="cyber-card rounded-sm p-6 text-center">
        <p className="font-mono text-sm text-muted-foreground hover-glitch-text">
          // No GitHub link configured. Add your GitHub URL in the admin panel.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="cyber-card rounded-sm overflow-hidden animate-pulse">
            <div className="h-1 bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-4/5" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="flex gap-2 mt-4">
                <div className="h-5 w-16 bg-muted rounded" />
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="cyber-card rounded-sm p-6 text-center border border-destructive/20">
        <p className="font-mono text-sm text-destructive hover-glitch-text">
          // Error fetching repos: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <GitBranch size={16} className="text-primary" aria-hidden />
        <span className="font-mono text-xs text-muted-foreground tracking-wider hover-glitch-text inline-block">
          {username} // {repos.length} public repositories · README previews where available
        </span>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={forceRefreshFromGitHub}
            disabled={isFetching}
            className="font-mono text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline disabled:opacity-50"
          >
            {isFetching ? 'Refreshing…' : 'Refresh from GitHub'}
          </button>
          <a
            href={githubLink?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-primary hover:underline hover-glitch-text inline-flex items-center gap-1"
          >
            View Profile <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, i) => {
          const fromReadme = Boolean(repo.readmeExcerpt)
          const blurb = repo.readmeExcerpt || repo.description
          const displayText = blurb || '// No description or README preview'

          return (
            <MotionA
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="cyber-card rounded-sm overflow-hidden group block no-underline text-left min-h-[200px] flex flex-col cursor-pointer outline-none ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent shrink-0" />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-orbitron text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary hover-glitch-text inline-block transition-colors leading-snug">
                    {repo.name}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                    aria-hidden
                  />
                </div>

                {fromReadme && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary/60 mb-1">
                    From README
                  </span>
                )}

                <p className="font-rajdhani text-sm text-muted-foreground leading-relaxed mb-4 flex-1 hover-glitch-text line-clamp-5">
                  {displayText}
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <Circle
                        size={10}
                        style={{
                          color: LANG_COLORS[repo.language] || '#aaa',
                          fill: LANG_COLORS[repo.language] || '#aaa',
                        }}
                      />
                      <span className="font-mono text-xs text-muted-foreground">{repo.language}</span>
                    </div>
                  )}
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star size={11} />
                      <span className="font-mono text-xs">{repo.stargazers_count}</span>
                    </div>
                  )}
                  {repo.forks_count > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GitFork size={11} />
                      <span className="font-mono text-xs">{repo.forks_count}</span>
                    </div>
                  )}
                </div>
              </div>
            </MotionA>
          )
        })}
      </div>
    </div>
  )
}
