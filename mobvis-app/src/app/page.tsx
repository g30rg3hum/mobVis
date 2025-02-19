import Header, { visitorLinks } from "@/components/layout/Header";

export default function Home() {
  return (
    <div>
      <Header navLinks={visitorLinks} />
    </div>
  );
}
