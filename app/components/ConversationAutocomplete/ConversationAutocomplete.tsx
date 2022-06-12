import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Avatar, Box } from "@mui/material";
import { useState } from "react";

export type Member = {
  id: string;
  label: string;
  imageSrc: string;
  type: "news" | "country";
};

export default function ConversationAutoomplete({
  members,
}: {
  members: Member[];
}) {
  const [value, setValue] = useState<Member[]>([]);

  return (
    <>
      <Autocomplete
        multiple
        id="tags-outlined"
        autoHighlight
        options={members}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        fullWidth
        value={value}
        onChange={(e, newVal) => setValue(newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.label}
              avatar={<Avatar src={option.imageSrc} alt="Flag" />}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderInput={(params) => <TextField {...params} label={`Membros`} />}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img loading="lazy" width="20" src={option.imageSrc} alt="" />
            {option.label}
          </Box>
        )}
      />
      <input
        type="hidden"
        name="conversationMembers"
        value={JSON.stringify(value.map(({ id, type }) => ({ id, type })))}
      />
    </>
  );
}
