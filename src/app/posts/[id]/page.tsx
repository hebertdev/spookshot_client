import { Box, Center, Container, Title } from "@mantine/core";
import { ContainerPost } from "components/pages/PostDetail";
import { cookies } from "next/headers";

import { getPostDetailsAPI } from "services/posts";

interface ProfileDetailsProps {
  params: { id: string | number };
}

export default async function PostDetails({ params }: ProfileDetailsProps) {
  const { id } = params;
  let headers: any = {};
  const cookie = cookies().get("id");
  const value_cookie = cookie?.value;
  try {
    if (value_cookie) {
      headers = {
        Authorization: `token ${value_cookie}`,
      };
    }
    const data = await getPostDetailsAPI(id, headers);
    return (
      <>
        <Container size="xs">
          <Center mt={"xs"} mb={"xs"}>
            <Title size={"lg"}>Post of @{data.user.username}</Title>
          </Center>
          <Box className="w-full rounded-[15px] bg-gray-100  dark:bg-[var(--mantine-color-dark-6)] mb-[10px] overflow-hidden">
            <ContainerPost post={data} />
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
