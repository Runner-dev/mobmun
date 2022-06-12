import React, { useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";
import type { RawDraftContentState } from "draft-js";
import type { EditorProps } from "react-draft-wysiwyg";
import { storage } from "~/firebase.client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { getFirebaseUrl } from "~/utils";

export { default as richTextCssUrl } from "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  className: string;
  initialState?: RawDraftContentState;
};

export default function RichText({
  value = "",
  onChange = () => {},
  className,
  initialState,
}: Props) {
  invariant(typeof value === "string", "value must be a string");
  invariant(typeof onChange === "function", "onChange must be a function");
  const [isBrowser, setIsBrowser] = useState(false);
  const [RichEditor, setRichEditor] =
    useState<React.ClassicComponent<EditorProps> | null>(null);
  const [editorContent, setEditorContent] = useState<RawDraftContentState>(
    initialState ?? {
      blocks: [],
      entityMap: {},
    }
  );

  useEffect(() => {
    import("react-draft-wysiwyg").then((data) => {
      setRichEditor(() => data.default.Editor as any);
      setIsBrowser(true);
    });
  }, []);

  if (isBrowser && !RichEditor) throw new Error("No Rich Editor");

  const editorProps = useMemo<EditorProps>(
    () => ({
      initialContentState: editorContent,
      onContentStateChange: (contentState) => {
        setEditorContent(contentState);
      },
      wrapperClassName: "border border-gray-400 ",
      toolbarClassName: "z-10",
      editorClassName: "z-0 min-h-[300px] max-h-[70vh]  overflow-y-auto",
      toolbar: {
        image: {
          uploadEnabled: true,
          uploadCallback: async (image: File) => {
            const nameParts = image.name.split(".");
            const ext = nameParts[nameParts.length - 1];
            const reference = ref(storage, `newsImages/${v4()}.${ext}`);
            await uploadBytes(reference, image);
            const downloadURL = await getDownloadURL(reference);
            // const url = getFirebaseUrl(reference);
            return { data: { link: downloadURL } };
          },
          previewImage: true,
        },
      },
    }),
    [editorContent]
  );

  return isBrowser ? (
    <div className="">
      {/* @ts-ignore */}
      <RichEditor {...editorProps} />
      <input
        type="text"
        name="richText"
        className="hidden"
        readOnly
        value={JSON.stringify(editorContent)}
      />
    </div>
  ) : (
    <div></div>
  );
}
