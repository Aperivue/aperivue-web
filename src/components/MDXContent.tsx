import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

interface Props {
  source: string;
}

export async function MDXContent({ source }: Props) {
  const code = String(
    await compile(source, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
    })
  );
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return <Content />;
}
