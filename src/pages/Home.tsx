import Hero from "@/components/archive/Hero";
import DecadeMenu from "@/components/archive/DecadeMenu";
import PhotoStack from "@/components/archive/PhotoStack";
import Timeline from "@/components/archive/Timeline";
import NextLunchBanner from "@/components/archive/NextLunchBanner";
import PhotoDropzone from "@/components/archive/PhotoDropzone";
import { siteContent, timelineEntries } from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle(siteContent.pageTitles.home);

  return (
    <>
      <Hero />
      {/* Sticky from here to the end of the page: its parent is the page's <main> */}
      <DecadeMenu />
      <PhotoStack />
      <NextLunchBanner />
      <Timeline
        id={siteContent.timeline.anchorId}
        entries={timelineEntries}
        heading={siteContent.home.timelineHeading}
        intro={siteContent.home.timelineIntro}
        moreLink={{ to: "/arquivo", label: siteContent.home.timelineLink }}
      />
      <PhotoDropzone />
    </>
  );
}
