import React, { useEffect, useState } from "react";
import invariant from "tiny-invariant";

export { default as richTextCssUrl } from "react-quill/dist/quill.snow.css";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  height: string;
};

export default function RichText({
  value = "",
  onChange = () => {},
  height,
}: Props) {
  invariant(typeof value === "string", "value must be a string");
  invariant(typeof onChange === "function", "onChange must be a function");
  const [isBrowser, setIsBrowser] = useState(false);
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [actualValue, setActualValue] = useState(value);

  useEffect(() => {
    import("react-quill").then(({ default: def }) => {
      setReactQuill(() => def);
      setIsBrowser(true);
    });
  }, []);
  return isBrowser ? (
    <>
      <ReactQuill
        theme="snow"
        value={actualValue}
        onChange={(value: string) => {
          setActualValue(value);
          onChange(value);
        }}
        className={`${height} pb-12`}
      />
      <input
        type="text"
        name="richtext"
        className="hidden"
        readOnly
        value={actualValue}
      />
    </>
  ) : null;
}
