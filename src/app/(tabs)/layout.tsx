import { BottomNav } from "@/components/bottom-nav";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-[72px]">{children}</main>
      <BottomNav />
    </>
  );
}
