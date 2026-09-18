import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group font-[var(--font-geist-sans,sans-serif)]"
      position="bottom-right"
      expand={false}
      closeButton
      richColors
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: [
            "group toast",
            "!rounded-xl !border !border-[#dce4ec]",
            "!bg-white !text-[#142c42]",
            "!shadow-[0_8px_24px_rgba(16,45,72,0.10)]",
            "!px-4 !py-3.5",
            "!text-[13px] !font-medium",
          ].join(" "),
          title: "!text-[13px] !font-semibold !text-[#142c42]",
          description: "!text-[11px] !text-[#687585] !mt-0.5",
          actionButton:
            "!bg-[#102d48] !text-white !text-[11px] !font-semibold !rounded-lg !px-3 !py-1.5 hover:!bg-[#193d5e]",
          cancelButton:
            "!bg-[#f0f4f8] !text-[#687585] !text-[11px] !font-medium !rounded-lg !px-3 !py-1.5 hover:!bg-[#e2e9f0]",
          closeButton:
            "!border !border-[#dce4ec] !bg-white !text-[#8793a2] hover:!bg-[#f0f4f8] hover:!text-[#142c42] !rounded-lg",
          success: "!border-[#c8edd8] !bg-[#f0faf5]",
          error: "!border-[#f5c6cc] !bg-[#fff5f5]",
          warning: "!border-[#fde9b8] !bg-[#fffbf0]",
          info: "!border-[#c6ddf5] !bg-[#f0f6ff]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
