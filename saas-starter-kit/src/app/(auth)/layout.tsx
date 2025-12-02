import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | SaaSKit",
    default: "Authentication",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
