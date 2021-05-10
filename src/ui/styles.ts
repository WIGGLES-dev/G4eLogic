import { tw } from "twind";
import { css, apply } from "twind/css";
const globalStyles = css({
  ":global": {
    html: apply`h-full`,
    body: {
      overscrollBehavior: "none",
    },
    blockquote: apply`mx-3 my-2`,
    menu: apply`m-0 p-0`,
    "form fieldset, form label": apply`flex flex-wrap max-w-full`,
    "form label": apply`
      m-4 
      p-2 
      bg-white 
      border(solid gray-700) 
      rounded`,
    "form label > span": apply`mx-2`,
    'form label > input[type="checkbox", form label > span]': apply`self-center`,
    "form label > input": apply`flex-1`,
    "form label > textarea": apply`w-full block`,
    button: apply`p-2 m-2 bg-gray-500 text-white font-semibold hover:bg-green-500 focus:outline-none`,
    '[contenteditable="true"],input,textarea,select': apply`focus:outline-none`,
    select: {
      "@apply": "whitespace-pre-wrap overflow-ellipsis",
      "max-width": "15rem",
      '[contenteditable="true"]:empty:before': {
        "@apply": "pointer-events-none",
        content: "attr(placeholder)",
      },
      textarea: apply`block`,
      "td > input, td > output, td > select": apply`inline-block w-full text(sm center)`,
      ".tooltip": apply`bg-gray-700 text(white left) p-4 font-normal not-italic`,
      ".rollable-cell": apply`bg-red-400 hover:bg-green-400 text(center white) cursor-pointer shadow`,
      ".ProseMirror-focused": apply`outline-none`,
      ".ProseMirror": {
        "@apply": "w-full p-2 max-h-full overflow-auto",
      },
      ".ProseMirror > ol > li": apply`list-decimal`,
      ".ProseMirror > ul > li": apply`list-disc`,
    },
  },
});
tw(globalStyles);
