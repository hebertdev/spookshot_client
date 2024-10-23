import { Avatar, Box, Button, Center, Container, Title } from "@mantine/core";
import { profileDetailsAPI } from "services/accounts";
import { cookies } from "next/headers";

import { ActionButtons, Posts } from "components/pages/Profile";

interface ProfileDetailsProps {
  params: { profile: string };
}

export default async function ProfileDetails({ params }: ProfileDetailsProps) {
  const { profile } = params;
  let headers: any = {};
  const cookie = cookies().get("id");
  const value_cookie = cookie?.value;
  try {
    if (!profile.startsWith("%40")) return;
    if (value_cookie) {
      headers = {
        Authorization: `token ${value_cookie}`,
      };
    }
    const data = await profileDetailsAPI(profile.substring(3), headers);

    return (
      <>
        <Container size="xs">
          <Center mt={"xs"} mb={"xs"}>
            <Title size={"lg"}>{data.user.username}</Title>
          </Center>
          <Box className="w-full rounded-[15px] bg-gray-100  dark:bg-[var(--mantine-color-dark-6)] mb-[10px] overflow-hidden">
            <div className="w-full  rounded-xl overflow-hidden border-b border-gray-300 dark:border-[var(--mantine-color-dark-4)]">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar src={data.user.profile.avatar} />
                  <div>
                    <h1 className="text-lg font-bold flex items-center">
                      {data.user.first_name} {data.user.last_name}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      @{data.user.username}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm"> {data.user.profile.bio} </p>
                <p className="mt-2 text-sm text-gray-400">-</p>
                <ActionButtons profile={data} />
              </div>
            </div>
            <Posts posts={data.posts} username={profile.substring(3)} />
          </Box>
        </Container>
      </>
    );
  } catch (error: any) {
    if (error.response?.status === 404) {
      return <div />;
    } else {
      return <div />;
    }
  }
}
