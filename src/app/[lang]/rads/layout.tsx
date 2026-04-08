import RadsHeader from "@/components/RadsHeader";
import RadsFooter from "@/components/RadsFooter";

export default function RadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-hidden">
      <RadsHeader />
      <main className="flex-1">{children}</main>
      <RadsFooter />
    </div>
  );
}
