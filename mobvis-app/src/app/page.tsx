import Header, { visitorLinks } from "@/components/layout/header";

export default function Home() {
  return (
    <div>
      <Header navLinks={visitorLinks} />
    </div>
  );
}
