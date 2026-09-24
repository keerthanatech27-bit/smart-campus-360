import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.tsx","./components/**/*.tsx"],
 theme:{extend:{colors:{ink:"#0F2A43",brand:"#1D4E89",teal:"#0E8F8A",paper:"#F5F7FA"},fontFamily:{sans:["var(--font-sans)","system-ui","sans-serif"]}}},plugins:[]} satisfies Config;
