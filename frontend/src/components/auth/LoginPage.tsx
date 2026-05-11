import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { setStoredAuthToken } from '../../lib/auth'
import { login } from '../../services/authService'

const initialForm = {
  email: '',
  password: '',
}

export function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState<string | null>(null)

  const authMutation = useMutation({
    mutationFn: async () => login({ email: form.email, password: form.password }),
    onSuccess: async (data) => {
      setStoredAuthToken(data.token)
      queryClient.setQueryData(['authUser'], data.user)
      await navigate({ to: '/' })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    },
  })

  return (
    <div className="min-h-screen bg-[#ece7da] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_24px_80px_rgba(33,24,18,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-[#183153] p-10 text-white lg:flex">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_48%),linear-gradient(0deg,rgba(0,0,0,0.16),rgba(0,0,0,0.16))]" />
            <div className="relative z-10">
              <div className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/65">YoloHome Access</p>
              <h1 className="max-w-sm text-5xl font-semibold leading-[1.08]">Control the house from one authenticated console.</h1>
            </div>

            <div className="relative z-10 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <div className="mb-2 text-sm text-white/60">Default admin</div>
                <div className="font-mono text-sm tracking-wide">admin@yolohome.local</div>
                <div className="mt-1 font-mono text-sm tracking-wide">admin12345</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Lights', value: '3 rooms' },
                  { label: 'Camera', value: 'Face ID' },
                  { label: 'Devices', value: 'MongoDB' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/55">{item.label}</div>
                    <div className="mt-2 text-lg font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex min-h-[640px] flex-col justify-center bg-[#fbfaf7] px-6 py-10 sm:px-10 lg:px-12">
            <div className="mb-8">
              <div className="mb-6 inline-flex rounded-2xl bg-[#ebe6da] px-4 py-2 text-sm font-semibold text-stone-700">
                Sign in
              </div>
              <h2 className="text-3xl font-semibold text-stone-900">Sign in to YoloHome</h2>
              <p className="mt-2 text-sm text-stone-500">
                Use an existing account to access the dashboard and device controls.
              </p>
            </div>

            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                authMutation.mutate()
              }}
            >
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-stone-900 outline-none transition focus:border-[#C8601F]"
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-stone-900 outline-none transition focus:border-[#C8601F]"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={authMutation.isPending}
                className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-[#C8601F] px-5 text-sm font-semibold text-white transition hover:bg-[#af531d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authMutation.isPending ? 'Processing...' : 'Sign in'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
