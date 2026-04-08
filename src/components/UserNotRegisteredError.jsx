export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-mono text-xs text-destructive mb-2">// ACCESS DENIED</p>
      <h1 className="font-orbitron text-xl text-foreground mb-4">User not registered</h1>
      <p className="font-rajdhani text-muted-foreground max-w-md">
        Your account is not registered for this application. Contact the administrator.
      </p>
    </div>
  )
}
