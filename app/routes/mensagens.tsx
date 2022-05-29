import Navbar from "~/components/Navbar";
import { authenticator } from "~/services/auth.server";
import type { LinksFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { PropsWithChildren } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import messagesOverridesCss from "~/styles/messagesOverrides.css";
import SharingAutocomplete from "~/components/SharingAutocomplete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: messagesOverridesCss }];
};

type LoaderData = {
  userId: string;
  chatToken: string;
};

const CustomListContainer = (
  props: PropsWithChildren<{
    error: boolean;
    loading: boolean;
    LoadingErrorIndicator: React.FC<{}>;
    LoadingIndicator: React.FC<{}>;
  }>
) => {
  const {
    children,
    error = false,
    loading,
    LoadingErrorIndicator = ChatDown,
    LoadingIndicator = LoadingChannels,
  } = props;

  const [modalIsOpen, setIsOpen] = useState(true);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (error) {
    return <LoadingErrorIndicator type="Connection Error" />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="str-chat__channel-list-messenger">
      <div
        aria-label="Channel list"
        className="str-chat__channel-list-messenger__main"
        role="listbox"
      >
        {children}
      </div>
      <div />
      <button
        className="absolute flex items-center justify-center w-12 h-12 text-4xl bg-white rounded-full shadow-lg bottom-4 right-4"
        onClick={openModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <CreateChannelModal open={modalIsOpen} onClose={closeModal} />
    </div>
  );
};

const CreateChannelModal = (props: { open: boolean; onClose: () => void }) => {
  return (
    <Dialog {...props} fullWidth maxWidth="xs">
      <DialogTitle>Criar Canal</DialogTitle>
      <DialogContent>
        <Form method="post">
          <Stack spacing={2} paddingTop={0.5}>
            <TextField variant="outlined" name="name" label="Nome" />
          </Stack>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button variant="contained" type="submit">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function Mensagens() {
  return (
    <>
      <Navbar />
      <h1>Mensagens</h1>
    </>
  );
}
