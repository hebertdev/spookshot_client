import { notifications } from "@mantine/notifications";
import classes from "./Notification.module.css";

interface NotificationOptions {
  title?: string;
  message: string;
  color?: string;
  autoClose?: number;
}

export const showNotification = ({
  title,
  message,
  color,
  autoClose,
}: NotificationOptions) => {
  notifications.show({
    title,
    message, // Cambia 'message' por 'description'
    color,
    autoClose,
    classNames: classes,
    styles: {
      root: {
        backgroundColor:
          "var(--notification-color, var(--mantine-primary-color-filled))",
        position: "relative",
      },
      description: {
        color: "var(--mantine-color-white)",
      },
      title: {
        color: "var(--mantine-color-white)",
      },
    },
  });
};
