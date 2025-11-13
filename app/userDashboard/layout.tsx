import SideNav from "../ui/dashboard/sidenav";
import { Suspense } from 'react';

export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <SideNav /> 
        </Suspense>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  )
}