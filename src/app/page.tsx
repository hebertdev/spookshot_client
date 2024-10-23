import { getTokenServer } from "helpers/auth";

//components
import { HeroBanner } from "components/pages/Home/Landing";
import { Feed } from "components/pages/Home/Feed";

export const metadata = {
  title: "SpookShot | Beautiful App",
  description:
    "SpookShot is the perfect app for Halloween, featuring spooky filters and effects that transform your photos into terrifying masterpieces. Have fun creating and sharing unique moments with friends and family!",
};

export default async function HomePage() {
  const token = await getTokenServer();
  return (
    <>
      {!token ? (
        <HeroBanner />
      ) : (
        <>
          <Feed />
        </>
      )}
    </>
  );
}
