interface Props {
  children: React.ReactNode;
}

export default function MutedMsg({ children }: Props) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
