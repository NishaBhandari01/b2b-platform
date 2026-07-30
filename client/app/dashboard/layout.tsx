// import { Navbar } from '@/components/common/Navbar'
// import { Sidebar } from '@/components/common/Sidebar'

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // In a real app, check user role here and conditionally render sidebar
//   // For now, we'll default to supplier
//   return (
//     <>
//       <Navbar />
//       <div className="flex">
//         <Sidebar variant="supplier" />
//         <main className="flex-1 bg-background min-h-screen">{children}</main>
//       </div>
//     </>
//   )
// }

import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import SocketProvider from "@/components/SocketProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <Navbar />
      <div className="flex">
        <Sidebar variant="supplier" />
        <main className="flex-1 bg-background min-h-screen">{children}</main>
      </div>
    </SocketProvider>
  );
}
