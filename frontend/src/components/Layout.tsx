import { Outlet, useRouterState } from '@tanstack/react-router'
import Header from './Header'

export default function Layout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isLoginPage = pathname === '/login'

  return (
    <div className={`flex min-h-screen flex-col ${isLoginPage ? 'bg-[#ece7da]' : 'bg-[#e6e2d2]'}`}>
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? 'flex-1' : 'flex-1 overflow-auto px-4 pb-8 sm:px-8 lg:px-14'}>
        <Outlet />
      </main>
    </div>
  )
}
