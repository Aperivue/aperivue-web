import RadsHeader from "@/components/RadsHeader";
import RadsFooter from "@/components/RadsFooter";

export default function RadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RadsHeader />
      <main className="flex-1">{children}</main>
      <RadsFooter />
    </>
  );
}
