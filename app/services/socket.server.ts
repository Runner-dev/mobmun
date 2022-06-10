import { getConversationMembersWithUsers } from "~/models/conversation.server";
import { FormattedMessage, getMessageForSocket } from "~/models/message.server";

export async function sendMessageToUsers({
  messageId,
  senderId,
  conversationId,
}: {
  messageId: string;
  senderId: string;
  conversationId: string;
}) {
  const { newsMembers, countryMembers } = await getConversationMembersWithUsers(
    conversationId
  );

  const users = [
    ...countryMembers.map((member) =>
      member.country.representatives.map((rep) => rep.userId)
    ),
    ...newsMembers.map((member) =>
      member.newsOrg.representatives.map((rep) => rep.userId)
    ),
  ]
    .flat()
    .filter((userId) => userId !== senderId);

  console.log(users);

  const message: FormattedMessage | null = await getMessageForSocket(messageId);

  console.log(
    JSON.stringify({
      users,
      conversationId,
      message,
    })
  );
  await fetch("http://localhost:3000/socket/sendMessage", {
    method: "POST",
    body: JSON.stringify({
      users,
      conversationId,
      message,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
