import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <p className="font-mono text-xs text-muted-foreground mb-4">// 404</p>
      <h1 className="font-orbitron text-2xl text-primary mb-6">PAGE NOT FOUND</h1>
      <Link
        to="/"
        className="font-mono text-sm text-primary border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-colors"
      >
        Return home
      </Link>
    </div>
  )
}
