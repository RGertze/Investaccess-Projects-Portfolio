import Provider from '@/components/next-auth-provider/provider';
import './globals.css'
import { Navbar } from "@/components/admin-nav-bar/navbar";

export default function AdminLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <html>
      <body>
        <main>
          <Provider>
            <div className="flex flex-col min-h-screen">
              <Navbar />

              {children}
            </div>
          </Provider>
        </main>
      </body>
    </html>
  );
}