"use client";

import { Button } from "@mantine/core";
import { showNotification } from "components/Notifications";
import { useUserContext } from "hooks/useUserContext";
import { ProfileDetailsData } from "interfaces/users";

interface ActionButtonsProps {
  profile: ProfileDetailsData;
}

export function ActionButtons({ profile }: ActionButtonsProps) {
  const { user } = useUserContext();
  return (
    <>
      <div className="mt-4 flex space-x-2">
        {user?.username === profile.user.username ? (
          <Button
            variant="outline"
            fullWidth
            onClick={() =>
              showNotification({
                title: "Warning",
                message: "this function is not implemented yet",
                color: "yellow",
              })
            }
          >
            editar perfil
          </Button>
        ) : (
          <Button
            variant="light"
            fullWidth
            onClick={() =>
              showNotification({
                title: "Warning",
                message: "this function is not implemented yet",
                color: "yellow",
              })
            }
          >
            Seguir
          </Button>
        )}
      </div>
    </>
  );
}
