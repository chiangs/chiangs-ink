import type { Route } from "./+types/home";
import { Nav, Footer } from "~/components";
import { Hero, WorkRows, AboutStrip, WritingList, ContactStrip } from "~/components/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stephen Chiang — Design Technologist" },
    {
      name: "description",
      content:
        "Engineering the strategy behind how products get built. Design Technologist and Product & Technology Leader based in Stavanger, Norway.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorkRows />
        <AboutStrip />
        <WritingList />
        <ContactStrip />
      </main>
      <Footer />
    </>
  );
}
