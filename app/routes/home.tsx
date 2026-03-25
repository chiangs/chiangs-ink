import type { Route } from "./+types/home";
import {
  Hero,
  CredentialsBar,
  WorkRows,
  AboutStrip,
  WritingList,
  ContactStrip,
} from "~/components/home";

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
    <main>
      <Hero />
      <CredentialsBar />
      <WorkRows />
      <AboutStrip />
      <WritingList />
      <ContactStrip />
    </main>
  );
}
