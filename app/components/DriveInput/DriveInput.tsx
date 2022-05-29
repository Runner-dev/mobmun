import { TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useDrivePicker from "react-google-drive-picker/dist";
import { oauthClientId, pickerApiKey } from "~/bowserConstants";

export default function DriveInput({
  className,
  authToken,
}: {
  className?: string;
  authToken: string;
}) {
  const [openPicker, data] = useDrivePicker();
  const fileId = useMemo(() => data?.docs[0]?.id, [data]) || "";
  const [nameValue, setNameValue] = useState(data?.docs[0].name || "");

  console.log(nameValue);

  useEffect(() => {
    setNameValue(data?.docs[0].name || "");
  }, [data?.docs]);

  const handleOpenPicker = () => {
    openPicker({
      clientId: oauthClientId,
      developerKey: pickerApiKey,
      viewId: "DOCUMENTS",
      locale: "pt-BR",
      token: authToken,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
    });
  };

  return (
    <>
      <div className="w-full p-2 bg-gray-200 rounded-lg">
        <button
          type="button"
          onClick={handleOpenPicker}
          className="p-2 mr-2 text-white transition bg-blue-500 rounded hover:bg-blue-400"
        >
          Escolher Arquivo
        </button>
        {data?.docs.length ? (
          <span>{data?.docs[0].name}</span>
        ) : (
          <span>Nenhum documento selecionado</span>
        )}
      </div>
      <input type="hidden" name="fileId" value={fileId} required />
      <TextField
        name="fileName"
        label="Nome do arquivo"
        required
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
      />
    </>
  );
}